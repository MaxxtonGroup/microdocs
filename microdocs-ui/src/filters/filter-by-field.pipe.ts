import {Pipe} from "@angular/core";

/**
 * This Pipe filter items based on if the item has a specified field with a specified value
 * Example usage:
 *   <div *ngFor="list | filter-by-field:'type':['one','two']">
 *
 * This example filters the list for all object which has type == 'one' or type == 'two'
 */
@Pipe({
  name: "filterByField"
})
export class FilterByFieldPipe {

  transform(list:Array<{}>, path:string, value:any):Array<{}> {
    return list.filter((item) => {
      var fieldValue = this.getFieldValue(item, path);
      var equals = fieldValue == value;
      if(!equals && Array.isArray(value)){
        value.forEach(v => {
          if(fieldValue == v){
            equals = true;
            return true;
          }
        });
      }
      return equals;
    });
  }

  getFieldValue(item:{}, path:string):any{
    var currentItem = item;
    path.split(".").forEach(segment =>{
      currentItem = currentItem[segment]
      if(currentItem == undefined || currentItem == null){
        return true;
      }
    });
    return currentItem;
  }


}