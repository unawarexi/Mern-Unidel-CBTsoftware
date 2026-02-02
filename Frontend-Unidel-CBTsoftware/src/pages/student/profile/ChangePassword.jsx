import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  Shield,
  AlertCircle,
  CheckCircle,
  Key,
  RefreshCw,
} from "lucide-react";
import StudentPage from "../components/StudentPage";
import { StudentIcons } from "../components/icons";
import useAuthStore from "../../../store/auth-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const ChangePassword = () => {
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Password strength calculator
  const calculateStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    return score;
  };

  const strength = calculateStrength(formData.newPassword);
  const strengthLabels = [
    "Very Weak",
    "Weak",
    "Fair",
    "Good",
    "Strong",
    "Very Strong",
  ];
  const strengthColors = [
    "bg-red-500",
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-emerald-500",
  ];

  const requirements = [
    { label: "At least 8 characters", met: formData.newPassword.length >= 8 },
    { label: "One lowercase letter", met: /[a-z]/.test(formData.newPassword) },
    { label: "One uppercase letter", met: /[A-Z]/.test(formData.newPassword) },
    { label: "One number", met: /[0-9]/.test(formData.newPassword) },
    {
      label: "One special character",
      met: /[^a-zA-Z0-9]/.test(formData.newPassword),
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (strength < 3) {
      setError("Password is too weak. Please choose a stronger password.");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  return (
    <StudentPage
      title="Change Password"
      subtitle="Update your account password"
      icon={StudentIcons.Profile}
    >
      <div className="max-w-xl mx-auto space-y-6">
        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-5 rounded-2xl border",
            isDarkMode
              ? "bg-blue-500/10 border-blue-500/30"
              : "bg-blue-50 border-blue-200",
          )}
        >
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4
                className={cn(
                  "font-semibold mb-1",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                Password Security
              </h4>
              <p
                className={cn(
                  "text-sm",
                  isDarkMode ? "text-slate-400" : "text-gray-600",
                )}
              >
                Choose a strong password that you don't use for other accounts.
                Your password should be unique and hard to guess.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <p className="text-emerald-500 font-medium">
                Password changed successfully!
              </p>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-2xl bg-red-500/20 border border-red-500/30"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-500 font-medium">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Password Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className={cn(
            "p-6 rounded-3xl border",
            isDarkMode
              ? "bg-slate-800/30 border-slate-800"
              : "bg-white border-gray-100",
          )}
        >
          <div className="space-y-5">
            {/* Current Password */}
            <div>
              <label
                className={cn(
                  "block text-sm font-medium mb-2",
                  isDarkMode ? "text-slate-300" : "text-gray-700",
                )}
              >
                Current Password
              </label>
              <div className="relative">
                <Lock
                  className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5",
                    isDarkMode ? "text-slate-500" : "text-gray-400",
                  )}
                />
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  required
                  value={formData.currentPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentPassword: e.target.value,
                    })
                  }
                  className={cn(
                    "w-full pl-12 pr-12 py-3 rounded-xl border outline-none transition-all",
                    isDarkMode
                      ? "bg-slate-700 border-slate-600 text-white focus:border-orange-500"
                      : "bg-white border-gray-200 text-gray-900 focus:border-orange-500",
                  )}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showCurrentPassword ? (
                    <EyeOff
                      className={cn(
                        "w-5 h-5",
                        isDarkMode ? "text-slate-500" : "text-gray-400",
                      )}
                    />
                  ) : (
                    <Eye
                      className={cn(
                        "w-5 h-5",
                        isDarkMode ? "text-slate-500" : "text-gray-400",
                      )}
                    />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label
                className={cn(
                  "block text-sm font-medium mb-2",
                  isDarkMode ? "text-slate-300" : "text-gray-700",
                )}
              >
                New Password
              </label>
              <div className="relative">
                <Key
                  className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5",
                    isDarkMode ? "text-slate-500" : "text-gray-400",
                  )}
                />
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                  className={cn(
                    "w-full pl-12 pr-12 py-3 rounded-xl border outline-none transition-all",
                    isDarkMode
                      ? "bg-slate-700 border-slate-600 text-white focus:border-orange-500"
                      : "bg-white border-gray-200 text-gray-900 focus:border-orange-500",
                  )}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showNewPassword ? (
                    <EyeOff
                      className={cn(
                        "w-5 h-5",
                        isDarkMode ? "text-slate-500" : "text-gray-400",
                      )}
                    />
                  ) : (
                    <Eye
                      className={cn(
                        "w-5 h-5",
                        isDarkMode ? "text-slate-500" : "text-gray-400",
                      )}
                    />
                  )}
                </button>
              </div>

              {/* Password Strength */}
              {formData.newPassword && (
                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all",
                          strengthColors[strength],
                        )}
                        style={{ width: `${((strength + 1) / 6) * 100}%` }}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium",
                        strength < 3
                          ? "text-red-500"
                          : strength < 5
                            ? "text-amber-500"
                            : "text-emerald-500",
                      )}
                    >
                      {strengthLabels[strength]}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {requirements.map((req, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs"
                      >
                        {req.met ? (
                          <CheckCircle className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <div
                            className={cn(
                              "w-3 h-3 rounded-full border",
                              isDarkMode
                                ? "border-slate-600"
                                : "border-gray-300",
                            )}
                          />
                        )}
                        <span
                          className={cn(
                            req.met
                              ? "text-emerald-500"
                              : isDarkMode
                                ? "text-slate-500"
                                : "text-gray-500",
                          )}
                        >
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                className={cn(
                  "block text-sm font-medium mb-2",
                  isDarkMode ? "text-slate-300" : "text-gray-700",
                )}
              >
                Confirm New Password
              </label>
              <div className="relative">
                <Key
                  className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5",
                    isDarkMode ? "text-slate-500" : "text-gray-400",
                  )}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className={cn(
                    "w-full pl-12 pr-12 py-3 rounded-xl border outline-none transition-all",
                    isDarkMode
                      ? "bg-slate-700 border-slate-600 text-white focus:border-orange-500"
                      : "bg-white border-gray-200 text-gray-900 focus:border-orange-500",
                    formData.confirmPassword &&
                      formData.newPassword !== formData.confirmPassword &&
                      "border-red-500",
                  )}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff
                      className={cn(
                        "w-5 h-5",
                        isDarkMode ? "text-slate-500" : "text-gray-400",
                      )}
                    />
                  ) : (
                    <Eye
                      className={cn(
                        "w-5 h-5",
                        isDarkMode ? "text-slate-500" : "text-gray-400",
                      )}
                    />
                  )}
                </button>
              </div>
              {formData.confirmPassword &&
                formData.newPassword !== formData.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    Passwords do not match
                  </p>
                )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                isSubmitting ||
                !formData.currentPassword ||
                !formData.newPassword ||
                formData.newPassword !== formData.confirmPassword
              }
              className={cn(
                "w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all",
                isSubmitting ||
                  !formData.currentPassword ||
                  !formData.newPassword ||
                  formData.newPassword !== formData.confirmPassword
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 text-white",
              )}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Change Password
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </StudentPage>
  );
};

export default ChangePassword;
