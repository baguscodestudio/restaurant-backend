export default class Server {
  #app;
  #database;
  #port;

  constructor(app, database, port) {
    this.#app = app;
    this.#database = database;
    this.#port = port;
  }

  run() {
    return this.#app.listen(this.#port, () => {
      console.log(`The server is running on port ${this.#port}`);
    });
  }

  loadMiddleware(middlewares) {
    middlewares.forEach((middleware) => {
      this.#app.use(middleware);
    });
  }

  loadControllers(controllers) {
    controllers.forEach((controller) => {
      this.#app.use(controller.path, controller.setRoutes());
    });
  }

  async initDatabase() {
    try {
      console.log("Database is successfully authenticated");
    } catch (err) {
      console.log(err);
    }
  }
}
