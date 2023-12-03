import express, {NextFunction, Request, Response} from "express";

const router = express.Router();
import {CodeEnum, ErrorEnum} from "../response/errorEnum";
import messageController from "../controller/messageController";
import {checkAuth} from "../middleware/auth";
import JoiValidator from "../middleware/joiValidator";
import {IMessage} from "../database/Mongo/Models/MessageModel";
import {Error400} from "../Error/error";
import {IConversation} from "../database/Mongo/Models/ConversationModel";
import conversationController from "../controller/conversationController";

router.delete("/:id", checkAuth,async (req: Request, res: Response,next: NextFunction): Promise<Response| undefined> => {
    try {
        if (req.params.id === undefined || req.params.id === null) {
          throw new Error400(ErrorEnum.MESSAGE_NOT_FOUND);
        }
        const message : IMessage = await messageController.deleteMessage(req.params.id.toString());
        const conversation: IConversation = await conversationController.getConversationFromMessageId(req.params.id.toString());
        req.app.locals.socketController.deletedMessageEvent(conversation.id, message);
        return res.status(CodeEnum.OK).json({"message": message});
    } catch (error) {
       next (error);
    }
});

router.put("/:id", JoiValidator,checkAuth,async (req: Request, res: Response,next: NextFunction) :Promise<Response|undefined> => {
    try {
        if (req.params.id === undefined || req.params.id === null) {
            throw new Error400(ErrorEnum.MESSAGE_NOT_FOUND);
        }
        await messageController.editMessage(req.params.id.toString(),req.body.newMessageContent);
        const conversation: IConversation = await conversationController.getConversationFromMessageId(req.params.id.toString());
        const message : IMessage = await messageController.getMessageById(req.params.id.toString());
        req.app.locals.socketController.editedMessageEvent(conversation.id, message);
        return res.status(CodeEnum.OK).json({"message": message});
    } catch (error) {
        next(error);
    }
});

router.post("/:id", JoiValidator,checkAuth,async (req: Request, res: Response,next: NextFunction): Promise<Response | undefined> => {
    try {
        if (req.params.id === undefined || req.params.id === null) {
            throw new Error400(ErrorEnum.MESSAGE_NOT_FOUND);
        }
        if (res.locals.userId === undefined || res.locals.userId === null) {
           throw new Error400(ErrorEnum.USER_NOT_FOUND);
        }
        const message: IMessage = await messageController.reactToMessage(req.params.id.toString(),req.body.reaction, res.locals.userId.toString());
        const conversation: IConversation = await conversationController.getConversationFromMessageId(req.params.id.toString());
        req.app.locals.socketController.addReactionEvent(conversation.id, message);
        return res.status(CodeEnum.OK).json({"message": message});
    } catch (error) {
        next(error);
    }
});

module.exports = router;