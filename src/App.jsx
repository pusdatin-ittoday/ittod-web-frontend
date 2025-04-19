import Event from './pages/Event'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Lomba from './pages/Lomba';
import TimelineUmum from './pages/TimelineUmum';

const App = () => {
  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} /> 
            <Route path="/home" element={<Home />} /> 
            <Route path="/event" element={<Event />} /> 
            <Route path="/competition" element={<Lomba />} /> 
            <Route path="/timeline" element={<TimelineUmum />}  /> 
          </Routes>
      </BrowserRouter>
    </>
  );
};

export default App
