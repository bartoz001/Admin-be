import mongoose from "mongoose";
const uri = "mongodb://localhost:27017/admin"
const connectDB = async () => {
    try {
        const connection = await mongoose.connect(uri, {

        })
        console.log("Connected to DB", connection.connection.host)


    } catch (error) {
        console.log(error)
    }
}
export default connectDB