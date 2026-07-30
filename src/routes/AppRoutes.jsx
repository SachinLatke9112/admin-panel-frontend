import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import AppLayout from "@components/layout/AppLayout";
import AuthLayout from "@components/layout/AuthLayout";

import ROUTES from "@constants/routes";

import AdminLogin from "@/Admin_panel/pages/AdminLogin";
import AdminForgotPassword from "@/Admin_panel/pages/AdminForgotPassword";
import AdminOtpVerification from "@/Admin_panel/pages/AdminOtpVerification";
import AdminResetPassword from "@/Admin_panel/pages/AdminResetPassword";
import SchoolAdminLogin from "@/Admin_panel/pages/SchoolAdminLogin";
import SchoolAdminForgotPassword from "@/Admin_panel/pages/SchoolAdminForgotPassword";
import SchoolAdminOtpVerification from "@/Admin_panel/pages/SchoolAdminOtpVerification";
import SchoolAdminResetPassword from "@/Admin_panel/pages/SchoolAdminResetPassword";
import TeacherLogin from "@/Admin_panel/pages/TeacherLogin";
import TeacherForgotPassword from "@/Admin_panel/pages/TeacherForgotPassword";
import TeacherOtpVerification from "@/Admin_panel/pages/TeacherOtpVerification";
import TeacherResetPassword from "@/Admin_panel/pages/TeacherResetPassword";
import TeacherDashboardHome from "@/Admin_panel/pages/TeacherDashboardHome";
import TeacherStudents from "@/Admin_panel/pages/TeacherStudents";
import TeacherStudentDetails from "@/Admin_panel/pages/TeacherStudentDetails";
import TeacherAnalytics from "@/Admin_panel/pages/TeacherAnalytics";
import TeacherReports from "@/Admin_panel/pages/TeacherReports";
import TeacherProfile from "@/Admin_panel/pages/TeacherProfile";
import AdminDashboard from "@/Admin_panel/pages/AdminDashboard";
import TeacherDashboardLayout from "@/Admin_panel/components/teacher/layout/TeacherDashboardLayout";
import AdminProtectedRoute from "@/Admin_panel/routes/AdminProtectedRoute";
import { ADMIN_ROLES } from "@/Admin_panel/constants/adminRoles";
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
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: "easeOut" }}
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

        {/* Role-based administration authentication */}
        {[
          [ROUTES.ADMIN_LOGIN, AdminLogin],
          [ROUTES.ADMIN_FORGOT_PASSWORD, AdminForgotPassword],
          [ROUTES.ADMIN_VERIFY_OTP, AdminOtpVerification],
          [ROUTES.ADMIN_RESET_PASSWORD, AdminResetPassword],
          [ROUTES.SCHOOL_ADMIN_LOGIN, SchoolAdminLogin],
          [ROUTES.SCHOOL_ADMIN_FORGOT_PASSWORD, SchoolAdminForgotPassword],
          [ROUTES.SCHOOL_ADMIN_VERIFY_OTP, SchoolAdminOtpVerification],
          [ROUTES.SCHOOL_ADMIN_RESET_PASSWORD, SchoolAdminResetPassword],
          [ROUTES.TEACHER_LOGIN, TeacherLogin],
          [ROUTES.TEACHER_FORGOT_PASSWORD, TeacherForgotPassword],
          [ROUTES.TEACHER_VERIFY_OTP, TeacherOtpVerification],
          [ROUTES.TEACHER_RESET_PASSWORD, TeacherResetPassword],
        ].map(([path, AuthPage]) => (
          <Route key={path} path={path} element={<PageTransition><AuthPage /></PageTransition>} />
        ))}

        {[
          [ROUTES.ADMIN_DASHBOARD, ADMIN_ROLES.SUPER_ADMIN],
          [ROUTES.SCHOOL_ADMIN_DASHBOARD, ADMIN_ROLES.SCHOOL_ADMIN],
        ].map(([path, role]) => (
          <Route
            key={path}
            path={path}
            element={
              <PageTransition>
                <AdminProtectedRoute requiredRole={role}>
                  <AdminDashboard />
                </AdminProtectedRoute>
              </PageTransition>
            }
          />
        ))}

        <Route
          path={ROUTES.TEACHER_DASHBOARD}
          element={
            <AdminProtectedRoute requiredRole={ADMIN_ROLES.TEACHER}>
              <TeacherDashboardLayout>
                <TeacherDashboardHome />
              </TeacherDashboardLayout>
            </AdminProtectedRoute>
          }
        />

        <Route
          path={ROUTES.TEACHER_STUDENTS}
          element={
            <AdminProtectedRoute requiredRole={ADMIN_ROLES.TEACHER}>
              <TeacherDashboardLayout>
                <TeacherStudents />
              </TeacherDashboardLayout>
            </AdminProtectedRoute>
          }
        />

        <Route
          path={ROUTES.TEACHER_STUDENT_DETAILS}
          element={
            <AdminProtectedRoute requiredRole={ADMIN_ROLES.TEACHER}>
              <TeacherDashboardLayout>
                <TeacherStudentDetails />
              </TeacherDashboardLayout>
            </AdminProtectedRoute>
          }
        />

        <Route
          path={ROUTES.TEACHER_ANALYTICS}
          element={
            <AdminProtectedRoute requiredRole={ADMIN_ROLES.TEACHER}>
              <TeacherDashboardLayout>
                <TeacherAnalytics />
              </TeacherDashboardLayout>
            </AdminProtectedRoute>
          }
        />

        <Route
          path={ROUTES.TEACHER_REPORTS}
          element={
            <AdminProtectedRoute requiredRole={ADMIN_ROLES.TEACHER}>
              <TeacherDashboardLayout>
                <TeacherReports />
              </TeacherDashboardLayout>
            </AdminProtectedRoute>
          }
        />

        <Route
          path={ROUTES.TEACHER_PROFILE}
          element={
            <AdminProtectedRoute requiredRole={ADMIN_ROLES.TEACHER}>
              <TeacherDashboardLayout>
                <TeacherProfile />
              </TeacherDashboardLayout>
            </AdminProtectedRoute>
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
