import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/LandingPage/Home';
import Login from './pages/LoginPage/Login';
import Register from './pages/LoginPage/Register';
import Event from './pages/LandingPage/Event';
import Lomba from './pages/LandingPage/Lomba';
import TimelineUmum from './pages/TimelineUmum';
import DashboardLayout from './pages/DashboardPage/DashboardLayout';
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

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            path="/home"
            element={<Home />}
          />
          <Route
            path="/event"
            element={<Event />}
          />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/register"
            element={<Register />}
          />
          <Route
            path="/forget-password"
            element={<ForgetPassword />}
          />
          <Route
            path="/verify-password"
            element={<VerifyPassword />}
          />
          <Route
            path="/new-password"
            element={<NewPassword />}
          />

          <Route
            path="/timeline"
            element={<TimelineUmum />}
          />
          <Route
            path="/contact-us"
            element={<ContactUs />}
          />

          {/*Dashboard*/}
          <Route
            path="*"
            element={<DashboardLayout />}
          />

          <Route
            path="/edit-profile"
            element={<EditProfile />}
          />

          {/* buat liat liat waktu bikin page */}
          <Route
            path="/competition"
            element={<Lomba />}
          />
          <Route
            path="/sponsors"
            element={<Sponsors />}
          ></Route>
          <Route
            path="/competition/game_today"
            element={<Game_Today />}
          ></Route>
          <Route
            path="/competition/hack_today"
            element={<Hack_Today />}
          ></Route>
          <Route
            path="/competition/mine_today"
            element={<Mine_Today />}
          ></Route>
          <Route
            path="/competition/ux_today"
            element={<Ux_Today />}
          ></Route>
          <Route
            path="/event/national_seminar"
            element={<Seminar />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
