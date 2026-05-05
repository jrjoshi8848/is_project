import React, { useState, useEffect, useRef } from 'react';
import apiClient from "../../services/apiClient";
import { ToastContainer, toast } from 'react-toastify';
import person from "../../assets/person.jpg";
import BasicDetailsForm from './BasicDetails';
import CitizenshipDetailsForm from './Citizenship';
import { XCircleIcon } from "@heroicons/react/24/solid";
import ImageUploader from './components';
const SubmitForm = () => {
  console.log("SubmitForm mounted");

  const [formData, setFormData] = useState({
    women: false,
    madheshi: false,
    dalit: false,
    adibashi_janjati: false,
    backward_region: false,
    disabled: false,
    district_quota: false,
    district: "",
    staff_quota: false,
    voucher_no: "",
  });
  const [voucher, setVoucher] = useState(null);
  const [disabledImage, setDisabledImage] = useState(null);
  const [staffImage, setStaffImage] = useState(null);
  const [existingForm, setExistingForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const fetched = useRef(false);

  // Fetch existing form details on mount
  useEffect(() => {
    if (fetched.current) return; // prevent duplicate fetch
    fetched.current = true;
    const fetchFormDetails = async () => {
      try {
        const response = await apiClient.get("/students/get-form");
        if (response.status === 200) {
          const data = response.data.form;
          toast(response.data?.message || "Form details fetched successfully");
          console.log(data)

          setFormData({
            women: data.women || false,
            madheshi: data.madheshi || false,
            dalit: data.dalit || false,
            adibashi_janjati: data.adibashi_janjati || false,
            backward_region: data.backward_region || false,
            disabled: data.disabled || false,
            district_quota: data.district_quota || false,
            district: data.district || "",
            staff_quota: data.staff_quota || false,
            voucher_no: data.voucher_no || "",
          });
          setVoucher(data.voucher || null);
          setDisabledImage(data.disabledImage || null);
          setStaffImage(data.staff_image || null);
          setEditMode(false);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setEditMode(true);
        } else {
          toast(error.response?.data?.message || "Failed to fetch form details");
        }
      }
    };
    fetchFormDetails();
  }, []);

  const handleDeleteImageDis = (index, field) => {
    setDisabledImage(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e, fieldName) => {
    if (e.target.files && e.target.files[0]) {
      if (fieldName === "voucher") {
        setVoucher(e.target.files[0]);
      } else if (fieldName === "disabledImage") {
        setDisabledImage(e.target.files[0]);
      } else if (fieldName === "staffImage") {
        setStaffImage(e.target.files[0]);
      }
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
      // Append files if selected
      if (voucher) {
        payload.append("voucher", voucher);
      }
      if (disabledImage) {
        payload.append("disabled_image", disabledImage);
      }
      if (staffImage) {
        payload.append("staff_image", staffImage);
      }

      const response = await apiClient.post("/students/form", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        toast(response.data?.message || "Form submitted/updated successfully");
        setEditMode(false);
      }
    } catch (error) {
      toast(error.response?.data?.message || "Failed to submit form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 bg-gray-100 min-h-screen">
      <ToastContainer />
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold text-blue-600 mb-6">
          {editMode ? "Fill/Update Your Form Details" : "Your Form Details"}
        </h2>
        {/* Display images if available */}
        <div className="container mx-auto p-8 bg-gray-100 min-h-screen">
        

        <form onSubmit={handleSubmit} >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
           

            {/* Quota checkboxes */}
            <div className="md:col-span-2 space-y-4">
              <label className="block text-sm font-medium text-gray-700">Quota Options</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="women"
                  checked={formData.women}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="mr-2"
                />
                <label className="block text-sm font-medium text-gray-700">Women</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="madheshi"
                  checked={formData.madheshi}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="mr-2"
                />
                <label className="block text-sm font-medium text-gray-700">Madheshi</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="dalit"
                  checked={formData.dalit}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="mr-2"
                />
                <label className="block text-sm font-medium text-gray-700">Dalit</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="adibashi_janjati"
                  checked={formData.adibashi_janjati}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="mr-2"
                />
                <label className="block text-sm font-medium text-gray-700">Adibashi Janjati</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="backward_region"
                  checked={formData.backward_region}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="mr-2"
                />
                <label className="block text-sm font-medium text-gray-700">Backward Region</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="disabled"
                  checked={formData.disabled}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="mr-2"
                />
                <label className="block text-sm font-medium text-gray-700">Disabled</label>
                </div>
              
                {formData.disabled &&
          <>
          { disabledImage ? (
            
            <div className="relative">
                <div className="flex flex-col items-center">
                 <label className="block text-xl font-large text-gray-700 text-centre">Disabled Image</label>
                 </div>
                 <img
                src={disabledImage instanceof File ? URL.createObjectURL(disabledImage) : disabledImage}
                className="w-128 h-128 object-cover border"
                alt="Disabled proof"
              />
              {editMode && (
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                  onClick={() => handleDeleteImageDis()}
                >
                  <XCircleIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          ) : (
            <input type="file" onChange={(e) => handleFileChange(e, "disabledImage")} />
          )}
            </>
          }

            
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="district_quota"
                  checked={formData.district_quota}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="mr-2"
                />
                <label className="block text-l font-medium text-gray-700">District Quota</label>
                </div>

                {formData.district_quota &&
                <div>
                <label className="block text-l font-medium text-gray-700">District</label>   
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
                }
             
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="staff_quota"
                  checked={formData.staff_quota}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="mr-2"
                />
                <label className="block text-sm font-medium text-gray-700">Staff Quota</label>
              </div>
            </div>
          </div>
          <div>
              <label className="block text-l font-medium text-gray-700">Voucher Number</label>
              <input
                type="text"
                name="voucher_no"
                value={formData.voucher_no}
                onChange={handleChange}
                disabled={!editMode}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          <div className="mb-6 flex items-center">
          <div className="mr-4">
          <div className="flex flex-col items-center">
                 <label className="block text-xl font-large text-gray-700 text-centre">Voucher Image</label>
                 </div>
            <img
              src={voucher ? voucher : person}
              alt="Voucher"
              className="w-120 h-120 rounded-md object-cover"
            />
            {editMode && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "voucher")}
                className="text-sm"
              />
            )}
          </div>
            {formData.staff &&
          <div>
            <label className="block text-sm font-medium text-gray-700">Staff Image</label>
            <img
              src={staffImage ? URL.createObjectURL(staffImage) : person}
              alt="Staff"
              className="w-20 h-20 rounded-md object-cover"
            />
            {editMode && staffImage && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "staffImage")}
                className="text-sm"
              />
            )}
          </div>}
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
    </div>
  );
};

export default SubmitForm;
