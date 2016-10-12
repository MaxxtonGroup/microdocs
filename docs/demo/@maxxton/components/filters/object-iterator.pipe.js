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
    var ObjectIteratorPipe;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            /**
             * This Pipe is used to iterate through a key-value array
             * Example usage:
             *   <div *ngFor="let property in myObject | object-iterator">
             *     </span>{{property._id}}</span>
             *   </div>
             */
            ObjectIteratorPipe = (function () {
                function ObjectIteratorPipe() {
                }
                ObjectIteratorPipe.prototype.transform = function (object) {
                    if (object == undefined || object == null) {
                        return [];
                    }
                    var result = [];
                    for (var key in object) {
                        if (key != '_id') {
                            var value = object[key];
                            if (value != undefined && value != null && typeof (value) == 'object' && !Array.isArray(value)) {
                                value._id = key;
                            }
                            result.push(value);
                        }
                    }
                    return result;
                };
                ObjectIteratorPipe = __decorate([
                    core_1.Pipe({
                        name: "objectIterator"
                    }), 
                    __metadata('design:paramtypes', [])
                ], ObjectIteratorPipe);
                return ObjectIteratorPipe;
            }());
            exports_1("ObjectIteratorPipe", ObjectIteratorPipe);
        }
    }
});
