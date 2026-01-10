/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Shield, AlertCircle, Lock, Settings, Database, TrendingUp } from "lucide-react";
import { Images } from "../../constants/image-strings";
import { Link, useNavigate } from "react-router-dom";
import { ButtonSpinner } from "../../components/Spinners";
import { useAuthLogin } from "../../store/auth-store";
import useAuthStore from "../../store/auth-store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const adminSignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const AdminSignIn = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthLogin();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      const role = (user.role || user.type || "").toString().toLowerCase();
      const target = role === "admin" ? "/admin" : role === "lecturer" ? "/lecturer" : "/student";
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminSignInSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, role: "admin" };
      const result = await login(payload);

      if (result?.requirePasswordChange || result?.user?.isFirstLogin) {
        navigate("/reset-password", { state: { message: "Please change your password", userId: result.user?.id || result?.userId, role: "admin" } });
        return;
      }

      const role = (result.user.role || result.user.type || "").toString().toLowerCase();
      const target = role === "admin" ? "/admin" : role === "lecturer" ? "/lecturer" : "/student";
      navigate(target, { replace: true });
    } catch (error) {
      // error handled via toast
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
      {/* Animated Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      
      {/* Glow Effects */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-5 gap-8 items-center">
        
        {/* Left Info Panel - Hidden on mobile */}
        <div className="lg:col-span-2 text-white space-y-8 hidden lg:block">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-400/30 mb-6">
              <Lock className="w-4 h-4 text-emerald-300" />
              <span className="text-sm font-semibold">Restricted Access</span>
            </div>
            
            <h1 className="text-5xl font-bold mb-4 leading-tight">
              Administration Control Center
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Manage platform operations, users, and system configurations with enterprise-grade security.
            </p>
          </div>

          {/* Image Container with Rounded Border */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl">
            <div className="aspect-[4/3] bg-cover bg-center" style={{ backgroundImage: `url(${Images.adminImage})` }} />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/97 via-gray-900/95 to-slate-950/97" />
            
            {/* Stats Grid Overlay */}
            <div className="absolute inset-0 p-6 flex items-end">
              <div className="w-full grid grid-cols-2 gap-3">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                  <Settings className="w-7 h-7 text-emerald-400 mb-2" />
                  <div className="text-xl font-bold">100%</div>
                  <div className="text-xs text-gray-300">System Uptime</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                  <Database className="w-7 h-7 text-cyan-400 mb-2" />
                  <div className="text-xl font-bold">Secure</div>
                  <div className="text-xs text-gray-300">Data Protection</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                  <Shield className="w-7 h-7 text-blue-400 mb-2" />
                  <div className="text-xl font-bold">24/7</div>
                  <div className="text-xs text-gray-300">Monitoring</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                  <TrendingUp className="w-7 h-7 text-purple-400 mb-2" />
                  <div className="text-xl font-bold">Real-time</div>
                  <div className="text-xs text-gray-300">Analytics</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Login Card */}
        <div className="lg:col-span-3">
          <div className="bg-white/98 backdrop-blur-2xl p-6 sm:p-8 lg:p-12 rounded-3xl shadow-2xl border border-white/20 max-w-xl mx-auto">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg shadow-emerald-500/30">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Administrator Access</h2>
              <p className="text-sm sm:text-base text-gray-600">Secure authentication required</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wide">
                  Admin Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="admin@unidel.edu.ng"
                    className={`w-full px-3 sm:px-5 py-3 sm:py-4 text-sm sm:text-base bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all ${
                      errors.email ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:ring-emerald-100 focus:border-emerald-500"
                    }`}
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center gap-2 mt-1.5 sm:mt-2 text-red-600 text-xs sm:text-sm font-medium">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{errors.email.message}</span>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <label htmlFor="password" className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs sm:text-sm text-emerald-600 hover:text-emerald-700 font-bold">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="Enter admin password"
                    className={`w-full px-3 sm:px-5 py-3 sm:py-4 text-sm sm:text-base bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all pr-11 sm:pr-14 ${
                      errors.password ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:ring-emerald-100 focus:border-emerald-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Eye className="w-5 h-5 sm:w-6 sm:h-6" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center gap-2 mt-1.5 sm:mt-2 text-red-600 text-xs sm:text-sm font-medium">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{errors.password.message}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-emerald-700 hover:to-cyan-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-all shadow-lg shadow-emerald-500/30 ${
                  isLoading ? "opacity-80" : ""
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <ButtonSpinner size={18} /> Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                    Secure Sign In
                  </span>
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
              <div className="text-center">
                <p className="text-xs sm:text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link to="/admin-signup" className="text-emerald-600 hover:text-emerald-700 font-bold">
                    Create Admin Account
                  </Link>
                </p>
              </div>
              
              <div className="pt-4 sm:pt-6 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-500">
                  This is a restricted area. All access attempts are logged and monitored.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Badge - Only visible on small screens */}
      <div className="lg:hidden absolute top-4 sm:top-6 left-1/2 -translate-x-1/2">
        <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-emerald-400/30">
          <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-300" />
          <span className="text-xs sm:text-sm font-semibold text-white">Admin Portal</span>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;
