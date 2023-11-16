import express, {Request, Response} from "express";

const router = express.Router();
import {ApiResponse} from "../response/apiResponse";
import {CodeEnum, ErrorEnum} from "../response/errorEnum";
import messageController from "../controller/messageController";
import {checkAuth} from "../middleware/auth";
import JoiValidator from "../middleware/joiValidator";
import {ErrorResponse} from "../response/errorResponse";

router.delete("/:id", checkAuth,async (req: Request, res: Response): Promise<ApiResponse> => {
    try {
        if (req.params.id === undefined || req.params.id === null) {
            return new ApiResponse(new ErrorResponse(CodeEnum.BAD_REQUEST, ErrorEnum.USER_NOT_FOUND));
        }
        const response: ApiResponse = await messageController.deleteMessage(req.params.id.toString());

        if (response.error) {
            return new ApiResponse(new ErrorResponse(response.error.code, response.error.message));
        }
        if(response.data === null){
            return new ApiResponse(new ErrorResponse(CodeEnum.NOT_FOUND, ErrorEnum.MESSAGE_NOT_FOUND));
        }
        return new ApiResponse(undefined, response.data);
    } catch (error) {
        return new ApiResponse(new ErrorResponse(CodeEnum.INTERNAL_SERVER_ERROR, ErrorEnum.INTERNAL_SERVER_ERROR));
    }
});

router.put("/:id", JoiValidator,checkAuth,async (req: Request, res: Response) :Promise<ApiResponse> => {
    try {
        if (req.params.id === undefined || req.params.id === null) {
            return new ApiResponse(new ErrorResponse(CodeEnum.BAD_REQUEST, ErrorEnum.USER_NOT_FOUND));
        }
        const response: ApiResponse = await messageController.editMessage(req.params.id.toString(),req.body.newMessageContent);

        if (response.error) {
            return new ApiResponse(new ErrorResponse(response.error.code, response.error.message));
        }
        if(response.data === null){
            return new ApiResponse(new ErrorResponse(CodeEnum.NOT_FOUND, ErrorEnum.MESSAGE_NOT_FOUND));
        }
        return new ApiResponse(undefined, response.data);
    } catch (error) {
        return new ApiResponse(new ErrorResponse(CodeEnum.INTERNAL_SERVER_ERROR, ErrorEnum.INTERNAL_SERVER_ERROR));
    }
});

router.post("/:id", JoiValidator,checkAuth,async (req: Request, res: Response): Promise<ApiResponse> => {
    try {
        if (req.params.id === undefined || req.params.id === null) {
            return new ApiResponse(new ErrorResponse(CodeEnum.BAD_REQUEST, ErrorEnum.USER_NOT_FOUND));
        }
        if (res.locals.userId === undefined || res.locals.userId === null) {
            return new ApiResponse(new ErrorResponse(CodeEnum.BAD_REQUEST, ErrorEnum.USER_NOT_FOUND));
        }
        const response: ApiResponse = await messageController.reactToMessage(req.params.id.toString(),req.body.reaction, res.locals.userId.toString());

        if (response.error) {
            return new ApiResponse(new ErrorResponse(response.error.code, response.error.message));
        }
        if(response.data === null){
            return new ApiResponse(new ErrorResponse(CodeEnum.NOT_FOUND, ErrorEnum.MESSAGE_NOT_FOUND));
        }
        return new ApiResponse(undefined, response.data);
    } catch (error) {
        return new ApiResponse(new ErrorResponse(CodeEnum.INTERNAL_SERVER_ERROR, ErrorEnum.INTERNAL_SERVER_ERROR));
    }
});

module.exports = router;