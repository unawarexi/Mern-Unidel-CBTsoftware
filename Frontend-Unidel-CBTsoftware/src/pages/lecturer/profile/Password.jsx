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
import LecturerPage from "../components/LecturerPage";
import { LecturerIcons } from "../components/icons";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const Password = () => {
  const { isDarkMode } = useThemeStore();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  // Password strength calculation
  const getStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return Math.min(strength, 5);
  };

  const strength = getStrength(form.newPassword);
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-blue-500",
    "bg-emerald-500",
  ];

  const requirements = [
    { label: "At least 8 characters", met: form.newPassword.length >= 8 },
    { label: "Contains lowercase letter", met: /[a-z]/.test(form.newPassword) },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(form.newPassword) },
    { label: "Contains a number", met: /[0-9]/.test(form.newPassword) },
    {
      label: "Contains special character",
      met: /[^a-zA-Z0-9]/.test(form.newPassword),
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!form.currentPassword)
      newErrors.currentPassword = "Current password required";
    if (!form.newPassword) newErrors.newPassword = "New password required";
    if (form.newPassword.length < 8)
      newErrors.newPassword = "Password too weak";
    if (form.newPassword !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords don't match";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    setSuccess(true);
    setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setSuccess(false), 5000);
  };

  const InputField = ({
    label,
    value,
    onChange,
    type,
    show,
    setShow,
    error,
  }) => (
    <div className="space-y-2">
      <label
        className={cn(
          "block text-sm font-medium",
          isDarkMode ? "text-slate-400" : "text-gray-600",
        )}
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full px-4 py-3 pr-12 rounded-xl border outline-none transition-all",
            isDarkMode
              ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500"
              : "bg-white border-gray-200 text-gray-900 placeholder-gray-400",
            error && "border-red-500 focus:border-red-500",
            !error && "focus:border-blue-500",
          )}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className={cn(
            "absolute right-4 top-1/2 -translate-y-1/2",
            isDarkMode ? "text-slate-500" : "text-gray-400",
          )}
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );

  return (
    <LecturerPage
      title="Change Password"
      subtitle="Update your account password"
      icon={LecturerIcons.Password}
    >
      <div className="max-w-xl mx-auto space-y-6">
        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-4 rounded-2xl border flex items-center gap-3",
              isDarkMode
                ? "bg-emerald-500/10 border-emerald-500/30"
                : "bg-emerald-50 border-emerald-200",
            )}
          >
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <p
              className={cn(
                "font-medium",
                isDarkMode ? "text-emerald-300" : "text-emerald-700",
              )}
            >
              Password changed successfully!
            </p>
          </motion.div>
        )}

        {/* Password Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className={cn(
            "p-6 rounded-3xl border space-y-6",
            isDarkMode
              ? "bg-slate-800/50 border-slate-700"
              : "bg-white border-gray-100",
          )}
        >
          <InputField
            label="Current Password"
            value={form.currentPassword}
            onChange={(v) =>
              setForm((prev) => ({ ...prev, currentPassword: v }))
            }
            type="password"
            show={showCurrent}
            setShow={setShowCurrent}
            error={errors.currentPassword}
          />

          <InputField
            label="New Password"
            value={form.newPassword}
            onChange={(v) => setForm((prev) => ({ ...prev, newPassword: v }))}
            type="password"
            show={showNew}
            setShow={setShowNew}
            error={errors.newPassword}
          />

          {/* Password Strength */}
          {form.newPassword && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden flex gap-1">
                  {[...Array(5)].map((_, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex-1 h-full rounded-full transition-colors",
                        idx < strength ? strengthColors[strength - 1] : "",
                      )}
                    />
                  ))}
                </div>
                <span
                  className={cn(
                    "text-sm font-medium",
                    strength <= 2
                      ? "text-red-500"
                      : strength <= 3
                        ? "text-amber-500"
                        : "text-emerald-500",
                  )}
                >
                  {strengthLabels[strength - 1] || ""}
                </span>
              </div>
              <ul className="space-y-1">
                {requirements.map((req, idx) => (
                  <li
                    key={idx}
                    className={cn(
                      "flex items-center gap-2 text-sm",
                      req.met
                        ? "text-emerald-500"
                        : isDarkMode
                          ? "text-slate-500"
                          : "text-gray-400",
                    )}
                  >
                    {req.met ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-current" />
                    )}
                    {req.label}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <InputField
            label="Confirm New Password"
            value={form.confirmPassword}
            onChange={(v) =>
              setForm((prev) => ({ ...prev, confirmPassword: v }))
            }
            type="password"
            show={showConfirm}
            setShow={setShowConfirm}
            error={errors.confirmPassword}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" /> Updating...
              </>
            ) : (
              <>
                <Key className="w-5 h-5" /> Change Password
              </>
            )}
          </button>
        </motion.form>

        {/* Security Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-6 rounded-3xl border",
            isDarkMode
              ? "bg-slate-800/50 border-slate-700"
              : "bg-white border-gray-100",
          )}
        >
          <h3
            className={cn(
              "font-bold mb-4 flex items-center gap-2",
              isDarkMode ? "text-white" : "text-gray-900",
            )}
          >
            <Shield className="w-5 h-5 text-blue-500" />
            Security Tips
          </h3>
          <ul className="space-y-2">
            {[
              "Use a unique password for each account",
              "Never share your password with anyone",
              "Enable two-factor authentication when available",
              "Change your password regularly",
              "Avoid using personal information in passwords",
            ].map((tip, idx) => (
              <li
                key={idx}
                className={cn(
                  "flex items-start gap-2 text-sm",
                  isDarkMode ? "text-slate-400" : "text-gray-600",
                )}
              >
                <CheckCircle className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </LecturerPage>
  );
};

export default Password;
