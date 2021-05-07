import {Pipe} from "@angular/core";

/**
 * This Pipe is used to check if an object or path of an object is not empty (null|undefined|zero length|zero keys)
 * Example usage:
 *   parent = {
 *              name: 'Alise',
 *              children: {
 *                john: {
 *                  name: 'John'
 *                }
 *              }
 *            }
 *   <div *ngIf="parent | empty:'children.john'">
 *     This example checks if the child john is not empty
 */
@Pipe({
  name: "empty"
})
export class EmptyPipe {

  transform(rootValue: any, path?: string): boolean {
    // check if the rootValue is empty
    if (this.isEmpty(rootValue)) {
      return true;
    }

    // follow the path if exists
    if (path != undefined) {
      let currentObject = rootValue;
      let segments = path.split(".");
      console.info(segments);
      for (let i = 0; i < segments.length; i++) {
        currentObject = currentObject[segments[i]];
        if (this.isEmpty(currentObject)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Check if an object is empty
   * @param value
   * @returns {boolean}
   */
  private isEmpty(value: any): boolean {
    if (value == undefined || value == null) {
      return true;
    }
    if (Array.isArray(value)) {
      if (value.length == 0) {
        return true;
      }
    } else if (typeof(value) == 'object') {
      if (Object.keys(value).length == 0) {
        return true;
      }
    }
    return false;
  }
}
