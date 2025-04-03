import React, { useState, useEffect,useRef } from "react";
import apiClient from "../../services/apiClient";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { ToastContainer, toast } from "react-toastify";

const CitizenshipDetailsForm = () => {
  const [formData, setFormData] = useState({
    citizenship_number: "",
    type: "",
    issued_date: "",
    issued_district: "",
    front: "",
    back: "",
  });

  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
    const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return; // prevent duplicate fetch
    fetched.current = true;
    const fetchCitizenshipDetails = async () => {
      try {
        const response = await apiClient.get("/students/citizenship");
        if (response.status === 200) {
          const data = response.data.data;
          toast(response.data?.message || "Citizenship details fetched successfully");

          setFormData({
            citizenship_number: data.citizenship_number || "",
            type: data.type || "",
            issued_date: data.issued_date ? new Date(data.issued_date).toISOString().split('T')[0] : "",
            issued_district: data.issued_district || "",
            front: data.front || "",
            back: data.back || "",
          });

          setFrontImage(data.front || null);
          setBackImage(data.back || null);

          setEditMode(false);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setEditMode(true);
        } else {
          toast(error.response?.data?.message || "Failed to fetch details");
        }
      }
    };
    fetchCitizenshipDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (type === "front") {
        setFrontImage(file);
      } else {
        setBackImage(file);
      }
    }
  };

  const handleDeleteImage = (type) => {
    if (type === "front") {
      setFrontImage(null);
    } else {
      setBackImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== "front" && key !== "back") {
          payload.append(key, formData[key]);
        }
      });

      if (frontImage instanceof File) {
        payload.append("front", frontImage);
      } else if (formData.front) {
        payload.append("front", formData.front);  
      }

      if (backImage instanceof File) {
        payload.append("back", backImage);
      } else if (formData.back) {
        payload.append("back", formData.back); 
      }

      const response = await apiClient.post("/students/citizenship", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        toast(response.data?.message || "Citizenship details updated successfully");
        setEditMode(false);
      }
    } catch (error) {
      toast(error.response?.data?.message || "Failed to save details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 bg-gray-100 min-h-screen">
      <ToastContainer />
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold text-blue-600 mb-6">
          {editMode ? "Fill/Update Your Citizenship Details" : "Your Citizenship Details"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Citizenship Number</label>
              <input
                type="text"
                name="citizenship_number"
                value={formData.citizenship_number}
                onChange={handleChange}
                disabled={!editMode}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Citizenship Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                disabled={!editMode}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select</option>
                <option value="Descendent By Birth">Descendent By Birth</option>
                <option value="Naturalized">Naturalized</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Issued Date</label>
              <input
                type="date"
                name="issued_date"
                value={formData.issued_date}
                onChange={handleChange}
                disabled={!editMode}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Issued District</label>
              <input
                type="text"
                name="issued_district"
                value={formData.issued_district}
                onChange={handleChange}
                disabled={!editMode}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            {[{ type: "front", label: "Front Side" }, { type: "back", label: "Back Side" }].map(
              ({ type, label }) => (
                <div key={type} className="flex flex-col items-center">
                  <label className="block text-sm font-medium text-gray-700">{label}</label>
                  {editMode && !eval(type + "Image") ? (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, type)}
                      className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  ) : (
                    <div className="relative">
                      {eval(type + "Image") && typeof eval(type + "Image") === "string" ? (
                        <img
                          src={eval(type + "Image")}
                          alt={`${type} preview`}
                          className="object-cover border rounded mt-2"
                        />
                      ) : (
                        <img
                          src={eval(type + "Image") instanceof File ? URL.createObjectURL(eval(type + "Image")) : eval(type + "Image")}
                          alt={`${type} preview`}
                          className="object-cover border rounded mt-2"
                        />
                      )}
                      {editMode && (
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(type)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                        >
                          <XCircleIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            )}
          </div>

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
                <button type="button" onClick={() => setEditMode(false)} className="py-2 px-4 bg-gray-400 text-white rounded">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="py-2 px-4 bg-blue-600 text-white rounded">
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

export default CitizenshipDetailsForm;
