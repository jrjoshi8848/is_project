import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import apiClient from '../services/apiClient';
import { useNavigate } from 'react-router-dom';
import NotificationMessage from '../components/common/NotificationMessage.jsx'; // Import the reusable Notification component
import { useNotification } from "../context/NotificationContext";
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');  // For OTP input
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);  // Check if Admin or Student
  const [isOtpStep, setIsOtpStep] = useState(false);  // If OTP is required for Admin login
  const { setAuth } = useAuthStore();
  const [noti, setNotification] = useState(null);  // For notification
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isAdmin ? 'auth/admin/login' : 'auth/students/login';
      const response = await apiClient.post(endpoint, { email, password });
      console.log(response.data)
      if (isAdmin && response.status === 200) {
        setIsOtpStep(true);  // Show OTP form after password verification
        showNotification('success',  'OTP sent to admin email' );
        setError('');
        return;
      }

      
      console.log("Logged in")
      if(!isAdmin && response.status===200 && response.data?.message === 'Account is not verified yet'){
        const resp = await apiClient.post("/auth/reqotp", { email });
        if(resp.status===200){
          setNotification({ type: 'success', message: 'Verify  Your Account' });
          navigate("/verify-account", { state: { email } });
        }
        else throw new Error('Failed to send OTP for account verification')
      }
      if(!isAdmin && response.status==200 && response.data.is_verified){
      setAuth('student');
      setNotification({ type: 'success', message: 'Login successful!' });
      toast(response.data?.message || 'Login successful!')
      navigate('/student/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      showNotification('error', error.response?.data?.message || 'Login failed' );
      toast(error.response?.data?.message || 'Login failed' )
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.post('/auth/admin/otp', { email, otp });
      if(response.status==200)
      {
        console.log(response.data)
        setAuth('admin');
        setNotification({ type: 'success', message: 'Admin logged in successfully' });
        navigate('/admin/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'OTP verification failed');
      setNotification({ type: 'error', message: error.response?.data?.message || 'OTP verification failed' });
      toast(error.response?.data?.message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Notification */}
      <ToastContainer/>
      {noti && (
        <NotificationMessage
          type={noti.type}
          message={noti.message}
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

const LoginForm = ({ email, setEmail, password, setPassword, loading, handleLogin }) => {
  const navigate = useNavigate();
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

      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      <div className="flex justify-between items-center text-sm mb-4">
        <button
          type="button"
          className="text-blue-600 hover:underline"
          onClick={() => navigate('/forget-password')}
        >
          Forgot Password?
        </button>
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <div className="mt-4 text-sm text-center">
        Don't have an account?{' '}
        <button
          type="button"
          className="text-blue-600 hover:underline"
          onClick={() => navigate('/register')}
        >
          Register
        </button>
      </div>
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
