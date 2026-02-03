import React from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  History,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Zap,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAgentSubscription } from "../../../hooks/useAgent";
import { useMyPayments, useInitiatePayment } from "../../../hooks/usePayment";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import { toast } from "react-hot-toast";

const AgentPayments = () => {
  const { isDarkMode } = useThemeStore();
  const { data: subscription, isLoading: subLoading } = useAgentSubscription();
  const { data: payments = [], isLoading: paymentsLoading } = useMyPayments();
  const initiatePaymentMutation = useInitiatePayment();

  const handleUpgrade = async (plan) => {
    try {
      const result = await initiatePaymentMutation.mutateAsync({
        amount: plan === "Premium" ? 50000 : 25000,
        purpose: `Upgrade to ${plan} Plan`,
      });
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } catch (error) {
      toast.error(error.message || "Failed to initiate payment");
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen p-4 sm:p-6 transition-colors duration-300",
        isDarkMode ? "bg-slate-950" : "bg-gray-50",
      )}
    >
      <div className="max-w-[1200px] mx-auto">
        <header className="mb-8">
          <h1
            className={cn(
              "text-2xl sm:text-3xl font-bold mb-1",
              isDarkMode ? "text-white" : "text-gray-900",
            )}
          >
            Payments & Subscription
          </h1>
          <p
            className={cn(
              "text-sm sm:text-base",
              isDarkMode ? "text-slate-400" : "text-gray-600",
            )}
          >
            Manage your service plans and view transaction logs.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Current Plan Card */}
          <div
            className={cn(
              "lg:col-span-2 rounded-2xl p-6 border shadow-sm",
              isDarkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-gray-100",
            )}
          >
            <div className="flex items-center justify-between mb-8">
              <h2
                className={cn(
                  "text-lg font-bold",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                Current Subscription
              </h2>
              <div
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold uppercase",
                  isDarkMode
                    ? "bg-blue-500/10 text-blue-400"
                    : "bg-blue-50 text-blue-600",
                )}
              >
                Active
              </div>
            </div>

            {subLoading ? (
              <Skeleton height={150} />
            ) : (
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start justify-between">
                <div className="space-y-4 text-center md:text-left">
                  <div>
                    <div className="text-gray-500 text-sm mb-1 uppercase font-bold tracking-wider">
                      Plan Name
                    </div>
                    <div
                      className={cn(
                        "text-3xl font-black italic",
                        isDarkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {subscription?.plan || "BASIC PARTNER"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-1 uppercase font-bold tracking-wider">
                      Renewal Date
                    </div>
                    <div
                      className={cn(
                        "text-lg font-medium",
                        isDarkMode ? "text-slate-300" : "text-gray-700",
                      )}
                    >
                      {subscription?.expiryDate
                        ? new Date(subscription.expiryDate).toLocaleDateString(
                            "en-GB",
                            { day: "numeric", month: "long", year: "numeric" },
                          )
                        : "N/A"}
                    </div>
                  </div>
                </div>

                <div
                  className={
                    cn(
                      "flex flex-col gap-3 w-full md:w-auto",
                      isDarkMode ? "bg-slate-800/50" : "bg-gray-50",
                    ) + " p-6 rounded-2xl"
                  }
                >
                  <h4
                    className={cn(
                      "font-bold text-sm mb-2",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    Quick Upgrade
                  </h4>
                  <button
                    onClick={() => handleUpgrade("Premium")}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                  >
                    <Zap size={18} fill="currentColor" />
                    Go Premium
                  </button>
                  <p className="text-[10px] text-center text-gray-500">
                    Includes limitless recruitments and analytics.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Highlights */}
          <div className="space-y-4">
            <div
              className={cn(
                "rounded-2xl p-6 border shadow-sm",
                isDarkMode
                  ? "bg-slate-900 border-slate-800"
                  : "bg-white border-gray-100",
              )}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase">
                    Verified Status
                  </div>
                  <div
                    className={cn(
                      "font-bold",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    Authorized Agent
                  </div>
                </div>
              </div>
            </div>
            <div
              className={cn(
                "rounded-2xl p-6 border shadow-sm",
                isDarkMode
                  ? "bg-slate-900 border-slate-800"
                  : "bg-white border-gray-100",
              )}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/10 text-orange-500 rounded-xl">
                  <History size={24} />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase">
                    Last Transaction
                  </div>
                  <div
                    className={cn(
                      "font-bold",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {payments[0]
                      ? `₦${payments[0].amount.toLocaleString()}`
                      : "No history"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div
          className={cn(
            "rounded-2xl border shadow-sm overflow-hidden",
            isDarkMode
              ? "bg-slate-900 border-slate-800"
              : "bg-white border-gray-100",
          )}
        >
          <div className="p-6 border-b border-gray-100 dark:border-slate-800">
            <h3
              className={cn(
                "text-lg font-bold",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              Transaction History
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr
                  className={cn(
                    "border-b",
                    isDarkMode
                      ? "bg-slate-800/50 border-slate-800"
                      : "bg-gray-50/50 border-gray-100",
                  )}
                >
                  <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">
                    Reference
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">
                    Date
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500 text-right">
                    Receipt
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {paymentsLoading ? (
                  Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <tr key={i}>
                        <td colSpan="5" className="px-6 py-4">
                          <Skeleton height={20} />
                        </td>
                      </tr>
                    ))
                ) : payments.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr
                      key={p._id}
                      className={cn(
                        "transition-colors",
                        isDarkMode
                          ? "hover:bg-slate-800/30"
                          : "hover:bg-gray-50",
                      )}
                    >
                      <td className="px-6 py-4 font-mono text-xs text-blue-500">
                        {p.reference}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                        ₦{p.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                            p.status === "successful"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700",
                          )}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                          <ExternalLink size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentPayments;
