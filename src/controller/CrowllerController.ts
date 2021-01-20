import { Response, Request, NextFunction } from "express";
import "reflect-metadata";
import { getResponseData } from "../utils/utils";
import { controller, get, use } from "../descriptor";
import Crowller from "../utils/crowller";
import Analyzer from "../utils/analyzer";
import fs from "fs";
import path from "path";

interface BodyRequest extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

const checkLogin = (
  req: BodyRequest,
  res: Response,
  next: NextFunction
): void => {
  const isLogin = !!(req.session ? req.session.isLogin : false);
  if (isLogin) next();
  else {
    res.json(getResponseData(null, "请先登录"));
  }
};

@controller("/")
export class CrowllerController {
  @get("/getData")
  @use(checkLogin)
  getData(req: BodyRequest, res: Response): void {
    const url = `https://movie.douban.com/`;
    const analyzer = Analyzer.getInstance();
    new Crowller(url, analyzer);
    res.json(getResponseData(true));
  }

  @get("/showData")
  @use(checkLogin)
  showData(req: BodyRequest, res: Response): void {
    try {
      const position = path.resolve(__dirname, "../../data/spiderData.json");
      const result = fs.readFileSync(position, "utf-8");
      res.json(getResponseData(JSON.parse(result)));
    } catch {
      res.json(getResponseData(false, "暂无爬虫数据"));
    }
  }
}
