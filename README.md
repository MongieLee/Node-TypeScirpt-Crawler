# Node-TypeScirpt-Crawler
使用TypeScript编写，基于Node实现的豆瓣热门电影爬虫

data中的json文件存放的是已爬下的数据
数据格式参考接口类型
```
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
```

先执行`yarn install`安装依赖
运行`yarn con`会监听ts文件的变化，变更后就会自动编译ts文件输出至build目录下，接着自动执行`node build index.js`
