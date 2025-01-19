import mongoose from "mongoose";

// Define the job schema
const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    level: { type: String, required: true }, // Corrected "lavel" to "level"
    salary: { type: Number, required: true }, // Changed "number" to "Number"
    date: { type: Number, required: true },
    visible: { type: Boolean, default:true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
});

// Create and export the Job model
const Job = mongoose.model('Job', jobSchema);

export default Job;
