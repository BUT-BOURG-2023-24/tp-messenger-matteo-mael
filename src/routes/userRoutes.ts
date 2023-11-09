import express from "express";
const router = express.Router();

import {checkAuth} from "../middleware/auth";
import {userController} from "../controller/userController";

//exemple de route pour tester le token
// router.get('/:id',checkAuth, userController.getUserById);


router.post('/login', userController.login);
router.get('/all', userController.getAllUsers);
router.get('/online', userController.getOnlineUsers);

module.exports = router;