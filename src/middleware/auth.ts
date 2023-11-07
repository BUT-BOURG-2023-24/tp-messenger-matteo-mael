import {JsonWebTokenError} from "jsonwebtoken";

const jwt = require('jsonwebtoken');

import { Request, Response, NextFunction } from 'express';
export function checkAuth(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentification requise' });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY as string) as { userId: string };
        const userId = decodedToken.userId;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token invalide' });
    }
}





