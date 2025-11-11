
import { googleLoginService } from "../services/googleAuthService.js"


// export const googleLoginController = async (req, res) => {
//     try {
//         const {token} = req.body
        

//         if(!token){
//             return res.status(400).json({error: "Token is required"})
//         }

//         const response = await googleLoginService(token)
//         res.json(response)
//     }catch(err){
//         res.status(500).json({ error: err.message })
//     }
// }

export const googleLoginController = async (req, res) => {
    try {
        const response = await googleLoginService(req.body.credential)
        res.json(response)
    }catch(err){
        res.status(500).json({ error: err.message })
    }
}

export default { googleLoginController }