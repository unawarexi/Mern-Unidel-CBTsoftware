/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { Shield, Lock, Settings, Database, TrendingUp } from "lucide-react";
import { Images } from "../../constants/image-strings";
import { Link, useNavigate } from "react-router-dom";
import { useAuthLogin } from "../../store/auth-store";
import useAuthStore from "../../store/auth-store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Import reusable components
import { Button, Input } from "../../components/ui";
import useThemeStore from "../../store/theme-store";
import { cn } from "../../core/lib/cn";

const adminSignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const AdminSignIn = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthLogin();
  const { isAuthenticated, user } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      const role = (user.role || user.type || "").toString().toLowerCase();

      // If already logged in as Admin, go to dashboard
      if (role === "admin" || role === "superadmin") {
        navigate("/admin", { replace: true });
      } else {
        // If logged in as something else (Student/Lecturer), auto-logout
        // This cleaning the session so they can sign in as Admin
        console.log(
          "[Auth] Mismatched role detected, performing auto-logout for clean switch",
        );
        performLogout();
      }
    }
  }, [isAuthenticated, user, navigate, performLogout]);

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
        navigate("/reset-password", {
          state: {
            message: "Please change your password",
            userId: result.user?.id || result?.userId,
            role: "admin",
          },
        });
        return;
      }

      const role = (result.user.role || result.user.type || "")
        .toString()
        .toLowerCase();
      const target =
        role === "admin"
          ? "/admin"
          : role === "lecturer"
            ? "/lecturer"
            : "/student";
      navigate(target, { replace: true });
    } catch (error) {
      // error handled via toast
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen relative overflow-hidden flex items-center justify-center p-3 sm:p-4 transition-colors duration-300",
        isDarkMode
          ? "bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900"
          : "bg-gradient-to-br from-slate-50 via-white to-emerald-50",
      )}
    >
      {/* Animated Grid Pattern Overlay */}
      <div
        className={cn(
          "absolute inset-0 opacity-10",
          isDarkMode ? "invert-0" : "invert",
        )}
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Glow Effects */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-5 gap-8 items-center">
        {/* Left Info Panel - Hidden on mobile */}
        <div
          className={cn(
            "lg:col-span-2 space-y-8 hidden lg:block",
            isDarkMode ? "text-white" : "text-gray-900",
          )}
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-400/30 mb-6 font-semibold shadow-sm">
              <Lock className="w-4 h-4 text-emerald-500" />
              <span
                className={cn(
                  "text-sm",
                  isDarkMode ? "text-emerald-300" : "text-emerald-700",
                )}
              >
                Restricted Access
              </span>
            </div>

            <h1 className="text-5xl font-bold mb-4 leading-tight">
              Administration Control Center
            </h1>
            <p
              className={cn(
                "text-xl leading-relaxed",
                isDarkMode ? "text-gray-300" : "text-gray-600",
              )}
            >
              Manage platform operations, users, and system configurations with
              enterprise-grade security.
            </p>
          </div>

          {/* Image Container with Rounded Border */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl group">
            <div
              className="aspect-[4/3] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${Images.adminImage})` }}
            />
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br",
                isDarkMode
                  ? "from-slate-950/95 via-gray-900/90 to-slate-950/95"
                  : "from-slate-900/40 via-transparent to-slate-900/40",
              )}
            />

            {/* Stats Grid Overlay */}
            <div className="absolute inset-0 p-6 flex items-end">
              <div className="w-full grid grid-cols-2 gap-3">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                  <Settings className="w-7 h-7 text-emerald-400 mb-2" />
                  <div className="text-xl font-bold text-white">100%</div>
                  <div className="text-xs text-gray-300">System Uptime</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                  <Database className="w-7 h-7 text-cyan-400 mb-2" />
                  <div className="text-xl font-bold text-white">Secure</div>
                  <div className="text-xs text-gray-300">Data Protection</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Login Card */}
        <div className="lg:col-span-3">
          <div
            className={cn(
              "p-6 sm:p-8 lg:p-12 rounded-3xl shadow-2xl border transition-all duration-300 max-w-xl mx-auto",
              isDarkMode
                ? "bg-slate-900/80 backdrop-blur-2xl border-white/10"
                : "bg-white/98 backdrop-blur-2xl border-gray-100",
            )}
          >
            {/* Header */}
            <div className="text-center mb-6 sm:mb-10">
              <Link to="/" className="inline-block group mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </Link>
              <h2
                className={cn(
                  "text-2xl sm:text-3xl font-bold mb-1 sm:mb-2",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                Administrator Access
              </h2>
              <p
                className={cn(
                  "text-sm sm:text-base",
                  isDarkMode ? "text-gray-400" : "text-gray-500",
                )}
              >
                Secure authentication required
              </p>
            </div>

            {/* Form - Using Reusable Components */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-6"
            >
              <Input
                type="email"
                label="Admin Email"
                placeholder="admin@unidel.edu.ng"
                error={errors.email?.message}
                variant="admin"
                {...register("email")}
              />

              <div>
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <label
                    className={cn(
                      "block text-xs sm:text-sm font-bold uppercase tracking-wide",
                      isDarkMode ? "text-gray-300" : "text-gray-700",
                    )}
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs sm:text-sm text-emerald-600 hover:text-emerald-700 font-bold"
                  >
                    Forgot?
                  </Link>
                </div>
                <Input
                  type="password"
                  placeholder="Enter admin password"
                  error={errors.password?.message}
                  variant="admin"
                  {...register("password")}
                />
              </div>

              <Button
                type="submit"
                isLoading={false}
                disableOnLoading={false}
                variant="admin"
                fullWidth
                size="lg"
                leftIcon={<Lock className="w-4 h-4 sm:w-5 sm:h-5" />}
              >
                Secure Sign In
              </Button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
              <div className="text-center">
                <p
                  className={cn(
                    "text-xs sm:text-sm",
                    isDarkMode ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  Contact Super Admin for account creation or access issues.
                </p>
              </div>

              <div
                className={cn(
                  "pt-4 sm:pt-6 border-t text-center",
                  isDarkMode ? "border-white/10" : "border-gray-100",
                )}
              >
                <p className="text-xs text-gray-500">
                  This is a restricted area. All access attempts are logged and
                  monitored.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Badge - Only visible on small screens */}
      <div className="lg:hidden absolute top-4 sm:top-6 left-1/2 -translate-x-1/2">
        <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-emerald-400/30">
          <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-300" />
          <span className="text-xs sm:text-sm font-semibold text-white">
            Admin Portal
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;
