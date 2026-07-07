import React, { Suspense, lazy } from 'react';
import { AnimatePresence, motion as Motion } from 'motion/react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MotionProvider from './components/motion/MotionProvider';
import { pageTransition } from './lib/motion';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const EventDetailPage = lazy(() => import('./pages/EventDetailPage'));
const CompetitionDetailPage = lazy(() => import('./pages/CompetitionDetailPage'));
const ProtectedRoute = lazy(() => import('./pages/protectedRoute'));
const Login = lazy(() => import('./pages/LoginPage/Login'));
const Register = lazy(() => import('./pages/LoginPage/Register'));
const ForgetPassword = lazy(() => import('./pages/LoginPage/ForgetPassword'));
const VerifyPassword = lazy(() => import('./pages/LoginPage/VerifyPassword'));
const NewPassword = lazy(() => import('./pages/LoginPage/NewPassword'));
const EditProfile = lazy(() => import('./components/Dashboard/EditProfil'));
const SubmitCompetition = lazy(() =>
  import('./pages/CompSubmission/SubmitCompetition')
);
const DashboardWrapper = lazy(() =>
  import('./pages/DashboardPage/DashboardWrapper')
);
const DaftarEvent = lazy(() => import('./pages/DaftarEvent'));
const RegistCompetition = lazy(() =>
  import('./pages/CompeRegisPage/RegistCompetition.jsx')
);
const AuthCallback = lazy(() => import('./components/Login/AuthCallback'));
const FallbackNoRegist = lazy(() =>
  import('./pages/Fallback/FallbackNoRegist.jsx')
);
const FallbackNotFound = lazy(() =>
  import('./pages/Fallback/FallbackNotFound.jsx')
);
const Sponsors = lazy(() => import('./Sponsors'));

const RouteLoading = () => (
  <Motion.div
    className="flex min-h-screen items-center justify-center bg-[#f7f7f4] px-5 text-black"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <Motion.div
      className="border-[4px] border-black bg-yellow-neo px-6 py-4 font-inter text-sm font-black uppercase shadow-[7px_7px_0_#111]"
      animate={{ rotate: [-1.5, 1.5, -1.5], y: [0, -4, 0] }}
      transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
    >
      Loading...
    </Motion.div>
  </Motion.div>
);

const ProtectedDashboard = ({ children }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Motion.div
        key={location.pathname}
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Suspense fallback={<RouteLoading />}>
          <Routes location={location}>
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
              path="/dashboard/submit-lomba"
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
              path="/submit-competition/:competitionId"
              element={
                <ProtectedDashboard>
                  <SubmitCompetition />
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
      </Motion.div>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <MotionProvider>
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </MotionProvider>
    </AuthProvider>
  );
};

export default App;
