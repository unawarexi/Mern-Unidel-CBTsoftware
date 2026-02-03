import React from "react";
import {
  useGetSubscriptions,
  useDeleteSubscription,
} from "../../../hooks/useWaitlist";
import { toast } from "react-hot-toast";

const WaitlistManagement = () => {
  const { data, isLoading } = useGetSubscriptions();
  const deleteMutation = useDeleteSubscription();

  const subscriptions = data?.data || [];

  const handleDelete = (id) => {
    if (window.confirm("Remove this subscription?")) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success("Removed from waitlist"),
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Waitlist Management</h1>

      <div className="bg-white dark:bg-gray-900 shadow rounded-lg overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 uppercase text-gray-500">
            <tr>
              <th className="px-6 py-3 text-left">Full Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Interest</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {subscriptions.map((sub) => (
              <tr key={sub._id}>
                <td className="px-6 py-4 font-medium">{sub.fullName}</td>
                <td className="px-6 py-4">{sub.email}</td>
                <td className="px-6 py-4 capitalize">{sub.interest}</td>
                <td className="px-6 py-4">
                  {new Date(sub.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(sub._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {subscriptions.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No subscriptions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WaitlistManagement;
