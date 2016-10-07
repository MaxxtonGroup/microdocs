/**
 * Created by Reinartz.T on 21-3-2016.
 */
System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var DatePickerUtil;
    return {
        setters:[],
        execute: function() {
            DatePickerUtil = (function () {
                function DatePickerUtil() {
                }
                /**
                 * create a collection of dates that form a month
                 * @param year
                 * @param month
                 * @returns {Array<Array<Date>>}
                 */
                DatePickerUtil.createMonthDates = function (year, month) {
                    if (year === void 0) { year = new Date().getFullYear(); }
                    if (month === void 0) { month = new Date().getMonth(); }
                    var weeks = [];
                    //clean models
                    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                    var firstDayOfMonth = new Date(year, month, 1);
                    firstDayOfMonth.setUTCHours(12, 0, 0, 0);
                    //generate 6 weeks
                    for (var i = 0; i < 6; i++) {
                        //create week
                        var week = DatePickerUtil.createWeekDates(firstDayOfMonth);
                        if (weeks.length < 5 || (weeks.length >= 5 && week[0].getDate() > 6))
                            weeks.push(week);
                        //move to next week
                        firstDayOfMonth.setTime(firstDayOfMonth.getTime() + (oneDay * 7));
                    }
                    return weeks;
                };
                DatePickerUtil.createMonthDatesAsList = function (year, month) {
                    if (year === void 0) { year = new Date().getFullYear(); }
                    if (month === void 0) { month = new Date().getMonth(); }
                    var _month = [];
                    var lastDayInMonth = new Date(year, month + 1, -1);
                    for (var i = 0; i <= lastDayInMonth.getDate(); i++) {
                        var date = new Date();
                        date.setFullYear(year, month, Number(i + 1));
                        date.setUTCHours(0, 0, 0, 0);
                        _month.push(date);
                    }
                    return _month;
                };
                /**
                 * create a array of dates that form a week (week starts on sunday for now)
                 * @param startDate
                 * @returns {Array}
                 */
                DatePickerUtil.createWeekDates = function (startDate) {
                    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                    var week = [];
                    var day = new Date(DatePickerUtil.getFirstDayOfWeek(startDate).getTime());
                    day.setHours(12, 0, 0, 0);
                    //generate 7 days
                    for (var j = 0; j < 7; j++) {
                        //add day
                        var date = new Date();
                        date.setFullYear(day.getFullYear(), day.getMonth(), day.getDate());
                        date.setUTCHours(0, 0, 0, 0);
                        week.push(date);
                        //move to the next day
                        day.setTime(day.getTime() + oneDay);
                    }
                    return week;
                };
                /**
                 * get the first day of a week for a specific date.
                 * @param date
                 * @returns {Date}
                 */
                DatePickerUtil.getFirstDayOfWeek = function (date) {
                    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                    var startDate = new Date(date.toISOString());
                    var dayNumber = startDate.getDay();
                    var firstDayOfWeek = new Date(startDate.getTime() - dayNumber * oneDay);
                    firstDayOfWeek.setUTCHours(0, 0, 0, 0);
                    return firstDayOfWeek;
                };
                return DatePickerUtil;
            }());
            exports_1("DatePickerUtil", DatePickerUtil);
        }
    }
});
