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
    var NotEmptyPipe;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            /**
             * This Pipe is used to check if an object or path of an object is not empty
             * Example usage:
             *   <div *ngIf="parent | not-empty:'children.john'">
             */
            NotEmptyPipe = (function () {
                function NotEmptyPipe() {
                }
                NotEmptyPipe.prototype.transform = function (value, path) {
                    if (this.isEmpty(value)) {
                        return false;
                    }
                    if (path != undefined) {
                        var currentObject = value;
                        var segments = path.split(".");
                        for (var i = 0; i < segments.length; i++) {
                            currentObject = currentObject[segments[i]];
                            if (this.isEmpty(currentObject)) {
                                return false;
                            }
                        }
                    }
                    return true;
                };
                NotEmptyPipe.prototype.isEmpty = function (value) {
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
                NotEmptyPipe = __decorate([
                    core_1.Pipe({
                        name: "notEmpty"
                    }), 
                    __metadata('design:paramtypes', [])
                ], NotEmptyPipe);
                return NotEmptyPipe;
            }());
            exports_1("NotEmptyPipe", NotEmptyPipe);
        }
    }
});
