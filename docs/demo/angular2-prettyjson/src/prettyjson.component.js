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
var prettyjson_pipe_1 = require("./prettyjson.pipe");
var PrettyJsonComponent = (function () {
    function PrettyJsonComponent() {
    }
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], PrettyJsonComponent.prototype, "obj", void 0);
    PrettyJsonComponent = __decorate([
        core_1.Component({
            selector: "prettyjson",
            pipes: [prettyjson_pipe_1.PrettyJsonPipe],
            template: "\n    <pre [innerHtml]=\"obj | prettyjson\">\n    </pre>\n  ",
            styles: [
                "pre {outline: 1px solid #ccc; padding: 5px; margin: 5px; }\n    :host >>> .string { color: green; }\n    :host >>> .number { color: darkorange; }\n    :host >>> .boolean { color: blue; }\n    :host >>> .null { color: magenta; }\n    :host >>> .key { color: red; }"
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], PrettyJsonComponent);
    return PrettyJsonComponent;
}());
exports.PrettyJsonComponent = PrettyJsonComponent;
//# sourceMappingURL=prettyjson.component.js.map