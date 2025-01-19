import express from "express";
import { getAllJobs, getJobById } from "../controller/Job.Controller.js";

const router = express.Router()

router.get('/', getAllJobs)
router.get('/:id', getJobById)





export default router