import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import config  from "../config.json";

const secret = config.secret

export function validate (req: Request, res: Response, next: NextFunction): any{
    const token = req.header('authorization-token');

    if(!token){
        return res.status(401).send('Acesso negado');
    }
    try {
        const userVerified = jwt.verify(token, secret);
        req.user = userVerified;
        next();
    } catch (error) {
        res.status(401).send('Acesso negado');
    }
}

