import authRoutes from "./authRoutes.js"
import messageRoutes from "./messageRoutes.js"


const initializeRoutes = (app)=> {
    app.use('/api/auth', authRoutes)
    app.use('/api/messages', messageRoutes)
}

export default initializeRoutes