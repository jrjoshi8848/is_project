import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000); // Clear after 5 seconds

      return () => clearTimeout(timer); // Cleanup timeout
    }
  }, [error, success]);

  const handleFileChange = (e) => {
    setProfile(e.target.files[0]);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      if (profile) {
        formData.append('profile', profile);
      }

      const response = await apiClient.post('/students/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if(response.status==201){
      setTimeout((() => navigate("/verify-account", { state: { email } })), 2000); // Redirect to login after 2 seconds

      }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="register-form w-full max-w-md p-8 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Register as a Student</h2>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        {success && <div className="text-green-500 text-sm mb-4">{success}</div>}

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

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

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Profile Picture (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-blue-500 hover:underline">
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
