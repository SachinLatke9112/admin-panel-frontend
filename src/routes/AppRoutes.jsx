import { AnimatePresence, motion } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import AppLayout from "@components/layout/AppLayout";
import AuthLayout from "@components/layout/AuthLayout";

import ROUTES from "@constants/routes";

import AdminLogin from "@/Admin_panel/pages/AdminLogin";
import AdminForgotPassword from "@/Admin_panel/pages/AdminForgotPassword";
import AdminOtpVerification from "@/Admin_panel/pages/AdminOtpVerification";
import AdminResetPassword from "@/Admin_panel/pages/AdminResetPassword";
import AdminDashboard from "@/Admin_panel/pages/AdminDashboard";
import AdminProtectedRoute from "@/Admin_panel/routes/AdminProtectedRoute";
import AiChat from "@pages/AiChat";
import Dashboard from "@pages/Dashboard";
import ForgotPassword from "@pages/ForgotPassword";
import GrammarPractice from "@pages/GrammarPractice";
import LandingPage from "@pages/LandingPage";
import ListeningPractice from "@pages/ListeningPractice";
import Login from "@pages/Login";
import NotFound from "@pages/NotFound";
import Profile from "@pages/Profile";
import Progress from "@pages/Progress";
import Register from "@pages/Register";
import Settings from "@pages/Settings";
import SpeakingPractice from "@pages/SpeakingPractice";
import Vocabulary from "@pages/Vocabulary";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Pages */}
        <Route element={<AppLayout />}>
          <Route
            path={ROUTES.HOME}
            element={
              <PublicRoute>
                <PageTransition>
                  <LandingPage />
                </PageTransition>
              </PublicRoute>
            }
          />
        </Route>

        {/* Authentication Pages */}
        <Route element={<AuthLayout />}>
          <Route
            path={ROUTES.LOGIN}
            element={
              <PublicRoute>
                <PageTransition>
                  <Login />
                </PageTransition>
              </PublicRoute>
            }
          />

          <Route
            path={ROUTES.REGISTER}
            element={
              <PublicRoute>
                <PageTransition>
                  <Register />
                </PageTransition>
              </PublicRoute>
            }
          />

          <Route
            path={ROUTES.FORGOT_PASSWORD}
            element={
              <PublicRoute>
                <PageTransition>
                  <ForgotPassword />
                </PageTransition>
              </PublicRoute>
            }
          />
        </Route>

        {/* Protected Pages */}
        <Route element={<AppLayout />}>
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute>
                <PageTransition>
                  <Dashboard />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.AI_CHAT}
            element={
              <ProtectedRoute>
                <PageTransition>
                  <AiChat />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.SPEAKING}
            element={
              <ProtectedRoute>
                <PageTransition>
                  <SpeakingPractice />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.GRAMMAR}
            element={
              <ProtectedRoute>
                <PageTransition>
                  <GrammarPractice />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.VOCABULARY}
            element={
              <ProtectedRoute>
                <PageTransition>
                  <Vocabulary />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.LISTENING}
            element={
              <ProtectedRoute>
                <PageTransition>
                  <ListeningPractice />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.PROGRESS}
            element={
              <ProtectedRoute>
                <PageTransition>
                  <Progress />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.PROFILE}
            element={
              <ProtectedRoute>
                <PageTransition>
                  <Profile />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.SETTINGS}
            element={
              <ProtectedRoute>
                <PageTransition>
                  <Settings />
                </PageTransition>
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Admin Panel */}
        <Route
          path={ROUTES.ADMIN_LOGIN}
          element={
            <PageTransition>
              <AdminLogin />
            </PageTransition>
          }
        />

        <Route
          path={ROUTES.ADMIN_FORGOT_PASSWORD}
          element={
            <PageTransition>
              <AdminForgotPassword />
            </PageTransition>
          }
        />

        <Route
          path={ROUTES.ADMIN_VERIFY_OTP}
          element={
            <PageTransition>
              <AdminOtpVerification />
            </PageTransition>
          }
        />

        <Route
          path={ROUTES.ADMIN_RESET_PASSWORD}
          element={
            <PageTransition>
              <AdminResetPassword />
            </PageTransition>
          }
        />

        <Route
          path={ROUTES.ADMIN_DASHBOARD}
          element={
            <PageTransition>
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            </PageTransition>
          }
        />

        {/* Not Found */}
        <Route
          path={ROUTES.NOT_FOUND}
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />

        <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default AppRoutes;
