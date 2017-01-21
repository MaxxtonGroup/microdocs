export abstract class AbstractCrawler{
  
  public static get ORDER_HIGHEST():number{return -100;}
  public static get ORDER_HIGHER():number{return -50;}
  public static get ORDER_NORMAL():number{return 0;}
  public static get ORDER_LOWER():number{return 50;}
  public static get ORDER_LOWEST():number{return 100;}

  private _order:number;

  constructor(order:number = AbstractCrawler.ORDER_NORMAL){
    this._order = order;
  }
  
  get order(){
    return this._order;
  }

  public abstract crawl(arg1?:any,arg2?:any,arg3?:any,arg4?:any,arg5?:any):any;
  
}