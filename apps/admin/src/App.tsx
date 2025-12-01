import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Login from './pages/Login';
import { AppShell } from './components/layout/AppShell';

// 1. Protected Route Wrapper
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

// 2. Main App Component
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes wrapped in AppShell */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          {/* Index Route (Dashboard) */}
          <Route index element={<h1 className="text-2xl font-bold">Dashboard Overview</h1>} />
          
          {/* Project Routes */}
          <Route path="projects" element={<h1 className="text-2xl font-bold">Project List</h1>} />
          <Route path="plants" element={<h1 className="text-2xl font-bold">Plant Encyclopedia</h1>} />
          <Route path="settings" element={<h1 className="text-2xl font-bold">Settings</h1>} />
        </Route>
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;