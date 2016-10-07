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
export declare class EmptyPipe {
    transform(rootValue: any, path?: string): boolean;
    /**
     * Check if an object is empty
     * @param value
     * @returns {boolean}
     */
    private isEmpty(value);
}
