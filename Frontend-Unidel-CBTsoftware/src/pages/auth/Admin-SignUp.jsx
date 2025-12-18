import React, { useState, useEffect } from "react";
import { Eye, EyeOff, BookOpen, AlertCircle } from "lucide-react";
import { Images } from "../../constants/image-strings";
import { Link, useNavigate } from "react-router-dom";
import { ButtonSpinner } from "../../components/Spinners";
import { useAuthAdminSignup } from "../../store/auth-store";
import useAuthStore from "../../store/auth-store";

const AdminSignUp = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuthAdminSignup();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      const role = (user.role || user.type || "").toString().toLowerCase();
      const target = role === "admin" ? "/admin-dashboard" : role === "lecturer" ? "/lecturer-dashboard" : "/student-dashboard";
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    organization: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Full name is required";
        return "";
      case "email":
        if (!value.trim()) return "Email address is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email address";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        return "";
      case "organization":
        if (!value.trim()) return "Organization is required";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (touched[name]) setErrors((p) => ({ ...p, [name]: validateField(name, value) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors((p) => ({ ...p, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach((k) => {
      const err = validateField(k, formData[k]);
      if (err) newErrors[k] = err;
    });
    setTouched(Object.fromEntries(Object.keys(formData).map((k) => [k, true])));
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        const data = await signup(formData);
        const role = (data.user.role || data.user.type || "").toString().toLowerCase();
        const target = role === "admin" ? "/admin-dashboard" : role === "lecturer" ? "/lecturer-dashboard" : "/student-dashboard";
        navigate(target, { replace: true });
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        // handled by store toast
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Admin Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">UNIDEL Admin</h3>
                <p className="text-xs text-gray-500">Create administrator account</p>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Sign Up</h1>
            <p className="text-gray-600">Register an administrator account to manage platform operations.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Jane Doe"
                className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.name && touched.name ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-orange-200 focus:border-orange-500"}`}
              />
              {errors.name && touched.name && <div className="flex items-center gap-1 mt-1.5 text-red-600 text-sm"><AlertCircle className="w-4 h-4" /><span>{errors.name}</span></div>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Organization</label>
              <input
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="University of Delta"
                className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.organization && touched.organization ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-orange-200 focus:border-orange-500"}`}
              />
              {errors.organization && touched.organization && <div className="flex items-center gap-1 mt-1.5 text-red-600 text-sm"><AlertCircle className="w-4 h-4" /><span>{errors.organization}</span></div>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="admin@unidel.edu.ng"
                className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.email && touched.email ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-orange-200 focus:border-orange-500"}`}
              />
              {errors.email && touched.email && <div className="flex items-center gap-1 mt-1.5 text-red-600 text-sm"><AlertCircle className="w-4 h-4" /><span>{errors.email}</span></div>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-sm text-orange-600 hover:text-orange-700 font-medium">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Choose a strong password"
                  className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all pr-12 ${errors.password && touched.password ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-orange-200 focus:border-orange-500"}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && touched.password && <div className="flex items-center gap-1 mt-1.5 text-red-600 text-sm"><AlertCircle className="w-4 h-4" /><span>{errors.password}</span></div>}
            </div>

            <button type="submit" disabled={isLoading} className={`w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 ${isLoading ? "opacity-80 pointer-events-none" : ""}`}>
              {isLoading ? <span className="flex items-center gap-2"><ButtonSpinner size={16} /> Creating Account...</span> : "Create Admin Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/admin-signin" className="text-orange-600 hover:text-orange-700 font-medium">Sign in</Link>
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
            <h4 className="text-sm lg:text-base font-semibold uppercase tracking-wide text-orange-200">Administrator Registration</h4>
            <p className="mt-1 text-xs lg:text-sm text-orange-100">Set up admin credentials for institution</p>
          </div>

          <div className="mt-auto max-w-lg">
            <h2 className="text-2xl lg:text-4xl font-bold leading-tight">Provision Administrative Access</h2>
            <p className="mt-4 text-sm lg:text-lg text-orange-100">Create a secure administrator account to manage exams, users and system settings with full auditing.</p>
          </div>

          <div className="absolute top-8 right-8 w-28 h-28 bg-white bg-opacity-8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-8 left-8 w-36 h-36 bg-white bg-opacity-6 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default AdminSignUp;
