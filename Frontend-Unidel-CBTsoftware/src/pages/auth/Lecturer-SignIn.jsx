/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { BookOpen, FileText, Users } from "lucide-react";
import { Images } from "../../constants/image-strings";
import { Link, useNavigate } from "react-router-dom";
import { useAuthLogin } from "../../store/auth-store";
import useAuthStore from "../../store/auth-store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Import reusable components
import { Button, Input } from "../../components/ui";
import { InfoCard } from "../../components/Cards";
import useThemeStore from "../../store/theme-store";
import { cn } from "../../core/lib/cn";

const lecturerSignInSchema = z.object({
  employeeId: z.string().min(3, "Employee ID must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const LecturerSignIn = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthLogin();
  const { isAuthenticated, user } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      const role = (user.role || user.type || "").toString().toLowerCase();

      // If Lecturer, go to lecturer dashboard
      if (role === "lecturer") {
        navigate("/lecturer", { replace: true });
      }
      // Otherwise stay on page to allow new login
    }
  }, [isAuthenticated, user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(lecturerSignInSchema),
    mode: "onBlur",
    defaultValues: {
      employeeId: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, role: "lecturer" };
      const result = await login(payload);

      if (result?.requirePasswordChange || result?.user?.isFirstLogin) {
        navigate("/reset-password", {
          state: {
            message: "Please change your password",
            userId: result.user?.id || result?.userId,
            role: "lecturer",
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
      // handled by store toast
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen flex transition-colors duration-300",
        isDarkMode
          ? "bg-slate-900"
          : "bg-gradient-to-br from-orange-50 via-white to-amber-50",
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
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h3
                  className={cn(
                    "text-base sm:text-xl font-bold",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  UNIDEL Lecturer
                </h3>
                <p
                  className={cn(
                    "text-xs sm:text-sm",
                    isDarkMode ? "text-gray-400" : "text-gray-500",
                  )}
                >
                  Faculty Portal
                </p>
              </div>
            </Link>
            <h1
              className={cn(
                "text-2xl sm:text-4xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent",
              )}
            >
              Faculty Access
            </h1>
            <p
              className={cn(
                "text-sm sm:text-lg",
                isDarkMode ? "text-gray-300" : "text-gray-600",
              )}
            >
              Sign in to manage courses and assessments
            </p>
          </div>

          {/* Sign In Form - Using Reusable Components */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-6"
          >
            <Input
              type="text"
              label="Employee ID"
              placeholder="EMP12345"
              error={errors.employeeId?.message}
              variant="lecturer"
              {...register("employeeId")}
            />

            <Input
              type="email"
              label="Email Address"
              placeholder="you@unidel.edu.ng"
              error={errors.email?.message}
              variant="lecturer"
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
                  className="text-xs sm:text-sm text-orange-600 hover:text-orange-700 font-semibold"
                >
                  Forgot?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="Enter your password"
                error={errors.password?.message}
                variant="lecturer"
                {...register("password")}
              />
            </div>

            <Button
              type="submit"
              isLoading={false}
              disableOnLoading={false}
              variant="lecturer"
              fullWidth
              size="lg"
            >
              Sign In to Portal
            </Button>
          </form>

          <div className="mt-6 sm:mt-8 text-center" />
        </div>
      </div>

      {/* Right Side - Hero Image with Enhanced Overlay */}
      <div className="hidden lg:block lg:w-[55%] relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${Images.lecturerImage})` }}
        />
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br",
            isDarkMode
              ? "from-orange-950/95 via-red-950/90 to-amber-950/95"
              : "from-orange-900/95 via-red-900/90 to-amber-900/95",
          )}
        />

        <div className="relative h-full flex flex-col justify-between p-12 text-white">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 self-start">
            <BookOpen className="w-4 h-4 text-orange-300" />
            <span className="text-sm font-medium">Faculty Portal</span>
          </div>

          {/* Center Content */}
          <div className="max-w-xl space-y-6">
            <h2 className="text-5xl font-bold leading-tight">
              Empower Your Teaching Journey
            </h2>
            <p className="text-xl text-orange-100 leading-relaxed">
              Comprehensive tools to create, manage, and assess student
              performance with precision and ease.
            </p>

            {/* Features - Using Reusable InfoCard */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <InfoCard
                icon={<FileText />}
                title="Create Assessments"
                description="Design comprehensive tests"
                color="orange"
              />
              <InfoCard
                icon={<Users />}
                title="Manage Students"
                description="Track progress effectively"
                color="orange"
              />
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="flex items-center gap-8 text-sm">
            <div>
              <div className="text-3xl font-bold text-orange-300">500+</div>
              <div className="text-orange-200">Active Lecturers</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div>
              <div className="text-3xl font-bold text-orange-300">1000+</div>
              <div className="text-orange-200">Courses Managed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerSignIn;
