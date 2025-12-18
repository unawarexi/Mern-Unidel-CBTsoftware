import React, { useState, useEffect } from "react";
import { Eye, EyeOff, BookOpen, AlertCircle } from "lucide-react";
import { Images } from "../../constants/image-strings";
import { useNavigate } from "react-router-dom";
import { ButtonSpinner } from "../../components/Spinners";
import { useAuthLogin } from "../../store/auth-store";
import useAuthStore from "../../store/auth-store";

const SignIn = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthLogin();
  const { isAuthenticated, user } = useAuthStore();

  // redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const role = (user.role || user.type || "").toString().toLowerCase();
      const target = role === "admin" ? "/admin-dashboard" : role === "lecturer" ? "/lecturer-dashboard" : "/student-dashboard";
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validation schema using Zod-like logic
  const validateField = (name, value) => {
    switch (name) {
      case "studentId":
        if (!value.trim()) return "Student ID/Matric Number is required";
        if (value.length < 5) return "Student ID must be at least 5 characters";
        return "";
      case "email": {
        if (!value.trim()) return "Email address is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Invalid email address";
        return "";
      }
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate all fields (existing validation)
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setTouched({ studentId: true, email: true, password: true });
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const data = await login(formData);
        // If first login handled by store, navigate accordingly
        if (data.user?.isFirstLogin) {
          navigate("/reset-password", { state: { message: "Please change your password" } });
          return;
        }
        const role = (data.user.role || data.user.type || "").toString().toLowerCase();
        const target = role === "admin" ? "/admin-dashboard" : role === "lecturer" ? "/lecturer-dashboard" : "/student-dashboard";
        navigate(target, { replace: true });
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        // errors are shown by store toasts
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">UNIDEL</h3>
                <p className="text-xs text-gray-500">CBT Platform</p>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to access your examination portal</p>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Student ID Field */}
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1.5">
                Student ID / Matric Number
              </label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g., UNIDEL/2023/0001"
                className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.studentId && touched.studentId ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-orange-200 focus:border-orange-500"}`}
              />
              {errors.studentId && touched.studentId && (
                <div className="flex items-center gap-1 mt-1.5 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.studentId}</span>
                </div>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="your.email@unidel.edu.ng"
                className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.email && touched.email ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-orange-200 focus:border-orange-500"}`}
              />
              {errors.email && touched.email && (
                <div className="flex items-center gap-1 mt-1.5 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <a href="#forgot" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all pr-12 ${
                    errors.password && touched.password ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-orange-200 focus:border-orange-500"
                  }`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && touched.password && (
                <div className="flex items-center gap-1 mt-1.5 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={isLoading} className={`w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors shadow-sm hover:shadow-md ${isLoading ? "opacity-80 pointer-events-none" : ""}`}>
              {isLoading ? <span className="flex items-center justify-center gap-2"><ButtonSpinner size={16} /> Signing in...</span> : "Sign In to Portal"}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need assistance?{" "}
              <a href="#contact" className="text-orange-600 hover:text-orange-700 font-medium">
                Contact Support
              </a>
            </p>
          </div>

          {/* Footer Note */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              By signing in, you agree to our{" "}
              <a href="#terms" className="text-gray-700 hover:text-orange-600">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#privacy" className="text-gray-700 hover:text-orange-600">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image Placeholder */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${Images.heroImage})` }}
          aria-hidden="true"
        />

        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Text content on top of image */}
        <div className="relative h-full flex flex-col justify-between p-8 lg:p-12 text-white">
          {/* Top - small formal title/desc */}
          <div className="max-w-md">
            <h4 className="text-sm lg:text-2xl font-bold uppercase tracking-wide">University of Delta</h4>
            <p className="mt-1 text-xs lg:text-sm text-orange-300">Official Computer-Based Testing Portal</p>
          </div>

          {/* Center/Bottom - main formal headline and description */}
          <div className="mt-auto max-w-lg">
            <h2 className="text-2xl lg:text-4xl font-bold leading-tight">Secure, Reliable & Professional Assessment</h2>
            <p className="mt-4 text-sm lg:text-lg text-orange-100">
              Access scheduled examinations, validate credentials, and receive timely results within a secure and proctored environment.
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-8 right-8 w-28 h-28 bg-white bg-opacity-8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-8 left-8 w-36 h-36 bg-white bg-opacity-6 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
