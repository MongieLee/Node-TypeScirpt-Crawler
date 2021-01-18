/*
 * @Author: your name
 * @Date: 2021-01-18 14:42:08
 * @LastEditTime: 2021-01-18 16:58:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Editi
 */
import { Router, Request, Response } from "express";
import Crowller from "./crowller";
import Analyzer from "./analyzer";

interface RequestWithBody extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

const router = Router();

router.get("/", (req: Request, res: Response) => {
  const isLogin = req.session ? req.session.isLogin : false;
  if (isLogin) {
    res.send(`
      <html>
      <head>
      </head>
      <body>
        <h1>因为你登陆过了，所以才会显示这个页面</h1>
        <a href='/logout'>logout</>
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
});
router.post("/login", (req, res) => {
  const { password } = req.body;
  const isLogin = req.session ? req.session.isLogin : false;
  if (isLogin) {
    res.send("登录过了,跳转去getDate吧");
  } else {
    if (password === "123" && req.session) {
      req.session.isLogin = true;
      res.send("login succes");
    } else {
      res.send("login faild");
    }
  }
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.isLogin = false;
  }
  res.redirect("./");
});

router.post("/getData", (req: RequestWithBody, res: Response) => {
  if (req.body.password === "123") {
    const url = `https://movie.douban.com/`;
    const analyzer = Analyzer.getInstance();
    new Crowller(url, analyzer);
    res.send(`get data success!`);
  } else {
    res.send(`error!`);
  }
});

export default router;
