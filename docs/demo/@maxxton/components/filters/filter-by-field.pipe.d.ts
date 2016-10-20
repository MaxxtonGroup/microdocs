/**
 * This Pipe filter items based on if the item has a specified field with a specified value
 * Example usage:
 *   <div *ngFor="list | filter-by-field:'type':['one','two']">
 *
 * This example filters the list for all object which has type == 'one' or type == 'two'
 */
export declare class FilterByFieldPipe {
    transform(list: any, path: string, value: any): any;
    filter(fieldValue: any, value: any): boolean;
    getFieldValue(item: {}, path: string): any;
}
