import React, { useEffect, useState } from "react";
import { Eye, EyeOff, BookOpen, AlertCircle } from "lucide-react";
import { Images } from "../../constants/image-strings";
import { Link, useNavigate } from "react-router-dom";
import { ButtonSpinner } from "../../components/Spinners";
import { useAuthAdminSignup } from "../../store/auth-store";
import useAuthStore from "../../store/auth-store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const adminSignupSchema = z.object({
  fullname: z.string().min(3, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  organisation: z.string().min(2, "Organisation is required"),
});

// Import reusable components
import { Button, Input } from "../../components/ui";
import useThemeStore from "../../store/theme-store";
import { cn } from "../../core/lib/cn";
import { Shield, Plus, Building, User } from "lucide-react";

const AdminSignUp = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuthAdminSignup();
  const { isAuthenticated, user } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      const role = (user.role || user.type || "").toString().toLowerCase();
      const target =
        role === "admin"
          ? "/admin"
          : role === "lecturer"
            ? "/lecturer"
            : "/student";
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminSignupSchema),
    mode: "onBlur",
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      organisation: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      const result = await signup(data);
      const role = (result.user?.role || result.user?.type || "")
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
          : "bg-gradient-to-br from-slate-50 via-white to-emerald-50",
      )}
    >
      {/* Left Side - Admin Sign Up Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-4 sm:p-8 lg:p-12 relative z-10">
        <div className="w-full max-w-lg">
          {/* Logo and Header */}
          <div className="mb-6 sm:mb-10">
            <Link
              to="/"
              className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-8 group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3
                className={cn(
                  "text-base sm:text-xl font-bold font-montserrat",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                UNIDEL Admin
              </h3>
            </Link>
            <h1
              className={cn(
                "text-2xl sm:text-4xl font-bold mb-2 sm:mb-3",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              Create <span className="text-emerald-500">Admin</span> Account
            </h1>
            <p
              className={cn(
                "text-sm sm:text-lg",
                isDarkMode ? "text-gray-400" : "text-gray-600",
              )}
            >
              Register an administrator account to manage platform operations.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-5"
          >
            <Input
              label="Full Name"
              placeholder="Jane Doe"
              error={errors.fullname?.message}
              variant="admin"
              {...register("fullname")}
            />

            <Input
              label="Organization"
              placeholder="University of Delta"
              error={errors.organisation?.message}
              variant="admin"
              {...register("organisation")}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="admin@unidel.edu.ng"
              error={errors.email?.message}
              variant="admin"
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
                  className="text-xs sm:text-sm text-emerald-600 hover:text-emerald-700 font-semibold"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Choose a strong password"
                  error={errors.password?.message}
                  variant="admin"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-gray-500 hover:text-emerald-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              variant="admin"
              fullWidth
              size="lg"
            >
              Create Admin Account
            </Button>
          </form>

          <div className="mt-6 sm:mt-8 text-center">
            <p
              className={cn(
                "text-xs sm:text-sm",
                isDarkMode ? "text-gray-400" : "text-gray-600",
              )}
            >
              Already have an account?{" "}
              <Link
                to="/admin-signin"
                className="text-emerald-600 hover:text-emerald-700 font-bold"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Image with Enhanced Overlay */}
      <div className="hidden lg:block lg:w-[55%] relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${Images.heroImage})` }}
          aria-hidden="true"
        />
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-tr",
            isDarkMode
              ? "from-slate-950/95 via-emerald-950/80 to-cyan-950/95"
              : "from-emerald-900/90 via-cyan-900/80 to-emerald-800/90",
          )}
        />

        <div className="relative h-full flex flex-col justify-between p-12 text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 self-start">
            <Shield className="w-4 h-4 text-emerald-300" />
            <span className="text-sm font-medium">Restricted Registration</span>
          </div>

          <div className="max-w-xl">
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Provision Administrative Access
            </h2>
            <p className="text-lg lg:text-xl text-emerald-50 leading-relaxed opacity-90">
              Create a secure administrator account to manage exams, users and
              system settings with full auditing and enterprise-grade security.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-12 w-full max-w-lg">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
              <Plus className="w-8 h-8 text-emerald-400 mb-2" />
              <h4 className="font-bold text-white">Scaleable</h4>
              <p className="text-xs text-emerald-100">
                Manage institution-wide data
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
              <Building className="w-8 h-8 text-cyan-400 mb-2" />
              <h4 className="font-bold text-white">Unified</h4>
              <p className="text-xs text-emerald-100">
                Centralized control center
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignUp;
