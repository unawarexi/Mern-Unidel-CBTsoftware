import React, { useState } from "react";
import { useCreateTicket, useGetMyTickets } from "../../hooks/useSupport";
import { toast } from "react-hot-toast";
import {
  MessageSquare,
  HelpCircle,
  AlertCircle,
  Clock,
  CheckCircle,
  Plus,
  Send,
} from "lucide-react";
import { cn } from "../../core/lib/cn";

const SupportPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "support",
    category: "other",
    priority: "low",
    email: "",
    name: "",
  });

  const { data: tickets, isLoading } = useGetMyTickets();
  const createMutation = useCreateTicket();

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Ticket submitted successfully!");
        setIsModalOpen(false);
        setFormData({
          title: "",
          message: "",
          type: "support",
          category: "other",
          priority: "low",
          email: "",
          name: "",
        });
      },
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Support & Complaints</h1>
          <p className="text-gray-500 mt-1">
            Found an issue or need help? We're here for you.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          New Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <HelpCircle className="text-blue-500 mb-2" />
          <h3 className="font-semibold">Help Center</h3>
          <p className="text-sm text-gray-500">
            Browse FAQs and guides to find quick answers.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <MessageSquare className="text-green-500 mb-2" />
          <h3 className="font-semibold">Direct Chat</h3>
          <p className="text-sm text-gray-500">
            Contact our support team directly for assistance.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <AlertCircle className="text-orange-500 mb-2" />
          <h3 className="font-semibold">Complaint Box</h3>
          <p className="text-sm text-gray-500">
            Have a formal complaint? Submit it here for review.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Your Recent Tickets</h2>
      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : tickets?.data?.length > 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Ticket ID</th>
                <th className="px-6 py-4 font-medium">Subject</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {tickets.data.map((ticket) => (
                <tr
                  key={ticket._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm font-mono text-blue-600">
                    {ticket.ticketId}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-sm">{ticket.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium uppercase",
                        ticket.type === "complaint"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700",
                      )}
                    >
                      {ticket.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      {ticket.status === "resolved" ? (
                        <CheckCircle size={14} className="text-green-500" />
                      ) : (
                        <Clock size={14} className="text-orange-500" />
                      )}
                      <span className="capitalize">{ticket.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center p-12 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
          <HelpCircle size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium">No tickets yet</h3>
          <p className="text-gray-500">
            You haven't submitted any support requests or complaints yet.
          </p>
        </div>
      )}

      {/* New Ticket Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-bold">Submit New Ticket</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Ticket Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent"
                  >
                    <option value="support">General Support</option>
                    <option value="complaint">Complaint</option>
                    <option value="technical">Technical Issue</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent"
                  >
                    <option value="account">Account & Profile</option>
                    <option value="admission">Admission</option>
                    <option value="exam">CBT Exams</option>
                    <option value="finance">Fees & Payments</option>
                    <option value="lecturer">Lecturer/Course</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium flex justify-between">
                  Subject
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded uppercase font-bold",
                      formData.priority === "urgent"
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 text-gray-500",
                    )}
                  >
                    {formData.priority} priority
                  </span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Summarize your issue"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your issue in detail..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {createMutation.isPending ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send size={16} />
                      Submit Ticket
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportPage;
