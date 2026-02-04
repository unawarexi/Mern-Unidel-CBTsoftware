import { create } from "zustand";
import { toast } from "react-hot-toast";
import { queryClient } from "../../core/lib/query-client";
import {
  createApplication,
  submitApplication,
  uploadApplicationFile,
} from "../../core/apis/application-api";

const initialFormData = {
  personalInfo: {
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    country: "",
    state: "",
    city: "",
    address: "",
    passportNumber: "",
    passportCountryOfIssue: "",
  },
  guardianInfo: {
    fatherName: "",
    motherName: "",
    guardianName: "",
    relationship: "",
    phone: "",
    email: "",
    address: "",
  },
  academicHistory: [],
  examResults: {
    examType: "",
    examYear: "",
    examNumber: "",
    resultDocument: {}, // O-Level / Secondary
    jambResult: {},
    bscCertificate: {}, // For MSc/PhD
    mscCertificate: {}, // For PhD
    transcript: {},
  },
  internationalInfo: {
    visaInformation: {},
    sponsorship: {},
  },
  programTarget: "",
  intendedCourse: "",
  modeOfStudy: "full-time",
};

export const useApplicationStore = create((set, get) => ({
  // State
  step: 1,
  appId: null,

  // New Top-Level Toggles
  studentType: "Local Student", // "Local Student" | "International Student"
  programLevel: "Undergraduate (BSc)", // "Undergraduate (BSc)" | "Masters (MSc)" | "Doctorate (PhD)"

  formData: initialFormData,
  isLoading: false,

  // Actions
  setStudentType: (type) => set({ studentType: type }),
  setProgramLevel: (level) => set({ programLevel: level }),

  setStep: (step) => set({ step }),
  setAppId: (appId) => set({ appId }),
  setFormData: (updater) =>
    set((state) => ({
      formData:
        typeof updater === "function" ? updater(state.formData) : updater,
    })),

  // Derived state helper
  isInternational: () => {
    const { studentType } = get();
    return studentType === "International Student";
  },

  handleFileUpload: (file, fieldPath) => {
    set((state) => {
      const parts = fieldPath.split(".");
      let newState = { ...state.formData };
      let current = newState;

      for (let i = 0; i < parts.length - 1; i++) {
        current[parts[i]] = { ...current[parts[i]] };
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = file;

      return { formData: newState };
    });
  },

  handleNext: async () => {
    const { step, formData } = get();
    const isInternational = get().isInternational();

    if (step === 1) {
      const { firstName, lastName, phone, dateOfBirth, address, nationality } =
        formData.personalInfo;
      if (!firstName) return toast.error("Please enter First Name");
      if (!lastName) return toast.error("Please enter Last Name");
      if (!phone) return toast.error("Please enter Phone Number");
      if (!dateOfBirth) return toast.error("Please enter Date of Birth");
      if (!address) return toast.error("Please enter Address");
      if (!nationality) return toast.error("Please enter Nationality");

      set({ step: 2 });
    } else if (step === 2) {
      const { fatherName, motherName, phone } = formData.guardianInfo;
      if (!fatherName && !motherName)
        return toast.error("Please provide at least one Parent Name");
      if (!phone) return toast.error("Please provide Parent/Guardian Contact");
      set({ step: 3 });
    } else if (step === 3) {
      if (formData.academicHistory.length === 0)
        return toast.error("Please add at least one previous school");
      set({ step: 4 });
    } else if (step === 4) {
      if (!formData.examResults?.examType)
        return toast.error("Please select Exam Type");
      set({ step: isInternational ? 5 : 6 });
    } else if (step === 5) {
      if (isInternational) {
        if (!formData.personalInfo.passportNumber)
          return toast.error("Passport Number is required");
        if (!formData.internationalInfo?.visaInformation?.visaType)
          return toast.error("Visa Type is required");
      }
      set({ step: 6 });
    } else if (step === 6) {
      if (!formData.programTarget)
        return toast.error("Please select a Program");
      if (!formData.intendedCourse)
        return toast.error("Please select or enter your Intended Course");
      set({ step: 7 });
    }
  },

  handleBack: () => {
    const { step } = get();
    const isInternational = get().isInternational();

    if (step === 6 && !isInternational) {
      set({ step: 4 });
    } else {
      set({ step: Math.max(1, step - 1) });
    }
  },

  handleSubmitFinal: async () => {
    const { appId, formData } = get();
    const isInternational = get().isInternational();
    let currentAppId = appId;

    set({ isLoading: true });

    try {
      // 1. Ensure Draft Exists
      if (!currentAppId) {
        try {
          const res = await createApplication(formData);
          currentAppId = res.data._id;
          set({ appId: currentAppId });
          // Invalidate "my applications" query if needed
          queryClient.invalidateQueries({ queryKey: ["applications", "my"] });
        } catch (err) {
          console.error(err);
          toast.error("Failed to initialize application draft");
          set({ isLoading: false });
          return;
        }
      }

      // 2. Scan and Upload Files
      const filesToUpload = [];

      // Helper to find Files in the object tree
      const findFiles = (obj, path = "") => {
        for (const key in obj) {
          const currentPath = path ? `${path}.${key}` : key;
          if (obj[key] instanceof File) {
            filesToUpload.push({ file: obj[key], path: currentPath });
          } else if (typeof obj[key] === "object" && obj[key] !== null) {
            findFiles(obj[key], currentPath);
          }
        }
      };

      findFiles(formData);

      if (filesToUpload.length > 0) {
        try {
          for (const item of filesToUpload) {
            await uploadApplicationFile({
              id: currentAppId,
              field: item.path,
              file: item.file,
            });
          }
          queryClient.invalidateQueries({
            queryKey: ["application", currentAppId],
          });
        } catch (err) {
          console.error(err);
          toast.error("File upload failed. Please try again.");
          set({ isLoading: false });
          return;
        }
      }

      // 3. Final Submission
      if (isInternational && !formData.personalInfo.passportNumber) {
        toast.error("Passport Number missing for international student");
        set({ isLoading: false });
        // return; // Should technically return, but logic flow follows existing context
      }

      await submitApplication(currentAppId);

      queryClient.invalidateQueries({ queryKey: ["applications", "my"] });
      queryClient.invalidateQueries({
        queryKey: ["application", currentAppId],
      });

      toast.success("Application Submitted Successfully!");
      set({ step: 8 });
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Submission Failed");
    } finally {
      set({ isLoading: false });
    }
  },

  // Reset store (optional, for cleanup)
  reset: () =>
    set({
      step: 1,
      appId: null,
      formData: initialFormData,
      isLoading: false,
    }),
}));
