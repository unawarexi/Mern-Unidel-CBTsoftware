/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { UserCheck, Lock, Globe, Users, Briefcase } from "lucide-react";
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

const agentSignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const AgentSignIn = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthLogin();
  const { isAuthenticated, user } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      const role = (user.role || user.type || "").toString().toLowerCase();

      if (role === "agent") {
        // Agent portal built, redirect to dashboard
        navigate("/agent", { replace: true });
      }
      // Allow usage of form even if logged in as other role
    }
  }, [isAuthenticated, user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(agentSignInSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      // Agent role
      const payload = { ...data, role: "agent" };
      await login(payload);
      navigate("/agent", { replace: true });
    } catch (error) {
      // error handled via toast
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen relative overflow-hidden flex items-center justify-center p-3 sm:p-4 transition-colors duration-300",
        isDarkMode
          ? "bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900"
          : "bg-gradient-to-br from-indigo-50 via-white to-purple-50",
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
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

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
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-indigo-400/30 mb-6 font-semibold shadow-sm">
              <Globe className="w-4 h-4 text-indigo-500" />
              <span
                className={cn(
                  "text-sm",
                  isDarkMode ? "text-indigo-300" : "text-indigo-700",
                )}
              >
                External Partner Portal
              </span>
            </div>

            <h1 className="text-5xl font-bold mb-4 leading-tight">
              Agent Collaboration Hub
            </h1>
            <p
              className={cn(
                "text-xl leading-relaxed",
                isDarkMode ? "text-gray-300" : "text-gray-600",
              )}
            >
              The gateway for licensed educational partners and institutional
              agents using the UNIDEL CBT platform.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 gap-4">
            <div
              className={cn(
                "p-4 rounded-2xl border backdrop-blur-md transition-all hover:scale-105",
                isDarkMode
                  ? "bg-white/5 border-white/10"
                  : "bg-white/50 border-indigo-100",
              )}
            >
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold">Student Management</h3>
              </div>
              <p className="text-sm opacity-70">
                Enrol and track your students' performance across various
                assessments.
              </p>
            </div>
            <div
              className={cn(
                "p-4 rounded-2xl border backdrop-blur-md transition-all hover:scale-105",
                isDarkMode
                  ? "bg-white/5 border-white/10"
                  : "bg-white/50 border-purple-100",
              )}
            >
              <div className="flex items-center gap-3 mb-2">
                <Briefcase className="w-5 h-5 text-purple-500" />
                <h3 className="font-bold">Partnership Tools</h3>
              </div>
              <p className="text-sm opacity-70">
                Access exclusive institutional resources and partnership
                analytics.
              </p>
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
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                  <UserCheck className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </Link>
              <h2
                className={cn(
                  "text-2xl sm:text-3xl font-bold mb-1 sm:mb-2",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                Agent Sign In
              </h2>
              <p
                className={cn(
                  "text-sm sm:text-base",
                  isDarkMode ? "text-gray-400" : "text-gray-500",
                )}
              >
                Access your partner dashboard
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-6"
            >
              <Input
                type="email"
                label="Agent Email"
                placeholder="agent@institution.com"
                error={errors.email?.message}
                className={cn(
                  "focus:ring-indigo-500/20 focus:border-indigo-500",
                )}
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
                    state={{ role: "agent" }}
                    className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-700 font-bold"
                  >
                    Forgot?
                  </Link>
                </div>
                <Input
                  type="password"
                  placeholder="Enter partner password"
                  error={errors.password?.message}
                  className={cn(
                    "focus:ring-indigo-500/20 focus:border-indigo-500",
                  )}
                  {...register("password")}
                />
              </div>

              <Button
                type="submit"
                isLoading={false}
                disableOnLoading={false}
                fullWidth
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-none shadow-indigo-500/25"
                leftIcon={<Lock className="w-4 h-4 sm:w-5 sm:h-5" />}
              >
                Sign In to Portal
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
                  Don't have a partner account?{" "}
                  <Link
                    to="/agent-signup"
                    className="text-indigo-600 hover:text-indigo-700 font-bold"
                  >
                    Apply for Partnership
                  </Link>
                </p>
              </div>
              <div
                className={cn(
                  "pt-4 sm:pt-6 border-t text-center",
                  isDarkMode ? "border-white/10" : "border-gray-100",
                )}
              >
                <p className="text-xs text-gray-500">
                  By signing in, you agree to our Partnership Terms and Data
                  Processing Agreement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Badge */}
      <div className="lg:hidden absolute top-4 sm:top-6 left-1/2 -translate-x-1/2">
        <div className="inline-flex items-center gap-2 bg-indigo-500/20 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-indigo-400/30">
          <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-300" />
          <span className="text-xs sm:text-sm font-semibold text-white">
            Partner Portal
          </span>
        </div>
      </div>
    </div>
  );
};

export default AgentSignIn;
