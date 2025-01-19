import express from 'express';
import { ChangeJobAplicationStatus, ChangeVisibility, DeleteCompanyData, getCompanyData,   getCompanyJobApplicates,   getCompanyPostedJob,   LoginCompany,  postjob,  registerCompany } from '../controller/Company.Controller.js';
import { protectCompany } from '../middleware/Auth.middleware.js';
// import upload from '../config/multer.js'

const router = express.Router();

router.post('/register', registerCompany);
router.post('/login', LoginCompany);
router.get('/company', protectCompany, getCompanyData);
router.get('/delete', protectCompany, DeleteCompanyData);

router.post('/post-job', protectCompany, postjob);
router.get('/applicants', protectCompany, getCompanyJobApplicates);
router.get('/list-jobs', protectCompany, getCompanyPostedJob);
router.post('/change-status', protectCompany, ChangeJobAplicationStatus);
router.post('/change-visibility', protectCompany, ChangeVisibility);

export default router;


/// upload.single('image')



