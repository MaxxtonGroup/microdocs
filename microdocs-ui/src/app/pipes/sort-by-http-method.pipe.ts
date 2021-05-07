import { Pipe } from "@angular/core";

/**
 * Custom sort http methods
 */
@Pipe({name: 'sortByHttpMethod'})
export class SortByHttpMethodPipe {

  private transform(list: Array<any>, key: string): any {
    if (list == undefined || list == null || list.length == 0) {
      return list;
    }

    if (key == undefined || key == null || key.length == 0) {
      return list;
    }

    let self = this;
    return list.sort(function (a, b) {
      let fieldA = self.getValueOf(a[key]);
      let fieldB = self.getValueOf(b[key]);

      if (fieldA < fieldB) {
        return -1;
      }
      if (fieldA > fieldB) {
        return 1;
      }
      return 0;
    });
  }

  private getValueOf(httpMethod: string): number {
    switch (httpMethod.toLowerCase()) {
      case 'get': return 1;
      case 'post': return 2;
      case 'put': return 3;
      case 'patch': return 4;
      case 'delete': return 5;
      default: return 9;
    }
  }

}
