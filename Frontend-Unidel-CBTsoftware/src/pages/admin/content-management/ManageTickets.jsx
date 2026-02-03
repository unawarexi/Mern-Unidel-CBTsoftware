import React, { useState } from "react";
import {
  useGetAllTickets,
  useUpdateTicketStatus,
  useRespondToTicket,
} from "../../../hooks/useSupport";
import { toast } from "react-hot-toast";
import {
  Search,
  Filter,
  MessageSquare,
  User,
  Clock,
  Send,
  MoreVertical,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "../../../core/lib/cn";

const ManageTickets = () => {
  const [filter, setFilter] = useState({ status: "", priority: "" });
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [response, setResponse] = useState("");

  const { data: tickets, isLoading } = useGetAllTickets(filter);
  const statusMutation = useUpdateTicketStatus();
  const respondMutation = useRespondToTicket();

  const handleStatusUpdate = (id, status) => {
    statusMutation.mutate(
      { id, status },
      {
        onSuccess: () => {
          toast.success(`Ticket marked as ${status}`);
          if (selectedTicket?._id === id)
            setSelectedTicket({ ...selectedTicket, status });
        },
      },
    );
  };

  const handleRespond = (e) => {
    e.preventDefault();
    if (!response.trim()) return;

    respondMutation.mutate(
      { id: selectedTicket._id, message: response },
      {
        onSuccess: () => {
          toast.success("Response sent!");
          setResponse("");
        },
      },
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Manage Tickets</h1>
          <p className="text-gray-500">
            Review and resolve support requests and complaints.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
        {/* Ticket List */}
        <div className="lg:col-span-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col shadow-sm">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 space-y-4">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search tickets..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg outline-none text-sm"
              />
            </div>
            <div className="flex gap-2">
              <select
                className="text-xs p-2 bg-gray-50 dark:bg-gray-800 rounded border-none outline-none"
                onChange={(e) =>
                  setFilter({ ...filter, status: e.target.value })
                }
              >
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
              <select
                className="text-xs p-2 bg-gray-50 dark:bg-gray-800 rounded border-none outline-none"
                onChange={(e) =>
                  setFilter({ ...filter, priority: e.target.value })
                }
              >
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
            {isLoading ? (
              <div className="p-10 text-center text-gray-400">Loading...</div>
            ) : (
              tickets?.data?.map((ticket) => (
                <div
                  key={ticket._id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={cn(
                    "p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition relative",
                    selectedTicket?._id === ticket._id &&
                      "bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-blue-500",
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-mono text-gray-500">
                      {ticket.ticketId}
                    </span>
                    <span
                      className={cn(
                        "text-[8px] font-bold uppercase px-1.5 py-0.5 rounded",
                        ticket.priority === "urgent"
                          ? "bg-red-500 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-500",
                      )}
                    >
                      {ticket.priority}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold truncate">{ticket.title}</h4>
                  <p className="text-xs text-gray-500 line-clamp-1 mb-2">
                    {ticket.message}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                      <User size={10} />
                      {ticket.sender.name || "Anonymous"}
                    </div>
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        ticket.status === "open"
                          ? "bg-red-500"
                          : ticket.status === "resolved"
                            ? "bg-green-500"
                            : "bg-orange-500",
                      )}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Ticket Detail */}
        <div className="lg:col-span-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col">
          {selectedTicket ? (
            <>
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold">{selectedTicket.title}</h3>
                    <p className="text-xs text-gray-500">
                      Sent by {selectedTicket.sender.name} (
                      {selectedTicket.sender.email})
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {selectedTicket.status !== "resolved" && (
                    <button
                      onClick={() =>
                        handleStatusUpdate(selectedTicket._id, "resolved")
                      }
                      className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-200 transition"
                    >
                      <CheckCircle size={14} />
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase text-gray-400">
                      Original Message
                    </span>
                    <span className="text-[10px] text-gray-400 italic">
                      {new Date(selectedTicket.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">
                    {selectedTicket.message}
                  </p>
                </div>

                {selectedTicket.responses?.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase text-gray-400">
                      Responses
                    </h4>
                    {selectedTicket.responses.map((resp, i) => (
                      <div key={i} className="flex gap-3 justify-end">
                        <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none max-w-[80%] shadow-sm">
                          <p className="text-sm">{resp.message}</p>
                          <span className="text-[10px] opacity-70 block text-right mt-1">
                            {new Date(resp.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-100 dark:border-gray-800">
                <form onSubmit={handleRespond} className="relative">
                  <textarea
                    rows={2}
                    placeholder="Type your response..."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    className="w-full p-4 pr-16 bg-gray-50 dark:bg-gray-800 rounded-2xl outline-none resize-none text-sm transition focus:ring-2 focus:ring-blue-500/20"
                  />
                  <button
                    disabled={!response.trim() || respondMutation.isPending}
                    className="absolute right-3 bottom-3 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center opacity-50">
              <MessageSquare size={64} className="mb-4 text-gray-300" />
              <h3 className="text-xl font-bold">Select a ticket to view</h3>
              <p className="max-w-xs">
                Click on any ticket from the sidebar to view full details and
                respond.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageTickets;
