import {RootCrawler} from "../common/root.crawler";
import {AbstractCrawler} from "../common/abstract/abstract.crawler";
import {Angular2ClassCrawler} from "./angular2-class.crawler";
import {Angular2PathCrawler} from "./angular2-path.crawler";
import {Angular2ClientCrawler} from "./angular2-client.crawler";

export class Angular2 extends RootCrawler {

  public initCrawlers():AbstractCrawler[]{
    return [
      new Angular2ClassCrawler(),
      new Angular2ClientCrawler(),
      new Angular2PathCrawler()
    ];
  }

}