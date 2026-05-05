import { XCircleIcon } from "@heroicons/react/24/solid";
import React,{ useState,useEffect } from "react";

const ImageUploader = ({ label, image, onImageChange, editMode }) => {
  const [dimensions, setDimensions] = useState({ width: 160, height: 160 }); // Default size

  // Function to load image and get dimensions
  useEffect(() => {
    if (image) {
      const img = new Image();
      img.onload = () => {
        setDimensions({ width: img.width, height: img.height });
      };
      img.src = image instanceof File ? URL.createObjectURL(image) : image;
    }
  }, [image]);

  return (
    <div className="relative">
      <div className="flex flex-col items-center">
        <label className="block text-xl font-large text-gray-700">{label}</label>
      </div>
      {image ? (
        <div className="relative">
          <img
            src={image instanceof File ? URL.createObjectURL(image) : image}
            className="object-contain border"
            style={{
              maxWidth: "100%",
              maxHeight: "400px",
            }}
            alt={label}
          />
          {editMode && (
            <button
              type="button"
              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
              onClick={() => onImageChange(null)}
            >
              <XCircleIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      ) : (
        editMode && (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onImageChange(e.target.files[0])}
          />
        )
      )}
    </div>
  );
};


const CheckboxField = ({ name, checked, onChange, disabled, label }) => {
    return (
      <div className="flex items-center">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="mr-2"
        />
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      </div>
    );
  };


  const TextInput = ({ name, value, onChange, disabled, label, required = false }) => {
    return (
      <div>
        <label className="block text-l font-medium text-gray-700">{label}</label>
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
    );
  };

  // Mapping field names to readable labels
const fieldLabels = {
  first_name: "First Name",
  middle_name: "Middle Name",
  last_name: "Last Name",
  phone: "Phone",
  DOB: "Date of Birth",
  temporary_address: "Temporary Address",
  permanent_address: "Permanent Address",
  sex: "Sex",
  fathers_name: "Father's Name",
  grandfathers_name: "Grandfather's Name",
  mothers_name: "Mother's Name",
  fathers_profession: "Father's Profession",
  citizenship_number: "Citizenship Number",
  type: "Citizenship Type",
  issued_date: "Issued Date",
  issued_district: "Issued District",
  boardName: "Board Name",
  institutionName: "Institution Name",
  degree: "Degree",
  graduationYear: "Graduation Year",
  cgpa: "CGPA",
  transcript: "Transcript Image",
  cc: "Certificate of Completion",
  pp: "Profile Picture",
  front: "Citizenship Front Image",
  back: "Citizenship Back Image",
};

// FieldRenderer component to display individual fields
const FieldRenderer = ({ data }) => {
  const renderTextField = (label, value) => (
    <div className="flex items-center space-x-4">
      <div className="font-medium text-gray-700">{label}:</div>
      <div className="text-gray-900">{value || "N/A"}</div>
    </div>
  );

  const renderImageField = (label, image, key) => {
    const isProfilePicture = key === "pp"; // Check if it's the profile picture field
  
    return (
      <div className="relative">
        {/* Render the profile picture at the top-right corner */}
        {isProfilePicture && image && (
          <div className="absolute top-0 right-0">
            <img
              src={image}
              className="object-contain w-20 h-20 rounded-full border"
              alt={label}
              style={{
                maxWidth: "100%",
                maxHeight: "200px", // Adjusted height for image positioning
              }}
            />
          </div>
        )}
  
        {/* For non-profile picture images, render them as normal */}
        {!isProfilePicture && image ? (
          <div>
            <img
              src={image}
              className="object-contain border"
              style={{
                maxWidth: "100%",
                maxHeight: "400px",
              }}
              alt={label}
            />
          </div>
        ) : (
          <div className="text-gray-600">No image available</div>
        )}
  
        {/* Always render the label */}
        <div className="flex flex-col items-center">
          <label className="block text-xl font-large text-gray-700">{label}</label>
        </div>
      </div>
    );
  };
  

  return (
    <div className="space-y-4">
      {Object.entries(data).map(([key, value], index) => {
        // Skip fields like 'id'
        if (key === "id" || key==="user_id") return null;

        // Render field label and value
        const label = fieldLabels[key] || key; // Use mapped label if available, otherwise use the key
        // Handle image URLs
        if (value && typeof value === "string" && value.includes("http")) {
          return renderImageField(label, value);
        } else {
          return renderTextField(label, value);
        }
      })}
    </div>
  );
};
  
  // FormDetails component to display the full form
  const FormDetails = ({ basicDetails, citizenship, prevEducation }) => {
    return (
      <div className="space-y-6">
  
        <div className="space-y-6">
          {/* Render Basic Details */}
          <h3 className="font-medium">Basic Details</h3>
          <FieldRenderer data={basicDetails} />
  
          {/* Render Citizenship Details */}
          <h3 className="font-medium">Citizenship Details</h3>
          <FieldRenderer data={citizenship} />
  
          {/* Render Previous Education Details */}
          <h3 className="font-medium">Previous Education</h3>
          {prevEducation.map((edu, idx) => (
            <div key={idx} className="space-y-4">
              <h4 className="text-lg font-medium">Education {idx + 1}</h4>
              <FieldRenderer data={edu} />
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  
  
export {ImageUploader,CheckboxField, TextInput,FormDetails};
