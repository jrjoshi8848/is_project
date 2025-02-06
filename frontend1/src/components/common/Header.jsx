import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../services/apiClient";
import person from "../../../src/assets/person.jpg";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";// Zustand global state
//import { logout } from "../../../../backends/controllers/authController";

const Header = () => {
  const [profileImage, setProfileImage] = useState(); // Default Image
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { clearAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
   const navigate = useNavigate();

  // Fetch profile details from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get("/auth/get-profile");
        console.log(response.data)

        if (response.data.profileImage) {
          setProfileImage(response.data.profileImage);
        }
        else{
            setProfileImage(person)
        }
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data?.message);
      }
    };

    fetchProfile();
  }, []);

  const logout = async () => {
    try {
      // Send POST request to the backend to logout
      const response = await apiClient.post("/auth/logout");
      console.log(response.data);

      // Clear localStorage items
      clearAuth();

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error.response?.data?.message);
    }
  };
  
    // Request OTP function
    const requestOtp = async () => {
      try {
        setLoading(true);
        setErrorMessage("");
  
        // Send OTP request to backend
        const response = await apiClient.post("/auth/reqotpwithid");
  
        // If successful, navigate to the next page to input OTP and new password
        if (response.status === 200) {
          navigate("/reset-password"); // Redirect to reset password page
        }
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Error sending OTP");
      } finally {
        setLoading(false);
      }
    };

  return (
    <header className="flex justify-between items-center bg-white p-4 shadow-md">
      {/* Left Side: Logo/Text */}
      <div className="text-3xl font-bold text-blue-600">FWU Engineering</div>

      {/* Right Side: Profile Image & Dropdown */}
      <div className="relative">
        {/* Profile Image */}
        <img
          src={profileImage}
          alt="Profile"
          className="w-10 h-10 rounded-full cursor-pointer border border-gray-300"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        />

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200">
            <ul className="py-2">
              <li>
              <button
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={requestOtp}
                    disabled={loading}
                >
                {loading ? "Sending OTP..." : "Change Password"}
        </button>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;