import type {Database} from "../database/database";
import {Server, Socket} from "socket.io";
import conversationController, {ConversationController} from "../controller/conversationController";
import ConversationModel, {IConversation} from "../database/Mongo/Models/ConversationModel";
import {ApiResponse} from "../response/apiResponse";
import {IMessage} from "../database/Mongo/Models/MessageModel";

export class SocketController {
    public userSocketMap: Map<string, string> = new Map<string, string>();

    constructor(private io: Server, private Database: Database) {
        this.connect();
        this.listenRoomChanged();
    }

    connect() {
        this.io.on("connection", async (socket: Socket) => {
            const optionalUser = socket.handshake.headers.userid;
            const userId = optionalUser as string;
            await this.connectionToSocketRoom(userId, socket);
        });
    }

    private async connectionToSocketRoom(userId: string, socket: Socket) {
        if (userId) {
            this.userSocketMap.set(socket.id, userId);
        }
        const conversations: IConversation[] = await conversationController.getAllConversationsForUser(userId)
        for (const conversation of conversations) {
            socket.join(conversation.id.toString());
        }
    }

    public addMessageEvent(conversationId: string, message: IMessage ): void {
        this.io.to(conversationId).emit("@newMessage", {
            message: message,
        });
    }

    public editedMessageEvent(conversationId: string, message: IMessage ): void {
        this.io.to(conversationId).emit("@messageEdited", {
            message: message,
        });
    }

// Cette fonction vous sert juste de debug.
    // Elle permet de log l'informations pour chaque changement d'une room.
    listenRoomChanged() {
        this.io.of("/").adapter.on("create-room", (room) => {
            console.log(`room ${room} was created`);
        });

        this.io.of("/").adapter.on("join-room", (room, id) => {
            console.log(`socket ${id} has joined room ${room}`);
        });

        this.io.of("/").adapter.on("leave-room", (room, id) => {
            console.log(`socket ${id} has leave room ${room}`);
        });

        this.io.of("/").adapter.on("delete-room", (room) => {
            console.log(`room ${room} was deleted`);
        });
    }
}


