import cheerio from "cheerio";
import fs from "fs";
import { AnalyzerC } from "./crowller";
import dayjs from "dayjs";
interface moveListItem {
  title: string;
  grade: number | string;
  time: string;
}

interface Content {
  [props: number]: moveListItem[];
}

export default class Analyzer implements AnalyzerC {
  private static instance: Analyzer;
  static getInstance() {
    if (!Analyzer.instance) {
      Analyzer.instance = new Analyzer();
    }
    return Analyzer.instance;
  }

  private generateJsonContent(jsonContent: moveListItem[], filePath: string) {
    let fileContent: moveListItem[] = [];
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
    return [...fileContent, ...jsonContent];
  }

  private getMoveInfo(html: string): moveListItem[] {
    const moveLIst: moveListItem[] = [];
    const $ = cheerio.load(html);
    const items = $("#screening .ui-slide-content > .ui-slide-item").filter(
      (_, element) => element.children.length > 1
    );
    items.map((_, element) => {
      const moveTitle =
        $(element).find("img").attr("alt") || "爬取目标有变，无法获取标题名称";
      const grade = parseInt($(element).find(".subject-rate").text(), 10);
      const noData = $(element).find(".text-tip").text();
      if (noData) {
        moveLIst.push({
          title: moveTitle,
          grade: 0,
          time: dayjs().format("YY-MM-DD HH:mm:ss"),
        });
      } else {
        moveLIst.push({
          title: moveTitle,
          grade: grade,
          time: dayjs().format("YY-MM-DD HH:mm:ss"),
        });
      }
    });
    return moveLIst;
  }

  private constructor() {}
  public analyze(html: string, filePath: string) {
    const moveResult = this.getMoveInfo(html);
    const fileContent = this.generateJsonContent(moveResult, filePath);
    return JSON.stringify(fileContent);
  }
}
