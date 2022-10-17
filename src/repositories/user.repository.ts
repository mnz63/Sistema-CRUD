import db from "../db";
import User from "../models/user.model";
import  bcrypt  from "bcryptjs";
import { Request, Response } from "express";

class UserRepository {

    async getAllUsers(): Promise<User[]> {
        const query = `SELECT id_user, username FROM usuarios`;

        const { rows } = await db.query<User>(query)
        return rows || []
    }

    async getUserByUsername(username:string): Promise<User>{
        const query = `SELECT id_user, username FROM usuarios WHERE username = $1`
        const values = [username]

        const { rows } = await db.query<User>(query, values)
        const [user] = rows

        return user
    }

    async create(user: User): Promise<User>{
        const script = `INSERT INTO usuarios (username, password)
        VALUES ($1, $2)
         RETURNING username, id_user
         `
        const values = [user.username, bcrypt.hashSync(user.password)]
            
        const { rows } = await db.query<User>(script, values)
        const [newUser] = rows
    
        return newUser
    }


    async getPassword(user: string): Promise<string>{

        const query = `SELECT username, password FROM usuarios
        WHERE username = $1`

        const values = [user]
        const { rows } = await db.query<User>(query, values)
        const [password] = rows.map(row=>{
            return row.password
        })
        return password
    }

    async getTypeUser(user: string): Promise<string>{
        
        const query = `SELECT user_type, username FROM usuarios
        WHERE username = $1
        `
        const values = [user]
        const {rows} = await db.query<User>(query, values)
        const [user_type] = rows

        return user_type.user_type
    }

    async deleteUser(user: string): Promise<void>{
        const script = `DELETE FROM usuarios 
        WHERE username = $1`

        const values = [user]
        await db.query<User>(script, values)

        return 
    }

    async updateUser(user: User, username: string): Promise<User>{
        const script = `UPDATE usuarios SET username = $2 WHERE username = $1`

        const values = [user.username, username]
        const {rows} = await db.query<User>(script, values)
        const [updateUser] = rows

        return updateUser
    }
}

export default new UserRepository()