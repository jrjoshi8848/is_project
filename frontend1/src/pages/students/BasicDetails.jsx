import React, { useState, useEffect, useRef } from 'react';
import apiClient from "../../services/apiClient";
//import { useNotification } from "../../context/NotificationContext";
import person from "../../assets/person.jpg"
import { ToastContainer, toast } from 'react-toastify';

const BasicDetailsForm = () => {
    console.log("BasicDetailsForm mounted");
  // Form state
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    phone: "",
    DOB: "",
    temporary_address: "",
    permanent_address: "",
    sex: "",
    fathers_name: "",
    grandfathers_name: "",
    mothers_name: "",
    fathers_profession: "",
  });
  const [pp, setPp] = useState(null); // profile picture file
  const [existingImage, setExistingImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const fetched = useRef(false);
  
  //const { showNotification } = useNotification();

  // Fetch existing basic details on mount
  useEffect(() => {
    if (fetched.current) return; // prevent duplicate fetch
    fetched.current = true;
    const fetchBasicDetails = async () => {
      try {
        const response = await apiClient.get("/students/basic_details");
        if (response.status === 200) {
          const data = response.data.data;
          toast(response.data?.message || "basic details fetched successfully")
          setFormData({
            first_name: data.first_name || "",
            middle_name: data.middle_name || "",
            last_name: data.last_name || "",
            phone: data.phone || "",
            DOB: data.DOB ? new Date(data.DOB).toISOString().split('T')[0] : "",
            temporary_address: data.temporary_address || "",
            permanent_address: data.permanent_address || "",
            sex: data.sex || "",
            fathers_name: data.fathers_name || "",
            grandfathers_name: data.grandfathers_name || "",
            mothers_name: data.mothers_name || "",
            fathers_profession: data.fathers_profession || "",
          });
          setExistingImage(data.image || null);
          setEditMode(false);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setEditMode(true);
        } else {
          toast(error.response?.data?.message || "Failed to fetch details")
        }
      }
    };
    fetchBasicDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPp(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = new FormData();
      // Append all text fields
      Object.keys(formData).forEach((key) => {
        payload.append(key, formData[key]);
      });
      // Append file if selected
      if (pp) {
        payload.append("pp", pp);
      }

      const response = await apiClient.post("/students/basicdetails", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        toast(response.data?.message || "Basic details updated successfully")
        setEditMode(false);
      }
    } catch (error) {
      toast(error.response?.data?.message || "Failed to save details")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 bg-gray-100 min-h-screen">
        <ToastContainer/>
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold text-blue-600 mb-6">
          {editMode ? "Fill/Update Your Basic Details" : "Your Basic Details"}
        </h2>

        {/* Display existing image if available */}
        <div className="mb-6 flex items-center">
          <img
            src={existingImage || person}
            alt="Profile"
            className="w-20 h-20 rounded-full mr-4 object-cover border"
          />
          {editMode && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm"
              required
            />
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                disabled={!editMode}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Middle Name</label>
              <input
                type="text"
                name="middle_name"
                value={formData.middle_name}
                onChange={handleChange}
                disabled={!editMode}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                disabled={!editMode}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!editMode}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="DOB"
                value={formData.DOB}
                onChange={handleChange}
                disabled={!editMode}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sex</label>
              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                disabled={!editMode}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Father's Name</label>
              <input
                type="text"
                name="fathers_name"
                value={formData.fathers_name}
                onChange={handleChange}
                disabled={!editMode}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Grandfather's Name</label>
              <input
                type="text"
                name="grandfathers_name"
                value={formData.grandfathers_name}
                onChange={handleChange}
                disabled={!editMode}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mother's Name</label>
              <input
                type="text"
                name="mothers_name"
                value={formData.mothers_name}
                onChange={handleChange}
                disabled={!editMode}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Father's Profession</label>
              <input
                type="text"
                name="fathers_profession"
                value={formData.fathers_profession}
                onChange={handleChange}
                disabled={!editMode}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Temporary Address</label>
              <input
                type="text"
                name="temporary_address"
                value={formData.temporary_address}
                onChange={handleChange}
                disabled={!editMode}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Permanent Address</label>
              <input
                type="text"
                name="permanent_address"
                value={formData.permanent_address}
                onChange={handleChange}
                disabled={!editMode}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end space-x-4">
            {!editMode ? (
              <button
                type="button"
                onClick={() => setEditMode(true)}
                className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300"
              >
                Edit
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="py-2 px-4 bg-gray-400 text-white rounded hover:bg-gray-500 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BasicDetailsForm;
