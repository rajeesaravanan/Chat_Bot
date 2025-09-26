import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors";
import connectDB from "./config/db.js";
import messageRoutes from "./routes/messageRoutes.js";
const app = express()

app.use(cors({
  origin: "http://localhost:3000" 
}));
app.use(express.json())
app.use(express.json())

connectDB()

app.use("/api", messageRoutes);


const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))