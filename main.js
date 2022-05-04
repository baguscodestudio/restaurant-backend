import express from "express";
import cors from "cors";
import Server from "./typings/Server";
import connection from "./models/index";
import { PORT } from "./config";
import UserController from "./controllers/UserController";
import AuthController from "./controllers/AuthController";

const app = express();
const controllers = [new UserController(), new AuthController()];

const server = new Server(app, connection, PORT);

const globalMiddleware = [
  cors({ credentials: true, origin: true }),
  express.json(),
];

Promise.resolve()
  .then(() => server.initDatabase())
  .then(() => {
    server.loadMiddleware(globalMiddleware);
    server.loadControllers(controllers);
    const httpServer = server.run();
  });
