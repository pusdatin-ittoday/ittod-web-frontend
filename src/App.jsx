// App.js
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
import DashboardWrapper from './pages/DashboardPage/DashboardWrapper';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/event" element={<Event />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/verify-password" element={<VerifyPassword />} />
          <Route path="/new-password" element={<NewPassword />} />
          <Route path="/timeline" element={<TimelineUmum />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          

          {/* Dashboard pages */}
          <Route path="/dashboard" element={<DashboardWrapper />} />
          <Route path="/beranda" element={<DashboardWrapper />} />
          <Route path="/ikut-lomba" element={<DashboardWrapper />} />
          <Route path="/ikut-event" element={<DashboardWrapper />} />

          {/* Preview/test pages */}
          <Route path="/competition" element={<Lomba />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/competition/game_today" element={<Game_Today />} />
          <Route path="/competition/hack_today" element={<Hack_Today />} />
          <Route path="/competition/mine_today" element={<Mine_Today />} />
          <Route path="/competition/ux_today" element={<Ux_Today />} />
          <Route path="/event/national_seminar" element={<Seminar />} />
          <Route path="/event/bootcamp" element={<Bootcamp />} />
          <Route path="/event/workshop" element={<Workshop />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
