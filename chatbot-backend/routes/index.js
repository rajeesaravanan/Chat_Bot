import authRoutes from "./authRoutes.js"
import messageRoutes from "./messageRoutes.js"
import conversationRoutes from "./conversationRoutes.js"


const initializeRoutes = (app)=> {
    app.use('/api/auth', authRoutes)
    app.use('/api/messages', messageRoutes)
    app.use('/api/conversations', conversationRoutes)
}

export default initializeRoutes