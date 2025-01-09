import express from 'express';
import { getBasicDetails } from '../controllers/controllerstudent.js';
import { getCitizenshipDetails } from '../controllers/controllerstudent.js';

const router=express.Router();

router.get('/basic_details',getBasicDetails);

export default router;