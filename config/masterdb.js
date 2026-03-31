import mongoose from 'mongoose';

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL, {
        maxPoolSize: 20,
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000
        });
        console.log(`✅ MongoDB Connected`);

    } catch (err) {
        console.log('MongoDB Connected error:', err);
        process.exit(1);
    }
};

export default connectDB;