import { Router } from "express";

export default class Controller {
  router = Router();
  path;
  routes;

  setRoutes = () => {
    for (const route of this.routes) {
      for (const mw of route.localMiddleware) {
        this.router.use(route.path, mw);
      }
      try {
        this.router[route.method](route.path, route.handler);
      } catch (err) {
        console.error("not a valid method");
      }
    }

    return this.router;
  };
  // these methods below must not be a properties< but methods (no "=>")
  sendSuccess(res, data, message) {
    return res.status(200).json({
      message: message || "success",
      data: data,
    });
  }

  sendError(res, message) {
    return res.status(500).json({
      message: message || "internal server error",
    });
  }
}
