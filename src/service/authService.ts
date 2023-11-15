import {IUser} from "../database/Mongo/Models/UserModel";

class AuthService{
    private currentAuth: IUser | null = null;

    public getCurrentAuth(): IUser | null {
        return this.currentAuth;
    }

    public setCurrentAuth(user: IUser | null) {
        this.currentAuth = user;
    }
}

const authService = new AuthService();
export default authService;
export type {AuthService};