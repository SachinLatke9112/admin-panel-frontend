/**
 * Admin_panel/services/adminSession.js
 *
 * TEMPORARY frontend-only dev bypass for Admin Panel authentication.
 * Stores a plain boolean flag in localStorage so protected admin routes
 * (e.g. /admin/dashboard) can be built and navigated to before a real
 * backend admin-login endpoint exists. No token, no roles, no expiry.
 *
 * To restore real authentication later: swap this file's implementation
 * for a real session check (e.g. presence/validity of a JWT returned by
 * adminAuthService.login()) — call sites (AdminProtectedRoute,
 * AdminLoginForm) should not need to change, only what happens inside
 * these three functions.
 */

const ADMIN_SESSION_KEY = "speakmate_admin_authenticated";

export function isAdminAuthenticated() {
  return localStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

export function setAdminAuthenticated() {
  localStorage.setItem(ADMIN_SESSION_KEY, "true");
}

export function clearAdminAuthenticated() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}
