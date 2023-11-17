import express, {NextFunction, Request, Response} from "express";

const router = express.Router();
import {checkAuth} from "../middleware/auth";
import conversationController from "../controller/conversationController";
import {ApiResponse} from "../response/apiResponse";
import {CodeEnum, ErrorEnum} from "../response/errorEnum";
import JoiValidator from "../middleware/joiValidator";
import {ErrorResponse} from "../response/errorResponse";
import {IConversation} from "../database/Mongo/Models/ConversationModel";
import {IMessage} from "../database/Mongo/Models/MessageModel";
import {Error400} from "../Error/error";

router.get("/", checkAuth, async (req: Request, res: Response,next: NextFunction):Promise<Response|undefined> => {
    try {
        if (res.locals.userId === undefined || res.locals.userId === null) {
          throw new Error400(ErrorEnum.USER_NOT_FOUND);
        }
        const conversations: IConversation[] = await conversationController.getAllConversationsForUser(res.locals.userId.toString());
        return res.status(CodeEnum.OK).json({"conversations": conversations});
    } catch (error) {
        next
        console.error()
    }
});
router.post("/",JoiValidator ,checkAuth, async (req: Request, res: Response): Promise<ApiResponse> => {
    try {
        if (res.locals.userId === undefined || res.locals.userId === null) {
            return new ApiResponse(new ErrorResponse(CodeEnum.BAD_REQUEST, ErrorEnum.USER_NOT_FOUND));
        }
        const response: ApiResponse = await conversationController.createConversation(req.body.concernedUsersIds, res.locals.userId.toString());
        if (response.error) {
            return new ApiResponse(new ErrorResponse(response.error.code, response.error.message));
        }
        return new ApiResponse(undefined, response.data);
    } catch (error) {
        return new ApiResponse(new ErrorResponse(CodeEnum.INTERNAL_SERVER_ERROR, ErrorEnum.INTERNAL_SERVER_ERROR));
    }
});
router.post("/:id", checkAuth, async (req: Request, res: Response, next: NextFunction):Promise<IMessage | undefined> => {
    try {
        if (res.locals.userId === undefined || res.locals.userId === null) {
            throw new Error400(ErrorEnum.USER_NOT_FOUND);
        }
        if(req.params.id === undefined || req.params.id === null){
            throw new Error400(ErrorEnum.CONVERSATION_NOT_FOUND);
        }
        const message: IMessage = await conversationController.addMessageToConversation(req.body.messageContent, req.params.id.toString(), res.locals.userId.toString(), req.body.messageReplyId);
        req.app.locals.socketController.addMessageEvent(req.params.id.toString(),message)
        return message;
    } catch (error) {
        next(error);
    }
});
router.post("/see/:id",checkAuth, async (req: Request, res: Response,next: NextFunction): Promise<IConversation | undefined> => {
    try {
        if (res.locals.userId === undefined || res.locals.userId === null) {
           throw new Error400(ErrorEnum.USER_NOT_FOUND);
        }
        return await conversationController.setConversationSeenForUserAndMessage(req.body.messageId ,req.params.id,res.locals.userId.toString());
    } catch (error) {
        next(error)
    }
});
router.delete("/:id", checkAuth,async (req: Request, res: Response, next: NextFunction): Promise<IConversation | undefined> => {
        try {
            if (req.params.id === undefined || req.params.id === null) {
                throw new Error400(ErrorEnum.USER_NOT_FOUND);
            }
           return await conversationController.deleteConversation(req.params.id.toString());
        } catch (error) {
            next(error)
        }
});
module.exports = router;