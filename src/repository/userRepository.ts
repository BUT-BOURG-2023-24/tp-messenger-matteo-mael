import UserModel, {IUser} from "../database/Mongo/Models/UserModel";
class UserRepository {

    public getUserById(userId: string): Promise<IUser | null> {
        return UserModel.findById(userId).exec();
    }
    public createUser(newUser: IUser): Promise<IUser | null> {
        return UserModel.create(newUser);
    }

    public getUsersByUsername(username: string): Promise<IUser[] | null> {
        return UserModel.find({username: username});
    }

    public getOneByUsername(username: string): Promise<IUser | null> {
        return UserModel.findOne({ username });
    }

    public getUsersbyIds(listeIds: string[]): Promise<IUser[] | null> {
        return UserModel.find({ _id: { $in: listeIds } });
    }
}

export default UserRepository;