import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors";
import connectDB from "./config/db.js";
import initializeRoutes from "./routes/index.js";
const app = express()

app.use(cors({
  origin: "http://localhost:3000" 
}));


app.use(express.json())


connectDB()

initializeRoutes(app);

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))