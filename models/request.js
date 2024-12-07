import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }, createdAt: { type: Date, default: Date.now, index: { expires: '7d' } }
}
    , {
        timestamps: true
    })

export default mongoose.model("Request", requestSchema);