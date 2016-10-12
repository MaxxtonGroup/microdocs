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
var WelcomePanel = (function () {
    function WelcomePanel() {
    }
    WelcomePanel = __decorate([
        core_1.Component({
            selector: 'welcome-panel',
            template:'<h1>MicroDocs server is up and running!</h1><h4>You can add your first project now. If you need help, see the <a [href]="\'http://www.microdocs.io/documentation/#!home/get-started\'" target=_blank>Get Started Guide</a></h4>'
        }), 
        __metadata('design:paramtypes', [])
    ], WelcomePanel);
    return WelcomePanel;
}());
exports.WelcomePanel = WelcomePanel;
