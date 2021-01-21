import { Response, Request } from "express";
import "reflect-metadata";
import { controller, get, post } from "../descriptor";
import { getResponseData } from "../utils/utils";
interface BodyRequest extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

@controller("/api")
export class LoginController {
  static isLogin(req: BodyRequest) {
    return !!(req.session ? req.session.isLogin : false);
  }

  @get("/isLogin")
  isLogin(req: BodyRequest, res: Response): void {
    const isLogin = LoginController.isLogin(req);
    res.json(getResponseData(isLogin));
  }

  @post("/login")
  login(req: BodyRequest, res: Response): void {
    const { password } = req.body;
    const isLogin = LoginController.isLogin(req);
    if (isLogin) {
      res.json(getResponseData(true));
    } else {
      if (password === "123" && req.session) {
        req.session.isLogin = true;
        res.json(getResponseData(true));
      } else {
        res.json(getResponseData(false, "登录失败"));
      }
    }
  }

  @get("/logout")
  logout(req: Request, res: Response): void {
    if (req.session) {
      req.session.isLogin = false;
    }
    res.json(getResponseData(true));
  }
}
