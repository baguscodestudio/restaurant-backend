import Token from "../services/TokenService";
import Methods from "../typings/Methods";
import UserService from "../services/UserService";
import Controller from "../typings/Controller";

export default class UserController extends Controller {
  path = "/";
  routes = [
    {
      path: "/login",
      method: Methods.POST,
      handler: this.handleLogin,
      localMiddleware: [],
    },
    {
      path: "/register",
      method: Methods.POST,
      handler: this.handleRegister,
      localMiddleware: [],
    },
  ];

  constructor() {
    super();
  }

  async handleLogin(req, res, next) {
    try {
      const { username, password } = req.body;
      const userService = new UserService(username, password);
      const data = await userService.login();
      if (data.success) {
        super.sendSuccess(res, data.data, data.message);
      } else {
        super.sendError(res, data.message);
      }
    } catch (e) {
      console.log(e);
      super.sendError(res);
    }
  }

  async handleRegister(req, res, next) {
    try {
      const { username, password } = req.body;
      console.log(username, password);
      const userService = new UserService(username, password);
      const data = await userService.register();
      if (data.success) {
        super.sendSuccess(res, data.data, data.message);
      } else {
        super.sendError(res, data.message);
      }
    } catch (e) {
      console.log(e);
      super.sendError(res);
    }
  }
}
