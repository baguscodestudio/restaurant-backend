import Controller from "../typings/Controller";
import Token from "../services/TokenService";
import Methods from "../typings/Methods";

export default class TokenController extends Controller {
  path = "/";
  routes = [
    {
      path: "/token",
      method: Methods.POST,
      handler: this.getToken,
      localMiddleware: [Token.verify],
    },
  ];

  getToken(req, res, next) {
    if (req.verifiedUser) {
      super.sendSuccess(res, {
        tokenVerificationData: { access: true, user: req.verifiedUser },
      });
    }
  }
}
