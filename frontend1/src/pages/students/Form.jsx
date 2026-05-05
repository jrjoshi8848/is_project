import React, { useState, useEffect, useRef } from "react";
import apiClient from "../../services/apiClient";
import { ToastContainer, toast } from "react-toastify";
import {ImageUploader,CheckboxField,TextInput,FormDetails} from "./components/components";

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
    basicDetails: null,
    citizenship: null,
    prevEducation: null,
  });

  const [voucher, setVoucher] = useState(null);
  const [disabledImage, setDisabledImage] = useState(null);
  const [staffImage, setStaffImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const fetchFormDetails = async () => {
      try {
        const response = await apiClient.get("/students/get-form");
        if (response.status === 200) {
          const data = response.data.form;
          toast(response.data?.message || "Form details fetched successfully");

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
            basicDetails: response.data.basicDetails,
            citizenship: response.data.citizenship,
            prevEducation: response.data.prevEducation,
          });

          setVoucher(data.voucher || null);
          setDisabledImage(data.disabledImage || null);
          setStaffImage(data.staffImage || null);
          setEditMode(false);
        }
      } catch (error) {
        if (error.response?.status === 404) {
          setEditMode(true);
        } else {
          toast(error.response?.data?.message || "Failed to fetch form details");
        }
      }
    };

    fetchFormDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleDeleteImageDis = (index, field) => {
    setDisabledImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      Object.keys(formData).forEach((key) => {
        payload.append(key, formData[key]);
      });

      if (voucher) payload.append("voucher", voucher);
      if (disabledImage) payload.append("disabled_image", disabledImage);
      if (staffImage) payload.append("staffImage", staffImage);

      const response = await apiClient.post("/students/form", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        toast(response.data?.message || "Form submitted successfully");
        setEditMode(false);
      }
    } catch (error) {
      toast(error.response?.data?.message || "Failed to submit form");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (file, fieldName) => {
    if (fieldName === "voucher") {
      setVoucher(file);
    } else if (fieldName === "disabledImage") {
      setDisabledImage(file);
    } else if (fieldName === "staffImage") {
      setStaffImage(file);
    }
  };
  

  return (
    <div className="container mx-auto p-8 bg-gray-100 min-h-screen">
      <ToastContainer />
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold text-blue-600 mb-6">
          {editMode ? "Fill/Update Your Form Details" : "Your Form Details"}
        </h2>
        {(formData.basicDetails && formData.citizenship && formData.prevEducation )&&<FormDetails basicDetails={formData.basicDetails}
        citizenship={formData.citizenship}
        prevEducation={formData.prevEducation} />}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Quota Checkboxes */}
            <CheckboxField name="women" checked={formData.women} onChange={handleChange} disabled={!editMode} label="Women" />
            <CheckboxField name="madheshi" checked={formData.madheshi} onChange={handleChange} disabled={!editMode} label="Madheshi" />
            <CheckboxField name="dalit" checked={formData.dalit} onChange={handleChange} disabled={!editMode} label="Dalit" />
            <CheckboxField name="adibashi_janjati" checked={formData.adibashi_janjati} onChange={handleChange} disabled={!editMode} label="Adibashi Janjati" />
            <CheckboxField name="backward_region" checked={formData.backward_region} onChange={handleChange} disabled={!editMode} label="Backward Region" />
            <CheckboxField name="disabled" checked={formData.disabled} onChange={handleChange} disabled={!editMode} label="Disabled" />

            {formData.disabled && (
              <ImageUploader  label="Disabled Proof" image={disabledImage} onImageChange={(file) => handleImageChange(file, "disabledImage")} editMode={editMode} />
            )}

            <CheckboxField name="district_quota" checked={formData.district_quota} onChange={handleChange} disabled={!editMode} label="District Quota" />

            {formData.district_quota && <TextInput name="district" value={formData.district} onChange={handleChange} disabled={!editMode} label="District" required />}

            <CheckboxField name="staff_quota" checked={formData.staff_quota} onChange={handleChange} disabled={!editMode} label="Staff Quota" />
            {formData.staff_quota && (
              <ImageUploader label="Staff Image" image={staffImage} onImageChange={(file) => handleImageChange(file, "staffImage")} editMode={editMode} required/>
            )}

            <TextInput name="voucher_no" value={formData.voucher_no} onChange={handleChange} disabled={!editMode} label="Voucher Number" required />

            <ImageUploader label="Voucher Image"  image={voucher} onImageChange={(file) => handleImageChange(file, "voucher")} editMode={editMode} required/>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end space-x-4">
            {!editMode ? (
              <button type="button" onClick={() => setEditMode(true)} className="py-2 px-4 bg-green-600 text-white rounded">Edit</button>
            ) : (
              <>
                <button type="button" onClick={() => setEditMode(false)} className="py-2 px-4 bg-gray-400 text-white rounded">Cancel</button>
                <button type="submit" disabled={loading} className="py-2 px-4 bg-blue-600 text-white rounded">{loading ? "Saving..." : "Save"}</button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitForm;
