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
router.post("/",JoiValidator ,checkAuth, async (req: Request, res: Response,next: NextFunction): Promise<Response| undefined> => {
    try {
        if (res.locals.userId === undefined || res.locals.userId === null) {
            throw new Error400(ErrorEnum.USER_NOT_FOUND);
        }
        const usersId: string[] = req.body.concernedUsersIds;
        usersId.push(res.locals.userId.toString());
        const conversation: IConversation = await conversationController.createConversation(usersId);
        req.app.locals.socketController.newConversationEvent(conversation, usersId);
        return res.status(CodeEnum.OK  ).json({"conversation": conversation});
    } catch (error) {
        next(error)
    }
});
router.post("/:id", checkAuth, async (req: Request, res: Response, next: NextFunction):Promise<Response | undefined> => {
    try {
        if (res.locals.userId === undefined || res.locals.userId === null) {
            throw new Error400(ErrorEnum.USER_NOT_FOUND);
        }
        if(req.params.id === undefined || req.params.id === null){
            throw new Error400(ErrorEnum.CONVERSATION_NOT_FOUND);
        }
        const message: IMessage = await conversationController.addMessageToConversation(req.body.messageContent, req.params.id.toString(), res.locals.userId.toString(), req.body.messageReplyId);
        req.app.locals.socketController.addMessageEvent(req.params.id.toString(),message)
        return res.status(CodeEnum.OK).json({"message": message});
    } catch (error) {
        next(error);
    }
});
router.post("/see/:id",checkAuth, async (req: Request, res: Response,next: NextFunction): Promise<Response | undefined> => {
    try {
        if (res.locals.userId === undefined || res.locals.userId === null) {
           throw new Error400(ErrorEnum.USER_NOT_FOUND);
        }
           if(req.params.id === undefined || req.params.id === null){
                throw new Error400(ErrorEnum.CONVERSATION_NOT_FOUND);
           }
        const conversation:IConversation =  await conversationController.setConversationSeenForUserAndMessage(req.body.messageId ,req.params.id,res.locals.userId.toString());
        req.app.locals.socketController.seenConversationEven(conversation);
        return res.status(CodeEnum.OK).json({"conversation": conversation});
    } catch (error) {
        next(error)
    }
});
router.delete("/:id", checkAuth,async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
        try {
            if (req.params.id === undefined || req.params.id === null) {
                throw new Error400(ErrorEnum.USER_NOT_FOUND);
            }
           const conversation: IConversation= await conversationController.deleteConversation(req.params.id.toString());
            req.app.locals.socketController.deleteConversationEvent(conversation);
            return res.status(CodeEnum.OK).json({"conversation": conversation});
        } catch (error) {
            next(error)
        }
});
module.exports = router;