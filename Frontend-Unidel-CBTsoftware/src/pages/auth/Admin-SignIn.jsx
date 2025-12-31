/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Eye, EyeOff, BookOpen, AlertCircle } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Admin Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">UNIDEL Admin</h3>
                <p className="text-xs text-gray-500">Administration Portal</p>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Sign In</h1>
            <p className="text-gray-600">Sign in to manage exams, users, and platform settings.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input
                id="email"
                type="email"
                {...register("email")}
                placeholder="admin@unidel.edu.ng"
                className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.email ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-orange-200 focus:border-orange-500"}`}
              />
              {errors.email && (
                <div className="flex items-center gap-1 mt-1.5 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email.message}</span>
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-sm text-orange-600 hover:text-orange-700 font-medium">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Enter your admin password"
                  className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all pr-12 ${errors.password ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-orange-200 focus:border-orange-500"}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center gap-1 mt-1.5 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password.message}</span>
                </div>
              )}
            </div>

            <button type="submit" disabled={isLoading} className={`w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 ${isLoading ? "opacity-80 pointer-events-none" : ""}`}>
              {isLoading ? <span className="flex items-center gap-2"><ButtonSpinner size={16} /> Signing in...</span> : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need help? <a href="#support" className="text-orange-600 hover:text-orange-700 font-medium">Contact Support</a>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              By signing in you accept our <a href="#terms" className="text-gray-700 hover:text-orange-600">Terms</a> and <a href="#privacy" className="text-gray-700 hover:text-orange-600">Privacy Policy</a>.
            </p>
          </div>
          {/* Account link */}
          <div className="mt-4 text-center">
            <p className="text-sm">
              Don't have an account?{" "}
              <Link to="/admin-signup" className="text-orange-600 hover:text-orange-700 font-medium">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image Background */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${Images.heroImage})` }} aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="relative h-full flex flex-col justify-between p-8 lg:p-12 text-white">
          <div className="max-w-md">
            <h4 className="text-sm lg:text-base font-semibold uppercase tracking-wide text-orange-200">Administration</h4>
            <p className="mt-1 text-xs lg:text-sm text-orange-100">Platform control center</p>
          </div>

          <div className="mt-auto max-w-lg">
            <h2 className="text-2xl lg:text-4xl font-bold leading-tight">Manage Exams, Users & Reports</h2>
            <p className="mt-4 text-sm lg:text-lg text-orange-100">Authenticate as an administrator to create exams, monitor activity, and export results securely.</p>
          </div>

          <div className="absolute top-8 right-8 w-28 h-28 bg-white bg-opacity-8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-8 left-8 w-36 h-36 bg-white bg-opacity-6 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;
