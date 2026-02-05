/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { GraduationCap, Shield, Clock } from "lucide-react";
import { Images } from "../../constants/image-strings";
import { useNavigate, Link } from "react-router-dom";
import { useAuthLogin, useAuthLogout } from "../../store/auth-store";
import useAuthStore from "../../store/auth-store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Import reusable components
import { Button, Input } from "../../components/ui";
import { InfoCard } from "../../components/Cards";
import useThemeStore from "../../store/theme-store";
import { cn } from "../../core/lib/cn";

const signInSchema = z
  .object({
    studentId: z.string().optional(),
    email: z.string().email("Invalid email address").optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.studentId || data.email, {
    message: "Either Student ID or Email is required",
    path: ["studentId"],
  });

const SignIn = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthLogin();
  const { isAuthenticated, user } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  // redirect if already authenticated
  const { logout: performLogout } = useAuthLogout();

  // redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const role = (user.role || user.type || "").toString().toLowerCase();

      // If User is Student, go to student dashboard
      if (role === "student") {
        navigate("/student", { replace: true });
      } else {
        // If logged in as Admin/Lecturer, auto-logout to allow student login
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
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
    defaultValues: {
      studentId: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        role: "student",
        password: data.password,
      };

      if (data.email && data.email.trim()) {
        payload.email = data.email.trim();
      }

      if (data.studentId && data.studentId.trim()) {
        payload.studentId = data.studentId.trim();
        payload.matricNumber = data.studentId.trim(); // Add as matricNumber for backend compatibility
      }

      const result = await login(payload);

      if (result?.requirePasswordChange || result?.user?.isFirstLogin) {
        navigate("/reset-password", {
          state: {
            message: "Please change your password",
            userId: result.user?.id || result?.userId,
            role: "student",
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
      // errors are shown by store toasts
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen flex transition-colors duration-300",
        isDarkMode
          ? "bg-slate-900"
          : "bg-gradient-to-br from-blue-50 via-white to-indigo-50",
      )}
    >
      {/* Left Side - Sign In Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-4 sm:p-8 lg:p-12 relative z-10">
        <div className="w-full max-w-lg">
          {/* Logo and Header */}
          <div className="mb-6 sm:mb-10">
            <Link
              to="/"
              className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-8 group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h3
                  className={cn(
                    "text-base sm:text-xl font-bold",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  UNIDEL Student
                </h3>
                <p
                  className={cn(
                    "text-xs sm:text-sm",
                    isDarkMode ? "text-gray-400" : "text-gray-500",
                  )}
                >
                  Examination Portal
                </p>
              </div>
            </Link>
            <h1
              className={cn(
                "text-2xl sm:text-4xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent",
              )}
            >
              Student Access
            </h1>
            <p
              className={cn(
                "text-sm sm:text-lg",
                isDarkMode ? "text-gray-300" : "text-gray-600",
              )}
            >
              Sign in to take your scheduled examinations
            </p>
          </div>

          {/* Sign In Form - Using Reusable Components */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-6"
          >
            <Input
              type="text"
              label="Student ID / Matric Number"
              placeholder="UNIDEL/2023/0001"
              error={errors.studentId?.message}
              {...register("studentId")}
            />

            <Input
              type="email"
              label="Email Address"
              placeholder="your.email@unidel.edu.ng"
              error={errors.email?.message}
              {...register("email")}
            />

            <div>
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <label
                  className={cn(
                    "block text-xs sm:text-sm font-semibold",
                    isDarkMode ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Forgot?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register("password")}
              />
            </div>

            <Button
              type="submit"
              isLoading={false}
              disableOnLoading={false}
              fullWidth
              size="lg"
            >
              Sign In to Portal
            </Button>
          </form>

          <div className="mt-6 sm:mt-8 text-center">
            <p
              className={cn(
                "text-xs sm:text-sm",
                isDarkMode ? "text-gray-400" : "text-gray-600",
              )}
            >
              Need assistance?{" "}
              <a
                href="#contact"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Image with Enhanced Overlay */}
      <div className="hidden lg:block lg:w-[55%] relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${Images.studentImage})` }}
        />
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br",
            isDarkMode
              ? "from-slate-950/95 via-indigo-950/90 to-blue-950/95"
              : "from-blue-900/95 via-indigo-900/90 to-purple-900/95",
          )}
        />

        <div className="relative h-full flex flex-col justify-between p-12 text-white">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 self-start">
            <Shield className="w-4 h-4 text-blue-300" />
            <span className="text-sm font-medium">Secure Portal</span>
          </div>

          {/* Center Content */}
          <div className="max-w-xl space-y-6">
            <h2 className="text-5xl font-bold leading-tight">
              Your Academic Excellence Starts Here
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Access your scheduled examinations in a secure, monitored
              environment. Complete assessments with confidence and receive
              instant results.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <InfoCard
                icon={<Clock />}
                title="Real-time Access"
                description="Instant exam availability"
                color="blue"
              />
              <InfoCard
                icon={<Shield />}
                title="Secure System"
                description="Protected environment"
                color="blue"
              />
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="flex items-center gap-8 text-sm">
            <div>
              <div className="text-3xl font-bold text-blue-300">10K+</div>
              <div className="text-blue-200">Active Students</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div>
              <div className="text-3xl font-bold text-blue-300">500+</div>
              <div className="text-blue-200">Courses Available</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
