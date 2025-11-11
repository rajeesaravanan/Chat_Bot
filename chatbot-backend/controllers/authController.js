import { registerService, loginService} from "../services/authService.js"

export const registerController = async (req, res)=> {
    try{
       const response = await registerService(req.body)
       res.json(response) 
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

export const loginController = async (req, res) => {
    try{
        const response = await loginService(req.body)
        res.json(response)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}




// export default { registerController, loginController}