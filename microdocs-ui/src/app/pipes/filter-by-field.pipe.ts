import { Pipe } from "@angular/core";

/**
 * This Pipe filter items based on if the item has a specified field with a specified value
 * Example usage:
 *   <div *ngFor="list | filter-by-field:'type':['one','two']">
 *
 * This example filters the list for all object which has type == 'one' or type == 'two'
 */
@Pipe( {
  name: "filterByField"
} )
export class FilterByFieldPipe {

  transform( list: any, path: string, value: any ): any {
    let self = this;
    if ( list == undefined || list == null ) {
      return list;
    }
    if ( Array.isArray( list ) ) {
      return list.filter( ( item: Object ) => {
        let fieldValue = this.getFieldValue( item, path );
        return self.filter( fieldValue, value );
      } );
    } else if ( typeof(list) == 'object' ) {
      let filteredObject = {};
      for ( let key in list ) {
        let fieldValue = this.getFieldValue( list[ key ], path );
        if ( self.filter( fieldValue, value ) ) {
          filteredObject[ key ] = list[ key ];
        }
      }
      return filteredObject;
    } else {
      console.warn( "filterByField requires an Array as input, not " + typeof(list) );
      return list;
    }
  }

  filter( fieldValue: any, value: any ): boolean {
    let equals = fieldValue == value;
    if ( !equals && Array.isArray( value ) ) {
      value.forEach( ( v: any ) => {
        if ( fieldValue == v ) {
          equals = true;
        }
      } );
    }
    return equals;
  }

  getFieldValue( item: {}, path: string ): any {
    let currentItem = item;
    path.split( "." ).forEach( segment => {
      if ( currentItem == undefined || currentItem == null ) {
        return true;
      }
      currentItem = currentItem[ segment ];
      return true;
    } );
    return currentItem;
  }


}
