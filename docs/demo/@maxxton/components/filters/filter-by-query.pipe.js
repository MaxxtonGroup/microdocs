System.register(["@angular/core"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var FilterByQueryPipe;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            /**
             * This Pipe is used to filter your results on an input string.
             * The input string will be splitted by space and each of these individual words need to be inside the field of an item.
             * If the item has no field that contains the string/word it is filtered out.
             * Example usage:
             *   <div *ngFor="let job of jobs | filterByQueryStrings:'jobA abc presetA':['jobName','jobGroup','preset']>
             * This example will filter out all jobs that do not have all the words 'jobA' 'abc' 'presetA' in any of the 3 fields. (job.jobName, job.jobGroup, job.preset)
             */
            FilterByQueryPipe = (function () {
                function FilterByQueryPipe() {
                    this.query = '';
                }
                FilterByQueryPipe.prototype.transform = function (list, query, fields) {
                    this.query = query;
                    this.fields = fields;
                    //check if all variables are available
                    if (this.query !== undefined && list !== undefined && this.query.length > 0) {
                        var filterByQuery = this.filterByQuery(list);
                        return filterByQuery;
                    }
                    else
                        return list;
                };
                FilterByQueryPipe.prototype.filterByQuery = function (list) {
                    var this_ = this;
                    var returnValue = [];
                    list.forEach(function (item) {
                        if (this_.isQueryMatchItem(item)) {
                            returnValue.push(item);
                        }
                    });
                    return returnValue;
                };
                /**
                 * Checks if every word in the entered query exists somewhere in a field of the item
                 * @param item
                 * @returns {boolean}
                 */
                FilterByQueryPipe.prototype.isQueryMatchItem = function (item) {
                    var _this = this;
                    var isAllWordsMatchedOnItem = true;
                    //The item should match all words in the query
                    this.query.toString().split(" ").some(function (word) {
                        if (!_this.isWordInItemFields(word, item)) {
                            isAllWordsMatchedOnItem = false;
                            //break out of loop
                            return true;
                        }
                    });
                    return isAllWordsMatchedOnItem;
                };
                /**
                 * Checks if the passed word exists in any of the fields of the passed item
                 * @param word
                 * @param item
                 * @returns {boolean}
                 */
                FilterByQueryPipe.prototype.isWordInItemFields = function (word, item) {
                    var isWordInItemFields = false;
                    this.fields.some(function (field) {
                        var fieldValue = item[field];
                        if (fieldValue != null) {
                            var lowerCaseFieldValue = fieldValue.toString().toLowerCase();
                            var lowerCaseWord = word.toLowerCase();
                            //check if this field contains the word
                            if (lowerCaseFieldValue.indexOf(lowerCaseWord) > -1) {
                                isWordInItemFields = true;
                                //break out of loop
                                return true;
                            }
                        }
                    });
                    return isWordInItemFields;
                };
                FilterByQueryPipe = __decorate([
                    core_1.Pipe({ name: 'filterByQueryStrings' }), 
                    __metadata('design:paramtypes', [])
                ], FilterByQueryPipe);
                return FilterByQueryPipe;
            }());
            exports_1("FilterByQueryPipe", FilterByQueryPipe);
        }
    }
});
