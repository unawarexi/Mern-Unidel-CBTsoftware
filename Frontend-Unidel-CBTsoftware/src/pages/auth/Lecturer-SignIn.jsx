/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Eye, EyeOff, BookOpen, AlertCircle, FileText, Users, BarChart3 } from "lucide-react";
import { Images } from "../../constants/image-strings";
import { Link, useNavigate } from "react-router-dom";
import { ButtonSpinner } from "../../components/Spinners";
import { useAuthLogin } from "../../store/auth-store";
import useAuthStore from "../../store/auth-store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const lecturerSignInSchema = z.object({
  employeeId: z.string().min(3, "Employee ID must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const LecturerSignIn = () => {
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
    resolver: zodResolver(lecturerSignInSchema),
    mode: "onBlur",
    defaultValues: {
      employeeId: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, role: "lecturer" };
      const result = await login(payload);

      if (result?.requirePasswordChange || result?.user?.isFirstLogin) {
        navigate("/reset-password", { state: { message: "Please change your password", userId: result.user?.id || result?.userId, role: "lecturer" } });
        return;
      }

      const role = (result.user.role || result.user.type || "").toString().toLowerCase();
      const target = role === "admin" ? "/admin" : role === "lecturer" ? "/lecturer" : "/student";
      navigate(target, { replace: true });
    } catch (error) {
      // handled by store toast
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex">
      {/* Left Side - Sign In Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-8 lg:p-12 relative z-10">
        <div className="w-full max-w-lg">
          {/* Logo and Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">UNIDEL Lecturer</h3>
                <p className="text-sm text-gray-500">Faculty Portal</p>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Faculty Access
            </h1>
            <p className="text-gray-600 text-lg">Sign in to manage courses and assessments</p>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="employeeId" className="block text-sm font-semibold text-gray-700 mb-2">
                Employee ID
              </label>
              <input
                id="employeeId"
                {...register("employeeId")}
                placeholder="EMP12345"
                className={`w-full px-4 py-3.5 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all ${
                  errors.employeeId ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:ring-orange-100 focus:border-orange-500"
                }`}
              />
              {errors.employeeId && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.employeeId.message}</span>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                placeholder="you@unidel.edu.ng"
                className={`w-full px-4 py-3.5 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all ${
                  errors.email ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:ring-orange-100 focus:border-orange-500"
                }`}
              />
              {errors.email && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email.message}</span>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm text-orange-600 hover:text-orange-700 font-semibold">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3.5 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all pr-12 ${
                    errors.password ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:ring-orange-100 focus:border-orange-500"
                  }`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password.message}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 px-4 rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-orange-200 transition-all shadow-lg shadow-orange-500/30 ${
                isLoading ? "opacity-80 pointer-events-none" : ""
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <ButtonSpinner size={18} /> Signing in...
                </span>
              ) : (
                "Sign In to Portal"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Need assistance?{" "}
              <a href="#support" className="text-orange-600 hover:text-orange-700 font-semibold">
                Contact IT Support
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Image with Enhanced Overlay */}
      <div className="hidden lg:block lg:w-[55%] relative">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${Images.lecturerImage})` }} />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/95 via-red-900/90 to-amber-900/95" />
        
        <div className="relative h-full flex flex-col justify-between p-12 text-white">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 self-start">
            <BookOpen className="w-4 h-4 text-orange-300" />
            <span className="text-sm font-medium">Faculty Portal</span>
          </div>

          {/* Center Content */}
          <div className="max-w-xl space-y-6">
            <h2 className="text-5xl font-bold leading-tight">
              Empower Your Teaching Journey
            </h2>
            <p className="text-xl text-orange-100 leading-relaxed">
              Comprehensive tools to create, manage, and assess student performance with precision and ease.
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                <FileText className="w-8 h-8 text-orange-300 mb-2" />
                <h3 className="font-semibold mb-1">Create Assessments</h3>
                <p className="text-sm text-orange-200">Design comprehensive tests</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                <Users className="w-8 h-8 text-orange-300 mb-2" />
                <h3 className="font-semibold mb-1">Manage Students</h3>
                <p className="text-sm text-orange-200">Track progress effectively</p>
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="flex items-center gap-8 text-sm">
            <div>
              <div className="text-3xl font-bold text-orange-300">500+</div>
              <div className="text-orange-200">Active Lecturers</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div>
              <div className="text-3xl font-bold text-orange-300">1000+</div>
              <div className="text-orange-200">Courses Managed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerSignIn;
