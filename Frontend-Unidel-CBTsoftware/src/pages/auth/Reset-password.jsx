/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { Images } from "../../constants/image-strings";
import {
  useAuthResetPassword,
  useAuthChangePasswordFirstLogin,
} from "../../store/auth-store";
import { ButtonSpinner } from "../../components/Spinners";
import { useLocation, useNavigate, Link } from "react-router-dom";
import useAuthStore from "../../store/auth-store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

// Import reusable components
import { Button, Input } from "../../components/ui";
import useThemeStore from "../../store/theme-store";
import { cn } from "../../core/lib/cn";
import { Lock, ShieldCheck } from "lucide-react";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const location = useLocation();
  const prefill = useMemo(() => location.state || {}, [location.state]);
  const query = new URLSearchParams(location.search);
  const tokenFromQuery = query.get("token");
  const roleFromQuery = query.get("role");

  const { resetPassword, isLoading: isResetting } = useAuthResetPassword();
  const { changePassword, isLoading: isChangingFirst } =
    useAuthChangePasswordFirstLogin();
  const authUser = useAuthStore((s) => s.user);
  const authFirstLogin = useAuthStore((s) => s.isFirstLogin);

  useEffect(() => {
    const isFirstLoginFlow = !!(
      prefill?.firstLogin ||
      authFirstLogin ||
      authUser?.isFirstLogin
    );
    const tokenVal = prefill.token || prefill.resetToken || tokenFromQuery;
    if (!isFirstLoginFlow && !tokenVal) {
      navigate("/forgot-password", { replace: true });
    }
  }, [prefill, tokenFromQuery, authFirstLogin, authUser, navigate]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
    defaultValues: {
      password: "",
      confirm: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const isFirstLoginFlow = !!(
        prefill?.firstLogin ||
        authFirstLogin ||
        authUser?.isFirstLogin
      );

      if (isFirstLoginFlow) {
        const userId =
          prefill.userId || authUser?.id || authUser?._id || authUser?.userId;
        const role = (prefill.role || authUser?.role || roleFromQuery || "")
          .toString()
          .toLowerCase();
        if (!userId || !role) {
          setError("password", {
            message: "Cannot change password: missing userId or role.",
          });
          return;
        }
        const payload = { userId, role, newPassword: data.password };
        const result = await changePassword(payload);
        const roleRes = (result.user?.role || result.user?.type || "")
          .toString()
          .toLowerCase();
        const target =
          roleRes === "admin"
            ? "/admin"
            : roleRes === "lecturer"
              ? "/lecturer"
              : "/student";
        navigate(target, { replace: true });
      } else {
        const tokenVal = prefill.token || prefill.resetToken || tokenFromQuery;
        if (!tokenVal) {
          setError("password", {
            message:
              "Reset token missing. Use the link from your email to reset password.",
          });
          return;
        }
        const payload = {
          token: tokenVal,
          role: prefill.role || roleFromQuery,
          newPassword: data.password,
        };
        await resetPassword(payload);
        navigate("/portal-signin", { replace: true });
      }
    } catch (err) {
      setError("password", { message: err?.message || "An error occurred" });
    }
  };

  const isLoading = isResetting || isChangingFirst;

  return (
    <div
      className={cn(
        "min-h-screen flex transition-colors duration-300",
        isDarkMode ? "bg-slate-900" : "bg-gray-50 text-gray-900",
      )}
    >
      {/* Left - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 border-r border-gray-100 dark:border-slate-800">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="inline-block mb-6">
              <div className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <span
                  className={cn(
                    "text-xl font-bold font-montserrat",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  UNIDEL
                </span>
              </div>
            </Link>
            <h3
              className={cn(
                "text-2xl font-bold mb-2",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              Reset Password
            </h3>
            <p
              className={cn(
                "text-sm",
                isDarkMode ? "text-gray-400" : "text-gray-600",
              )}
            >
              Set a new secure password for your account.
            </p>
            {prefill.email && (
              <div
                className={cn(
                  "mt-4 p-3 rounded-lg text-xs font-medium border",
                  isDarkMode
                    ? "bg-slate-800/50 border-slate-700 text-gray-300"
                    : "bg-gray-100 border-gray-200 text-gray-600",
                )}
              >
                Resetting for:{" "}
                <span className="text-orange-500">{prefill.email}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="relative">
              <Input
                label="New Password"
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Choose a strong password"
                error={errors.password?.message}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <Input
              label="Confirm Password"
              {...register("confirm")}
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter password"
              error={errors.confirm?.message}
            />

            <Button type="submit" isLoading={isLoading} fullWidth size="lg">
              Reset Password
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p
              className={cn(
                "text-sm",
                isDarkMode ? "text-gray-400" : "text-gray-600",
              )}
            >
              Remembered?{" "}
              <Link
                to="/auth/selection"
                className="text-orange-500 hover:text-orange-600 font-bold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right - informative panel */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${Images.heroImage})` }}
          aria-hidden="true"
        />
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t",
            isDarkMode
              ? "from-slate-950 via-slate-900/60 to-slate-900/20"
              : "from-black/80 via-black/30 to-transparent",
          )}
        />
        <div className="relative h-full flex flex-col justify-center items-center p-8 lg:p-12 text-white">
          <div className="w-full max-w-sm bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 flex flex-col items-center text-center gap-6 shadow-2xl">
            <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
              <ShieldCheck className="w-12 h-12 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3">Secure Your Account</h3>
              <p className="text-sm text-orange-50 text-center leading-relaxed opacity-90">
                Create a strong password and keep your account secure. A
                combination of letters, numbers, and symbols is recommended.
              </p>
            </div>

            <div className="w-full pt-6 border-t border-white/10 flex items-center justify-center gap-6 text-xs font-semibold text-orange-100">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                SSL Encrypted
              </div>
              <div className="px-3 py-1 bg-white/10 rounded-full border border-white/20">
                Time-limited Reset Link
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
