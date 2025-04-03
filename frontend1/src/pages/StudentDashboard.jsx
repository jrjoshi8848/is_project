import {React,useState,useEffect} from 'react';
import { ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import person from "../assets/person.jpg";
import { fetchEligibality } from './students/services/utility'
import apiClient from '../services/apiClient';



const StudentDashboard = () => {

  const [eligible,setElgible]=useState(false);

const fetchEligibality=async ()=>{
  const response=await apiClient.get('/students/get-eligiablity');
  console.log(response.data)
  setElgible(response.data.eligible)
}

useEffect( ()=>{
  fetchEligibality();
},[])


  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center relative">
      <h1 className="text-4xl font-bold mb-4">Student Dashboard</h1>
      <p className="text-lg mb-4">Welcome to the Student Dashboard!</p>

      
      <div className="flex flex-wrap justify-center">
        <button className="m-2 p-4 bg-white rounded shadow hover:bg-gray-200">
          
          <Link to="/student/dashboard/basic-details" className="mt-2">
            <img src={person} alt="Attendance List" className="cursor-pointer w-32 h-32 hover:opacity-80 transform transition-transform duration-300 ease-in-out hover:scale-110 rounded" />
          </Link>
          <h4>Basic details</h4>
        </button>

        <button className="m-2 p-4 bg-white rounded shadow hover:bg-gray-200">
        <Link to="/student/dashboard/citizenship-details" className="mt-2">
            <img src={person} alt="Attendance List" className="cursor-pointer w-32 h-32 hover:opacity-80 transform transition-transform duration-300 ease-in-out hover:scale-110 rounded" />
          </Link>
          <h4>Citizenship Details</h4>
        </button>

        <button className="m-2 p-4 bg-white rounded shadow hover:bg-gray-200">
        <Link to="/student/dashboard/previous-education" className="mt-2">
            <img src={person} alt="Attendance List" className="cursor-pointer w-32 h-32 hover:opacity-80 transform transition-transform duration-300 ease-in-out hover:scale-110 rounded" />
            </Link>
          <h4>Previous Education</h4>
        </button>

        {eligible && 
        <button className="m-2 p-4 bg-white rounded shadow hover:bg-gray-200">
        <Link to="/student/dashboard/previous-education" className="mt-2">
            <img src={person} alt="Submit form" className="cursor-pointer w-32 h-32 hover:opacity-80 transform transition-transform duration-300 ease-in-out hover:scale-110 rounded" />
            </Link>
          <h4>Previous Education</h4>
        </button>
        }
        
      </div>
      
    </div>
  );
};

export default StudentDashboard;