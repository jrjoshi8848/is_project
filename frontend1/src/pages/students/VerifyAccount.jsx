import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import apiClient from "../../services/apiClient"; // Ensure this is set up for API calls

const VerifyAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || ""; // Get email from registration page navigation

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0); // Timer state for resend OTP
  const [isResendDisabled, setIsResendDisabled] = useState(false); // Disable resend OTP button

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await apiClient.post("/students/verifyAccount", { email, otp });
      setSuccess(response.data.message);
      if(response.status==200)
        setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
    else{
        setError("otp verification failed")
        setTimeout(2000);
    }
    } catch (error) {
      setError(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsResendDisabled(true);
      setTimer(60); // Set timer for 60 seconds
      const response = await apiClient.post("/auth/reqotp", { email });
      console.log(response.data)
      setSuccess(response.data.message); // Success message for OTP resend
    } catch (error) {
      setError(error.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-4">Verify Account</h2>
        <p className="text-sm text-gray-600 text-center mb-4">
          Enter the OTP sent to <span className="font-medium">{email}</span>
        </p>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center">{success}</p>}

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify Account"}
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Didn't receive the OTP?{" "}
          <button
            onClick={handleResendOtp}
            className={`text-blue-500 ${isResendDisabled ? "cursor-not-allowed" : ""}`}
            disabled={isResendDisabled}
          >
            {isResendDisabled ? `${timer}s` : "Resend OTP"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default VerifyAccount;
