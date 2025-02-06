import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext.jsx'; 
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Register from './pages/students/Register.jsx';
import VerifyAccount from './pages/students/VerifyAccount.jsx';
import ForgotPassword from './pages/ForgetPasword.jsx';
import Header from './components/common/Header.jsx';
import ProtectedRoute from './components/ProtectedRoutes.jsx'; // Import the ProtectedRoute component
import ResetPassword from './components/common/ResetPassword.jsx';


const App = () => {
  return (
    <NotificationProvider> {/* Wrap Routes with NotificationProvider */}
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-account" element={<VerifyAccount />} />
          <Route path="/forget-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />}/>
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<Header><AdminDashboard /></Header>} />
          </Route>
          
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/student/dashboard" element={<Header><StudentDashboard /></Header>} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['student','admin']} />}>
            
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </NotificationProvider>
  );
};

export default App;
