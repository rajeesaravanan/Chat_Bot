import dotenv from "dotenv"
dotenv.config()

import User from "../models/User.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../helpers/jwtHelper.js";

export const registerService = async ({ username, email, password }) => {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ username, email, password: hashedPassword })
    await user.save()
    return { message: "User registered successfully"}
}

export const loginService = async ({ email, password })=> {
    const user = await User.findOne({ email })
    if(!user) throw new Error("User not found")
    
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) throw new Error ("Invalid password")

            const token = generateToken(user._id); 
  return { username: user.username, message: "Login successful", token };
};

export default { registerService, loginService }