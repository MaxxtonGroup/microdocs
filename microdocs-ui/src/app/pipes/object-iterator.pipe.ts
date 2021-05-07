import { Pipe } from "@angular/core";

/**
 * This Pipe is used to iterate through a key-value array
 * Example usage:
 *   <div *ngFor="let property in myObject | object-iterator">
 *     </span>{{property._id}}</span>
 *   </div>
 */
@Pipe({
  name: "objectIterator"
})
export class ObjectIteratorPipe {

  transform(object: {}): Array<any> {
    if (object == undefined || object == null) {
      return [];
    }
    let result: Array<any> = [];
    for (let key in object) {
      if (key != '_id') {
        let value = object[key];
        if (value != undefined && value != null && typeof(value) == 'object' && !Array.isArray(value)) {
          value._id = key;
        }
        result.push(value);
      }
    }
    return result;
  }
}
