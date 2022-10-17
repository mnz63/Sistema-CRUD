import { Express, NextFunction, Request, Response } from "express";
import { Router } from "express";
import { validate } from  "../repositories/auth.repository";
import UserRepository from "../repositories/user.repository";

const authorizationRoute = Router();

authorizationRoute.get('/', validate, async (req: Request, res: Response, next: NextFunction)=>{
    const user = req.user
    const selectUser = await UserRepository.getTypeUser(user.username)
    if (selectUser != 'admin') {
        return res.status(401).send('Você não possui permissão!')
    }
    res.status(200).send('Dado visto apenas por admin')
})

export default authorizationRoute