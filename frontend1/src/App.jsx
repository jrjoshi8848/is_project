import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
//import { NotificationProvider } from './context/NotificationContext.jsx';
import Login from './pages/Login';
import Register from './pages/students/Register.jsx';
import VerifyAccount from './pages/students/VerifyAccount.jsx';
import ForgotPassword from './pages/ForgetPasword.jsx';
import ResetPassword from './components/common/ResetPassword.jsx';
import ProtectedRoute from './components/ProtectedRoutes.jsx';
import Header from './components/common/Header.jsx';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import BasicDetailsForm from './pages/students/BasicDetails.jsx';
import CitizenshipDetailsForm from './pages/students/Citizenship.jsx';
import PreviousEducationForm from './pages/students/PrevEdu.jsx';
import SubmitForm from './pages/students/Form.jsx';

// Create a layout for protected routes that includes the Header
const ProtectedLayout = () => (
  <>
    <Header />
    <Outlet />
  </>
);

const App = () => {
  return (
    
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-account" element={<VerifyAccount />} />
          <Route path="/forget-password" element={<ForgotPassword />} />
          
          

          
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<ProtectedLayout />}>
              <Route path="/admin/dashboard" element={<Outlet />} />
                <Route index element={<AdminDashboard />} />
            </Route>
          </Route>
          

          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route element={<ProtectedLayout />}>
              <Route path="/student/dashboard" element={<Outlet />}>
                <Route index element={<StudentDashboard />} />
                <Route path="basic-details" element={<BasicDetailsForm />} />
                <Route path="citizenship-details" element={<CitizenshipDetailsForm />} />
                <Route path="previous-education" element={<PreviousEducationForm />} />
                <Route path="submit-form" element={<SubmitForm />} />
              </Route>
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route element={<ProtectedLayout />}>
              <Route path="/" element={<Outlet />}>
              <Route path="/reset-password" element={<ResetPassword />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    
  );
};

export default App;
