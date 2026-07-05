import React from 'react';
import { Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import EventDetailPage from '../pages/EventDetailPage';
import CompetitionDetailPage from '../pages/CompetitionDetailPage';

/**
 * Routes untuk scope Orang Pertama.
 * Ekspor sebagai array <Route> yang bisa langsung di-spread di <Routes>.
 */
const OrangPertamaRoutes = () => (
  <>
    <Route path="/" element={<LandingPage />} />
    <Route path="/home" element={<LandingPage />} />
    <Route path="/event/:slug" element={<EventDetailPage />} />
    <Route path="/competition/:slug" element={<CompetitionDetailPage />} />
  </>
);

export default OrangPertamaRoutes;
