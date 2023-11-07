import express from "express";
const router = express.Router();

const userController = require('../controller/userController');

import {checkAuth} from "../middleware/auth";

//exemple de route pour tester le token
// router.get('/:id',checkAuth, userController.getUserById);
router.post('/login', userController.login);

module.exports = router;