import * as http from "http";
import express from "express";
import {Server} from "socket.io";
import {Database} from "./database/database";
import {SocketController} from "./socket/socketController";
import {ErrorHandler} from "./Error/errorHandler";

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
    const messageRoutes = require("./routes/messageRoutes");
    app.use("/conversations", conversationRoutes);
    app.use('/users', userRoutes);
    app.use('/messages', messageRoutes);
    const io = new Server(server, {cors: {origin: "*"}});
    let socketController = new SocketController(io, database);
    app.use(ErrorHandler);
    app.locals.socketController = socketController;

    return {app, server};
}

export {makeApp};
