import mongoose, {Schema, Document} from "mongoose";

export interface IUser extends Document {
    username: string;
    password: string;
    profilePicId: string;
}

const userSchema: Schema<IUser> = new Schema<IUser>({
    username: {type: String, required: true},
    password: {type: String, required: true},
    profilePicId: {type: String, required: true},
});

const UserModel = mongoose.model<IUser>("user", userSchema);

export default UserModel;
