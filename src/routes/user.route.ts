import { NextFunction, Request, Response } from "express";
import { Router } from "express";
import UserRepository from "../repositories/user.repository";
import  bcrypt  from "bcryptjs";
import  jwt  from "jsonwebtoken";
import config  from "../config.json";

const secret = config.secret

const usersRoute = Router();

usersRoute.get('/users', async (req: Request, res: Response, next: NextFunction) => {

    const user = await UserRepository.getAllUsers()
    res.status(200).send(user);
});


usersRoute.post('/register', async (req: Request, res: Response, next: NextFunction)=>{

    const user = req.body
    const selectUser = await UserRepository.getUserByUsername(user)

    if(selectUser) 
        return res.status(500).send('User already exists')
     
    const newUser = await UserRepository.create(user);
    res.status(200).send(newUser);
});

usersRoute.post('/login', async (req: Request, res: Response, next: NextFunction) =>{

    const user = req.body
    const selectUser = await UserRepository.getUserByUsername(user.username)

    if(!selectUser)
        return res.status(500).send('Email ou senha incorretos')
    
    const password = req.body.password
    const cryptPassword = await UserRepository.getPassword(user.username)
    const decryptPassword = bcrypt.compareSync(password, cryptPassword)

    if(!decryptPassword) 
        return res.status(500).send('Email ou senha incorretos')
        

    const token = jwt.sign({username: selectUser.username, user_type: selectUser.user_type}, secret);

    res.header('authorization-token', token)
    res.status(200).send('Login feito com sucesso!')
});

usersRoute.delete('/delete', async (req: Request, res: Response) =>{
    const user = req.body

    try {
        await UserRepository.deleteUser(user.username)
        res.send('Usuário deletado com sucesso')
    } catch (error) {
        console.log(error)
    }
});

usersRoute.put('/update', async (req: Request, res: Response) =>{
    const user = req.body
    const updateUser = await UserRepository.updateUser(user, user.newname)
    res.status(200).send(updateUser)
})


export default usersRoute;