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
import Game_Today from './pages/game_today';
import Hack_Today from './pages/hack_today';
import Mine_Today from './pages/mine_today';
import Ux_Today from './pages/ux_today';
import EditProfile from './components/Dashboard/EditProfil';
import Seminar from './pages/seminar';
import Bootcamp from './pages/Bootcamp';
import Workshop from './pages/Workshop';
import Submit_Gametoday from './pages/CompSubmission/Submit_Gametoday';
import Submit_Uxtoday from './pages/CompSubmission/Submit_Uxtoday';
import Submit_Minetoday from './pages/CompSubmission/Submit_Minetoday';
import DashboardWrapper from './pages/DashboardPage/DashboardWrapper';
import DaftarEvent from './pages/DaftarEvent';
import RegistGametoday from "./pages/CompeRegisPage/RegistGametoday.jsx";
import RegistMineToday from "./pages/CompeRegisPage/RegistMinetoday.jsx";
import RegistHackToday from "./pages/CompeRegisPage/RegistHacktoday.jsx";
import RegistUXToday from "./pages/CompeRegisPage/RegistUXtoday.jsx";
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
          <Route path="/submit-gametoday" element={
            <ProtectedRoute>
              <Submit_Gametoday />
            </ProtectedRoute>
          } />
          <Route path="/submit-uxtoday" element={
            <ProtectedRoute>
              <Submit_Uxtoday />
            </ProtectedRoute>
          } />
          <Route path="/submit-minetoday" element={
            <ProtectedRoute>
              <Submit_Minetoday />
            </ProtectedRoute>
          } />


          {/* Protected Registration Routes */}
          <Route path="/register-hacktoday" element={
            <ProtectedRoute>
              <RegistHackToday />
            </ProtectedRoute>
          } />
          <Route path="/register-gametoday" element={
            <ProtectedRoute>
              <RegistGametoday />
            </ProtectedRoute>
          } />
          <Route path="/register-minetoday" element={
            <ProtectedRoute>
              <RegistMineToday />
            </ProtectedRoute>
          } />
          <Route path="/register-uxtoday" element={
            <ProtectedRoute>
              <RegistUXToday />
            </ProtectedRoute>
          } />

          {/* Competition/Event Pages */}
          <Route path="/competition" element={<Lomba />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/competition/game_today" element={<Game_Today />} />
          <Route path="/competition/hack_today" element={<Hack_Today />} />
          <Route path="/competition/mine_today" element={<Mine_Today />} />
          <Route path="/competition/ux_today" element={<Ux_Today />} />
          <Route path="/event/national_seminar" element={<Seminar />} />
          <Route path="/event/bootcamp" element={<Bootcamp />} />
          <Route path="/event/workshop" element={<Workshop />} />

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
