import express from "express";
import { getFullFormDetailswithId ,getFilteredForms} from "../controllers/adminController.js";
import { authorize } from "../middlewares/authorize.js";

const router=express.Router();

router.get('/getforms',authorize('Admin'),getFilteredForms);
router.get('/getformdetails',authorize('Admin'),getFullFormDetailswithId);



export default router;