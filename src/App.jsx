import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout.jsx';

import Dashboard from './pages/Dashboard/Dashboard.jsx';
import UsersList from './pages/Users/UsersList.jsx';
import UserDetail from './pages/Users/UserDetail.jsx';
import Moderation from './pages/Moderation/Moderation.jsx';
import Analytics from './pages/Analytics/Analytics.jsx';
import Monetization from './pages/Monetization/Monetization.jsx';
import Messaging from './pages/Messaging/Messaging.jsx';
import Config from './pages/Config/Config.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard"    element={<Dashboard />} />
        <Route path="/users"        element={<UsersList />} />
        <Route path="/users/:id"    element={<UserDetail />} />
        <Route path="/moderation"   element={<Moderation />} />
        <Route path="/analytics"    element={<Analytics />} />
        <Route path="/monetization" element={<Monetization />} />
        <Route path="/messaging"    element={<Messaging />} />
        <Route path="/config"       element={<Config />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
