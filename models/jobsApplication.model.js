import mongoose from "mongoose";

// Define the company schema
const JobsApplicationSchema = new mongoose.Schema({
    userId:{ type: String, ref:"User",required: true  },
    companyId:{   type: mongoose.Schema.Types.ObjectId, ref:"Company",required: true  },
    jobId:{   type: mongoose.Schema.Types.ObjectId, ref:"Job",required: true  },
    status:{ type: String, default:'Pending'},
    date: { type:Number, required:true }
});

// Create and export the Company model
const JobsApplication = mongoose.model('JobsApplication', JobsApplicationSchema);

export default JobsApplication;
