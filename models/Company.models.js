import mongoose from "mongoose";

// Define the company schema
const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    password: { type: String, required: true },
});

// Create and export the Company model
const Company = mongoose.model('Company', companySchema);

export default Company;
