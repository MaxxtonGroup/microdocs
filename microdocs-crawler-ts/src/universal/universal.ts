import {AbstractCrawler} from "../common/abstract/abstract.crawler";
import {UniversalClassCrawler} from "./universal-class.crawler";
import {UniversalClientCrawler} from "./universal-client.crawler";
import {UniversalPathCrawler} from "./universal-path.crawler";
import { UniversalControllerCrawler } from "./universal-controller.crawler";
import { UniversalComponentCrawler } from "./universal-component.crawler";

export class Universal {

  public initCrawlers(): AbstractCrawler[] {
    return [
      new UniversalClassCrawler(),
      new UniversalComponentCrawler(),
      new UniversalClientCrawler(),
      new UniversalControllerCrawler(),
      new UniversalPathCrawler()
    ];
  }

}