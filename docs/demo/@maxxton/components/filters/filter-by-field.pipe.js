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
    var FilterByFieldPipe;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            /**
             * This Pipe filter items based on if the item has a specified field with a specified value
             * Example usage:
             *   <div *ngFor="list | filter-by-field:'type':['one','two']">
             *
             * This example filters the list for all object which has type == 'one' or type == 'two'
             */
            FilterByFieldPipe = (function () {
                function FilterByFieldPipe() {
                }
                FilterByFieldPipe.prototype.transform = function (list, path, value) {
                    var _this = this;
                    var self = this;
                    if (list == undefined || list == null) {
                        return list;
                    }
                    if (Array.isArray(list)) {
                        return list.filter(function (item) {
                            var fieldValue = _this.getFieldValue(item, path);
                            return self.filter(fieldValue, value);
                        });
                    }
                    else if (typeof (list) == 'object') {
                        var filteredObject = {};
                        for (var key in list) {
                            var fieldValue = this.getFieldValue(list[key], path);
                            if (self.filter(fieldValue, value)) {
                                filteredObject[key] = list[key];
                            }
                        }
                        return filteredObject;
                    }
                    else {
                        console.warn("filterByField requires an Array as input, not " + typeof (list));
                        return list;
                    }
                };
                FilterByFieldPipe.prototype.filter = function (fieldValue, value) {
                    var equals = fieldValue == value;
                    if (!equals && Array.isArray(value)) {
                        value.forEach(function (v) {
                            if (fieldValue == v) {
                                equals = true;
                                return true;
                            }
                        });
                    }
                    return equals;
                };
                FilterByFieldPipe.prototype.getFieldValue = function (item, path) {
                    var currentItem = item;
                    path.split(".").forEach(function (segment) {
                        if (currentItem == undefined || currentItem == null) {
                            return true;
                        }
                        currentItem = currentItem[segment];
                    });
                    return currentItem;
                };
                FilterByFieldPipe = __decorate([
                    core_1.Pipe({
                        name: "filterByField"
                    }), 
                    __metadata('design:paramtypes', [])
                ], FilterByFieldPipe);
                return FilterByFieldPipe;
            }());
            exports_1("FilterByFieldPipe", FilterByFieldPipe);
        }
    }
});
