import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
// import AuthPage from './pages/Auth Page/AuthPage';
import Login from './pages/Auth Page/Login';
import Signup from './pages/Auth Page/Signup';
import ForgotPassword from './pages/Auth Page/ForgotPassword';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import Analytics from './pages/admin/Analytics';
import Broadcast from './pages/admin/Broadcast';
import IncidentDetail from './pages/admin/IncidentDetail';
import Incidents from './pages/admin/Incidents';
import LiveMap from './pages/admin/LiveMap';
import Settings from './pages/admin/Settings';
import Tasks from './pages/admin/Tasks';

// Civic Pages
import CivicDashboard from './pages/civic/Dashboard';
import AboutStats from './pages/civic/AboutStats';
import Leaderboard from './pages/civic/Leaderboard';
import CivicLiveMap from './pages/civic/LiveMap';
import MyReports from './pages/civic/MyReports';
import Notifications from './pages/civic/Notifications';
import Profile from './pages/civic/Profile';
import ReportDetail from './pages/civic/ReportDetail';
import ReportIssue from './pages/civic/ReportIssue';
import SOS from './pages/civic/SOS';
import WhatsAppGuide from './pages/civic/WhatsAppGuide';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/broadcast" element={<Broadcast />} />
        <Route path="/admin/incident/:id" element={<IncidentDetail />} />
        <Route path="/admin/incidents" element={<Incidents />} />
        <Route path="/admin/map" element={<LiveMap />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/tasks" element={<Tasks />} />

        {/* Civic Routes */}
        <Route path="/civic/dashboard" element={<CivicDashboard />} />
        <Route path="/report" element={<ReportIssue />} />
        <Route path="/civic/map" element={<CivicLiveMap />} />
        <Route path="/sos" element={<SOS />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/civic/my-reports" element={<MyReports />} />
        <Route path="/civic/profile" element={<Profile />} />
        <Route path="/civic/report/:id" element={<ReportDetail />} />
        <Route path="/civic/stats" element={<AboutStats />} />
        <Route path="/civic/guide" element={<WhatsAppGuide />} />


        {/* Public Routes handled by Home */}
        <Route path="/*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;