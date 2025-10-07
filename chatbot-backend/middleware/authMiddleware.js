import {decodeToken} from "../helpers/jwtHelper.js";

export const verifyToken = (req, res, next) => {
    const userId = decodeToken(req)
    if(!userId){
        return res.status(401).json({ error: "Unauthorized" })
    }
    req.userId = userId
    next()
}

export default verifyToken
