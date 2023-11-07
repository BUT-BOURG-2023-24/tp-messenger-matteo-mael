import express from "express";

const userRouter = express.Router();

const userController = require("../controller/userController");

import { checkAuth } from "../middleware/auth";

//exemple de route pour tester le token
// router.get('/:id',checkAuth, userController.getUserById);
userRouter.post("/login", userController.login);

export default userRouter;
