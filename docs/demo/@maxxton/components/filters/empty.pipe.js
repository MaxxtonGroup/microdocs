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
    var EmptyPipe;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            /**
             * This Pipe is used to check if an object or path of an object is not empty (null|undefined|zero length|zero keys)
             * Example usage:
             *   parent = {
             *              name: 'Alise',
             *              children: {
             *                john: {
             *                  name: 'John'
             *                }
             *              }
             *            }
             *   <div *ngIf="parent | empty:'children.john'">
             *     This example checks if the child john is not empty
             */
            EmptyPipe = (function () {
                function EmptyPipe() {
                }
                EmptyPipe.prototype.transform = function (rootValue, path) {
                    // check if the rootValue is empty
                    if (this.isEmpty(rootValue)) {
                        return true;
                    }
                    // follow the path if exists
                    if (path != undefined) {
                        var currentObject = rootValue;
                        var segments = path.split(".");
                        console.info(segments);
                        for (var i = 0; i < segments.length; i++) {
                            currentObject = currentObject[segments[i]];
                            if (this.isEmpty(currentObject)) {
                                return true;
                            }
                        }
                    }
                    return false;
                };
                /**
                 * Check if an object is empty
                 * @param value
                 * @returns {boolean}
                 */
                EmptyPipe.prototype.isEmpty = function (value) {
                    if (value == undefined || value == null) {
                        return true;
                    }
                    if (Array.isArray(value)) {
                        if (value.length == 0) {
                            return true;
                        }
                    }
                    else if (typeof (value) == 'object') {
                        if (Object.keys(value).length == 0) {
                            return true;
                        }
                    }
                    return false;
                };
                EmptyPipe = __decorate([
                    core_1.Pipe({
                        name: "empty"
                    }), 
                    __metadata('design:paramtypes', [])
                ], EmptyPipe);
                return EmptyPipe;
            }());
            exports_1("EmptyPipe", EmptyPipe);
        }
    }
});
