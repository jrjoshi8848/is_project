import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import apiClient from '../services/apiClient';
import { useNavigate } from 'react-router-dom';
//import Notification from '../components/common/Notification'; // Import the reusable Notification component

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');  // For OTP input
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);  // Check if Admin or Student
  const [isOtpStep, setIsOtpStep] = useState(false);  // If OTP is required for Admin login
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);  // For notification

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isAdmin ? 'auth/admin/login' : 'auth/students/login';
      const response = await apiClient.post(endpoint, { email, password });

      if (isAdmin && response.data.message === 'OTP sent to admin email') {
        setIsOtpStep(true);  // Show OTP form after password verification
        setNotification({ type: 'success', message: 'OTP sent to admin email' });
        setError('');
        return;
      }

      // Store the token and navigate for student login
      setAuth(isAdmin ? 'admin' : 'student', response.data.accessToken);
      setNotification({ type: 'success', message: 'Login successful!' });
      navigate(isAdmin ? '/admin/dashboard' : '/student/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      setNotification({ type: 'error', message: error.response?.data?.message || 'Login failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.post('/admin/verify-otp', { email, otp });
      setAuth('admin', response.data.accessToken);
      setNotification({ type: 'success', message: 'Admin logged in successfully' });
      navigate('/admin/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'OTP verification failed');
      setNotification({ type: 'error', message: error.response?.data?.message || 'OTP verification failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)} // Optional callback to reset notification state
        />
      )}

      <div className="login-form w-full max-w-md p-8 bg-white rounded shadow">
        <div className="flex justify-around mb-4">
          <button
            className={`px-4 py-2 font-semibold ${!isAdmin ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => {
              setIsAdmin(false);
              setIsOtpStep(false);
            }}
          >
            Student Login
          </button>
          <button
            className={`px-4 py-2 font-semibold ${isAdmin ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => {
              setIsAdmin(true);
              setIsOtpStep(false);
            }}
          >
            Admin Login
          </button>
        </div>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>} {/* Error message */}

        {!isOtpStep ? (
          // Login Form for Student and Admin (Email and Password)
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            loading={loading}
            handleLogin={handleLogin}
          />
        ) : (
          // OTP Form for Admin
          <OtpForm otp={otp} setOtp={setOtp} loading={loading} handleOtpVerification={handleOtpVerification} />
        )}
      </div>
    </div>
  );
};

// Separate component for the login form (email and password)
const LoginForm = ({ email, setEmail, password, setPassword, loading, handleLogin }) => {
  return (
    <form onSubmit={handleLogin}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
        disabled={loading}  // Disable button while loading
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

// Separate component for OTP form (after email/password for admin)
const OtpForm = ({ otp, setOtp, loading, handleOtpVerification }) => {
  return (
    <form onSubmit={handleOtpVerification}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">OTP</label>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
        disabled={loading}  // Disable button while loading
      >
        {loading ? 'Verifying OTP...' : 'Verify OTP'}
      </button>
    </form>
  );
};

export default Login;
