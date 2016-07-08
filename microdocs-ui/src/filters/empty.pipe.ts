import {Pipe} from "@angular/core";

/**
 * This Pipe is used to check if an object or path of an object is not empty
 * Example usage:
 *   <div *ngIf="parent | empty:'children.john'">
 */
@Pipe({
  name: "empty"
})
export class EmptyPipe {

  transform(value:any, path?:string):boolean {
    if (this.isEmpty(value)) {
      return true;
    }

    if (path != undefined) {
      var currentObject = value;
      var segments = path.split(".");
      console.info(segments);
      for (var i = 0; i < segments.length; i++) {
        currentObject = currentObject[segments[i]];
        if (this.isEmpty(currentObject)) {
          return true;
        }
      }
    }
    return false;
  }

  private isEmpty(value:any):boolean {
    if (value == undefined || value == null) {
      return true;
    }
    if (Array.isArray(value)) {
      if (value.length == 0) {
        return true;
      }
    }else if(typeof(value) == 'object'){
      if(Object.keys(value).length == 0){
        return true;
      }
    }
    return false;
  }
}