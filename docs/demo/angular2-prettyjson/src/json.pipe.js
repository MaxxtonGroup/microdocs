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
var core_1 = require("@angular/core");
var safe_util_1 = require("./safe.util");
var SafeJsonPipe = (function () {
    function SafeJsonPipe() {
    }
    SafeJsonPipe.prototype.transform = function (obj, spaces) {
        if (spaces === void 0) { spaces = 2; }
        return JSON.stringify(obj, safe_util_1.serializer(), spaces);
    };
    SafeJsonPipe = __decorate([
        core_1.Pipe({
            name: "json",
            pure: false
        }), 
        __metadata('design:paramtypes', [])
    ], SafeJsonPipe);
    return SafeJsonPipe;
}());
exports.SafeJsonPipe = SafeJsonPipe;
//# sourceMappingURL=json.pipe.js.map