import {AbstractCrawler} from "../common/abstract/abstract.crawler";
import {UniversalClassCrawler} from "./universal-class.crawler";
import {UniversalClientCrawler} from "./universal-client.crawler";
import {UniversalPathCrawler} from "./universal-path.crawler";

export class Universal {

  public initCrawlers(): AbstractCrawler[] {
    return [
      new UniversalClassCrawler(),
      new UniversalClientCrawler(),
      new UniversalPathCrawler()
    ];
  }

}