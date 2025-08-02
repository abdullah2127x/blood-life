"use client";
import { useState } from "react";
import AuthForm from "./AuthForm";
import { useRouter } from "next/navigation";

export default function ForgetPassword() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const emailFields = [
    {
      name: "email",
      type: "email",
      placeholder: "Enter your email address",
      label: "Email Address",
      validation: {
        required: "Email is required",
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Invalid email address",
        },
      },
    },
  ];

  const otpFields = [
    {
      name: "otp",
      type: "text",
      placeholder: "Enter 6-digit code",
      label: "Verification Code",
      validation: {
        required: "Verification code is required",
        pattern: {
          value: /^[0-9]{6}$/,
          message: "Please enter a 6-digit code",
        },
      },
    },
  ];

  const resetFields = [
    {
      name: "newPassword",
      type: "password",
      placeholder: "Enter new password",
      label: "New Password",
      validation: {
        required: "New password is required",
        minLength: {
          value: 8,
          message: "Password must be at least 8 characters",
        },
        pattern: {
          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          message: "Password must contain uppercase, lowercase, and number",
        },
      },
    },
    {
      name: "confirmPassword",
      type: "password",
      placeholder: "Confirm new password",
      label: "Confirm New Password",
      validation: {
        required: "Please confirm your password",
        validate: (value: string, formValues: any) =>
          value === formValues.newPassword || "Passwords do not match",
      },
    },
  ];

  // Handle resend countdown
  const startResendCountdown = () => {
    setResendCountdown(60);
    const interval = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle email submission - using secure backend OTP
  const handleEmailSubmit = async (data: any) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      // Check if user exists first
      const checkUserRes = await fetch("/api/auth/check-user-exist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
      const userData = await checkUserRes.json();
      if (!userData.exists) {
        setError("No account found with this email address.");
        return;
      }
      // Send OTP using new endpoint
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
      const result = await res.json();
      if (res.ok) {
        setEmail(data.email);
        setOtp("");
        setStep("otp");
        setAttempts(0);
        startResendCountdown();
        setSuccess("Verification code sent to your email!");
      } else {
        setError("Failed to send OTP: " + result.error);
      }
    } catch (error) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP submission - using secure backend verification
  const handleOtpSubmit = async (data: any) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      // Verify OTP using new endpoint
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, otp: data.otp }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setOtp(data.otp);
        setStep("reset");
        setSuccess("Code verified successfully!");
      } else {
        setAttempts((prev) => prev + 1);
        if (attempts >= 2) {
          setStep("email");
          setAttempts(0);
          setError("Too many incorrect attempts. Please try again.");
        } else {
          setError(`Incorrect code. ${3 - attempts} attempts remaining.`);
        }
      }
    } catch (error) {
      setError("Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset - using the existing reset password API
  const handleResetSubmit = async (data: any) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Use the existing reset password API (OTP already verified in previous step)
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          newPassword: data.newPassword,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setSuccess("Password reset successfully! Redirecting to login...");
        setLoading(true);
        setTimeout(() => {
          router.push("/authentication/login");
        }, 1500);
      } else {
        setError("Password reset failed: " + result.error);
      }
    } catch (error) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP - using secure backend
  const handleResendOtp = async () => {
    if (resendCountdown > 0) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      // Resend OTP using new endpoint
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
      });
      const result = await res.json();
      if (res.ok) {
        startResendCountdown();
        setSuccess("Verification code resent successfully!");
      } else {
        setError("Failed to resend code: " + result.error);
      }
    } catch (error) {
      setError("Failed to resend code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle change email
  const handleChangeEmail = () => {
    setStep("email");
    setEmail("");
    setOtp("");
    setAttempts(0);
    setResendCountdown(0);
    setError("");
    setSuccess("");
  };

  const getStepConfig = () => {
    switch (step) {
      case "email":
        return {
          fields: emailFields,
          title: "Forgot Password",
          description: "Enter your email to receive a reset code",
          submitLabel: "Send Reset Code",
          handleSubmit: handleEmailSubmit,
          links: [{ name: "Back to login", href: "/authentication/login" }],
          disableAll: loading,
        };
      case "otp":
        return {
          fields: otpFields,
          title: "Enter Verification Code",
          description: `We've sent a code to ${email}`,
          submitLabel: "Verify Code",
          handleSubmit: handleOtpSubmit,
          links: [
            {
              name:
                resendCountdown > 0
                  ? `Resend code in ${resendCountdown}s`
                  : "Didn't receive code? Resend",
              href: "#",
              onClick: handleResendOtp,
              disabled: resendCountdown > 0 || loading,
            },
            { name: "Change email", href: "#", onClick: handleChangeEmail },
            { name: "Back to login", href: "/authentication/login" },
          ],
          disableAll: loading,
        };
      case "reset":
        return {
          fields: resetFields,
          title: "Reset Password",
          description: "Create a new password for your account",
          submitLabel: "Reset Password",
          handleSubmit: handleResetSubmit,
          showProviders: false,
          showDivider: false,
          links: [
            {
              name: "Back to verification",
              href: "#",
              onClick: () => setStep("otp"),
            },
            { name: "Back to login", href: "/authentication/login" },
          ],
          disableAll: loading,
        };
    }
  };

  const config = getStepConfig();

  return (
    <AuthForm {...config} loading={loading} error={error} success={success} />
  );
}
