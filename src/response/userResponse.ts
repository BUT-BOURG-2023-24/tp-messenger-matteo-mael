import {IUser} from "../database/Mongo/Models/UserModel";

export class UserResponse {
    public user: IUser;
    public token: string;
    public isNewUser: boolean;

    constructor(user: IUser, token: string, isNewUser: boolean) {
        this.user = user;
        this.token = token;
        this.isNewUser = isNewUser;
    }
}