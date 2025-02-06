import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient"; // Your API client

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  // Timer effect for Resend OTP button
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
  
      return () => clearInterval(interval);
    } else {
      setIsResendDisabled(false); // Re-enable the button when timer reaches 0
    }
  }, [timer]);
  

  // Auto-hide messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const messageTimer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(messageTimer);
    }
  }, [error, success]);

  // Request OTP
  const handleRequestOtp = async () => {
    if (!email) {
      setError("Email is required to request OTP.");
      return;
    }
  
    try {
      setIsResendDisabled(true);
      const response = await apiClient.post("/auth/reqotp", { email });
      
      if (response.status === 200) {
        //setIsResendDisabled(true);
        setTimer(10); // Start 60s timer
        setSuccess(response.data.message);
        setOtpSent(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to request OTP.");
      setIsResendDisabled(false);
    }
  };
  

  // Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!email || !otp || !newPassword) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.post("/auth/resetpass", {
        email,
        otp,
        newPass: newPassword,
      });
      setSuccess(response.data.message);
      setTimeout(() => navigate("/login"), 2000); // Redirect to login after success
    } catch (error) {
      setError(error.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-4">Forgot Password</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center">{success}</p>}

        <form onSubmit={handleResetPassword} className="space-y-4">
          {/* Email Input + Send OTP Button */}
          <div className="flex space-x-2">
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={handleRequestOtp}
              className={`bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition ${
                isResendDisabled ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={isResendDisabled}
            >
              {isResendDisabled ? `${timer}s` : "Send OTP"}
            </button>
          </div>

          {/* OTP Input (Only show after OTP is sent) */}
          {otpSent && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />

              {/* New Password Input */}
              <input
                type="password"
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />

              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Remembered your password?{" "}
          <button onClick={() => navigate("/login")} className="text-blue-500">
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;