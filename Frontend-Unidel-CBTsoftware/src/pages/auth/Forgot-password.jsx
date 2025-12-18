import React, { useState } from "react";
import { AlertCircle, Mail, User } from "lucide-react";
import { Images } from "../../constants/image-strings";
import { useNavigate, Link } from "react-router-dom";
import { useAuthForgotPassword } from "../../store/auth-store";
import { ButtonSpinner } from "../../components/Spinners";

const ForgotPassword = () => {
  const [role, setRole] = useState("student");
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { forgotPassword, isLoading } = useAuthForgotPassword();

  const validate = () => {
    const e = {};
    if (!identifier.trim()) e.identifier = `${role === "student" ? "Matric/Student ID" : role === "lecturer" ? "Employee ID" : "Admin ID"} is required`;
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Invalid email address";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) {
      try {
        const payload = { role, identifier, email };
        const data = await forgotPassword(payload);
        // backend might return token or confirmation; pass useful info to reset page
        navigate("/reset-password", { state: { ...payload, token: data?.token || null } });
      // eslint-disable-next-line no-unused-vars
      } catch (_err) {
        // toast shown by store; no-op here
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900">Password Assistance</h3>
            <p className="text-sm text-gray-600 mt-2">Request a password reset link for your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">I am a</label>
              <div className="flex items-center gap-3">
                <label className={`px-3 py-2 rounded-lg cursor-pointer ${role === "student" ? "bg-orange-50 border border-orange-300" : "bg-white border border-gray-200"}`}>
                  <input type="radio" name="role" value="student" checked={role === "student"} onChange={() => setRole("student")} className="hidden" />
                  Student
                </label>
                <label className={`px-3 py-2 rounded-lg cursor-pointer ${role === "lecturer" ? "bg-orange-50 border border-orange-300" : "bg-white border border-gray-200"}`}>
                  <input type="radio" name="role" value="lecturer" checked={role === "lecturer"} onChange={() => setRole("lecturer")} className="hidden" />
                  Lecturer
                </label>
                <label className={`px-3 py-2 rounded-lg cursor-pointer ${role === "admin" ? "bg-orange-50 border border-orange-300" : "bg-white border border-gray-200"}`}>
                  <input type="radio" name="role" value="admin" checked={role === "admin"} onChange={() => setRole("admin")} className="hidden" />
                  Admin
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {role === "student" ? "Matric / Student ID" : role === "lecturer" ? "Employee ID" : "Admin ID"}
              </label>
              <div className="relative">
                <input
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={role === "student" ? "UNIDEL/2023/0001" : role === "lecturer" ? "EMP12345" : "ADM001"}
                  className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.identifier ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-orange-200 focus:border-orange-500"}`}
                />
              </div>
              {errors.identifier && (
                <div className="flex items-center gap-1 mt-1.5 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.identifier}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@unidel.edu.ng"
                className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.email ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-orange-200 focus:border-orange-500"}`}
              />
              {errors.email && (
                <div className="flex items-center gap-1 mt-1.5 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors shadow-sm">
              {isLoading ? (
                <span className="flex items-center justify-center gap-2"><ButtonSpinner size={16} /> Requesting...</span>
              ) : (
                "Request Reset Link"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remembered your password?{" "}
              <Link to="/portal-signin" className="text-orange-600 hover:text-orange-700 font-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right - image + brief */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${Images.heroImage})` }} aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative h-full flex flex-col justify-center p-8 lg:p-12 text-white">
          <h2 className="text-2xl lg:text-4xl font-bold">Reset your password securely</h2>
          <p className="mt-4 text-sm lg:text-lg text-orange-100">Enter your details and we'll send instructions to your registered email to reset your account password.</p>

          <div className="mt-8 w-full max-w-xs">
            {/* Lottie / illustrative placeholder */}
            <div className="w-full h-40 bg-white/10 rounded-lg flex items-center justify-center">
              {/* Lottie animation placeholder - replace with Lottie component */}
              <div className="text-sm text-orange-100">[Lottie animation placeholder]</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
