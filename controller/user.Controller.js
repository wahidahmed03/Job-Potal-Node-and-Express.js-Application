import bcrypt from 'bcrypt';
import User from '../models/User.models.js'
import generateToken from '../utils/generateToken.js';


export const CreateUserAccount = async (req,res)=>{
    const {name,email,password } = req.body;
    const imageFile = req.file;
    // console.log(imageFile)    || !imageFile 
    if (!name || !email || !password  ) return res.status(400).json({ success: false, message: "All fields are required" });
    try {
        // CHEACK USER ALL READY CREATE BY MAIL
        const  UserExist = await User.findOne({ email });
        if(UserExist)  return res.status(400).json({ success: false, message: "Account already exists" });
        
        // MAKE PASSWORK HASH
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // UPLOAD IMAGE
        // const imageUpload = await cloudinary.uploader.upload(imageFile.path);

        // CREATE USER IN DATABASE
        const UserCreate = await User.create({
            name,
            email,
            password: hashedPassword,
            image: "imageUpload.secure_url",
        });

        return res.status(200).json({
            success: true,
            UserData: {
                _id: UserCreate._id,
                name: UserCreate.name,
                email: UserCreate.email,
                image: UserCreate.image,
            },
            token: generateToken(UserCreate._id),
        });



    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message, error });
    }
}


export const UserLoginAccount =async (req,res)=>{
    /// USER INFORMATION SEND BY USER
    const {email, password } = req.body;
    if (!email || !password ) return res.status(400).json({ success: false, message: "All fields are required" });
    try {
        // CHEAK USER EXIST
        const UserExist = await User.findOne({ email });
        console.log(UserExist)
        if (!UserExist)  return res.status(400).json({ success: false, message: "HAVE'N ACCOUNT. PLACE CREATE ACCOUNT" });

        /// MATCH USER PASSWORD
        const MatchUserPassword = await bcrypt.compare(password,UserExist.password)
        if(!MatchUserPassword) return res.status(400).json({ success: false, message: "Password Not Match" });

        if(MatchUserPassword){
         return res.status(200).json({ success: true,
            UserData: {
                    _id: UserExist._id,
                    name: UserExist.name,
                    email: UserExist.email,
                    image: UserExist.image,
                },
                token: generateToken(UserExist._id),
            });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message, error });
    }
}


// GET USER DATA
export const getUserData = async (req,res) =>{
    try {
        const UserData = req.UserData
        return res.status(200).json({ success: true, UserData })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message });
    }
}

// GET USER DATA DELETE
export const DeleteUserData = async (req,res) =>{
    try {
        const UserData = req.UserData
        await User.findByIdAndDelete(UserData._id);
        return res.status(200).json({ success: true, message:"User Delete"  })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message });
    }
}


export const UserHandleByGoogle = async (req, res) => {
    
    try {
        const { data, type } = req.body;
        switch (type) {
            case "user.created": {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`, 
                    image: data.image_url,
                    resume: "",
                };

                await User.create(userData);
                res.json({});
                break
            }

            case "user.updated": {
                const updatedData = {
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    image: data.image_url,
                    resume: "",
                };

                await User.findByIdAndUpdate(data.id, updatedData);
                res.json( {});
                break
            }

            case "user.deleted": {
                await User.findByIdAndDelete(data.id);
                res.json( {});
                break
            }

            default: {
                break
            }
        }
    } catch (error) {
        console.error("Error handling webhook:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};