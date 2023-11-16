import express, {Request, Response} from "express";

const router = express.Router();
import userController from "../controller/userController";
import {checkAuth} from "../middleware/auth";
import {ApiResponse} from "../response/apiResponse";
import {CodeEnum, ErrorEnum} from "../response/errorEnum";
import JoiValidator from "../middleware/joiValidator";


//exemple de route pour tester le token
// router.get('/:id',checkAuth, userController.getUserById);


router.post('/login',JoiValidator, async (req:Request, res: Response) => {
    try {
        const response: ApiResponse = await userController.login(req.body.username, req.body.password);
        if (response.error) {
            return res.status(response.error.code).json(response.error.message);
        }
        return res.status(CodeEnum.OK).json(response.data);
    } catch (error) {
        return res.status(CodeEnum.INTERNAL_SERVER_ERROR).json(ErrorEnum.INTERNAL_SERVER_ERROR);    }
});
router.get('/all', async(req:Request, res: Response) => {
        try {
            const response : ApiResponse = await userController.getAllUsers();
            if (response.error) {
                return res.status(response.error.code).json(response.error.message);
            }
            return res.status(CodeEnum.OK).json({"users": response.data});
        } catch (error) {
            return res.status(CodeEnum.INTERNAL_SERVER_ERROR).json(ErrorEnum.INTERNAL_SERVER_ERROR);        }
    }
);
router.get('/online', async (req:Request, res: Response) => {
        try {
            const response :ApiResponse = await userController.getOnlineUsers();
            if (response.error) {
                return res.status(response.error.code).json(response.error.message);
            }
            return res.status(CodeEnum.OK).json({"users": response.data});
        } catch (error) {
            console.error(error);
            return res.status(CodeEnum.INTERNAL_SERVER_ERROR).json(ErrorEnum.INTERNAL_SERVER_ERROR);        }
    }
);

module.exports = router;