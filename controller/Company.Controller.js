import Company from "../models/Company.models.js";
import Job from "../models/Job.model.js";

import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import generateToken from "../utils/generateToken.js";
import JobsApplication from "../models/jobsApplication.model.js";

// Company registration
export const registerCompany = async (req, res) => {
    const { name, email, password } = req.body;
    // const imageFile = req.file;  || !imageFile

    if (!name || !email || !password   ) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        // Check if the company already exists
        const companyExists = await Company.findOne({ email });
        if (companyExists) {
            return res.status(400).json({ success: false, message: "Account already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Upload image to Cloudinary
        // const imageUpload = await cloudinary.uploader.upload(imageFile.path);

        // Create new company
        const company = await Company.create({
            name,
            email,
            password: hashedPassword,
            image: "imageUpload.secure_url",
        });

        // Respond with success
        res.status(200).json({
            success: true,
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image,
            },
            token: generateToken(company._id),
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};




/// COMPANY LOGIN
export const LoginCompany = async (req,res)=>{

    const {  email, password } = req.body;

    if (!email || !password ) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        // Check if the company already exists
        const company = await Company.findOne({ email });
        if (!company)  return res.status(400).json({ success: false, message: "Account Have't exists" });
        const UserPassword = await bcrypt.compare(password,company.password)
        if(!UserPassword) return res.status(400).json({ success: false, message: "Password Not Match" });

        if (UserPassword){
            return  res.status(200).json({ success: true,
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image,
            },
            token: generateToken(company._id),
        }); }

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }

}

// COMPANY DATA
export const getCompanyData = async (req,res) =>{
    try {
        const company = req.Company
        res.status(200).json({ success: true, company })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message });
    }

}

// COMPANY DELETE
export const DeleteCompanyData = async (req,res) =>{
    try {
        const companyData = req.Company
        await Company.findByIdAndDelete(companyData._id);
        return res.status(200).json({ success: true, message:"Company Delete Success"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message });
    }

}

// POST A JOBS

export const postjob = async (req,res) =>{

    const { title, description, location, salary,category,level } = req.body;
    const companyId = req.Company._id;
    try {
        const newJob = new Job({
            title,
            description,
            location,
            salary,
            companyId:companyId,
            category,
            level,
            date:Date.now()
        })

        await newJob.save()
        res.status(200).json({ success: true,  newJob })
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }

}


// GEY COMPANY APLICANTES
export const getCompanyJobApplicates = async (req,res) =>{
    const companyId = req.Company._id;
    try {
        const applications = await JobsApplication.find({companyId}).populate('userId', 'name image resume').populate('jonId','title location category lavel salary').exec()
        return res.status(200).json({ success: true, applications})
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message, error });

    }
}

// GEY POST JOBS
export const getCompanyPostedJob = async (req,res) =>{
    try {
        const companyId = req.Company._id;
        const jobs = await Job.find({companyId})

        const jobsData = await Promise.all(jobs.map(async (job) => {
            const Applicants = await JobsApplication.find({ jobId: job._id });
            return { ...job.toObject(), Applicants: Applicants.length };
        }));

        res.status(200).json({ success: true, jobsData })
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// CHANGE JOB STATTUS
export const ChangeJobAplicationStatus = async (req,res) =>{
    try {
        const { id, status} =req.body
        await JobsApplication.findOneAndUpdate({_id:id},{status}) 
        const changeJobApplicationStatusUpdate = await JobsApplication.findOne({ _id: id });
        res.status(200).json({ success: true, message:"change Success ", changeJobApplicationStatusUpdate })
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// CHANGE JOB VISIVILYTY
export const ChangeVisibility = async (req,res) =>{
const { id } = req.body;
const companyId =  req.Company._id;
    try {
        const job = await Job.findById(id)
        if(companyId.toString() === job.companyId.toString()){
            job.visible = !job.visible;
            await job.save();
        }
        res.status(200).json({ success: true, job })
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }

}





