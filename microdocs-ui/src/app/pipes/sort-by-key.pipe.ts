import { Pipe } from "@angular/core";

/**
 * Filter list of cast by argument
 * Usage:
 * string | sortByKey: 'mustContain': 'mustNotContain'
 * Example:
 *   url(assignment) | sortByKey: '/': '' //will not return a string
 *   assignment | sortByKey: '': '/' //returns string
 */
@Pipe({name: 'sortByKey'})
export class SortByKeyPipe {

  private transform(list: Array<any>, key: string): any {
    if (list == undefined || list == null || list.length == 0) {
      return list;
    }

    if (key == undefined || key == null || key.length == 0) {
      return list;
    }

    return list.sort(function (a, b) {
      let fieldA = a[key];
      let fieldB = b[key];

      if (fieldA < fieldB) {
        return -1;
      }
      if (fieldA > fieldB) {
        return 1;
      }
      return 0;
    });
  }
}
