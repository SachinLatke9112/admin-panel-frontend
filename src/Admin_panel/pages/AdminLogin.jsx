import { motion } from "framer-motion";
import { itemVariants } from "@animations/variants";
import LogoSection from "../components/layout/LogoSection";
import AdminFooter from "../components/layout/AdminFooter";
import AdminCard from "../components/common/AdminCard";
import AdminLoginForm from "../components/forms/AdminLoginForm";

export function AdminLogin() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 sm:px-6">
      {/* Subtle decorative background only — a soft radial wash plus two
          blurred corner circles, no illustration, no content. */}
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
          <h1 className="text-2xl font-black text-slate-950">Welcome back, Admin</h1>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to access the SpeakMate AI admin workspace.
          </p>

          <AdminLoginForm />
        </AdminCard>

        <AdminFooter />
      </motion.div>
    </div>
  );
}

export default AdminLogin;
