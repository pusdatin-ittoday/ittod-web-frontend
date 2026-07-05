// App.js
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// === Orang Pertama: Halaman publik (Neo-Brutalisme) ===
import LandingPage from './pages/LandingPage';
import EventDetailPage from './pages/EventDetailPage';
import CompetitionDetailPage from './pages/CompetitionDetailPage';

// === Orang Lain: Import existing (tetap dipertahankan) ===
import ProtectedRoute from './pages/protectedRoute';
import Login from './pages/LoginPage/Login';
import Register from './pages/LoginPage/Register';
import ForgetPassword from './pages/LoginPage/ForgetPassword';
import VerifyPassword from './pages/LoginPage/VerifyPassword';
import NewPassword from './pages/LoginPage/NewPassword';
import EditProfile from './components/Dashboard/EditProfil';
import SubmitCompetition from './pages/CompSubmission/SubmitCompetition';
import DashboardWrapper from './pages/DashboardPage/DashboardWrapper';
import DaftarEvent from './pages/DaftarEvent';
import RegistCompetition from "./pages/CompeRegisPage/RegistCompetition.jsx";
import AuthCallback from './components/Login/AuthCallback';
import FallbackNoRegist from './pages/Fallback/FallbackNoRegist.jsx';
import FallbackNotFound from './pages/Fallback/FallbackNotFound.jsx';
import Sponsors from './Sponsors';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ===== ORANG PERTAMA: Halaman Publik (Neo-Brutalisme) ===== */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/event/:slug" element={<EventDetailPage />} />
          <Route path="/competition/:slug" element={<CompetitionDetailPage />} />
          {/* ===== ORANG KEDUA: Auth Pages ===== */}
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-password" element={<VerifyPassword />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/new-password" element={<NewPassword />} />

          {/* ===== ORANG KETIGA: Dashboard & Protected Routes ===== */}
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/dashboard/beranda" element={
            <ProtectedRoute>
              <DashboardWrapper />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/ikut-lomba" element={
            <ProtectedRoute>
              <DashboardWrapper />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/ikut-event" element={
            <ProtectedRoute>
              <DashboardWrapper />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/submit-lomba" element={
            <ProtectedRoute>
              <DashboardWrapper />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/pengumuman" element={
            <ProtectedRoute>
              <DashboardWrapper />
            </ProtectedRoute>
          } />
          <Route path="/submit-competition/:competitionId" element={
            <ProtectedRoute>
              <SubmitCompetition />
            </ProtectedRoute>
          } />

          {/* ===== ORANG KEEMPAT: Registration Routes ===== */}
          <Route path="/register-competition/:competitionSlug" element={
            <ProtectedRoute>
              <RegistCompetition />
            </ProtectedRoute>
          } />
          <Route path="/daftar-event/:target" element={
            <ProtectedRoute>
              <DaftarEvent />
            </ProtectedRoute>
          } />

          {/* ===== Misc ===== */}
          <Route path="/sponsors" element={<Sponsors />} />

          {/* ===== Fallback Routes ===== */}
          <Route path="/registration-unavailable" element={<FallbackNoRegist />} />
          <Route path="*" element={<FallbackNotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
