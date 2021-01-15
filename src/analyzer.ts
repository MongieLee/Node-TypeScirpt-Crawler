import cheerio from "cheerio";
import fs from "fs";
import { AnalyzerC } from "./index";
interface moveListItem {
  title: string;
  grade: number | string;
}

interface moveResult {
  time: number;
  data: moveListItem[];
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

  private generateJsonContent(jsonContent: moveResult, filePath: string) {
    let fileContent: Content = {};
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
    fileContent[jsonContent.time] = jsonContent.data;
    return fileContent;
  }

  private getMoveInfo(html: string): moveResult {
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
        moveLIst.push({ title: moveTitle, grade: noData });
      } else {
        moveLIst.push({ title: moveTitle, grade });
      }
    });
    return {
      time: new Date().getTime(),
      data: moveLIst,
    };
  }

  private constructor() {}
  public analyze(html: string, filePath: string) {
    const moveResult = this.getMoveInfo(html);
    const fileContent = this.generateJsonContent(moveResult, filePath);
    return JSON.stringify(fileContent);
  }
}
