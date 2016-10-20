
import {MicroDocsCrawler} from "./microdocs-crawler";

var tsConfigFile = 'C:\\Users\\hermans.s.MAXXTONBV\\projects\\microdocs\\microdocs-server\\src\\tsconfig.json';
var sources = [
  'C:\\Users\\hermans.s.MAXXTONBV\\projects\\microdocs\\microdocs-core-ts\\src\\domain\\index.ts',
  // 'C:\\Users\\hermans.s.MAXXTONBV\\projects\\microdocs\\microdocs-server\\src\\app.ts'
  // 'C:\\Users\\hermans.s.MAXXTONBV\\projects\\maxxton-frontend\\services-library\\src\\maxxton-services.ts',
  // 'C:\\Users\\hermans.s.MAXXTONBV\\projects\\maxxton-frontend\\services-library\\src\\services\\index.ts'
];

var tsConfig = require(tsConfigFile);

var crawler = new MicroDocsCrawler();
var project = crawler.crawl(sources, tsConfig.compilerOptions);

console.info(JSON.stringify(project, undefined, 2));