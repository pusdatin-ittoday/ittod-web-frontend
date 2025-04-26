import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import Event from './pages/Event';
import Lomba from './pages/Lomba';
import TimelineUmum from './pages/TimelineUmum';
import DashboardBeranda from './pages/DashboardBeranda';
import IkutLomba from './pages/IkutLomba'; 


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/home" element={<Home />} /> 
        <Route path="/event" element={<Event />} /> 
        <Route path="/competition" element={<Lomba />} /> 
        <Route path="/timeline" element={<TimelineUmum />} /> 
        <Route path="/dashboardBeranda" element={<DashboardBeranda />} />
        <Route path="/ikutlomba" element={<IkutLomba />} />
      
      </Routes>
    </BrowserRouter>
  );
};


export default App
