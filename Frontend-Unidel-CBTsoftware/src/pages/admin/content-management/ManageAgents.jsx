import React, { useState } from "react";
import {
  Users,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Building,
} from "lucide-react";
import { useGetAgents, useUpdateAgentStatus } from "../../../hooks/useAgent";
import { Button, Input } from "../../../components/ui";
import { FullPageSpinner } from "../../../components/Spinners";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { useSocketEvent } from "../../../hooks/useSocket";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const ManageAgents = () => {
  const { isDarkMode } = useThemeStore();
  const [filterStatus, setFilterStatus] = useState("all"); // all, pending, approved, rejected
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useGetAgents(
    filterStatus === "all" ? undefined : filterStatus,
  );
  const { mutate: updateStatus, isLoading: isUpdating } =
    useUpdateAgentStatus();

  const queryClient = useQueryClient();

  // Listen for new agents
  useSocketEvent("agent:new", (newAgent) => {
    toast.success(`New agent application: ${newAgent.fullname}`);
    queryClient.invalidateQueries({ queryKey: ["agents"] });
  });

  // Listen for agent updates (from other admins)
  useSocketEvent("agent:updated", (updatedAgent) => {
    queryClient.invalidateQueries({ queryKey: ["agents"] });
  });

  const handleStatusUpdate = (id, status) => {
    if (window.confirm(`Are you sure you want to ${status} this agent?`)) {
      updateStatus({ id, status });
    }
  };

  if (isLoading) return <FullPageSpinner />;

  const agents = data?.data || [];
  const filteredAgents = agents.filter(
    (agent) =>
      agent.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.organisation.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
            <CheckCircle className="size-3" /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
            <XCircle className="size-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
            <Users className="size-3" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Manage Agents
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Review and verify agent registration requests.
        </p>
      </div>

      {/* Filters */}
      <div
        className={cn(
          "p-4 rounded-xl border shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:justify-between sticky top-0 z-10 backdrop-blur-md",
          isDarkMode
            ? "bg-gray-800/80 border-gray-700"
            : "bg-white/80 border-gray-200",
        )}
      >
        <div className="flex flex-wrap gap-2">
          {["all", "pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors capitalize",
                filterStatus === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600",
              )}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full pl-9 pr-4 py-2 rounded-lg border text-sm outline-none transition-all focus:ring-2",
              isDarkMode
                ? "bg-gray-900 border-gray-700 text-white focus:ring-blue-500 focus:border-transparent placeholder:text-gray-500"
                : "bg-white border-gray-200 text-gray-900 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400",
            )}
          />
        </div>
      </div>

      {/* Table */}
      <div
        className={cn(
          "rounded-xl border overflow-hidden",
          isDarkMode
            ? "border-gray-700 bg-gray-800"
            : "border-gray-200 bg-white",
        )}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead
              className={cn(
                "text-xs uppercase border-b",
                isDarkMode
                  ? "bg-gray-900/50 text-gray-400 border-gray-700"
                  : "bg-gray-50 text-gray-500 border-gray-200",
              )}
            >
              <tr>
                <th className="px-6 py-4 font-medium">Agent Details</th>
                <th className="px-6 py-4 font-medium">Organisation</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Subscription</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAgents.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    No agents found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredAgents.map((agent) => (
                  <tr
                    key={agent._id}
                    className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold">
                          {agent.fullname.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {agent.fullname}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail className="size-3" /> {agent.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <Building className="size-4 text-gray-400" />
                        {agent.organisation}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(agent.approvalStatus)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 dark:text-white capitalize">
                          {agent.subscriptionType || "N/A"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {agent.subscriptionStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {agent.approvalStatus !== "approved" && (
                          <Button
                            size="sm"
                            variant="primary" // Assuming primary assumes 'success' logic or just green
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() =>
                              handleStatusUpdate(agent._id, "approved")
                            }
                            disabled={isUpdating}
                          >
                            Approve
                          </Button>
                        )}
                        {agent.approvalStatus !== "rejected" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleStatusUpdate(agent._id, "rejected")
                            }
                            disabled={isUpdating}
                          >
                            Decline
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageAgents;
