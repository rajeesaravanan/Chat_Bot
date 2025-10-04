import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    text: String,
  source: String,   
  createdAt: { type: Date, default: Date.now },
  embedding: { 
    type: [Number],
    index: "knnVector",
    required: true
  }
})

const Message = mongoose.model("Message", messageSchema)
export default Message