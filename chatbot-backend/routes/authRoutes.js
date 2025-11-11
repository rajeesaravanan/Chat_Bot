import express from "express"
import { registerController, loginController } from "../controllers/authController.js"
import { googleLoginController } from "../controllers/googleAuthController.js"

const router = express.Router()
 
router.post("/register", registerController)
router.post("/login", loginController)
router.post("/google", googleLoginController)

export default router