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
var filters_1 = require("@maxxton/components/filters");
var ProblemPanel = (function () {
    function ProblemPanel() {
    }
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], ProblemPanel.prototype, "problems", void 0);
    ProblemPanel = __decorate([
        core_1.Component({
            selector: 'problem-panel',
            template:'<div class="problem-box error" *ngFor="let problem of problems | filterByField:\'level\':\'error\'"><span class=icon>error</span> <span class=problem>{{problem.message}}</span></div><div class="problem-box warning" *ngFor="let problem of problems | filterByField:\'level\':\'warning\'"><span class=icon>warning</span> <span class=problem>{{problem.message}}</span></div><div class="problem-box notice" *ngFor="let problem of problems | filterByField:\'level\':\'notice\'"><span class=icon>info</span> <span class=problem>{{problem.message}}</span></div>',
            pipes: [filters_1.FILTERS]
        }), 
        __metadata('design:paramtypes', [])
    ], ProblemPanel);
    return ProblemPanel;
}());
exports.ProblemPanel = ProblemPanel;
