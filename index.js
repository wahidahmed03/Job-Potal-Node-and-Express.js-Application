import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from './config/db.js';

/// INTER FILE 
import userRouter from './routes/user.routes.js'
import CompanyRoutes from './routes/Company.Routes.js'
import JobRoutes from './routes/Job.Routes.js'


dotenv.config()
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is working');
});

// MAIN ROUTING
app.use('/api/users', userRouter);
app.use('/api/company', CompanyRoutes );
app.use('/api/jobs', JobRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB()
});