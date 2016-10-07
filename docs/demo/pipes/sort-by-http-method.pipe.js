"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const core_1 = require("@angular/core");
/**
 * Custom sort http methods
 */
let SortByHttpMethod = class SortByHttpMethod {
    transform(list, key) {
        if (list == undefined || list == null || list.length == 0)
            return list;
        if (key == undefined || key == null || key.length == 0)
            return list;
        var self = this;
        return list.sort(function (a, b) {
            var fieldA = self.getValueOf(a[key]);
            var fieldB = self.getValueOf(b[key]);
            if (fieldA < fieldB)
                return -1;
            if (fieldA > fieldB)
                return 1;
            return 0;
        });
    }
    getValueOf(httpMethod) {
        switch (httpMethod.toLowerCase()) {
            case 'get': return 1;
            case 'post': return 2;
            case 'put': return 3;
            case 'patch': return 4;
            case 'delete': return 5;
            default: return 9;
        }
    }
};
SortByHttpMethod = __decorate([
    core_1.Pipe({ name: 'sortByHttpMethod' }), 
    __metadata('design:paramtypes', [])
], SortByHttpMethod);
exports.SortByHttpMethod = SortByHttpMethod;
