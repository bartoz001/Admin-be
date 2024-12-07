import express from 'express';
import { Login,logout,requestUser,updateUser} from '../controllers/auth.js';
// import { isUser } from '../middleware/verify.js';

const router = express.Router();

router.post('/login',Login)
router.post('/logout',logout)
router.put('/updateuser/:id',updateUser)
router.post('/requestuser',requestUser)

export default router;