import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../helpers/jwtHelper.js";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "../validators/validator.js";

export const registerService = async ({ username, email, password }) => {
  
    if (!validateUsername(username)) throw new Error("Username must be 3-20 characters long");
    if (!validateEmail(email)) throw new Error("Invalid email address");
    if (!validatePassword(password)) throw new Error("Password must be at least 6 characters long");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashedPassword });
  await user.save();
  return { message: "User registered successfully" };
};

export const loginService = async ({ email, password }) => {
  if (!validateEmail(email)) throw new Error("Invalid email address");
  if (!validatePassword(password)) throw new Error("Invalid password");

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid password");

  const token = generateToken(user._id);
  return { username: user.username, message: "Login successful", token };
};

export default { registerService, loginService };
