import {AbstractCrawler} from "./common/abstract/abstract.crawler";
import {Angular2} from "./angular2/angular2";
import {Universal} from "./universal/universal";

/**
 * Supported frameworks
 */
export class Framework {

  public static ANGULAR2:Framework = new Framework("Angular2", new Angular2().initCrawlers);
  public static UNIVERSAL:Framework = new Framework("Universal", new Universal().initCrawlers);

  private constructor(public name:string, public initCrawlers:() => AbstractCrawler[]){}
}

export const FRAMEWORKS: Framework[] = [Framework.UNIVERSAL, Framework.ANGULAR2];