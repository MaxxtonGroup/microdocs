/**
 * Created by Reinartz.T on 21-3-2016.
 */
export declare class DatePickerUtil {
    /**
     * create a collection of dates that form a month
     * @param year
     * @param month
     * @returns {Array<Array<Date>>}
     */
    static createMonthDates(year?: number, month?: number): Date[][];
    static createMonthDatesAsList(year?: number, month?: number): Date[];
    /**
     * create a array of dates that form a week (week starts on sunday for now)
     * @param startDate
     * @returns {Array}
     */
    static createWeekDates(startDate: Date): Date[];
    /**
     * get the first day of a week for a specific date.
     * @param date
     * @returns {Date}
     */
    static getFirstDayOfWeek(date: Date): Date;
}
