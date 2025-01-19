import Job from "../models/Job.model.js"

export const getAllJobs = async (req, res)=>{
    try {
        const jobs = await Job.find({ visible: true }).populate({ path: 'companyId', select: '-password' });
        res.status(200).json({ success: true, jobs  });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message });
    }

}

export const getJobById = async (req, res)=>{
    try {
        const { id} = req.params
        const job = await Job.findById(id).populate({ path: 'companyId', select: '-password' });
        if(!job) return res.status(404).json({ success: false, message: 'Job Not Found '});

        return res.status(200).json({ success: true, job  });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message });
    }
}