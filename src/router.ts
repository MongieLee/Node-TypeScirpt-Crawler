/*
 * @Author: your name
 * @Date: 2021-01-18 14:42:08
 * @LastEditTime: 2021-01-19 13:21:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Editi
 */
import { Router, Request, Response, NextFunction } from "express";
import Crowller from "./utils/crowller";
import Analyzer from "./utils/analyzer";
import fs from "fs";
import path from "path";

import { getResponseData } from "./utils/utils";
const router = Router();

interface BodyRequest extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

const checkLogin = (req: BodyRequest, res: Response, next: NextFunction) => {
  const isLogin = req.session ? req.session.isLogin : false;
  if (isLogin) next();
  else {
    res.json(getResponseData(null, "请先登录"));
  }
};

router.get("/", (req: BodyRequest, res: Response) => {
  const isLogin = req.session ? req.session.isLogin : false;
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
});
router.post("/login", (req: BodyRequest, res) => {
  const { password } = req.body;
  const isLogin = req.session ? req.session.isLogin : false;
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
});

router.get("/showData", checkLogin, (req: BodyRequest, res) => {
  try {
    const position = path.resolve(__dirname, "../data/spiderData.json");
    const result = fs.readFileSync(position, "utf-8");
    res.json(getResponseData(JSON.parse(result)));
  } catch {
    res.json(getResponseData(false, "暂无爬虫数据"));
  }
});

router.get("/logout", (req: BodyRequest, res) => {
  if (req.session) {
    req.session.isLogin = false;
  }
  res.json(getResponseData(true));
});

router.get("/getData", checkLogin, (req: BodyRequest, res: Response) => {
  const url = `https://movie.douban.com/`;
  const analyzer = Analyzer.getInstance();
  new Crowller(url, analyzer);
  res.json(getResponseData(true));
});

export default router;
