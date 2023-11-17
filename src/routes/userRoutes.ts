import express, {NextFunction, Request, Response} from "express";

const router = express.Router();
import userController from "../controller/userController";
import {CodeEnum, ErrorEnum} from "../response/errorEnum";
import JoiValidator from "../middleware/joiValidator";
import {IUser} from "../database/Mongo/Models/UserModel";
import {UserResponse} from "../response/userResponse";

router.post('/login', JoiValidator, async (req: Request, res: Response, next: NextFunction) :Promise<Response|undefined> => {
    try {
       const userResponse: UserResponse = await userController.loginOrRegister(req.body.username, req.body.password);
       return res.status(CodeEnum.OK).json(userResponse);
    } catch (error) {
        next(error);
    }
});
router.get('/all', async (req: Request, res: Response, next: NextFunction):Promise<Response|undefined> => {
    try {
        const onlineUsers :IUser[] = await userController.getAllUsers();
        return res.status(CodeEnum.OK).json({"users": onlineUsers});
    } catch (error) {
        next(error);
    }
});

router.get('/online', async (req: Request, res: Response, next: NextFunction) :Promise<Response|undefined> => {
    try {
        const usersId: string[]= Array.from(req.app.locals.socketController.userSocketMap.values())
        const onlineUsers : IUser[] | null = await userController.getUsersByIds(usersId);
        return res.status(CodeEnum.OK).json({"users":onlineUsers});
    } catch (error) {
        next(error);
    }
});

module.exports = router;