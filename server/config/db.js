import mongoose from "mongoose";

const connectDB = async()=>{
    try {

        
        await mongoose.connect(process.env.DB || process.env.MONGO_URI).then(()=>{
            console.log("DB connected Successfully");
        })


    } catch (error) {
        console.log("error in connecting DB",error);
        process.exit(1);

    }
}

export default connectDB;