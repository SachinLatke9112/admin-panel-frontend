import { useCallback, useState } from "react";
import { adminAuthService } from "../services/adminAuthService";
import { validateAdminLoginForm } from "../utils/adminValidators";

/**
 * useAdminAuth — Admin Login request/validation state.
 *
 * Frontend-only for now: it validates the form, calls the stub
 * adminAuthService, and tracks loading/error state. It intentionally does
 * not persist a session or expose `isAuthenticated` — that belongs to a
 * future AdminAuthContext once a real backend admin-login endpoint and an
 * AdminRoute guard are built alongside the rest of the Admin Panel.
 */
export function useAdminAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const clearErrors = useCallback(() => {
    setError("");
    setFieldErrors({});
  }, []);

  const login = useCallback(async ({ email, password, rememberMe }) => {
    const validationErrors = validateAdminLoginForm({ email, password });

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return { success: false };
    }

    setIsLoading(true);
    setError("");
    setFieldErrors({});

    try {
      const response = await adminAuthService.login({ email, password, rememberMe });
      return { success: true, data: response.data };
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to sign in. Please check your credentials and try again."
      );
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { login, isLoading, error, fieldErrors, clearErrors };
}

export default useAdminAuth;
