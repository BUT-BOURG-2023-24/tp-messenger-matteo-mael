import express from "express";
const router = express.Router();

import {checkAuth} from "../middleware/auth";
import userController from "../controller/userController";

//exemple de route pour tester le token
// router.get('/:id',checkAuth, userController.getUserById);


router.post('/login', userController.login);
router.get('/all', checkAuth,userController.getAllUsers);
router.get('/online', checkAuth,userController.getOnlineUsers);

module.exports = router;