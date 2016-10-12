System.register(["@angular/core", "rxjs/Observable"], function(exports_1, context_1) {
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
    var core_1, Observable_1;
    var StopwatchComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            }],
        execute: function() {
            StopwatchComponent = (function () {
                function StopwatchComponent() {
                    this.startTime = null;
                    this.autoStart = true;
                    this.runTime = null;
                    this.stopwatchInterval = Observable_1.Observable.interval(1000).startWith(0);
                }
                StopwatchComponent.prototype.ngOnInit = function () {
                    if (this.autoStart) {
                        this.start();
                    }
                };
                StopwatchComponent.prototype.start = function () {
                    var _this = this;
                    if (this.startTime == null) {
                        this.startTime = new Date();
                    }
                    this.stopwatchSubscription = this.stopwatchInterval.subscribe(function (timer) {
                        _this.runTime = _this.getCurrentRunDuration();
                    });
                };
                StopwatchComponent.prototype.stop = function () {
                    this.startTime = null;
                    this.stopwatchSubscription.unsubscribe();
                };
                StopwatchComponent.prototype.pause = function () {
                    this.stopwatchSubscription.unsubscribe();
                };
                StopwatchComponent.prototype.getCurrentRunDuration = function () {
                    if (this.startTime == null) {
                        return null;
                    }
                    var seconds = Math.floor((new Date().getTime() - (this.startTime.getTime())) / 1000);
                    var minutes = Math.floor(seconds / 60);
                    var hours = Math.floor(minutes / 60);
                    var days = Math.floor(hours / 24);
                    hours = hours - (days * 24);
                    minutes = minutes - (days * 24 * 60) - (hours * 60);
                    seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);
                    return "" + (hours < 10 ? '0' + hours : hours) + ":" + (minutes < 10 ? '0' + minutes : minutes) + ":" + (seconds < 10 ? '0' + seconds : seconds);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Date)
                ], StopwatchComponent.prototype, "startTime", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], StopwatchComponent.prototype, "autoStart", void 0);
                StopwatchComponent = __decorate([
                    core_1.Component({
                        selector: 'stopwatch',
                        template: '{{runTime}}'
                    }), 
                    __metadata('design:paramtypes', [])
                ], StopwatchComponent);
                return StopwatchComponent;
            }());
            exports_1("StopwatchComponent", StopwatchComponent);
        }
    }
});
