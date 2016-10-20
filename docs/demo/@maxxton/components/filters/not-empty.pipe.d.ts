/**
 * This Pipe is used to check if an object or path of an object is not empty
 * Example usage:
 *   <div *ngIf="parent | not-empty:'children.john'">
 */
export declare class NotEmptyPipe {
    transform(value: any, path?: string): boolean;
    private isEmpty(value);
}
