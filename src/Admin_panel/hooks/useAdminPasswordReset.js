import { useCallback, useState } from "react";
import { adminAuthService } from "../services/adminAuthService";
import {
  validateAdminForgotPasswordForm,
  validateAdminOtpForm,
  validateAdminResetPasswordForm,
} from "../utils/adminValidators";

/**
 * useAdminPasswordReset — Admin Forgot Password / OTP Verification / Reset
 * Password request+validation state. Sibling to useAdminAuth, kept separate
 * since it drives three calls (request OTP, verify OTP, reset password)
 * across three pages rather than one login submission.
 *
 * Frontend-only for now: it validates the form, calls the stub
 * adminAuthService methods, and tracks loading/error state — same shape
 * as useAdminAuth so swapping in real API calls later requires no
 * changes to the calling components.
 */
export function useAdminPasswordReset() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const clearErrors = useCallback(() => {
    setError("");
    setFieldErrors({});
  }, []);

  const requestOtp = useCallback(async ({ email }) => {
    const validationErrors = validateAdminForgotPasswordForm({ email });

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return { success: false };
    }

    setIsLoading(true);
    setError("");
    setFieldErrors({});

    try {
      const response = await adminAuthService.requestPasswordResetOtp({ email });
      return { success: true, data: response.data };
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to send the OTP. Please check the email address and try again."
      );
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyOtp = useCallback(async ({ email, otp }) => {
    const validationErrors = validateAdminOtpForm({ otp });

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return { success: false };
    }

    setIsLoading(true);
    setError("");
    setFieldErrors({});

    try {
      const response = await adminAuthService.verifyPasswordResetOtp({ email, otp });
      return { success: true, data: response.data };
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid or expired OTP. Please try again.");
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async ({ email, password, confirmPassword }) => {
    const validationErrors = validateAdminResetPasswordForm({ password, confirmPassword });

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return { success: false };
    }

    setIsLoading(true);
    setError("");
    setFieldErrors({});

    try {
      const response = await adminAuthService.resetPassword({ email, password });
      return { success: true, data: response.data };
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to reset the password. Please try again.");
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { requestOtp, verifyOtp, resetPassword, isLoading, error, fieldErrors, clearErrors };
}

export default useAdminPasswordReset;
