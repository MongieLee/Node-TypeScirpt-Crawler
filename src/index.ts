import superagent from "superagent";
import fs from "fs";
import path from "path";
import Analyzer from "./analyzer";

export interface AnalyzerC {
  analyze(html: string, filePath: string): string;
}

class Crowller {
  private filePath = path.resolve(__dirname, "../data/spiderData.json");

  private async initSpiderProcess() {
    const html = await this.getRawHtml();
    const dateResult = this.analyzer.analyze(html, this.filePath);
    console.log(dateResult);
    this.writeFile(dateResult);
  }

  private writeFile(data: string) {
    fs.writeFileSync(this.filePath, data);
  }

  private async getRawHtml(): Promise<string> {
    return (await superagent.get(this.url)).text;
  }

  constructor(private url: string, private analyzer: AnalyzerC) {
    this.initSpiderProcess();
  }
}

const url = `https://movie.douban.com/`;   
const analyzer = Analyzer.getInstance();
new Crowller(url, analyzer);
