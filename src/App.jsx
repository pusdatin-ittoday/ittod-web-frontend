import Event from './pages/Event';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/LoginPage/Login';
import Register from './pages/LoginPage/Register';
import ForgetPassword from './pages/LoginPage/ForgetPassword';
import VerifyPassword from './pages/LoginPage/VerifyPassword';
import NewPassword from './pages/LoginPage/NewPassword';
import Lomba from './pages/Lomba';
import TimelineUmum from './pages/TimelineUmum';
import ContactUs from './pages/ContactUs';


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
            path="/competition"
            element={<Lomba />}
          />
          <Route
            path="/timeline"
            element={<TimelineUmum />}
          />
          <Route
            path="/ContactUs"
            element={<ContactUs />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
