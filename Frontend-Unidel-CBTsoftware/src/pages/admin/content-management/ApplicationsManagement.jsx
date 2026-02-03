import React, { useState } from "react";
import {
  useGetAllApplications,
  useAdminReviewApplication,
  useDeleteApplication,
} from "../../../hooks/useApplication";
import { toast } from "react-hot-toast";

const ApplicationsManagement = () => {
  const { data, isLoading } = useGetAllApplications();
  const reviewMutation = useAdminReviewApplication();
  const deleteMutation = useDeleteApplication();

  const [selectedApp, setSelectedApp] = useState(null);
  const [feedback, setFeedback] = useState("");

  const applications = data?.data || [];

  const handleReview = (id, status) => {
    reviewMutation.mutate(
      { id, status, feedback },
      {
        onSuccess: () => {
          toast.success(`Application ${status}`);
          setSelectedApp(null);
          setFeedback("");
        },
      },
    );
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Student Applications</h1>

      <div className="bg-white dark:bg-gray-900 shadow rounded-lg overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 uppercase text-gray-500">
            <tr>
              <th className="px-6 py-3 text-left">Applicant</th>
              <th className="px-6 py-3 text-left">Program</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {applications.map((app) => (
              <tr key={app._id}>
                <td className="px-6 py-4">
                  <div className="font-medium">
                    {app.personalInfo?.firstName} {app.personalInfo?.lastName}
                  </div>
                  <div className="text-gray-500 text-xs">{app.email}</div>
                </td>
                <td className="px-6 py-4">{app.program?.name || "N/A"}</td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs",
                      app.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : app.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800",
                    )}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="text-blue-600"
                  >
                    Review
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(app._id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Review Application</h2>
            <div className="space-y-2 mb-4 text-sm">
              <p>
                <strong>Name:</strong> {selectedApp.personalInfo?.firstName}{" "}
                {selectedApp.personalInfo?.lastName}
              </p>
              <p>
                <strong>Phone:</strong> {selectedApp.personalInfo?.phone}
              </p>
              <p>
                <strong>Qualifications:</strong>{" "}
                {selectedApp.academicBackground?.join(", ")}
              </p>
            </div>
            <textarea
              placeholder="Admin feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-800 mb-4"
              rows="3"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2"
              >
                Close
              </button>
              <button
                onClick={() => handleReview(selectedApp._id, "Rejected")}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Reject
              </button>
              <button
                onClick={() => handleReview(selectedApp._id, "Approved")}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper for status classes (assuming cn utility is available or just using string)
const cn = (...classes) => classes.filter(Boolean).join(" ");

export default ApplicationsManagement;
