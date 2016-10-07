/**
 * Filter list of cast by argument
 * Usage:
 * string | stringFilter: 'mustContain': 'mustNotContain'
 * Example:
 *   url(assignment) | stringFilter: '/': '' //will not return a string
 *   assignment | stringFilter: '': '/' //returns string
 *
 * @author R. Reinartz (r.reinartz@maxxton.com)
 */
export declare class StringFilterPipe {
    private transform(item, mustContain?, mustNotContain?);
}
