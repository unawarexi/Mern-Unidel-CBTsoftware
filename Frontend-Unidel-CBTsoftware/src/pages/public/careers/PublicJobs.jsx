import React, { useState } from "react";
import { useApplyForJob } from "../../../hooks/useCareerApplication";
import { usePublicCareers } from "../../../hooks/usePublic";
import useThemeStore from "../../../store/theme-store";
import { toast } from "react-hot-toast";
import {
  Briefcase,
  MapPin,
  Clock,
  ChevronRight,
  FileText,
  Upload,
  CheckCircle,
} from "lucide-react";
import { cn } from "../../../core/lib/cn";

const PublicJobs = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
  });
  const [files, setFiles] = useState({
    cv: null,
    letter: null,
  });

  const { data: careers, isLoading } = usePublicCareers();
  const applyMutation = useApplyForJob();

  const { isDarkMode } = useThemeStore();

  const handleApply = async (e) => {
    e.preventDefault();
    if (!files.cv) return toast.error("Please upload your CV");

    const data = new FormData();
    data.append("careerId", selectedJob._id);
    data.append("fullName", formData.fullName);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("coverLetter", formData.coverLetter);
    data.append("cv", files.cv);
    if (files.letter) data.append("letter", files.letter);

    applyMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Application submitted successfully!");
        setIsApplying(false);
        setSelectedJob(null);
        setFormData({ fullName: "", email: "", phone: "", coverLetter: "" });
        setFiles({ cv: null, letter: null });
      },
      onError: (err) => {
        toast.error(err.message || "Failed to submit application");
      },
    });
  };

  return (
    <div
      className={cn(
        "min-h-screen py-20 px-4 transition-colors duration-300",
        isDarkMode ? "bg-black" : "bg-white",
      )}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1
            className={cn(
              "text-4xl md:text-5xl font-bold mb-4",
              isDarkMode ? "text-white" : "text-gray-900",
            )}
          >
            Join the UNIDEL Team
          </h1>
          <p
            className={cn(
              "text-xl max-w-2xl mx-auto",
              isDarkMode ? "text-gray-400" : "text-gray-500",
            )}
          >
            Shape the future of education with us. Browse our open positions and
            find your next career opportunity.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : careers?.data?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careers.data
              .filter((j) => j.isActive)
              .map((job) => (
                <div
                  key={job._id}
                  className={cn(
                    "group p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/5 cursor-pointer",
                    isDarkMode
                      ? "bg-gray-900 border-gray-800 hover:border-orange-500"
                      : "bg-white border-gray-100 hover:border-orange-500",
                  )}
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={cn(
                        "p-3 rounded-xl text-orange-600",
                        isDarkMode ? "bg-orange-900/20" : "bg-orange-50",
                      )}
                    >
                      <Briefcase size={24} />
                    </div>
                    {job.type && (
                      <span
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded",
                          isDarkMode
                            ? "bg-gray-800 text-gray-300"
                            : "bg-gray-100 text-gray-700",
                        )}
                      >
                        {job.type.replace("-", " ")}
                      </span>
                    )}
                  </div>
                  <h3
                    className={cn(
                      "text-xl font-bold mb-2 transition",
                      isDarkMode
                        ? "text-white group-hover:text-orange-500"
                        : "text-gray-900 group-hover:text-orange-500",
                    )}
                  >
                    {job.title}
                  </h3>
                  <p
                    className={cn(
                      "text-sm mb-6 line-clamp-2",
                      isDarkMode ? "text-gray-400" : "text-gray-500",
                    )}
                  >
                    {job.description}
                  </p>

                  <div className="flex flex-col gap-2 mb-6">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <MapPin size={14} />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Clock size={14} />
                      Deadline:{" "}
                      {job.deadline
                        ? new Date(job.deadline).toLocaleDateString()
                        : "Rolling"}
                    </div>
                  </div>

                  <div className="flex items-center text-orange-600 font-semibold text-sm group-hover:gap-2 transition-all">
                    View Details & Apply
                    <ChevronRight
                      size={16}
                      className="opacity-0 group-hover:opacity-100 transition"
                    />
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div
            className={cn(
              "text-center p-20 rounded-3xl",
              isDarkMode ? "bg-gray-900/50" : "bg-gray-50",
            )}
          >
            <h3
              className={cn(
                "text-xl font-bold mb-2",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              No Job Openings Currently
            </h3>
            <p className={cn(isDarkMode ? "text-gray-400" : "text-gray-500")}>
              We don't have any open positions at the moment. Please check back
              later.
            </p>
          </div>
        )}
      </div>

      {/* Post Details Modal */}
      {selectedJob && !isApplying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div
            className={cn(
              "rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl",
              isDarkMode ? "bg-gray-900" : "bg-white",
            )}
          >
            <div className="p-8 overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2
                    className={cn(
                      "text-3xl font-bold mb-2",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {selectedJob.title}
                  </h2>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {selectedJob.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase size={14} /> {selectedJob.type}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-orange-600">
                      <Clock size={14} /> Deadline:{" "}
                      {new Date(selectedJob.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  ×
                </button>
              </div>

              <div
                className={cn(
                  "prose max-w-none space-y-6",
                  isDarkMode ? "prose-invert" : "",
                )}
              >
                <section>
                  <h4 className="text-lg font-bold">About the Role</h4>
                  <p>{selectedJob.description}</p>
                </section>

                {selectedJob.requirements?.length > 0 && (
                  <section>
                    <h4 className="text-lg font-bold">Requirements</h4>
                    <ul
                      className={cn(
                        "list-disc list-inside space-y-1",
                        isDarkMode ? "text-gray-400" : "text-gray-600",
                      )}
                    >
                      {selectedJob.requirements.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {selectedJob.expectations?.length > 0 && (
                  <section>
                    <h4 className="text-lg font-bold">What we expect</h4>
                    <ul
                      className={cn(
                        "list-disc list-inside space-y-1",
                        isDarkMode ? "text-gray-400" : "text-gray-600",
                      )}
                    >
                      {selectedJob.expectations.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            </div>

            <div
              className={cn(
                "p-8 border-t flex gap-4",
                isDarkMode
                  ? "border-gray-800 bg-gray-800/50"
                  : "border-gray-100 bg-gray-50",
              )}
            >
              <button
                onClick={() => setSelectedJob(null)}
                className={cn(
                  "flex-1 px-6 py-4 rounded-xl border font-bold transition",
                  isDarkMode
                    ? "border-gray-700 hover:bg-gray-800 text-white"
                    : "border-gray-200 hover:bg-gray-100 text-gray-900",
                )}
              >
                Close
              </button>
              <button
                onClick={() => setIsApplying(true)}
                className="flex-[2] bg-orange-500 text-white px-6 py-4 rounded-xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Application Form Modal */}
      {isApplying && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div
            className={cn(
              "rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300",
              isDarkMode ? "bg-gray-900" : "bg-white",
            )}
          >
            <div
              className={cn(
                "p-6 border-b flex items-center justify-between",
                isDarkMode ? "border-gray-800" : "border-gray-100",
              )}
            >
              <div>
                <h3
                  className={cn(
                    "font-bold",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  Applying for {selectedJob.title}
                </h3>
                <p className="text-xs text-gray-500">
                  Step 2: Submit your credentials
                </p>
              </div>
              <button
                onClick={() => setIsApplying(false)}
                className="text-gray-400"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleApply} className="p-8 space-y-5">
              <div className="space-y-4">
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className={cn(
                    "w-full p-4 rounded-xl border bg-transparent focus:ring-2 focus:ring-orange-500 outline-none transition",
                    isDarkMode
                      ? "border-gray-800 text-white placeholder-gray-500"
                      : "border-gray-200 text-gray-900 placeholder-gray-400",
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={cn(
                      "w-full p-4 rounded-xl border bg-transparent outline-none",
                      isDarkMode
                        ? "border-gray-800 text-white placeholder-gray-500"
                        : "border-gray-200 text-gray-900 placeholder-gray-400",
                    )}
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className={cn(
                      "w-full p-4 rounded-xl border bg-transparent outline-none",
                      isDarkMode
                        ? "border-gray-800 text-white placeholder-gray-500"
                        : "border-gray-200 text-gray-900 placeholder-gray-400",
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      required
                      className="hidden"
                      id="cv-upload"
                      onChange={(e) =>
                        setFiles({ ...files, cv: e.target.files[0] })
                      }
                    />
                    <label
                      htmlFor="cv-upload"
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border-2 border-dashed transition cursor-pointer",
                        files.cv
                          ? isDarkMode
                            ? "border-green-500 bg-green-900/10"
                            : "border-green-500 bg-green-50"
                          : isDarkMode
                            ? "border-gray-800 hover:border-orange-500"
                            : "border-gray-200 hover:border-orange-500",
                      )}
                    >
                      {files.cv ? (
                        <CheckCircle className="text-green-500" />
                      ) : (
                        <Upload className="text-gray-400" />
                      )}
                      <span
                        className={cn(
                          "text-xs font-medium",
                          isDarkMode ? "text-gray-400" : "text-gray-600",
                        )}
                      >
                        {files.cv ? files.cv.name : "Upload CV"}
                      </span>
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      id="letter-upload"
                      onChange={(e) =>
                        setFiles({ ...files, letter: e.target.files[0] })
                      }
                    />
                    <label
                      htmlFor="letter-upload"
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border-2 border-dashed transition cursor-pointer",
                        files.letter
                          ? isDarkMode
                            ? "border-green-500 bg-green-900/10"
                            : "border-green-500 bg-green-50"
                          : isDarkMode
                            ? "border-gray-800 hover:border-orange-500"
                            : "border-gray-200 hover:border-orange-500",
                      )}
                    >
                      {files.letter ? (
                        <CheckCircle className="text-green-500" />
                      ) : (
                        <FileText className="text-gray-400" />
                      )}
                      <span
                        className={cn(
                          "text-xs font-medium",
                          isDarkMode ? "text-gray-400" : "text-gray-600",
                        )}
                      >
                        {files.letter
                          ? files.letter.name
                          : "Cover Letter (Opt)"}
                      </span>
                    </label>
                  </div>
                </div>

                <textarea
                  rows={4}
                  placeholder="Anything else you'd like us to know? (Optional)"
                  value={formData.coverLetter}
                  onChange={(e) =>
                    setFormData({ ...formData, coverLetter: e.target.value })
                  }
                  className={cn(
                    "w-full p-4 rounded-xl border bg-transparent outline-none",
                    isDarkMode
                      ? "border-gray-800 text-white placeholder-gray-500"
                      : "border-gray-200 text-gray-900 placeholder-gray-400",
                  )}
                />
              </div>

              <button
                type="submit"
                disabled={applyMutation.isPending}
                className="w-full bg-orange-500 text-white p-5 rounded-2xl font-bold hover:bg-orange-600 transition disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {applyMutation.isPending ? (
                  "Submitting Application..."
                ) : (
                  <>
                    <Briefcase size={20} />
                    Submit Application
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicJobs;
