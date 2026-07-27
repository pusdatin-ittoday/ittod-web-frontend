import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AlertProvider } from "./context/AlertContext";
import MotionProvider from "./components/motion/MotionProvider";
import LoadingState from "./components/ui/LoadingState";

const routeTitleMap = {
  "/": "IT TODAY 2026 - The Biggest IT Event | IPB University",
  "/home": "IT TODAY 2026 - The Biggest IT Event | IPB University",
  "/login": "Masuk - IT TODAY 2026",
  "/register": "Daftar Akun - IT TODAY 2026",
  "/verify-password": "Verifikasi Password - IT TODAY 2026",
  "/forget-password": "Lupa Password - IT TODAY 2026",
  "/new-password": "Password Baru - IT TODAY 2026",
  "/edit-profile": "Edit Profil - IT TODAY 2026",
  "/dashboard/beranda": "Dashboard - IT TODAY 2026",
  "/dashboard/ikut-lomba": "Daftar Lomba - IT TODAY 2026",
  "/dashboard/ikut-event": "Daftar Event - IT TODAY 2026",
  "/dashboard/pengumuman": "Pengumuman - IT TODAY 2026",
  "/dashboard/submit-lomba": "Pengumpulan Karya Lomba - IT TODAY 2026",
  "/dashboard/edit-profile": "Edit Profil - IT TODAY 2026",
  "/sponsors": "Sponsor Kami - IT TODAY 2026",
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const PageTitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;

    if (routeTitleMap[pathname]) {
      document.title = routeTitleMap[pathname];
      return;
    }

    if (pathname.startsWith("/daftar-event/")) {
      const target = pathname.replace("/daftar-event/", "");
      const formatted = target
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      document.title = `Pendaftaran ${formatted} - IT TODAY 2026`;
      return;
    }

    if (pathname.startsWith("/register-competition/")) {
      const target = pathname.replace("/register-competition/", "");
      const formatted = target.toUpperCase();
      document.title = `Pendaftaran ${formatted} - IT TODAY 2026`;
      return;
    }

    if (pathname.startsWith("/dashboard/lomba/")) {
      document.title = `Pendaftaran Lomba - IT TODAY 2026`;
      return;
    }
  }, [location]);

  return null;
};

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
      <ScrollToTop />
      <PageTitleUpdater />
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
