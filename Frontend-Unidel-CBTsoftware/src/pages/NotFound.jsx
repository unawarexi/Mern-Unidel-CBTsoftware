import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";

/**
 * NotFound - 404 fallback page
 *
 * Displayed when user navigates to a route that doesn't exist.
 */
const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-lg w-full text-center">
        {/* 404 Number */}
        <div className="relative mb-8">
          <h1 className="text-[150px] sm:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-500 to-amber-500 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-orange-500/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Search className="w-12 h-12 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. Let's get
          you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGoHome}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-2xl font-bold shadow-lg shadow-orange-600/20 transition-all hover:scale-105"
          >
            <Home className="w-5 h-5" />
            Go to Homepage
          </button>
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold backdrop-blur-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Quick links */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-sm text-gray-500 mb-4">Popular destinations:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="/portal-signin"
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Student Portal
            </a>
            <a
              href="/lecturer-signin"
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Lecturer Portal
            </a>
            <a
              href="/admin-signin"
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Admin Portal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
