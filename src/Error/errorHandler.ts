import {ApiError} from "./error";
import {ApiResponse} from "../response/apiResponse";
import {ErrorResponse} from "../response/errorResponse";
import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";

export function ErrorHandler(err: Error,req: Request, res: Response, next: NextFunction) {
    if (err instanceof ApiError) {
        return res.status(err.code).json({ error: err.message });
    }
    console.log(err);
    return res.status(500).json({ error: 'Erreur interne du serveur' });
};