import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';

import Dashboard from './pages/Dashboard/index';
import UsersList from './pages/Users/index';
import UserDetail from './pages/Users/UserDetail';
import Moderation from './pages/Moderation/Moderation';
import Analytics from './pages/Analytics/Analytics';
import Monetization from './pages/Monetization';
import Messaging from './pages/Messaging/Messaging';
import Config from './pages/Config';
import Profile from './pages/Profile/Profile';

// Auth Pages
import Login from './pages/Auth/Login';
import ForgotPassword from './pages/Auth/ForgotPassword';
import VerifyOtp from './pages/Auth/VerifyOtp';
import ResetPassword from './pages/Auth/ResetPassword';

export default function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Admin Protected Routes */}
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/users/:id" element={<UserDetail />} />
        <Route path="/moderation" element={<Moderation />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/monetization" element={<Monetization />} />
        <Route path="/messaging" element={<Messaging />} />
        <Route path="/config" element={<Config />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
