import bcrypt from "bcrypt";
import userModel, {IUser} from "../database/Mongo/Models/UserModel";
import {pickRandom} from "../pictures";
import userRepository from "../repository/userRepository";
import {UserResponse} from "../response/userResponse";
import {ErrorEnum} from "../response/errorEnum";
import {Error400, Error500} from "../Error/error";

const jwt = require('jsonwebtoken');

class UserController {
    private readonly EXPIRES_TIME_TOKEN: string = '1h';

    public async getAllUsers(): Promise<IUser[]> {
        return await userRepository.getAllUsers();
    }

    public async getUserById(userId: string): Promise<IUser | null> {
          return await userRepository.getUserById(userId);
    }

    public async getUserByName(username: string): Promise<IUser | null> {
        return await userRepository.getUserByName(username);
    }

    public async getUsersByIds(usersId: string[]): Promise<IUser[]> {
        return await userRepository.getUsersbyIds(usersId);
    }

    public async loginOrRegister(username: string, password: string): Promise<UserResponse> {
        const isNewUser: IUser | null = await this.checkIfUserExist(username);
        if (isNewUser === null) {
            return await this.createUser(username, password);
        }
        return await this.login(isNewUser, password);
    }

    public async createUser(username: string, password: string): Promise<UserResponse> {
        let hashPassword: string = await bcrypt.hash(password, 5);
        const userFromRequest: IUser = new userModel({
            username: username,
            password: hashPassword,
            profilePicId: pickRandom()
        });
        const user: IUser | null = await userRepository.createUser(userFromRequest);
        if (!user) {
            throw new Error500(ErrorEnum.INTERNAL_SERVER_ERROR);
        }
        const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY, {expiresIn: this.EXPIRES_TIME_TOKEN});
        return new UserResponse(user, token, true);
    }

    public async login(user: IUser, password: string): Promise<UserResponse> {
        const passwordMatch: boolean = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new Error400(ErrorEnum.LOGIN_PASSWORD_NOT_MATCH);
        }
        const token = jwt.sign({userId: user?._id}, process.env.SECRET_KEY, {expiresIn: this.EXPIRES_TIME_TOKEN});
        return new UserResponse(user, token, false);
    }

    public async checkIfUserExist(username: string): Promise<IUser | null> {
        const user: IUser | null = await userRepository.getUserByName(username);
        if (!user) {
            return null;
        }
        return user;
    }
}

let userController: UserController = new UserController();
export default userController;
export type {UserController};


