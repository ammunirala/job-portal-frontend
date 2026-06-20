import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import PostJob from './pages/PostJob';
import JobDetail from './pages/JobDetail';
import InterviewPrep from './pages/InterviewPrep';
import ApplicantsList from './pages/ApplicantsList';
import SavedJobs from './pages/SavedJobs';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/jobs" element={<Jobs />} />

        <Route
          path="/post-job"
          element={
            <PrivateRoute>
              <PostJob />
            </PrivateRoute>
          }
        />

        {/* ApplicantsList — jobs/:id se PEHLE rakhna zaroori hai */}
        <Route
          path="/jobs/:jobId/applicants"
          element={
            <PrivateRoute>
              <ApplicantsList />
            </PrivateRoute>
          }
        />

        {/* JobDetail — hamesha BAAD mein */}
        <Route path="/jobs/:id" element={<JobDetail />} />

        <Route
          path="/saved-jobs"
          element={
            <PrivateRoute>
              <SavedJobs />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/interview-prep"
          element={
            <PrivateRoute>
              <InterviewPrep />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a24',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
            },
          }}
        />

        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}