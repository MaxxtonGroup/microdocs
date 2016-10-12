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
    var FilterBooleanFieldByQueryPipe;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            /**
             * This Pipe is used to filter your results on a boolean field of your object.
             * Example usage:
             *   <div *ngFor="let job of jobs | filterBooleanFieldByQuery:query:[ ['running', 'getRunning'], ['enabled', 'isEnabled'] ]>
             * Here 'running' is the key the user can enter(and '!running' to invert the results).
             * And 'getRunning' is the name of the method that is executed to find the result
             * So when the user inputs: '!running' it will only return jobs where job.getRunning() is false;
             */
            FilterBooleanFieldByQueryPipe = (function () {
                function FilterBooleanFieldByQueryPipe() {
                }
                FilterBooleanFieldByQueryPipe.prototype.transform = function (objectList, query, keyMethodList) {
                    var _this = this;
                    keyMethodList.forEach(function (keyMethod) {
                        var key = keyMethod[0];
                        var method = keyMethod[1];
                        //if the user entered the key inside the query
                        if (query && query.toString().match(new RegExp(key, 'i'))) {
                            //filter the objectList by the method of the key
                            objectList = objectList.filter(function (object) {
                                //obtain either the value of the field or the return value of the method if the field doesn't exist.
                                var methodValue = object.hasOwnProperty(method) ? object[method] : object[method]();
                                //make sure the object is filtered out when the method result is true, but the query is inverted. (or the other way around)
                                if (methodValue !== _this.isQueryKeyInverted(query, key)) {
                                    return false;
                                }
                                return true;
                            });
                        }
                    });
                    return objectList;
                };
                /**
                 * Check if the query is inverted with !
                 * @param query
                 * @param key
                 * @returns {boolean}
                 */
                FilterBooleanFieldByQueryPipe.prototype.isQueryKeyInverted = function (query, key) {
                    return query.toString().match(new RegExp("!" + key, 'i')) == null;
                };
                FilterBooleanFieldByQueryPipe = __decorate([
                    core_1.Pipe({
                        name: "filterBooleanFieldByQuery"
                    }), 
                    __metadata('design:paramtypes', [])
                ], FilterBooleanFieldByQueryPipe);
                return FilterBooleanFieldByQueryPipe;
            }());
            exports_1("FilterBooleanFieldByQueryPipe", FilterBooleanFieldByQueryPipe);
        }
    }
});
