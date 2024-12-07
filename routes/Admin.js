import express from 'express'
const router = express.Router()
import {getuser,deleteUser,createuser,getadmin, getrequest, acceptrequest, deleterequest, switchadmin} from '../controllers/admin.js'
import { isAdmin } from '../middleware/verify.js'


router.get('/getuser',isAdmin,getuser)
router.get('/getrequest',isAdmin,getrequest)
router.delete('/deleteuser/:userId',isAdmin,deleteUser)
router.post('/createuser',isAdmin,createuser)
router.get('/getadmin',isAdmin,getadmin)
router.patch('/updateadmin/:userId',isAdmin,switchadmin)
router.delete("/deleterequest/:id",isAdmin,deleterequest)
router.post("/acceptrequest/:id",isAdmin,acceptrequest)

export default router