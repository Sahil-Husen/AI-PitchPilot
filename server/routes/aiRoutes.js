import express from 'express'
const router = express.Router();
import protectedMiddleware from '../middleware/authMiddleware.js'
// import aiController from '../controllers/aiController.js'
import {generateEmail,getHistory} from '../controllers/aiController.js'


router.post("/generate-email",protectedMiddleware,generateEmail)
router.get("/history",protectedMiddleware,getHistory)

export default router;