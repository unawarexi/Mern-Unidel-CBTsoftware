import React from "react";
import { useNavigate, useRouteError } from "react-router-dom";
import { AlertTriangle, RefreshCw, ArrowLeft, Home } from "lucide-react";

/**
 * RouteErrorBoundary - Route-level error boundary for React Router
 *
 * Use this as errorElement in route configuration to catch
 * errors within specific routes without crashing the entire app.
 *
 * Usage in routes:
 * <Route
 *   path="/admin/*"
 *   element={<AdminDashboard />}
 *   errorElement={<RouteErrorBoundary />}
 * />
 */
const RouteErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleRetry = () => {
    window.location.reload();
  };

  // Extract error message
  const errorMessage =
    error?.message || error?.statusText || "An unexpected error occurred";
  const errorStatus = error?.status || error?.code;

  console.error("🔴 Route Error:", error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 p-6">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800 p-8 text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-orange-600" />
        </div>

        {/* Status code if available */}
        {errorStatus && (
          <div className="text-sm font-black text-orange-600 uppercase tracking-widest mb-2">
            Error {errorStatus}
          </div>
        )}

        {/* Title */}
        <h1 className="text-xl font-black text-gray-900 dark:text-white mb-2">
          Page Error
        </h1>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {errorStatus === 404
            ? "The page you're looking for doesn't exist or has been moved."
            : "Something went wrong loading this page. Please try again."}
        </p>

        {/* Error details in dev mode */}
        {process.env.NODE_ENV === "development" && errorMessage && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-left">
            <p className="text-xs font-mono text-red-600 dark:text-red-400 break-all">
              {errorMessage}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleRetry}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleGoBack}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-900 dark:text-white rounded-xl font-bold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
            <button
              onClick={handleGoHome}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-900 dark:text-white rounded-xl font-bold transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteErrorBoundary;
