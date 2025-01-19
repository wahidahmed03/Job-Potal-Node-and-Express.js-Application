import express from "express";
import { CreateUserAccount, DeleteUserData, getUserData, UserHandleByGoogle, UserLoginAccount } from "../controller/user.Controller.js";
import { protectUser } from "../middleware/Auth.middleware.js";

const router = express.Router();


/// USER AUTH ROUTE
router.post('/register', CreateUserAccount)
router.post('/login', UserLoginAccount)
router.get('/user', protectUser, getUserData)
router.get('/userdelete', protectUser, DeleteUserData)


router.get('/google', UserHandleByGoogle)




export default router