import express from 'express';
import { getBasicDetails } from '../controllers/studentGetControllers';

const router=express.Router();

router.get('/basic_details',getBasicDetails);

export default router;