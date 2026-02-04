import React from "react";
import { toast } from "react-hot-toast";
import { Button } from "../../../components/ui";
import {
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Send,
  Loader2,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { useApplicationStore } from "../../../store/ui-store/application-store";
import { useGetAllPrograms } from "../../../hooks/useProgram";

// Sub-components
import PersonalDetailsForm from "./components/PersonalDetailsForm";
import GuardianInfoForm from "./components/GuardianInfoForm";
import AcademicBackgroundForm from "./components/AcademicBackgroundForm";
import DocumentUploadsForm from "./components/DocumentUploadsForm";
import ProgramSelectionForm from "./components/ProgramSelectionForm";
import InternationalReqForm from "./components/InternationalReqForm";
import ReviewApplication from "./components/ReviewApplication";

const StepForm = () => {
  const {
    step,
    setStep,
    formData,
    setFormData,
    appId,
    studentType,
    setStudentType,
    programLevel,
    setProgramLevel,
    isInternational,
    handleFileUpload,
    handleNext,
    handleBack,
    handleSubmitFinal,
    isLoading,
  } = useApplicationStore();

  // Remove local isInternationalFn since we use the direct store value now (if updated in store)
  // or use the derived one. The store update changed isInternational to a function of state, but useApplicationStore hook returns values.
  // Wait, in Zustand `create`, derived state as functions need to be called: `isInternational: () => ...`
  // so `const isInternational = useApplicationStore(state => state.isInternational())` is how it's usually used if exposed as a fn.
  // BUT I updated the store to expose `isInternational` as a helper function.
  // Let's stick to using the `studentType` state which is "International Student" to drive logic.

  const { data: programsData } = useGetAllPrograms();
  const programs = programsData?.data || [];

  return (
    <div className="flex-1 flex flex-col h-full relative">
      {/* Top Configuration Tabs */}
      <div className="mb-8 space-y-4">
        {/* Student Type Toggle */}
        <div className="bg-gray-100  p-1 rounded-xl flex">
          {["Local Student", "International Student"].map((type) => (
            <button
              key={type}
              onClick={() => setStudentType(type)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                studentType === type
                  ? "bg-white dark:bg-slate-700 shadow text-gray-900 dark:text-white"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Program Level Toggle */}
        <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
          {["Undergraduate (BSc)", "Masters (MSc)", "Doctorate (PhD)"].map(
            (level) => (
              <button
                key={level}
                onClick={() => setProgramLevel(level)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                  programLevel === level
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:border-orange-300"
                }`}
              >
                {level}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <PersonalDetailsForm
              key="step1"
              formData={formData}
              setFormData={setFormData}
              handleFileUpload={handleFileUpload}
              appId={appId}
            />
          )}
          {step === 2 && (
            <GuardianInfoForm
              key="step2"
              formData={formData}
              setFormData={setFormData}
            />
          )}
          {step === 3 && (
            <AcademicBackgroundForm
              key="step3"
              formData={formData}
              setFormData={setFormData}
            />
          )}
          {step === 4 && (
            <DocumentUploadsForm
              key="step4"
              formData={formData}
              setFormData={setFormData}
              handleFileUpload={handleFileUpload}
              appId={appId}
            />
          )}
          {step === 5 && isInternational && (
            <InternationalReqForm
              key="step5"
              formData={formData}
              setFormData={setFormData}
              handleFileUpload={handleFileUpload}
              appId={appId}
            />
          )}
          {step === 6 && (
            <ProgramSelectionForm
              key="step6"
              formData={formData}
              setFormData={setFormData}
            />
          )}
          {step === 7 && (
            <ReviewApplication
              key="step7"
              formData={formData}
              programs={programs}
            />
          )}
          {step === 8 && (
            <motion.div
              key="step8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10 space-y-6"
            >
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold dark:text-white">
                Application Received!
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Your application has been successfully submitted and is under
                review by the admissions committee. You will receive an email
                shortly.
              </p>
              <Button
                onClick={() => (window.location.href = "/")}
                className="mt-4"
              >
                Return to Home
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      {step < 8 && (
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center bg-white/0 backdrop-blur-sm sticky bottom-0">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div /> // Spacer
          )}

          {step === 7 ? (
            <Button
              onClick={handleSubmitFinal}
              isLoading={isLoading}
              className="px-8 shadow-xl shadow-orange-500/20 bg-orange-600 hover:bg-orange-700 border-none group"
            >
              Submit Application
              <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              isLoading={isLoading}
              className="px-8 shadow-xl shadow-blue-500/10 group"
            >
              Next Step
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default StepForm;
