import jwt from 'jsonwebtoken'
import User from '../models/User.models.js'
import dotenv from 'dotenv'
import Company from '../models/Company.models.js'
dotenv.config()

export const protectUser = async (req,res,next) =>{
    const token = req.headers.token
    if (!token) return res.status(500).json({ success: false, message: "Your are Not Login" });
    try {
       const decoded = jwt.verify(token,process.env.JWT_SECRET)
       const UserData = await User.findById(decoded.id).select('-password')
       req.UserData = UserData
       next()
    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: error.message , error });
    }
}


export const protectCompany = async (req,res,next) =>{
    const token = req.headers.token
    if (!token) return res.status(500).json({ success: false, message: "Your are Not Login" });
    try {
       const decoded = jwt.verify(token,process.env.JWT_SECRET)
       if(!decoded.id) return res.status(500).json({ success: false, message: "Your are Not Login" });
       const Companydata = await Company.findById(decoded.id).select('-password')
       req.Company = Companydata
       next()
    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: error.message });

    }
}