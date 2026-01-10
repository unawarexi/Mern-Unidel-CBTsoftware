/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Eye, EyeOff, BookOpen, AlertCircle, GraduationCap, Shield, Clock } from "lucide-react";
import { Images } from "../../constants/image-strings";
import { useNavigate, Link } from "react-router-dom";
import { ButtonSpinner } from "../../components/Spinners";
import { useAuthLogin } from "../../store/auth-store";
import useAuthStore from "../../store/auth-store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const signInSchema = z.object({
  studentId: z.string().min(5, "Student ID must be at least 5 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const SignIn = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthLogin();
  const { isAuthenticated, user } = useAuthStore();

  // redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const role = (user.role || user.type || "").toString().toLowerCase();
      // updated to new base paths
      const target = role === "admin" ? "/admin" : role === "lecturer" ? "/lecturer" : "/student";
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, touchedFields },
    getValues,
  } = useForm({
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
    defaultValues: {
      studentId: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      // build payload: student sign in must include role; prefer email if provided, otherwise include studentId
      const payload = {
        role: "student",
        password: data.password,
      };
      if (data.email && data.email.trim()) payload.email = data.email.trim();
      else payload.studentId = data.studentId.trim();

      const result = await login(payload);

      // handle first-login shape returned by backend (either data.user?.isFirstLogin or data.requirePasswordChange)
      if (result?.requirePasswordChange || result?.user?.isFirstLogin) {
        navigate("/reset-password", { state: { message: "Please change your password", userId: result.user?.id || result?.userId, role: "student" } });
        return;
      }

      const role = (result.user.role || result.user.type || "").toString().toLowerCase();
      const target = role === "admin" ? "/admin" : role === "lecturer" ? "/lecturer" : "/student";
      navigate(target, { replace: true });
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      // errors are shown by store toasts
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      {/* Left Side - Sign In Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-4 sm:p-8 lg:p-12 relative z-10">
        <div className="w-full max-w-lg">
          {/* Logo and Header */}
          <div className="mb-6 sm:mb-10">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-8">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-xl font-bold text-gray-900">UNIDEL Student</h3>
                <p className="text-xs sm:text-sm text-gray-500">Examination Portal</p>
              </div>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Student Access
            </h1>
            <p className="text-gray-600 text-sm sm:text-lg">Sign in to take your scheduled examinations</p>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <div>
              <label htmlFor="studentId" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                Student ID / Matric Number
              </label>
              <input
                type="text"
                id="studentId"
                {...register("studentId")}
                placeholder="UNIDEL/2023/0001"
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3.5 text-sm sm:text-base bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all ${
                  errors.studentId ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:ring-blue-100 focus:border-blue-500"
                }`}
              />
              {errors.studentId && (
                <div className="flex items-center gap-2 mt-1.5 sm:mt-2 text-red-600 text-xs sm:text-sm">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{errors.studentId.message}</span>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                placeholder="your.email@unidel.edu.ng"
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3.5 text-sm sm:text-base bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all ${
                  errors.email ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:ring-blue-100 focus:border-blue-500"
                }`}
              />
              {errors.email && (
                <div className="flex items-center gap-2 mt-1.5 sm:mt-2 text-red-600 text-xs sm:text-sm">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{errors.email.message}</span>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-gray-700">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-semibold">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...register("password")}
                  placeholder="Enter your password"
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3.5 text-sm sm:text-base bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all pr-10 sm:pr-12 ${
                    errors.password ? "border-red-500 focus:ring-red-100" : "border-gray-200 focus:ring-blue-100 focus:border-blue-500"
                  }`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center gap-2 mt-1.5 sm:mt-2 text-red-600 text-xs sm:text-sm">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{errors.password.message}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 sm:py-4 px-4 text-sm sm:text-base rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all shadow-lg shadow-blue-500/30 ${
                isLoading ? "opacity-80 pointer-events-none" : ""
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <ButtonSpinner size={16} /> Signing in...
                </span>
              ) : (
                "Sign In to Portal"
              )}
            </button>
          </form>

          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              Need assistance?{" "}
              <a href="#contact" className="text-blue-600 hover:text-blue-700 font-semibold">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Image with Enhanced Overlay */}
      <div className="hidden lg:block lg:w-[55%] relative">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${Images.studentImage})` }} />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-indigo-900/90 to-purple-900/95" />
        
        <div className="relative h-full flex flex-col justify-between p-12 text-white">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 self-start">
            <Shield className="w-4 h-4 text-blue-300" />
            <span className="text-sm font-medium">Secure Portal</span>
          </div>

          {/* Center Content */}
          <div className="max-w-xl space-y-6">
            <h2 className="text-5xl font-bold leading-tight">
              Your Academic Excellence Starts Here
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Access your scheduled examinations in a secure, monitored environment. Complete assessments with confidence and receive instant results.
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                <Clock className="w-8 h-8 text-blue-300 mb-2" />
                <h3 className="font-semibold mb-1">Real-time Access</h3>
                <p className="text-sm text-blue-200">Instant exam availability</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                <Shield className="w-8 h-8 text-blue-300 mb-2" />
                <h3 className="font-semibold mb-1">Secure System</h3>
                <p className="text-sm text-blue-200">Protected environment</p>
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="flex items-center gap-8 text-sm">
            <div>
              <div className="text-3xl font-bold text-blue-300">10K+</div>
              <div className="text-blue-200">Active Students</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div>
              <div className="text-3xl font-bold text-blue-300">500+</div>
              <div className="text-blue-200">Courses Available</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
