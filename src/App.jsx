import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/LoginPage/Login';
import Register from './pages/LoginPage/Register';
import Event from './pages/Event';
import Lomba from './pages/Lomba';
import TimelineUmum from './pages/TimelineUmum';
import DashboardLayout from './pages/DashboardPage/DashboardLayout';
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
