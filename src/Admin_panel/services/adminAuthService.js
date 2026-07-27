/**
 * Admin_panel/services/adminAuthService.js
 *
 * Stub authentication service for the Admin Panel — mirrors the mock-first
 * pattern already used by src/services/api.js (authService). No network
 * call is made yet; `login` simulates latency and resolves/rejects locally
 * so the UI layer (useAdminAuth) has a real async contract to build against.
 *
 * Swap the body of `login` for a real axios/fetch call to the backend's
 * admin-login endpoint once one exists — the function signature and
 * resolved/rejected shapes below are the intended integration contract.
 */

const SIMULATED_LATENCY_MS = 700;

export const adminAuthService = {
  login: async ({ email, password, rememberMe }) => {
    return new Promise((resolve, reject) => {
      window.setTimeout(() => {
        if (!email || !password) {
          reject({ response: { data: { message: "Email and password are required." } } });
          return;
        }

        resolve({
          data: {
            token: "mock-admin-token",
            user: { email, role: "ADMIN" },
            rememberMe: Boolean(rememberMe),
          },
        });
      }, SIMULATED_LATENCY_MS);
    });
  },

  // Swap for a real "request password reset OTP" endpoint call once one
  // exists — resolved/rejected shapes below are the intended contract.
  requestPasswordResetOtp: async ({ email }) => {
    return new Promise((resolve, reject) => {
      window.setTimeout(() => {
        if (!email) {
          reject({ response: { data: { message: "Email address is required." } } });
          return;
        }

        resolve({
          data: {
            message: `OTP code sent to ${email}.`,
          },
        });
      }, SIMULATED_LATENCY_MS);
    });
  },

  // Swap for a real "verify OTP" endpoint call once one exists. TEMPORARY:
  // no OTP is actually issued yet, so every 6-digit code is accepted as
  // correct except the reserved "000000" value, which keeps the failure
  // path (AdminAlert error state) reachable for manual testing.
  verifyPasswordResetOtp: async ({ email, otp }) => {
    return new Promise((resolve, reject) => {
      window.setTimeout(() => {
        if (!email || !otp) {
          reject({ response: { data: { message: "Email and OTP code are required." } } });
          return;
        }

        if (otp === "000000") {
          reject({ response: { data: { message: "Invalid or expired OTP. Please try again." } } });
          return;
        }

        resolve({
          data: {
            message: "OTP verified successfully.",
            verified: true,
          },
        });
      }, SIMULATED_LATENCY_MS);
    });
  },

  // Swap for a real "reset password" endpoint call once one exists — the
  // resolved/rejected shape below is the intended integration contract.
  // The eventual request will likely also carry the OTP-verification step's
  // short-lived reset token; until that exists, email is the only identifier
  // threaded through from the OTP Verification step.
  resetPassword: async ({ email, password }) => {
    return new Promise((resolve, reject) => {
      window.setTimeout(() => {
        if (!email || !password) {
          reject({ response: { data: { message: "Email and new password are required." } } });
          return;
        }

        resolve({
          data: {
            message: "Password reset successfully.",
          },
        });
      }, SIMULATED_LATENCY_MS);
    });
  },
};

export default adminAuthService;
