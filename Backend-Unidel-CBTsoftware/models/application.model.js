import mongoose from "mongoose";
import softDeletePlugin from "../core/plugins/soft-delete.plugin.js";

const applicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      index: true,
    },
    // Program & Academic Intent
    studentType: {
      type: String,
      enum: ["Local Student", "International Student"],
      required: true,
      default: "Local Student",
    },
    programLevel: {
      type: String,
      enum: ["Undergraduate (BSc)", "Masters (MSc)", "Doctorate (PhD)"],
      required: true,
      default: "Undergraduate (BSc)",
    },
    // Deprecate but keep for compat if needed, or remove?
    programType: {
      type: String,
      // enum: ["degree", "diploma", "special-program", "scholarship"],
      // required: true,
    },
    intendedCourse: {
      type: String,
      required: true,
    },
    programTarget: {
      type: mongoose.Schema.Types.ObjectId, // Course, SpecialProgram, etc.
      required: true,
      refPath: "programTargetModel",
    },
    programTargetModel: {
      type: String,
      required: true,
      enum: ["Course", "SpecialProgram", "Scholarship"], // Dynamic ref
    },
    faculty: String,
    department: String,
    modeOfStudy: {
      type: String,
      enum: ["full-time", "part-time"],
      default: "full-time",
    },
    entrySemester: String,
    entryYear: String,

    // 1. Personal Information (Detailed)
    personalInfo: {
      firstName: { type: String, required: true },
      middleName: String,
      lastName: { type: String, required: true },
      dateOfBirth: { type: Date, required: true },
      gender: { type: String, enum: ["male", "female", "other"] },
      nationality: { type: String, required: true },
      country: { type: String, required: true }, // Residence
      state: String,
      city: String,
      address: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String }, // Optional overlap with User email
      passportPhoto: {
        url: String,
        public_id: String,
      },
      // International Specific
      passportNumber: String,
      passportCountryOfIssue: String,
      passportExpiryDate: Date,
      passportBioDataPage: {
        url: String,
        public_id: String,
      },
    },

    // 2. Parent / Guardian Information
    guardianInfo: {
      fatherName: String,
      motherName: String,
      guardianName: String,
      relationship: String,
      phone: String,
      email: String,
      address: String,
    },

    // 3. Academic Background
    academicHistory: [
      {
        schoolName: String,
        country: String,
        address: String,
        yearEntry: String,
        yearGraduation: String,
        qualification: String, // e.g. High School Diploma
      },
    ],

    // 4. Academic Results & Documents
    examResults: {
      examType: {
        type: String,
        enum: ["WAEC", "NECO", "GCSE", "IB", "SAT", "OTHER"],
      },
      examYear: String,
      examNumber: String, // Candidate ID
      resultDocument: {
        // PDF Upload
        url: String,
        public_id: String,
      },
      jambResult: {
        // Local (Nigeria) specific
        url: String,
        public_id: String,
        score: Number,
        registrationNumber: String,
      },
      bscCertificate: { url: String, public_id: String },
      mscCertificate: { url: String, public_id: String },
      transcript: { url: String, public_id: String },
      otherExams: [
        // Flexible for other results
        {
          name: String,
          grade: String,
          document: { url: String, public_id: String },
        },
      ],
    },

    // 5. International Requirements (Conditional)
    internationalInfo: {
      englishProficiency: {
        testType: {
          type: String,
          enum: ["IELTS", "TOEFL", "PTE", "Duolingo", "None"],
        },
        score: String,
        testDate: Date,
        certificate: { url: String, public_id: String },
      },
      visaInformation: {
        intendedStudyCountry: String,
        visaType: String,
        refusalHistory: { type: Boolean, default: false },
        intendedArrivalDate: Date,
      },
      sponsorship: {
        source: {
          type: String,
          enum: ["self", "parent", "government", "scholarship"],
        },
        sponsorName: String,
        sponsorContact: String,
        proofOfFunds: { url: String, public_id: String },
      },
    },

    // 6. Health & Special Needs
    healthInfo: {
      hasMedicalCondition: { type: Boolean, default: false },
      medicalConditionDetails: String,
      hasDisability: { type: Boolean, default: false },
      disabilityDetails: String,
      allergies: String,
      emergencyContact: {
        name: String,
        phone: String,
        relationship: String,
      },
    },

    // Meta Data
    currentStep: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: [
        "draft",
        "submitted",
        "under-review",
        "accepted",
        "rejected",
        "withdrawn",
      ],
      default: "draft",
    },
    submissionDate: Date,
    reviewFeedback: String,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  },
);

applicationSchema.plugin(softDeletePlugin);

export default mongoose.model("Application", applicationSchema);
