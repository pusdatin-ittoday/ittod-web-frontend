import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/LandingPage/Home';
import Login from './pages/LoginPage/Login';
import Register from './pages/LoginPage/Register';
import Event from './pages/LandingPage/Event';
import Lomba from './pages/LandingPage/Lomba';
import TimelineUmum from './pages/TimelineUmum';
import DashboardBeranda from './pages/DashboardBeranda';
import IkutLomba from './pages/IkutLomba';
import ForgetPassword from './pages/LoginPage/ForgetPassword';
import VerifyPassword from './pages/LoginPage/VerifyPassword';
import NewPassword from './pages/LoginPage/NewPassword';
import ContactUs from './pages/ContactUs';
import Sponsors from './Sponsors';
import Hack_Today from './pages/hack_today';

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
            path="ikutlomba"
            element={<IkutLomba />}
          ></Route>
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
            path="/ContactUs"
            element={<ContactUs />}
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
            path="/competition/hack_today"
            element={<Hack_Today />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
