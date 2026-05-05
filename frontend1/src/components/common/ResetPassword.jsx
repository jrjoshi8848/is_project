import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";

const ResetPassword = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Logout function to clear cookies and localStorage
  const logout = async () => {
    try {
      const response = await apiClient.post("/auth/logout");
      console.log(response.data);
      // Clear any localStorage items if used for auth state
      localStorage.removeItem("role");
      localStorage.removeItem("isAuthenticated");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error.response?.data?.message);
    }
  };

  const resetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      // Send password reset request to backend
      const response = await apiClient.post("/auth/resetpasswithid", {
        otp,
        newPass: newPassword,
      });

      if (response.status === 200) {
        // After successfully resetting the password, log out the user
        await logout();
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Error resetting password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="register-form w-full max-w-md p-8 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">
          Reset Your Password
        </h2>

        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}

        <div className="mb-4">
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
            Enter OTP
          </label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <button
          onClick={resetPassword}
          className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition duration-300"
          disabled={loading}
        >
          {loading ? "Resetting Password..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
