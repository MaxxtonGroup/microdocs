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
    var GroupByKeyPipe;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            /**
             * Filter list of cast by argument
             * Usage:
             * string | stringFilter: 'mustContain': 'mustNotContain'
             * Example:
             *   url(assignment) | groupByKey: '/'
             *   assignment | groupByKey: ''
             */
            GroupByKeyPipe = (function () {
                function GroupByKeyPipe() {
                }
                GroupByKeyPipe.prototype.transform = function (list, key) {
                    if (list == undefined || list == null || list.length == 0)
                        return list;
                    if (key == undefined || key == null || key.length == 0)
                        return list;
                    return list.sort(function (a, b) {
                        var fieldA = a[key];
                        var fieldB = b[key];
                        //nullcheck
                        if (fieldA == null || fieldA == undefined)
                            fieldA = 0;
                        if (fieldB == undefined || fieldB == null)
                            fieldB = 0;
                        fieldA = fieldA.toString().toLowerCase();
                        fieldB = fieldB.toString().toLowerCase();
                        if (fieldA < fieldB)
                            return -1;
                        if (fieldA > fieldB)
                            return 1;
                        return 0;
                    });
                };
                GroupByKeyPipe = __decorate([
                    core_1.Pipe({ name: 'groupByKey' }), 
                    __metadata('design:paramtypes', [])
                ], GroupByKeyPipe);
                return GroupByKeyPipe;
            }());
            exports_1("GroupByKeyPipe", GroupByKeyPipe);
        }
    }
});
