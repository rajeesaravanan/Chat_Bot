import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function() {
    return this.authType === "M"; 
  }
    },
    authType: {
        type: String,
        enum: ['M', 'G'],
        default: 'M'
    }


}, { timestamps: true })

const User = mongoose.model("User", userSchema)

export default User