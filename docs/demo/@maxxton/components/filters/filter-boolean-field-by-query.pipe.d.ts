/**
 * This Pipe is used to filter your results on a boolean field of your object.
 * Example usage:
 *   <div *ngFor="let job of jobs | filterBooleanFieldByQuery:query:[ ['running', 'getRunning'], ['enabled', 'isEnabled'] ]>
 * Here 'running' is the key the user can enter(and '!running' to invert the results).
 * And 'getRunning' is the name of the method that is executed to find the result
 * So when the user inputs: '!running' it will only return jobs where job.getRunning() is false;
 */
export declare class FilterBooleanFieldByQueryPipe {
    transform(objectList: Array<any>, query: string, keyMethodList: Array<any>): any[];
    /**
     * Check if the query is inverted with !
     * @param query
     * @param key
     * @returns {boolean}
     */
    private isQueryKeyInverted(query, key);
}
