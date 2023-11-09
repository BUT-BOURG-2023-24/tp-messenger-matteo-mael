import {Request, Response} from "express";
import bcrypt from "bcrypt";
import userModel, {IUser} from "../database/Mongo/Models/UserModel";
import {pickRandom} from "../pictures";
import UserRepository from "../repository/userRepository";

const jwt = require('jsonwebtoken');

const userRepository: UserRepository = new UserRepository();
const EXPIRES_TIME_TOKEN: string = '1h';


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

async function getUserByName(req: Request, res: Response): Promise<Response> {
    try {
        const name: string = req.params.name;
        const user: IUser | null = await userRepository.getUserByName(name);
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        return res.status(200).json(user);
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
        const {username} = req.body;
        const isNewUser: boolean = await checkIfUserExist(username);
        if (!isNewUser) {
            return await signin(req, res);
        } else {
            return await createUser(req, res);
        }
}

async function getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
        const users: IUser[] | null = await userRepository.getAllUsers();
        if (!users || users.length === 0) {
            return res.status(404).json({message: 'User not found'});
        }
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({message: 'Server error'});
    }
}

async function getOnlineUsers(req: Request, res: Response): Promise<Response> {
    //todo
        return res.status(200).json([]);
}
async function createUser(req: Request, res: Response): Promise<Response> {
        const {password, username} = req.body;
        let hashPassword: string = await bcrypt.hash(password, 5);
        const userFromRequest: IUser = new userModel({
            username: username,
            password: hashPassword,
            profilePicId: pickRandom()
        });
        const user: IUser | null = await userRepository.createUser(userFromRequest);
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY, {expiresIn: EXPIRES_TIME_TOKEN});
        return res.status(201).json({
            user,
            "token": token,
            "isNewUser": "true"
        });
}

async function signin(req: Request, res: Response): Promise<Response> {
    try {
        const {password, username} = req.body;
        const user: IUser | null = await userRepository.getUserByName(username);
        if (!user) {
            return res.status(500).json({message: 'login or password incorrect'});
        }
        const passwordMatch: boolean = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(500).json({message: 'login or password incorrect'});
        }
        const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY, {expiresIn: EXPIRES_TIME_TOKEN});
        return res.status(200).json({
            user,
            token,
            "isNewUser": "false"
        });
    } catch (error) {
        return res.status(500).json({message: 'Server error'});
    }
}

async function checkIfUserExist(username: string): Promise<boolean> {
    const user: IUser | null = await userRepository.getUserByName(username);
    if (!user) {
        return true;
    }
    return false;
}


module.exports = {
    createUser,
    getUserById,
    getUserByName,
    getUsersByIds,
    login,
    getAllUsers,
    getOnlineUsers
};

