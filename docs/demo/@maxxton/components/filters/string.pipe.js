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
    var StringFilterPipe;
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
             *   url(assignment) | stringFilter: '/': '' //will not return a string
             *   assignment | stringFilter: '': '/' //returns string
             *
             * @author R. Reinartz (r.reinartz@maxxton.com)
             */
            StringFilterPipe = (function () {
                function StringFilterPipe() {
                }
                StringFilterPipe.prototype.transform = function (item, mustContain, mustNotContain) {
                    if (item == undefined || item == null)
                        return;
                    if (!(mustNotContain.length > 0 && item.indexOf(mustNotContain) != -1)) {
                        if ((mustContain.length > 0 && item.indexOf(mustContain) != -1) || mustContain.length == 0) {
                            return item;
                        }
                    }
                };
                StringFilterPipe = __decorate([
                    core_1.Pipe({ name: 'stringFilter' }), 
                    __metadata('design:paramtypes', [])
                ], StringFilterPipe);
                return StringFilterPipe;
            }());
            exports_1("StringFilterPipe", StringFilterPipe);
        }
    }
});
