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
var PrettyJsonPipe = (function () {
    function PrettyJsonPipe() {
    }
    PrettyJsonPipe.prototype.transform = function (obj, spaces) {
        if (spaces === void 0) { spaces = 2; }
        return this._syntaxHighlight(obj, safe_util_1.serializer(), spaces);
    };
    PrettyJsonPipe.prototype._syntaxHighlight = function (json, serializer, spacing) {
        // Credits to the accepted answer here http://stackoverflow.com/questions/4810841/how-can-i-pretty-print-json-using-javascript
        if (typeof json !== "string") {
            json = JSON.stringify(json, serializer, spacing);
        }
        json = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = "number";
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = "key";
                }
                else {
                    cls = "string";
                }
            }
            else if (/true|false/.test(match)) {
                cls = "boolean";
            }
            else if (/null/.test(match)) {
                cls = "null";
            }
            return "<span class=\"" + cls + "\">" + match + "</span>";
        });
    };
    PrettyJsonPipe = __decorate([
        core_1.Pipe({
            name: "prettyjson",
            pure: false
        }), 
        __metadata('design:paramtypes', [])
    ], PrettyJsonPipe);
    return PrettyJsonPipe;
}());
exports.PrettyJsonPipe = PrettyJsonPipe;
//# sourceMappingURL=prettyjson.pipe.js.map