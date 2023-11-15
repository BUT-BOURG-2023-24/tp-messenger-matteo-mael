import express, {Request, Response} from "express";

const router = express.Router();
import {checkAuth} from "../middleware/auth";
import conversationController from "../controller/conversationController";
import {ApiResponse} from "../response/apiResponse";
import {CodeEnum, ErrorEnum} from "../response/errorEnum";
import {Error} from "mongoose";

router.get("/", checkAuth, async (req: Request, res: Response) => {
    try {
        if (res.locals.userId === undefined || res.locals.userId === null) {
            return res.status(CodeEnum.BAD_REQUEST).json({ErrorEnum: ErrorEnum.USER_NOT_FOUND});
        }
        const response: ApiResponse = await conversationController.getAllConversationsForUser(res.locals.userId.toString());
        if (response.error) {
            res.status(response.error.code).json(response.error.message);
        }
        res.status(CodeEnum.OK).json(response.data);
    } catch (error) {
        res.status(CodeEnum.INTERNAL_SERVER_ERROR).json(ErrorEnum.INTERNAL_SERVER_ERROR);
    }
});
router.post("/", checkAuth, async (req: Request, res: Response) => {
    try {
        if (res.locals.userId === undefined || res.locals.userId === null) {
            return res.status(CodeEnum.BAD_REQUEST).json({ErrorEnum: ErrorEnum.USER_NOT_FOUND});
        }
        const response: ApiResponse = await conversationController.createConversation(req.body.concernedUsersIds, res.locals.userId.toString());
        if (response.error) {
            return res.status(response.error.code).json(response.error.message);
        }
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(CodeEnum.INTERNAL_SERVER_ERROR).json(ErrorEnum.INTERNAL_SERVER_ERROR);
    }
});
router.post("/:id", checkAuth, async (req: Request, res: Response) => {
    try {
        if (res.locals.userId === undefined || res.locals.userId === null) {
            return res.status(CodeEnum.BAD_REQUEST).json({ErrorEnum: ErrorEnum.USER_NOT_FOUND});
        }
        const response: ApiResponse = await conversationController.addMessageToConversation(req.body.messageContent, req.params.id.toString(), res.locals.userId.toString(), req.body.messageReplyId)
        if (response.error) {
            res.status(response.error.code).json(response.error.message);
        }
        res.status(200).json(response.data);
    } catch (error) {
        return res.status(CodeEnum.INTERNAL_SERVER_ERROR).json(ErrorEnum.INTERNAL_SERVER_ERROR);
    }
});
router.post("/see/:id",checkAuth, async (req: Request, res: Response) => {
    try {
        if (res.locals.userId === undefined || res.locals.userId === null) {
            return res.status(CodeEnum.BAD_REQUEST).json({ErrorEnum: ErrorEnum.USER_NOT_FOUND});
        }
        const response: ApiResponse = await conversationController.setConversationSeenForUserAndMessage(req.body.messageId ,req.params.id,res.locals.userId.toString());
        if (response.error) {
            res.status(response.error.code).json(response.error.message);
        }
        res.status(200).json(response.data);
    } catch (error) {
        return res.status(CodeEnum.INTERNAL_SERVER_ERROR).json(ErrorEnum.INTERNAL_SERVER_ERROR);
    }
});
router.delete("/:id", conversationController.deleteConversation);

module.exports = router;