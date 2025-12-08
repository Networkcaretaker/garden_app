import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Login from './pages/Login';
import { AppShell } from './components/layout/AppShell';
import ProjectCreate from './pages/projects/ProjectCreate';
import DashboardPage from './pages/DashboardPage';
import PlantsPage from './pages/plants/PlantsPage';
import ProjectList from './pages/projects/ProjectList';
import ProjectEdit from './pages/projects/ProjectEdit';
import ProjectPreview from './pages/projects/ProjectPreview';
import SettingsPage from './pages/settings/SettingsPage';

// ... ProtectedRoute component ...
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          
          <Route path="projects">
             <Route index element={<ProjectList />} />
             <Route path="new" element={<ProjectCreate />} />
             <Route path=":id" element={<ProjectPreview />} />
             <Route path=":id/edit" element={<ProjectEdit />} />
          </Route>
          <Route path="plants" element={<PlantsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;