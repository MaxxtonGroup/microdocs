
import {Logger} from './logger';
import * as jsLogger from 'js-logger';

jsLogger.useDefaults();

export class JSLogger implements Logger{

  debug( ...x: any[] ): void {
    call(x, jsLogger.debug);
  }

  info( ...x: any[] ): void {
    call(x, jsLogger.info);
  }

  log( ...x: any[] ): void {
    call(x, jsLogger.log);
  }

  warn( ...x: any[] ): void {
    call(x, jsLogger.warn);
  }

  error( ...x: any[] ): void {
    call(x, jsLogger.error);
  }

}

function call(x:any[], func:(args:any) => void){
  if(!x){
    x = [];
  }else if(!Array.isArray(x)){
    x = [x];
  }
  x.forEach(y => func(y));
}