/**
 * Filter list of cast by argument
 * Usage:
 * string | sortByKey: 'mustContain': 'mustNotContain'
 * Example:
 *   url(assignment) | sortByKey: '/': '' //will not return a string
 *   assignment | sortByKey: '': '/' //returns string
 */
export declare class SortByKeyPipe {
    private transform(list, key);
}
