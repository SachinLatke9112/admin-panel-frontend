import { motion } from "framer-motion";
import { Link, Navigate, useLocation } from "react-router-dom";
import { itemVariants } from "@animations/variants";
import ROUTES from "@constants/routes";
import LogoSection from "../components/layout/LogoSection";
import AdminFooter from "../components/layout/AdminFooter";
import AdminCard from "../components/common/AdminCard";
import AdminOtpForm from "../components/forms/AdminOtpForm";

export function AdminOtpVerification() {
  const location = useLocation();
  const email = location.state?.email;

  // Reached directly (refresh, bookmarked URL) without an email from the
  // Forgot Password step — send back there rather than rendering a form
  // with nothing to verify against.
  if (!email) {
    return <Navigate to={ROUTES.ADMIN_FORGOT_PASSWORD} replace />;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 sm:px-6">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.10),_transparent_60%)]" />
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-violet-200/30 blur-3xl" />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={itemVariants}
        className="relative w-full max-w-[29rem]"
      >
        <LogoSection />

        <AdminCard className="mt-6 p-7 sm:p-9">
          <h1 className="text-2xl font-black text-slate-950">Verify OTP</h1>
          <p className="mt-2 text-sm text-slate-600">
            Enter the 6-digit code sent to <span className="font-semibold text-slate-900">{email}</span>.
          </p>

          <AdminOtpForm email={email} />

          <p className="mt-6 text-center text-sm text-slate-600">
            <Link
              to={ROUTES.ADMIN_FORGOT_PASSWORD}
              className="font-semibold text-indigo-600 transition hover:text-indigo-500"
            >
              ← Back to Forgot Password
            </Link>
          </p>
        </AdminCard>

        <AdminFooter />
      </motion.div>
    </div>
  );
}

export default AdminOtpVerification;
