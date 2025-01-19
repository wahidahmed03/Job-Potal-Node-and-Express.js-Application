import mongosse from 'mongoose';

export default async function connectDB() {
    try {
        const conn = await mongosse.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.log('Error connecting to the database', error.message);
    }
}