import { Response, Request } from "express";
import "reflect-metadata";
import { controller, get, post } from "../descriptor";
import { getResponseData } from "../utils/utils";
interface BodyRequest extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

@controller("/")
export class LoginController {
  static isLogin(req: BodyRequest) {
    return !!(req.session ? req.session.isLogin : false);
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

  @get("/")
  home(req: BodyRequest, res: Response): void {
    const isLogin = LoginController.isLogin(req);
    if (isLogin) {
      res.send(`
        <html>
        <head>
        </head>
        <body>
          <h1>因为你登陆过了，所以才会显示这个页面</h1>
          <a href='/getData'>爬虫</a>
          <a href='/showData'>展示</a>
          <a href='/logout'>logout</a>
        </body>
        </html>
      `);
    } else {
      res.send(`
      <html>
      <head>
      </head>
      <body>
        <form method='post' action='/login'>
        <input type='password' name='password'/>
        <button>提交</button>
        </form>
      </body>
      </html>
    `);
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
