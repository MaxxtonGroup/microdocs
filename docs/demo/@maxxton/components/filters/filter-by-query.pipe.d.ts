/**
 * This Pipe is used to filter your results on an input string.
 * The input string will be splitted by space and each of these individual words need to be inside the field of an item.
 * If the item has no field that contains the string/word it is filtered out.
 * Example usage:
 *   <div *ngFor="let job of jobs | filterByQueryStrings:'jobA abc presetA':['jobName','jobGroup','preset']>
 * This example will filter out all jobs that do not have all the words 'jobA' 'abc' 'presetA' in any of the 3 fields. (job.jobName, job.jobGroup, job.preset)
 */
export declare class FilterByQueryPipe {
    query: string;
    fields: Array<string>;
    private transform(list, query, fields);
    filterByQuery(list: any[]): any[];
    /**
     * Checks if every word in the entered query exists somewhere in a field of the item
     * @param item
     * @returns {boolean}
     */
    isQueryMatchItem(item: any): boolean;
    /**
     * Checks if the passed word exists in any of the fields of the passed item
     * @param word
     * @param item
     * @returns {boolean}
     */
    private isWordInItemFields(word, item);
}
