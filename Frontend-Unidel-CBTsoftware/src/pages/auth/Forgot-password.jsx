/* eslint-disable no-unused-vars */
import React from "react";
import { AlertCircle, Mail, User } from "lucide-react";
import { Images } from "../../constants/image-strings";
import { useNavigate, Link } from "react-router-dom";
import { useAuthForgotPassword } from "../../store/auth-store";
import { ButtonSpinner } from "../../components/Spinners";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const forgotPasswordSchema = z.object({
  role: z.enum(["student", "lecturer", "admin"]),
  identifier: z.string().min(3, "ID is required"),
  email: z.string().email("Invalid email address"),
});

// Import reusable components
import { Button, Input } from "../../components/ui";
import useThemeStore from "../../store/theme-store";
import { cn } from "../../core/lib/cn";
import { Shield } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword, isLoading } = useAuthForgotPassword();
  const { isDarkMode } = useThemeStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
    defaultValues: {
      role: "student",
      identifier: "",
      email: "",
    },
  });

  const role = watch("role");

  const onSubmit = async (data) => {
    try {
      const payload = { ...data };
      const result = await forgotPassword(payload);
      navigate("/reset-password", {
        state: { ...payload, token: result?.token || null },
      });
    } catch (err) {
      // toast shown by store
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen flex transition-colors duration-300",
        isDarkMode ? "bg-slate-900" : "bg-gray-50 text-gray-900",
      )}
    >
      {/* Left - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="inline-block mb-6">
              <div className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <Mail className="w-6 h-6 text-white" />
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
              Password Assistance
            </h3>
            <p
              className={cn(
                "text-sm",
                isDarkMode ? "text-gray-400" : "text-gray-600",
              )}
            >
              Request a password reset link for your account.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                className={cn(
                  "block text-sm font-medium mb-3",
                  isDarkMode ? "text-gray-300" : "text-gray-700",
                )}
              >
                I am a
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["student", "lecturer", "admin"].map((r) => (
                  <label
                    key={r}
                    className={cn(
                      "flex items-center justify-center px-3 py-2.5 rounded-xl cursor-pointer border-2 transition-all capitalize text-sm font-semibold",
                      role === r
                        ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/20"
                        : isDarkMode
                          ? "bg-slate-800 border-slate-700 text-gray-400 hover:border-slate-600"
                          : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 shadow-sm",
                    )}
                  >
                    <input
                      type="radio"
                      {...register("role")}
                      value={r}
                      className="hidden"
                      onClick={() => setValue("role", r)}
                    />
                    {r}
                  </label>
                ))}
              </div>
            </div>

            <Input
              label={
                role === "student"
                  ? "Matric / Student ID"
                  : role === "lecturer"
                    ? "Employee ID"
                    : "Admin ID"
              }
              placeholder={
                role === "student"
                  ? "UNIDEL/2023/0001"
                  : role === "lecturer"
                    ? "EMP12345"
                    : "ADM001"
              }
              error={errors.identifier?.message}
              {...register("identifier")}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="your.email@unidel.edu.ng"
              error={errors.email?.message}
              {...register("email")}
            />

            <Button type="submit" isLoading={isLoading} fullWidth size="lg">
              Request Reset Link
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p
              className={cn(
                "text-sm",
                isDarkMode ? "text-gray-400" : "text-gray-600",
              )}
            >
              Remembered your password?{" "}
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

      {/* Right - image + brief */}
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
        <div className="relative h-full flex flex-col justify-center p-8 lg:p-12 text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 self-start mb-8">
            <AlertCircle className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-medium">Security First</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold leading-tight">
            Reset your password securely
          </h2>
          <p className="mt-6 text-lg lg:text-xl text-orange-100/80 leading-relaxed max-w-lg">
            Enter your details and we'll send instructions to your registered
            email to reset your account password.
          </p>

          <div className="mt-12 w-full max-w-xs">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm font-bold">Encrypted Reset</div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                Our reset links are encrypted and time-sensitive for your
                protection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
