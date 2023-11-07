import express from "express";
import * as http from "http";
import { Server } from "socket.io";
import { Database } from "./database/database";
import { SocketController } from "./socket/socketController";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import conversationRoutes from "./routes/conversationRoutes";

const app = express();

function makeApp(database: Database) {
  app.locals.database = database;

  database.connect();

  const server = http.createServer(app);
  app.use(express.json());
  app.use(cors());

  app.use("/conversations", conversationRoutes);
  app.use("/users", userRoutes);
  const io = new Server(server, { cors: { origin: "*" } });
  let socketController = new SocketController(io, database);

  app.locals.sockerController = socketController;

  return { app, server };
}

export { makeApp };
