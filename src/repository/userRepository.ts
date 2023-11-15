import UserModel, {IUser} from "../database/Mongo/Models/UserModel";
import {MongooseID} from "../types";
class UserRepository {

    public getUserById(userId: string): Promise<IUser | null> {
        return UserModel.findById(userId).exec();
    }
    public createUser(newUser: IUser): Promise<IUser | null> {
        return UserModel.create(newUser);
    }


    public getUserByName(username: string): Promise<IUser | null> {
        return UserModel.findOne({ username });
    }

    public getUsersbyIds(listeIds: MongooseID[]): Promise<IUser[] | null> {
        return UserModel.find({ _id: { $in: listeIds } });
    }
    public getAllUsers(): Promise<IUser[] | null> {
        return UserModel.find();
    }
}

const userRepository: UserRepository = new UserRepository();
export default userRepository;
export type {UserRepository}