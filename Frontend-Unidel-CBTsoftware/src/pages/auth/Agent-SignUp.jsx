/* eslint-disable no-unused-vars */
import React from "react";
import {
  Globe,
  ShieldCheck,
  Mail,
  Lock,
  Building,
  UserPlus,
  ArrowLeft,
} from "lucide-react";
import { Images } from "../../constants/image-strings";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth-store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAgentSignup } from "../../hooks/useAuth";

// Import reusable components
import { Button, Input } from "../../components/ui";
import useThemeStore from "../../store/theme-store";
import { cn } from "../../core/lib/cn";

const agentSignUpSchema = z
  .object({
    fullname: z.string().min(3, "Full name is required"),
    email: z.string().email("Invalid email address"),
    organisation: z.string().min(2, "Organisation/School name is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const AgentSignUp = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const { mutateAsync: signup, isLoading } = useAgentSignup();
  const showToast = useAuthStore((state) => state.showToast);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(agentSignUpSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        role: "agent",
        // The backend expects organisation, fullname, email, password
      };
      await signup(payload);
      showToast(
        "Registration successful! Please wait for admin verification.",
        "success",
      );
      navigate("/signin-agent");
    } catch (error) {
      showToast(error.message || "Registration failed", "error");
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
      <div className="relative z-10 w-full max-w-7xl grid lg:grid-cols-5 gap-8 items-center">
        {/* Left Info Panel */}
        <div
          className={cn(
            "lg:col-span-2 space-y-8 hidden lg:block",
            isDarkMode ? "text-white" : "text-gray-900",
          )}
        >
          <div>
            <Link
              to="/signin-agent"
              className="inline-flex items-center pr-6 gap-2 text-indigo-500 hover:text-indigo-600 font-bold mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>

            <div className="inline-flex items-center gap-2 bg-indigo-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-indigo-400/30 mb-6 font-semibold shadow-sm">
              <UserPlus className="w-4 h-4 text-indigo-500" />
              <span
                className={cn(
                  "text-sm",
                  isDarkMode ? "text-indigo-300" : "text-indigo-700",
                )}
              >
                Partner Registration
              </span>
            </div>

            <h1 className="text-5xl font-bold mb-4 leading-tight">
              Join the UNIDEL Partner Network
            </h1>
            <p
              className={cn(
                "text-xl leading-relaxed",
                isDarkMode ? "text-gray-300" : "text-gray-600",
              )}
            >
              Register your institution or agency to access our advanced CBT
              infrastructure and assessment tools.
            </p>
          </div>

          <div className="space-y-4">
            <div
              className={cn(
                "p-4 rounded-2xl border backdrop-blur-md transition-all",
                isDarkMode
                  ? "bg-white/5 border-white/10"
                  : "bg-white/50 border-indigo-100",
              )}
            >
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold">Verified Access</h3>
              </div>
              <p className="text-sm opacity-70">
                Register today and our admin team will verify your school or
                agency within 24 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Right Signup Card */}
        <div className="lg:col-span-3">
          <div
            className={cn(
              "p-6 sm:p-8 lg:p-8 rounded-3xl shadow-2xl border transition-all duration-300 max-w-2xl mx-auto",
              isDarkMode
                ? "bg-slate-900/80 backdrop-blur-2xl border-white/10"
                : "bg-white/98 backdrop-blur-2xl border-gray-100",
            )}
          >
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30 mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h2
                className={cn(
                  "text-2xl sm:text-3xl font-bold mb-1",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                Create Partner Account
              </h2>
              <p
                className={cn(
                  "text-sm",
                  isDarkMode ? "text-gray-400" : "text-gray-500",
                )}
              >
                Fill in the details to apply for partnership
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="John Doe"
                error={errors.fullname?.message}
                {...register("fullname")}
              />

              <Input
                label="Partner Email"
                type="email"
                placeholder="admin@school.com"
                error={errors.email?.message}
                {...register("email")}
              />

              <Input
                label="Organisation / School Name"
                placeholder="University of Excellence"
                error={errors.organisation?.message}
                {...register("organisation")}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register("password")}
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  error={errors.confirmPassword?.message}
                  {...register("confirmPassword")}
                />
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                fullWidth
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 mt-4"
              >
                Register & Apply
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p
                className={cn(
                  "text-sm",
                  isDarkMode ? "text-gray-400" : "text-gray-500",
                )}
              >
                Already a partner?{" "}
                <Link to="/signin-agent" className="text-indigo-600 font-bold">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentSignUp;
