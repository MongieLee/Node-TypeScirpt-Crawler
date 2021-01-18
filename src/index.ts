import express, { Request, NextFunction } from "express";
import router from "./router";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
const app = express();
// console.log(bodyParser)
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.use(
  cookieSession({
    name: "session",
    keys: [
      /* secret keys */
      "lemon",
    ],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);
app.use(router);

app.listen(3333, () => {
  console.log(`333端口启动成功`);
});
