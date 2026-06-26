import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Projects from './pages/Projects';
import TimeLogs from './pages/TimeLogs';
import Invoices from './pages/Invoices';
import InvoiceView from './pages/InvoiceView';  // ✅ YEH IMPORT ADD KIYA
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import InviteClient from './pages/InviteClient';
import AcceptInvite from './pages/AcceptInvite';
import ClientDetail from './pages/ClientDetail';
import ProjectDetail from './pages/ProjectDetail';
import EditProject from './pages/EditProject';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/accept-invite/:token" element={<AcceptInvite />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Dashboard />
                </>
              </ProtectedRoute>
            } />
            <Route path="/clients" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Clients />
                </>
              </ProtectedRoute>
            } />
            <Route path="/clients/:id" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <ClientDetail />
                </>
              </ProtectedRoute>
            } />
            <Route path="/projects" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Projects />
                </>
              </ProtectedRoute>
            } />
            <Route path="/projects/:id" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <ProjectDetail />
                </>
              </ProtectedRoute>
            } />
            <Route path="/projects/edit/:id" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <EditProject />
                </>
              </ProtectedRoute>
            } />
            <Route path="/timelogs" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <TimeLogs />
                </>
              </ProtectedRoute>
            } />
            
            {/* Invoices Routes */}
            <Route path="/invoices" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Invoices />
                </>
              </ProtectedRoute>
            } />
            
            {/* ✅ INVOICE VIEW ROUTE - YEH ADD KIYA */}
            <Route path="/invoices/:id" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <InvoiceView />
                </>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Profile />
                </>
              </ProtectedRoute>
            } />
            <Route path="/invite-client" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <InviteClient />
                </>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;