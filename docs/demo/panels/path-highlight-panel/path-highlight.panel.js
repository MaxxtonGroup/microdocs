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
/**
 * @author Steven Hermans
 */
var PathHighlightPanel = (function () {
    function PathHighlightPanel(el) {
        this.el = el;
        this.highlightPath = '';
    }
    PathHighlightPanel.prototype.ngOnChanges = function (changes) {
        this.highlightPath = this.path
            .replace(new RegExp("\{", 'g'), '<span class="highlight">{')
            .replace(new RegExp("\}", 'g'), '}</span>');
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], PathHighlightPanel.prototype, "path", void 0);
    PathHighlightPanel = __decorate([
        core_1.Component({
            selector: 'path-highlight',
            template:'<span [innerHTML]=highlightPath></span>'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], PathHighlightPanel);
    return PathHighlightPanel;
}());
exports.PathHighlightPanel = PathHighlightPanel;
