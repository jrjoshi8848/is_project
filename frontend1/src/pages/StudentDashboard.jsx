import React from 'react';
import { ToastContainer } from 'react-toastify';

const StudentDashboard = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer/>
      <h1 className="text-2xl font-bold">Student Dashboard</h1>
    </div>
  );
};

export default StudentDashboard;
