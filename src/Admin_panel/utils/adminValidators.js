/**
 * Admin_panel/utils/adminValidators.js
 *
 * Pure client-side validation helpers for the Admin Login, Forgot
 * Password, and OTP Verification forms. The 8-character password
 * minimum mirrors the backend's existing validation rule so the
 * frontend never accepts something the API would reject anyway.
 */

export function isValidAdminEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

export function isValidOtpCode(otp) {
  return /^\d{6}$/.test(String(otp || "").trim());
}

export function getAdminPasswordError(password) {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  return "";
}

export function validateAdminLoginForm({ email, password }) {
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = "Email address is required.";
  } else if (!isValidAdminEmail(email)) {
    errors.email = "Enter a valid email address.";
  }

  const passwordError = getAdminPasswordError(password);
  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
}

export function validateAdminForgotPasswordForm({ email }) {
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = "Email address is required.";
  } else if (!isValidAdminEmail(email)) {
    errors.email = "Enter a valid email address.";
  }

  return errors;
}

export function validateAdminOtpForm({ otp }) {
  const errors = {};

  if (!otp || !String(otp).trim()) {
    errors.otp = "OTP code is required.";
  } else if (!isValidOtpCode(otp)) {
    errors.otp = "Enter the 6-digit OTP code.";
  }

  return errors;
}

export function getAdminPasswordStrengthError(password) {
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    return "Password must include an uppercase letter, a lowercase letter, and a number.";
  }
  return "";
}

export function validateAdminResetPasswordForm({ password, confirmPassword }) {
  const errors = {};

  const requiredError = getAdminPasswordError(password);
  if (requiredError) {
    errors.password = requiredError;
  } else {
    const strengthError = getAdminPasswordStrengthError(password);
    if (strengthError) {
      errors.password = strengthError;
    }
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your new password.";
  } else if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}
