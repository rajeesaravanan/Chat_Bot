import jwt from "jsonwebtoken"

export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export const decodeToken = (req) => {
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer "))
        return null

    try{
        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        return decoded.userId
    }catch(err){
        console.error("Invalid token:", err.message)
        return null
    }
}

