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
    return this.registrationType !== "Google";
  },
  default: ""
},
registrationType: {
  type: String,
  enum: ["Manual", "Google"],
  default: "Manual"
}

})

const User = mongoose.model("User", userSchema)

export default User