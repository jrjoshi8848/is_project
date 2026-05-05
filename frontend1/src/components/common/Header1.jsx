import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";
import person from "../../../src/assets/person.jpg";
import useAuthStore from "../../store/authStore"; 
import { toast,ToastContainer } from "react-toastify";

const Header = () => {
  const [profileImage, setProfileImage] = useState(); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { clearAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get("/auth/get-profile");
        console.log(response.data);

        if (response.data.profileImage) {
          setProfileImage(response.data.profileImage);
        } else {
          setProfileImage(person);
        }
      } catch (error) {
        toast(error.response?.data?.message||"Error fetching profile:")
        console.error("Error fetching profile:", error.response?.data?.message);
      }
    };

    fetchProfile();
  }, []);

  const logout = async () => {
    try {
      const response = await apiClient.post("/auth/logout");
      console.log(response.data);

      clearAuth();

      navigate("/login");
    } catch (error) {
      toast(error.response?.data?.message || "Error logging out:", )
      console.error("Error logging out:", error.response?.data?.message);
    }
  };

  const requestOtp = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await apiClient.post("/auth/reqotpwithid");

      if (response.status === 200) {
        navigate("/reset-password");
      }
    } catch (error) {
      toast(error.response?.data?.message || "Error sending OTP")
    } finally {
      setLoading(false);
    }
  };

  const isDashboard =
      location.pathname === "/admin/dashboard" ||
      location.pathname === "/student/dashboard";

  const handleNavigate = () => {
    const role = localStorage.getItem("role");

    if (role === "admin") {
      navigate("/admin/dashboard");
    } else if (role === "student") {
      navigate("/student/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="flex justify-between w-full items-center bg-white p-4 shadow-md top-0 left-0 relative z-0">
      {/* Left Side: Logo/Text */}
      <ToastContainer/>
      <div className="absolute">
      <button
    onClick={handleNavigate}
    disabled={isDashboard} 
    className={`text-3xl font-bold ${isDashboard ? "text-blue-600 cursor-default" : "text-blue-600 cursor-pointer hover:text-green-800 transition"} p-0 m-0`}
    style={{ textAlign: "left" }} // Ensure alignment
  >
    FWU Engineering
  </button>
  </div>

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
