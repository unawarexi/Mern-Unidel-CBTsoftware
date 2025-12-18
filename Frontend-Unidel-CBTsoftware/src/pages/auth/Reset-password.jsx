import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { Images } from "../../constants/image-strings";
import { useAuthResetPassword, useAuthChangePasswordFirstLogin } from "../../store/auth-store";
import { ButtonSpinner } from "../../components/Spinners";
import { useLocation, useNavigate, Link } from "react-router-dom";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const prefill = location.state || {};

  const { resetPassword, isLoading: isResetting } = useAuthResetPassword();
  const { changePassword, isLoading: isChangingFirst } = useAuthChangePasswordFirstLogin();

  const validate = () => {
    const e = {};
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Password must be at least 8 characters";
    if (!confirm) e.confirm = "Please confirm your password";
    else if (password !== confirm) e.confirm = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) {
      try {
        if (prefill?.firstLogin) {
          // first login flow
          const payload = { ...prefill, password };
          const data = await changePassword(payload);
          // store updates user; redirect to dashboard
          const role = (data.user?.role || data.user?.type || "").toString().toLowerCase();
          const target = role === "admin" ? "/admin-dashboard" : role === "lecturer" ? "/lecturer-dashboard" : "/student-dashboard";
          navigate(target, { replace: true });
        } else {
          // normal reset - token or email in state
          const payload = { ...prefill, password };
          await resetPassword(payload);
          navigate("/portal-signin", { replace: true });
        }
      // eslint-disable-next-line no-unused-vars
      } catch (_err) {
        // handled by store toasts
      }
    }
  };

  const isLoading = isResetting || isChangingFirst;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900">Reset Password</h3>
            <p className="text-sm text-gray-600 mt-2">Set a new secure password for your account.</p>
            {prefill.email && <p className="mt-2 text-xs text-gray-500">Resetting for: <strong>{prefill.email}</strong></p>}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Choose a strong password"
                  className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all pr-12 ${errors.password ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-orange-200 focus:border-orange-500"}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center gap-1 mt-1.5 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <input
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter password"
                className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${errors.confirm ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-orange-200 focus:border-orange-500"}`}
              />
              {errors.confirm && (
                <div className="flex items-center gap-1 mt-1.5 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.confirm}</span>
                </div>
              )}
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors shadow-sm">
              {isLoading ? <span className="flex items-center gap-2"><ButtonSpinner size={16} /> Processing...</span> : "Reset Password"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remembered? <Link to="/portal-signin" className="text-orange-600 hover:text-orange-700 font-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right - Lottie / gif placeholder */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${Images.heroImage})` }} aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative h-full flex flex-col justify-center items-center p-8 lg:p-12 text-white">
          {/* GIF / Lottie placeholder */}
          <div className="w-full max-w-sm bg-white/10 rounded-lg p-6 flex flex-col items-center gap-4">
            <div className="w-40 h-40 bg-white/6 rounded-md flex items-center justify-center">
              {/* Replace with Lottie component or gif */}
              <div className="text-orange-100">[Lottie / GIF placeholder]</div>
            </div>
            <h3 className="text-xl font-bold">Password Reset</h3>
            <p className="text-sm text-orange-100 text-center">Create a strong password and keep your account secure. Do not share your password with anyone.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
