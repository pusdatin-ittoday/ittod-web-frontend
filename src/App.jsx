// App.js
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './pages/protectedRoute';
import Home from './pages/LandingPage/Home';
import Login from './pages/LoginPage/Login';
import Register from './pages/LoginPage/Register';
import Event from './pages/LandingPage/Event';
import Lomba from './pages/LandingPage/Lomba';
import TimelineUmum from './pages/TimelineUmum';
import ForgetPassword from './pages/LoginPage/ForgetPassword';
import VerifyPassword from './pages/LoginPage/VerifyPassword';
import NewPassword from './pages/LoginPage/NewPassword';
import ContactUs from './pages/ContactUs';
import Sponsors from './Sponsors';
import EventDetail from './pages/EventDetail';
import EditProfile from './components/Dashboard/EditProfil';
import SubmitCompetition from './pages/CompSubmission/SubmitCompetition';
import DashboardWrapper from './pages/DashboardPage/DashboardWrapper';
import DaftarEvent from './pages/DaftarEvent';
import RegistCompetition from "./pages/CompeRegisPage/RegistCompetition.jsx";
import AuthCallback from './components/Login/AuthCallback';
import FallbackNoRegist from './pages/Fallback/FallbackNoRegist.jsx';
import FallbackNotFound from './pages/Fallback/FallbackNotFound.jsx';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Core routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/event" element={<Event />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-password" element={<VerifyPassword />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/new-password" element={<NewPassword />} />
          <Route path="/timeline" element={<TimelineUmum />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/edit-profile" element={<EditProfile />} />

          {/*Fallback Routes*/}
          <Route path="/registration-unavailable" element={<FallbackNoRegist />} />
          <Route path="*" element={<FallbackNotFound />} />

          {/* Protected Dashboard Routes */}
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


          {/* Protected Registration Routes */}
          <Route path="/register-competition/:competitionSlug" element={
            <ProtectedRoute>
              <RegistCompetition />
            </ProtectedRoute>
          } />

          {/* Competition/Event Pages */}
          <Route path="/competition" element={<Lomba />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/competition/:eventId" element={<EventDetail />} />
          <Route path="/event/:eventId" element={<EventDetail />} />

          {/* Protected Event Registration */}
          <Route path="/daftar-event/:target" element={
            <ProtectedRoute>
              <DaftarEvent />
            </ProtectedRoute>
          } />

        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
