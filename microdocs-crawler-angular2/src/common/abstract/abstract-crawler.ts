export abstract class AbstractCrawler{
  
  static readonly ORDER_HIGHEST:number = 100;
  static readonly ORDER_HIGHER:number = 50;
  static readonly ORDER_NORMAL:number = 0;
  static readonly ORDER_LOWER:number = -50;
  static readonly ORDER_LOWEST:number = -100;
  
  constructor(private order:number){}
  
  get order(){
    return this.order;
  }
  
}