import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors";
import connectDB from "./config/db.js";
import initializeRoutes from "./routes/index.js";
const app = express()

app.use(cors({
  origin: [
    "http://localhost:3000",
    // local network IPs on port 3000
    /^http:\/\/192\.168\.\d+\.\d+:3000$/,
    /^http:\/\/\d+\.\d+\.\d+\.\d+:3000$/,
    // allow ngrok HTTPS domains (common patterns)
    /^https?:\/\/.*\.ngrok\.io$/,
    /^https?:\/\/.*\.ngrok-free\.app$/
  ]
}));


app.use(express.json())



connectDB()

initializeRoutes(app);

const PORT = 8080; 
const HOST = "0.0.0.0";
app.listen(PORT, HOST, () => {
  console.log(`Backend server running at:`);
  console.log(`- Local: http://localhost:${PORT}`);
  console.log(`- Network: http://192.168.1.128:${PORT}`);
});
