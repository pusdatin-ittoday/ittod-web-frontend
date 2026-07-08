import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AlertProvider } from "./context/AlertContext";
import MotionProvider from "./components/motion/MotionProvider";
import LoadingState from "./components/ui/LoadingState";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const EventDetailPage = lazy(() => import("./pages/EventDetailPage"));
const CompetitionDetailPage = lazy(
  () => import("./pages/CompetitionDetailPage"),
);
const ProtectedRoute = lazy(() => import("./pages/protectedRoute"));
const Login = lazy(() => import("./pages/LoginPage/Login"));
const Register = lazy(() => import("./pages/LoginPage/Register"));
const ForgetPassword = lazy(() => import("./pages/LoginPage/ForgetPassword"));
const VerifyPassword = lazy(() => import("./pages/LoginPage/VerifyPassword"));
const NewPassword = lazy(() => import("./pages/LoginPage/NewPassword"));
const EditProfile = lazy(() => import("./components/Dashboard/EditProfil"));
const SubmitCompetition = lazy(
  () => import("./pages/CompSubmission/SubmitCompetition"),
);
const DashboardWrapper = lazy(
  () => import("./pages/DashboardPage/DashboardWrapper"),
);
const DaftarEvent = lazy(() => import("./pages/DaftarEvent"));
const RegistCompetition = lazy(
  () => import("./pages/CompeRegisPage/RegistCompetition.jsx"),
);
const AuthCallback = lazy(() => import("./components/Login/AuthCallback"));
const FallbackNoRegist = lazy(
  () => import("./pages/Fallback/FallbackNoRegist.jsx"),
);
const FallbackNotFound = lazy(
  () => import("./pages/Fallback/FallbackNotFound.jsx"),
);
const Sponsors = lazy(() => import("./Sponsors"));

const ProtectedDashboard = ({ children }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

const AppRoutes = () => {
  return (
    <div className="min-h-screen bg-[#f7f7f4]">
      <Suspense fallback={<LoadingState />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/event/:slug" element={<EventDetailPage />} />
          <Route
            path="/competition/:slug"
            element={<CompetitionDetailPage />}
          />

          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-password" element={<VerifyPassword />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/new-password" element={<NewPassword />} />

          <Route path="/edit-profile" element={<EditProfile />} />
          <Route
            path="/dashboard/beranda"
            element={
              <ProtectedDashboard>
                <DashboardWrapper />
              </ProtectedDashboard>
            }
          />
          <Route
            path="/dashboard/ikut-lomba"
            element={
              <ProtectedDashboard>
                <DashboardWrapper />
              </ProtectedDashboard>
            }
          />
          <Route
            path="/dashboard/ikut-event"
            element={
              <ProtectedDashboard>
                <DashboardWrapper />
              </ProtectedDashboard>
            }
          />
          <Route
            path="/dashboard/pengumuman"
            element={
              <ProtectedDashboard>
                <DashboardWrapper />
              </ProtectedDashboard>
            }
          />
          <Route
            path="/dashboard/submit-lomba"
            element={
              <ProtectedDashboard>
                <DashboardWrapper />
              </ProtectedDashboard>
            }
          />
          <Route
            path="/dashboard/submit-gametoday"
            element={
              <ProtectedDashboard>
                <DashboardWrapper />
              </ProtectedDashboard>
            }
          />
          <Route
            path="/dashboard/submit-uxtoday"
            element={
              <ProtectedDashboard>
                <DashboardWrapper />
              </ProtectedDashboard>
            }
          />
          <Route
            path="/dashboard/submit-minetoday"
            element={
              <ProtectedDashboard>
                <DashboardWrapper />
              </ProtectedDashboard>
            }
          />
          <Route
            path="/dashboard/edit-profile"
            element={
              <ProtectedDashboard>
                <DashboardWrapper />
              </ProtectedDashboard>
            }
          />
          <Route
            path="/dashboard/lomba/:competitionId/register"
            element={
              <ProtectedDashboard>
                <RegistCompetition />
              </ProtectedDashboard>
            }
          />
          <Route
            path="/register-competition/:competitionSlug"
            element={
              <ProtectedDashboard>
                <RegistCompetition />
              </ProtectedDashboard>
            }
          />
          <Route
            path="/dashboard/lomba/:competitionId/submit"
            element={
              <ProtectedDashboard>
                <SubmitCompetition />
              </ProtectedDashboard>
            }
          />
          <Route
            path="/daftar-event/:target"
            element={
              <ProtectedDashboard>
                <DaftarEvent />
              </ProtectedDashboard>
            }
          />

          <Route path="/sponsors" element={<Sponsors />} />
          <Route
            path="/registration-unavailable"
            element={<FallbackNoRegist />}
          />
          <Route path="*" element={<FallbackNotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
};

const App = () => {
  return (
    <AlertProvider>
      <AuthProvider>
        <MotionProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </MotionProvider>
      </AuthProvider>
    </AlertProvider>
  );
};

export default App;
