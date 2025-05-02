import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/LoginPage/Login';
import Register from './pages/LoginPage/Register';
import Event from './pages/Event';
import Lomba from './pages/Lomba';
import TimelineUmum from './pages/TimelineUmum';
import DashboardBeranda from './pages/DashboardBeranda';
import IkutLomba from './pages/IkutLomba'; 
import ForgetPassword from './pages/LoginPage/ForgetPassword';
import VerifyPassword from './pages/LoginPage/VerifyPassword';
import NewPassword from './pages/LoginPage/NewPassword';
import ContactUs from './pages/ContactUs';
import Sponsors from "./Sponsors";
import AdminCompetitionView from './pages/Admin/AdminCompetitionView';  // Pastikan pathnya benar
import AdminVerifyTeamView from './pages/Admin/VerifyTeamView';  // Pastikan pathnya benar

import LoginAdmin from '././pages/Admin/LoginPage/LoginAdmin';
import RegisterAdmin from '././pages/Admin/LoginPage/RegisterAdmin';
import ForgetPasswordAdmin from '././pages/Admin/LoginPage/ForgetPasswordAdmin';
import VerifyPasswordAdmin from '././pages/Admin/LoginPage/VerifyPasswordAdmin';
import NewPasswordAdmin from '././pages/Admin/LoginPage/NewPasswordAdmin';


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
          <Route path="ikutlomba" element={<IkutLomba />}></Route>
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/verify-password" element={<VerifyPassword />} />
          <Route path="/new-password" element={<NewPassword />} />

          <Route
            path="/timeline"
            element={<TimelineUmum />}
          />
          <Route
            path="/ContactUs"
            element={<ContactUs />}
          />

          {/* buat liat liat waktu bikin page */}
          <Route path="/competition" element={<Lomba />}/>
          <Route path="/sponsors" element={<Sponsors/>}></Route>
          {/* Admin Routes */}
     
        <Route path="/AdminCompetitionView" element={<AdminCompetitionView />} />
        <Route path="/AdminVerifyTeamView" element={<AdminVerifyTeamView />} />
        <Route path="/AdminLogin" element={<LoginAdmin />} />
        <Route path="/AdminRegister" element={<RegisterAdmin />} />
        <Route path="/AdminForgetPassword" element={<ForgetPasswordAdmin />} />
        <Route path="/AdminVerifyPassword" element={<VerifyPasswordAdmin />} />
        <Route path="/AdminNewPassword" element={<NewPasswordAdmin />} />
     
        

        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;              