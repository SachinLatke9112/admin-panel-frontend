import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ROUTES from "@constants/routes";
import AdminInput from "../common/AdminInput";
import AdminButton from "../common/AdminButton";
import AdminAlert from "../common/AdminAlert";
import { useAdminPasswordReset } from "../../hooks/useAdminPasswordReset";

// Same icon as AdminLoginForm's email field, kept visually identical.
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

export function AdminForgotPasswordForm() {
  const navigate = useNavigate();
  const { requestOtp, isLoading, error, fieldErrors, clearErrors } = useAdminPasswordReset();
  const [email, setEmail] = useState("");

  const handleChange = (event) => {
    setEmail(event.target.value);
    if (error || fieldErrors.email) clearErrors();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await requestOtp({ email });

    if (result.success) {
      navigate(ROUTES.ADMIN_VERIFY_OTP, { state: { email } });
    }
  };

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
      {error && <AdminAlert tone="error">{error}</AdminAlert>}

      <AdminInput
        id="admin-forgot-email"
        name="email"
        label="Email address"
        type="email"
        autoComplete="username"
        placeholder="admin@speakmate.ai"
        value={email}
        onChange={handleChange}
        icon={<MailIcon />}
        error={fieldErrors.email}
        disabled={isLoading}
        required
      />

      <AdminButton type="submit" className="w-full" isLoading={isLoading} loadingText="Sending OTP...">
        Send OTP
      </AdminButton>
    </form>
  );
}

export default AdminForgotPasswordForm;
