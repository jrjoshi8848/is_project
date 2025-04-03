import apiClient from "../../../services/apiClient";

export const fetchPreviousEducation = async () => {
  try {
    const response = await apiClient.get('/students/get-prev-edu');
    return response.data.data; 
  } catch (error) {
    console.error('Error fetching previous education:', error);
    return [];
  }
};

export const savePreviousEducation = async (formData) => {
  try {
    const response = await apiClient.post('/students/prev-edu', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error saving previous education:', error);
    throw error;
  }
};

export const fetchEligibality=async ()=>{
 try{
 const response=await apiClient.get('/students/get-eligiablity');
 return response.data 
 }catch(error){
  console.log(error);
  throw error;
 }
};