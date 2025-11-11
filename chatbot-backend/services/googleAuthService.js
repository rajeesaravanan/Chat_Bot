// import { OAuth2Client } from "google-auth-library"

// import User from "../models/User.js"
// import { generateToken } from "../helpers/jwtHelper.js"

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// export const googleLoginService = async (token) => {
//     const ticket = await client.verifyIdToken({
//         idToken: token,
//         audience: process.env.GOOGLE_CLIENT_ID,
//     })

//     const payload = ticket.getPayload()
//     const { email, name } = payload

//     let user = await User.findOne({ email })
//     if (!user){
//         user = await User.create({ username: email.split("@")[0],
//             email,
//             password:"",
//             registrationType: "Google"
//         })
//     }

//     const jwtToken = generateToken(user._id)

//     return { 
//         message: "Google Login successful",
//         username: user.username,
//         token: jwtToken
// }
// }

// export default { googleLoginService }


import jwt from "jsonwebtoken"
import User from "../models/User.js"
import { OAuth2Client } from "google-auth-library"
import { generateToken } from "../helpers/jwtHelper.js"

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export const googleLoginService = async (credential) => {
    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    const { email, name } = payload

    let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ 
            username: email.split("@")[0],
            email,
            password: "",
            registrationType: "Google",
        })
    }
    const token = generateToken(user._id)
    return {
        username: user.username,
        message: "Login successful", token
    }
}
