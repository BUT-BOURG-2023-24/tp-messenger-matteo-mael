import * as http from "http";
import express from "express";
import {Server} from "socket.io";
import {Database} from "./database/database";
import {SocketController} from "./socket/socketController";
import mongoose from "mongoose";
import UserModel from "./database/Mongo/Models/UserModel";
import ConversationModel from "./database/Mongo/Models/ConversationModel";
import MessageModel from "./database/Mongo/Models/MessageModel";

const app = express();
const cors = require('cors');
function makeApp(database: Database) {
    app.locals.database = database;

    database.connect();

    const server = http.createServer(app);
    app.use(express.json());
    app.use(cors());
    const conversationRoutes = require("./routes/conversationRoutes");
    const userRoutes = require("./routes/userRoutes");
    app.use("/conversations", conversationRoutes);
    app.use('/users', userRoutes);
    const io = new Server(server, {cors: {origin: "*"}});
    let socketController = new SocketController(io, database);

    app.locals.socketController = socketController;

    return {app, server};
}

export {makeApp};
