import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ROUTES from "@constants/routes";
import AdminInput from "../common/AdminInput";
import AdminButton from "../common/AdminButton";
import PasswordInput from "./PasswordInput";
import { setAdminAuthenticated } from "../../services/adminSession";

function MailIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

// TEMPORARY DEV BYPASS: real submission (client-side validation +
// adminAuthService.login() via the useAdminAuth hook) is intentionally not
// wired up here so the rest of the Admin Panel can be built without a
// backend. The short delay below exists only to preserve the existing
// loading-state UI (spinner, disabled fields) — it is not simulating a
// real request. Restore the useAdminAuth() call in place of this bypass
// once a real admin-login endpoint exists; see adminAuthService.js /
// useAdminAuth.js / adminValidators.js, which already implement the
// validation and request flow this bypass skips.
const BYPASS_DELAY_MS = 500;

export function AdminLoginForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);

    window.setTimeout(() => {
      setAdminAuthenticated();
      navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
    }, BYPASS_DELAY_MS);
  };

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
      <AdminInput
        id="admin-email"
        name="email"
        label="Email address"
        type="email"
        autoComplete="username"
        placeholder="admin@speakmate.ai"
        value={form.email}
        onChange={handleChange("email")}
        icon={<MailIcon />}
        disabled={isLoading}
        required
      />

      <PasswordInput
        id="admin-password"
        name="password"
        label="Password"
        autoComplete="current-password"
        placeholder="Enter your admin password"
        value={form.password}
        onChange={handleChange("password")}
        disabled={isLoading}
        required
      />

      <div className="flex items-center justify-between text-sm">
        <label htmlFor="admin-remember-me" className="flex items-center gap-2 text-slate-600">
          <input
            id="admin-remember-me"
            type="checkbox"
            checked={rememberMe}
            disabled={isLoading}
            onChange={(event) => setRememberMe(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 transition focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
          />
          Remember me
        </label>

        <button
          type="button"
          disabled={isLoading}
          onClick={() => navigate(ROUTES.ADMIN_FORGOT_PASSWORD)}
          className="font-semibold text-indigo-600 transition hover:text-indigo-500 focus:outline-none focus:underline disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:text-indigo-600"
        >
          Forgot password?
        </button>
      </div>

      <AdminButton type="submit" className="w-full" isLoading={isLoading} loadingText="Signing In...">
        Sign in to Admin Panel
      </AdminButton>
    </form>
  );
}

export default AdminLoginForm;
