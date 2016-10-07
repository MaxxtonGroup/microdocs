/**
 * This Pipe is used to iterate through a key-value array
 * Example usage:
 *   <div *ngFor="let property in myObject | object-iterator">
 *     </span>{{property._id}}</span>
 *   </div>
 */
export declare class ObjectIteratorPipe {
    transform(object: {}): Array<any>;
}
