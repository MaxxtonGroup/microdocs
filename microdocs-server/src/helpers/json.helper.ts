
import { LoggerFactory } from "@webscale/logging";

const logger = LoggerFactory.create();

export class JsonSerializer {

  /**
   * Serialize JSON and generate dump when it fails
   * @param object
   */
  public static serialize(object:any):string{
    try{
      return JSON.stringify(object);
    }catch(e){
      let problems = checkCircularStructure(object);
      logger.warn("Converting JSON failed: ", problems);
      throw new Error("Converting JSON failed: " + problems);
    }
  }

}

/**
 * Detect circular structure in the object
 * @param object
 * @return problems detections
 */
function checkCircularStructure(object: any, objectStore: {path: string, object: any}[] = [], problems: string[] = [], path: string = '.'): string[] {
  let stack = objectStore.map(obj => obj);

  if (object && typeof(object) === 'object') {
    let stackItem = stack.filter(stackItem => stackItem.object === object)[0];
    if (stackItem) {
      problems.push(path + " <=> " + stackItem.path);
    } else {
      stack.push({path: path, object: object});
      for (let key in object) {
        let propertyPath = path === '.' ? key : path + '.' + key;
        checkCircularStructure(object[key], stack, problems, propertyPath);
      }
    }
  }

  return problems;
}