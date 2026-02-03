import React, { useState } from "react";
import {
  useGetAllCareerApplications,
  useUpdateCareerApplicationStatus,
} from "../../../hooks/useCareerApplication";
import { toast } from "react-hot-toast";
import {
  FileSearch,
  Mail,
  Phone,
  Calendar,
  ExternalLink,
  ChevronDown,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { cn } from "../../../core/lib/cn";

const ManageCareerApplications = () => {
  const [filter, setFilter] = useState({ status: "" });
  const [selectedApp, setSelectedApp] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [interview, setInterview] = useState({
    date: "",
    location: "",
    link: "",
  });

  const { data: apps, isLoading } = useGetAllCareerApplications(filter);
  const updateMutation = useUpdateCareerApplicationStatus();

  const handleUpdate = (status) => {
    const data = {
      id: selectedApp._id,
      status,
      adminFeedback: feedback,
    };
    if (status === "interview") data.interviewDetails = interview;

    updateMutation.mutate(data, {
      onSuccess: () => {
        toast.success(`Application updated to ${status}`);
        setIsUpdating(false);
        setFeedback("");
        setSelectedApp(null);
      },
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Career Applications</h1>
          <p className="text-gray-500">
            Review job applicants and schedule interviews.
          </p>
        </div>
        <div className="flex gap-3">
          <select
            className="p-2.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-sm outline-none shadow-sm"
            onChange={(e) => setFilter({ status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interview">Interview</option>
            <option value="offered">Offered</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-48 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl"
                ></div>
              ))
          : apps?.data?.map((app) => (
              <div
                key={app._id}
                className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-orange-50 dark:bg-orange-900/10 p-2 rounded-lg text-orange-600">
                    <FileSearch size={20} />
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded",
                      app.status === "interview"
                        ? "bg-blue-100 text-blue-700"
                        : app.status === "shortlisted"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-500",
                    )}
                  >
                    {app.status}
                  </span>
                </div>

                <h3 className="font-bold text-lg mb-1">{app.fullName}</h3>
                <p className="text-orange-600 text-sm font-medium mb-4">
                  {app.careerId?.title}
                </p>

                <div className="space-y-2 mb-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Mail size={14} />
                    {app.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} />
                    {app.phone}
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={app.cvUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-bold hover:bg-gray-200 transition"
                  >
                    <ExternalLink size={12} />
                    CV
                  </a>
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="flex-1 p-2 bg-black dark:bg-white dark:text-gray-900 text-white rounded-lg text-xs font-bold hover:opacity-80 transition"
                  >
                    Review
                  </button>
                </div>
              </div>
            ))}
      </div>

      {/* Review Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-8 overflow-y-auto">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold">{selectedApp.fullName}</h2>
                  <p className="text-orange-600 font-medium">
                    {selectedApp.careerId?.title}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-gray-400"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Contact Details
                  </h4>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <strong>Email:</strong> {selectedApp.email}
                    </p>
                    <p className="text-sm">
                      <strong>Phone:</strong> {selectedApp.phone}
                    </p>
                    <p className="text-sm">
                      <strong>Applied:</strong>{" "}
                      {new Date(selectedApp.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Documents
                  </h4>
                  <div className="flex flex-col gap-2">
                    <a
                      href={selectedApp.cvUrl}
                      target="_blank"
                      className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm border hover:border-orange-500 transition"
                    >
                      <FileSearch size={16} /> CV / Resume
                    </a>
                    {selectedApp.letterUrl && (
                      <a
                        href={selectedApp.letterUrl}
                        target="_blank"
                        className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm border hover:border-orange-500 transition"
                      >
                        <ExternalLink size={16} /> Cover Letter
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Message/Notes
                </h4>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm italic">
                  "{selectedApp.coverLetter || "No message provided."}"
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold">
                  Internal Feedback (Shared with applicant via email)
                </label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Review findings or interview feedback..."
                  className="w-full p-4 rounded-xl border bg-transparent outline-none"
                />
              </div>

              {selectedApp.status === "interview" && (
                <div className="mt-6 p-6 border rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 space-y-4">
                  <h4 className="font-bold flex items-center gap-2">
                    <Calendar size={18} /> Interview Schedule
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="datetime-local"
                      value={interview.date}
                      onChange={(e) =>
                        setInterview({ ...interview, date: e.target.value })
                      }
                      className="p-3 rounded-lg border bg-transparent text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Location (Room or Online)"
                      value={interview.location}
                      onChange={(e) =>
                        setInterview({ ...interview, location: e.target.value })
                      }
                      className="p-3 rounded-lg border bg-transparent text-sm"
                    />
                  </div>
                  <input
                    type="url"
                    placeholder="Remote Link (Zoom/Google Meet)"
                    value={interview.link}
                    onChange={(e) =>
                      setInterview({ ...interview, link: e.target.value })
                    }
                    className="w-full p-3 rounded-lg border bg-transparent text-sm"
                  />
                </div>
              )}
            </div>

            <div className="p-8 border-t bg-gray-50 dark:bg-gray-800/50 flex flex-wrap gap-3">
              <button
                onClick={() => handleUpdate("rejected")}
                className="flex-1 bg-red-100 text-red-700 px-4 py-3 rounded-xl font-bold hover:bg-red-200 transition"
              >
                Reject
              </button>
              <button
                onClick={() => handleUpdate("shortlisted")}
                className="flex-1 bg-green-100 text-green-700 px-4 py-3 rounded-xl font-bold hover:bg-green-200 transition"
              >
                Shortlist
              </button>
              <button
                onClick={() => handleUpdate("interview")}
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
              >
                Interview
              </button>
              <button
                onClick={() => handleUpdate("offered")}
                className="flex-1 bg-orange-500 text-white px-4 py-3 rounded-xl font-bold hover:bg-orange-600 transition"
              >
                Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCareerApplications;
