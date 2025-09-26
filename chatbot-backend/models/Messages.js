import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    text: String,
    embedding: { 
        type: [Number],
        index: "knnVector",
        required: true
    }
})

const Message = mongoose.model("Message", messageSchema)
export default Message