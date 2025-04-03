import { useState, useEffect } from "react";
import { fetchPreviousEducation, savePreviousEducation } from "./services/utility";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { ToastContainer, toast } from "react-toastify";

const degrees = ["SEE","Intermediate", "Other"];

const PreviousEducationForm = () => {
  const [educationRecords, setEducationRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null); // Track which record is being edited

  useEffect(() => {
    async function loadData() {
      const records = await fetchPreviousEducation();
      console.log(records)
      setEducationRecords(records);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleFieldChange = (index, field, value) => {
    const updatedRecords = [...educationRecords];
    updatedRecords[index][field] = value;
    setEducationRecords(updatedRecords);
  };

  const handleFileChange = (index, field, file) => {
    const updatedRecords = [...educationRecords];
    updatedRecords[index][field] = file;
    setEducationRecords(updatedRecords);
  };

  const handleDeleteImage = (index, field) => {
    const updatedRecords = [...educationRecords];
    updatedRecords[index][field] = null;
    setEducationRecords(updatedRecords);
  };

  const handleSaveRecord = async (index) => {
    const record = educationRecords[index];

    const formData = new FormData();
    formData.append("institutionName", record.institutionName);
    formData.append("boardName", record.boardName);
    formData.append("degree", record.degree);
    formData.append("graduationYear", record.graduationYear);
    formData.append("cgpa", record.cgpa);

    if (record.transcript instanceof File) {
      formData.append("transcript", record.transcript);
    } else if (record.transcript) {
      formData.append("transcript_url", record.transcript);
    }

    if (record.cc instanceof File) {
      formData.append("cc", record.cc);
    } else if (record.cc) {
      formData.append("cc_url", record.cc);
    }

    try {
      setLoading(true);
      const response=await savePreviousEducation(formData);
      if(response.status==200){
        toast(res.data?.message ||"Previous education details saved successfully!");
        setEditingIndex(null);}
      setLoading(false)
    } catch (error) {
      toast(error.response?.data?.message||"Failed to save details. Please try again.");
      setLoading(false)
    }
  };

  const handleAddRecord = () => {
    if (educationRecords.length < 2) {
      setEducationRecords([
        ...educationRecords,
        {
          institutionName: "",
          boardName: "",
          degree: "",
          graduationYear: "",
          cgpa: "",
          transcript: null,
          cc: null,
        },
      ]);
      setEditingIndex(educationRecords.length); // Set new record to editing mode
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <ToastContainer />
      <h2 className="text-xl font-semibold mb-4">Previous Education</h2>

      
        <>
          {educationRecords.map((record, index) => (
            <div key={index} className="border p-4 mb-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Institution Name"
                  className="border p-2 rounded w-full"
                  value={record.institutionName}
                  onChange={(e) => handleFieldChange(index, "institutionName", e.target.value)}
                  disabled={editingIndex !== index}
                />

                <input
                  type="text"
                  placeholder="Board Name"
                  className="border p-2 rounded w-full"
                  value={record.boardName}
                  onChange={(e) => handleFieldChange(index, "boardName", e.target.value)}
                  disabled={editingIndex !== index}
                />

                <select
                  className="border p-2 rounded w-full"
                  value={record.degree}
                  onChange={(e) => handleFieldChange(index, "degree", e.target.value)}
                  disabled={editingIndex !== index}
                >
                  <option value="">Select Degree</option>
                  {degrees.map((deg) => (
                    <option key={deg} value={deg}>
                      {deg}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Graduation Year"
                  className="border p-2 rounded w-full"
                  value={record.graduationYear}
                  onChange={(e) => handleFieldChange(index, "graduationYear", e.target.value)}
                  disabled={editingIndex !== index}
                />

                <input
                  type="text"
                  placeholder="CGPA"
                  className="border p-2 rounded w-full"
                  value={record.cgpa}
                  onChange={(e) => handleFieldChange(index, "cgpa", e.target.value)}
                  disabled={editingIndex !== index}
                />
              </div>

              {/* File Uploads */}
              <div className="flex items-center gap-4 mt-4">
                {/* Transcript */}
                {record.transcript ? (
                  <div className="relative">
                    <img
                      src={record.transcript instanceof File ? URL.createObjectURL(record.transcript) : record.transcript}
                      className="w-32 h-32 object-cover border"
                      alt="Transcript"
                    />
                    {editingIndex === index && (
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                        onClick={() => handleDeleteImage(index, "transcript")}
                      >
                        <XCircleIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ) : (
                  editingIndex === index && <input type="file" onChange={(e) => handleFileChange(index, "transcript", e.target.files[0])} />
                )}

                {/* CC */}
                {record.cc ? (
                  <div className="relative">
                    <img
                      src={record.cc instanceof File ? URL.createObjectURL(record.cc) : record.cc}
                      className="w-32 h-32 object-cover border"
                      alt="Character Certificate"
                    />
                    {editingIndex === index && (
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                        onClick={() => handleDeleteImage(index, "cc")}
                      >
                        <XCircleIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ) : (
                  editingIndex === index && <input type="file" onChange={(e) => handleFileChange(index, "cc", e.target.files[0])} />
                )}
              </div>

              {/* Edit / Save Button */}
              {editingIndex === index ? (
                <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded" onClick={() => handleSaveRecord(index)} disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </button>
              ) : (
                <button className="mt-4 bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setEditingIndex(index)}>
                  Edit
                </button>
              )}
            </div>
          ))}

          {educationRecords.length < 2 && (
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddRecord}>
              + Add Education
            </button>
          )}
        </>
      
    </div>
  );
};

export default PreviousEducationForm;
