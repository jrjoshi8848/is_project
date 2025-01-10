import express from 'express';
import { getBasicDetails,getCitizenshipDetails,getPreviousEducationDetails,getFullFormDetails } from '../controllers/getStudentControllers.js';


const router=express.Router();

router.get('/basic_details',getBasicDetails);
router.get('/citizenship',getCitizenshipDetails);
router.get('/get-prev-edu',getPreviousEducationDetails);
router.get('/get-form',getFullFormDetails);
export default router;