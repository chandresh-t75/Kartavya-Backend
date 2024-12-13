import mongoose from 'mongoose';

const connectDB = async () => {
    // console.log(process.env.MONGO_URI)
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.bold);
    } catch (error) {
        console.error(`Error: ${error.message}`.red.bold);
        process.exit(1);
    }
}

export default connectDB;