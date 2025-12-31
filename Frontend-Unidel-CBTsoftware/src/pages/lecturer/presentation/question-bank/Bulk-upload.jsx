/* eslint-disable no-unused-vars */
import React, { useRef } from "react";
import { UploadCloud, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useBulkUploadQuestionsAction } from "../../../../store/exam-store";

const BulkUpload = ({ onQuestionsParsed }) => {
  const fileInputRef = useRef();
  const { bulkUpload, isLoading, error } = useBulkUploadQuestionsAction();
  const [success, setSuccess] = React.useState("");
  const [count, setCount] = React.useState(0);

  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSuccess("");
    setCount(0);

    try {
      const result = await bulkUpload(file);
      setCount(result.questions?.length || 0);
      setSuccess(`Imported ${result.questions?.length || 0} questions from file`);
      if (onQuestionsParsed) onQuestionsParsed(result.questions || []);
    } catch (err) {
      // error handled by store
    }
    e.target.value = "";
  };

  return (
    <div className="mb-6 flex flex-col md:flex-row items-center gap-4">
      <label className="flex items-center gap-2 cursor-pointer bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-2 rounded-lg font-semibold shadow transition-all">
        <UploadCloud className="w-5 h-5" />
        <span>Upload Multiple Questions</span>
        <input
          type="file"
          accept=".csv, .xlsx, .xls, .docx, .pdf"
          onChange={handleBulkUpload}
          ref={fileInputRef}
          className="hidden"
        />
      </label>
      <span className="text-xs text-slate-500">
        Upload a CSV, Excel, DOCX, or PDF file with questions. After upload, fill in the title, course, and description before saving.
      </span>
      <AnimatePresence>
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-orange-600 text-sm ml-2">
            Uploading...
          </motion.div>
        )}
        {success && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1 text-green-700 text-sm ml-2">
            <CheckCircle className="w-4 h-4" />
            {success}
          </motion.div>
        )}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1 text-red-600 text-sm ml-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BulkUpload;
