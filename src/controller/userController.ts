import {Request, Response} from "express";
import bcrypt from "bcrypt";
import userModel, {IUser} from "../database/Mongo/Models/UserModel";
import {pickRandom} from "../pictures";
import UserRepository from "../repository/userRepository";

const jwt = require('jsonwebtoken');

const userRepository = new UserRepository();

async function createUser(req: Request, res: Response): Promise<Response> {
    try {
        const {password, username} = req.body;
        let hash: string = await bcrypt.hash(password, 5);
        const user :IUser = new userModel({
            username: username,
            password: hash,
            profilePicId: pickRandom()
        });
        const newUser = await userRepository.createUser(user);
        return res.status(201).json(newUser);
    } catch (error) {
        return res.status(500).json({message: 'Server error'});
    }
}

async function getUserById(req: Request, res: Response): Promise<Response> {
    try {
        const userId: string = req.params.id;
        const user: IUser | null = await userRepository.getUserById(userId);
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({message: 'Server error'});
    }
}

async function getUsersByUsername(req: Request, res: Response): Promise<Response> {
    try {
        const username: string = req.params.username;
        const users: IUser[] | null = await userRepository.getUsersByUsername(username);
        if (!users || users.length === 0) {
            return res.status(404).json({message: 'User not found'});
        }
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({message: 'Server error'});
    }
}

async function getUsersByIds(req: Request, res: Response): Promise<Response> {
    try {
        const users: IUser[] | null = await userRepository.getUsersbyIds(req.body.ids);
        if (!users || users.length === 0) {
            return res.status(404).json({message: 'User not found'});
        }
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({message: 'Server error'});
    }
}

async function login(req: Request, res: Response): Promise<Response> {
    try {
        const {password, username} = req.body;
        const user:IUser|null = await  userRepository.getOneByUsername(username);
        if (!user) {
            return res.status(500).json({message: 'login or password incorrect'});
        }
        const passwordMatch: boolean = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(500).json({message: 'login or password incorrect'});
        }
        const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY, {expiresIn: '1h'});
        return res.status(500).json({token: token});
    } catch (error) {
        return res.status(500).json({message: 'Server error'});
    }
}


module.exports = {
    createUser,
    getUserById,
    getUsersByUsername,
    getUsersByIds,
    login
};


