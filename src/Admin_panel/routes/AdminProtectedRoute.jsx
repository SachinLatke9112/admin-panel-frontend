import { Navigate } from "react-router-dom";
import ROUTES from "@constants/routes";
import { isAdminAuthenticated } from "../services/adminSession";

// Mirrors the shape of src/routes/ProtectedRoute.jsx — same guard pattern,
// scoped to the Admin Panel's own (currently mock) session flag.
export function AdminProtectedRoute({ children }) {
  if (!isAdminAuthenticated()) {
    return <Navigate to={ROUTES.ADMIN_LOGIN} replace />;
  }

  return children;
}

export default AdminProtectedRoute;
