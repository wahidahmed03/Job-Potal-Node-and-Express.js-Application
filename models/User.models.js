import mongoose from "mongoose";

// Define the user schema
const userSchema = new mongoose.Schema({
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    name: {  type: String,  required: true },
    email: {  type: String,  required: true, unique: true },
    resume: {  type: String,  },
    image: {  type: String,  required: true  },
    password: { type: String, required: true },
});

// Create and export the User model
const User = mongoose.model('User', userSchema);
export default User;
