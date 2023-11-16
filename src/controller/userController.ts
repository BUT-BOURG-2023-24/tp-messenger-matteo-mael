import {Request, Response} from "express";
import bcrypt from "bcrypt";
import userModel, {IUser} from "../database/Mongo/Models/UserModel";
import {pickRandom} from "../pictures";
import {SocketController} from "../socket/socketController";
import userRepository from "../repository/userRepository";
import {UserResponse} from "../response/userResponse";
import {CodeEnum, ErrorEnum} from "../response/errorEnum";
import {ApiResponse} from "../response/apiResponse";
import {ErrorResponse} from "../response/errorResponse";

const jwt = require('jsonwebtoken');

class UserController {
    private static readonly EXPIRES_TIME_TOKEN: string ='1h';
    public async getOnlineUsers(): Promise<ApiResponse> {
        try {
            const userIds: string[] = Array.from(SocketController.userSocketMap.values());
            const users: IUser[] | null = await userRepository.getUsersbyIds(userIds);
            return new ApiResponse(undefined,users);
        } catch (error) {
            return new ApiResponse(new ErrorResponse(CodeEnum.INTERNAL_SERVER_ERROR,ErrorEnum.INTERNAL_SERVER_ERROR));
        }
    }

    public async getUserById(req: Request, res: Response): Promise<ApiResponse> {
        try {
            const userId: string = req.params.id;
            const user: IUser | null = await userRepository.getUserById(userId);
            if (!user) {
              return new ApiResponse(new ErrorResponse(CodeEnum.NOT_FOUND,ErrorEnum.USER_NOT_FOUND));
            }
          return new ApiResponse(undefined,user);
        } catch (error) {
           return new ApiResponse(new ErrorResponse(CodeEnum.INTERNAL_SERVER_ERROR,ErrorEnum.INTERNAL_SERVER_ERROR));
        }
    }

    public async getUserByName(req: Request, res: Response): Promise<ApiResponse> {
        try {
            const name: string = req.params.name;
            const user: IUser | null = await userRepository.getUserByName(name);
            if (!user) {
                return new ApiResponse(new ErrorResponse(CodeEnum.NOT_FOUND,ErrorEnum.USER_NOT_FOUND));
            }
            return new ApiResponse(undefined,user);
        } catch (error) {
            return new ApiResponse(new ErrorResponse(CodeEnum.INTERNAL_SERVER_ERROR,ErrorEnum.INTERNAL_SERVER_ERROR));
        }
    }

    public async getUsersByIds(usersId:string[]): Promise<IUser[] | null> {
            return await userRepository.getUsersbyIds(usersId);
    }

    public async login(username: string, password: string): Promise<ApiResponse> {
        const isNewUser: boolean = await UserController.checkIfUserExist(username);
        if (!isNewUser) {
            return await UserController.signin(username, password);
        } else {
            return await UserController.createUser(username, password);
        }
    }

    public async getAllUsers(): Promise<ApiResponse> {
        try {
            const users: IUser[] | null = await userRepository.getAllUsers();
            return new ApiResponse(undefined,users);
        } catch (error) {
            return new ApiResponse(new ErrorResponse(CodeEnum.INTERNAL_SERVER_ERROR,ErrorEnum.INTERNAL_SERVER_ERROR));
        }
    }

    public static async createUser(username: string, password: string): Promise<ApiResponse> {
        try {
            let hashPassword: string = await bcrypt.hash(password, 5);
            const userFromRequest: IUser = new userModel({
                username: username,
                password: hashPassword,
                profilePicId: pickRandom()
            });
            const user: IUser | null = await userRepository.createUser(userFromRequest);
            if (!user) {
                return new ApiResponse(new ErrorResponse(CodeEnum.INTERNAL_SERVER_ERROR,ErrorEnum.INTERNAL_SERVER_ERROR))
            }
            const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY, {expiresIn: this.EXPIRES_TIME_TOKEN});
            return new ApiResponse(undefined,new UserResponse(user, token, true));
        } catch (error) {
            return new ApiResponse(new ErrorResponse(CodeEnum.INTERNAL_SERVER_ERROR,ErrorEnum.INTERNAL_SERVER_ERROR))
        }
    }

    public static async signin(username: string, password: string): Promise<ApiResponse> {
        const user: IUser | null = await userRepository.getUserByName(username);
        if (!user) {
            return new ApiResponse(new ErrorResponse(CodeEnum.BAD_REQUEST,ErrorEnum.LOGIN_PASSWORD_NOT_MATCH));
        }
        const passwordMatch: boolean = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return new ApiResponse(new ErrorResponse(CodeEnum.BAD_REQUEST,ErrorEnum.LOGIN_PASSWORD_NOT_MATCH));
        }
        const token = jwt.sign({userId: user?._id}, process.env.SECRET_KEY, {expiresIn: this.EXPIRES_TIME_TOKEN});
        return new ApiResponse(undefined,new UserResponse(user, token, false));

    }

    public static async checkIfUserExist(username: string): Promise<boolean> {
        const user: IUser | null = await userRepository.getUserByName(username);
        if (!user) {
            return true;
        }
        return false;
    }
}

let userController: UserController = new UserController();
export default userController;
export type {UserController};


