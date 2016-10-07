System.register(["@angular/core", "./step/step.component", "../../helpers/ease-animation.util"], function(exports_1, context_1) {
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
    var __param = (this && this.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };
    var core_1, step_component_1, ease_animation_util_1;
    var StepperComponent, STEPPER_DIRECTIVES;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (step_component_1_1) {
                step_component_1 = step_component_1_1;
            },
            function (ease_animation_util_1_1) {
                ease_animation_util_1 = ease_animation_util_1_1;
            }],
        execute: function() {
            StepperComponent = (function () {
                function StepperComponent(stepComponents, animate) {
                    this.stepComponents = stepComponents;
                    this.animate = animate;
                    this.activeStep = 0;
                    this.loaderValue = 0;
                    this.loading = false;
                    this.completeLabel = null;
                    this.completeChange = new core_1.EventEmitter();
                    this.steps = [];
                }
                StepperComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.stepComponents.changes.subscribe(function (steps) {
                        //unsubscribe from changes on the loader
                        _this.steps.forEach(function (step) {
                            step.loadingChange.unsubscribe();
                        });
                        //clean the list of steps
                        _this.steps = [];
                        _this.stepComponents.toArray().forEach(function (step) {
                            _this.steps.push(step);
                        });
                        //get loading state from step component
                        _this.steps.forEach(function (step) {
                            step.loadingChange.subscribe(function (loading) {
                                _this.loading = loading;
                                if (_this.loading) {
                                    _this.startLoader();
                                }
                            });
                        });
                        //select the first step
                        if (_this.steps.length)
                            _this.selectStep(_this.steps[0]);
                    });
                };
                StepperComponent.prototype.selectStep = function (step) {
                    var _this = this;
                    var activated = false;
                    this.steps.forEach(function (_step, index) {
                        if (_step == step && _this.canActivate((index - 2))) {
                            step.setActiveState(true);
                            _this.activeStep = index;
                            activated = true;
                        }
                    });
                    if (activated) {
                        this.steps.forEach(function (_step, index) {
                            if (_step != step)
                                _step.setActiveState(false);
                            else
                                _this.activeStep = index;
                        });
                    }
                };
                StepperComponent.prototype.gotoNextStep = function () {
                    if (this.steps && this.activeStep < (this.steps.length - 1)) {
                        this.selectStep(this.steps[(this.activeStep + 1)]);
                    }
                };
                StepperComponent.prototype.gotoPrevStep = function () {
                    if (this.steps && this.activeStep > 0) {
                        this.selectStep(this.steps[(this.activeStep - 1)]);
                    }
                };
                StepperComponent.prototype.canActivate = function (index) {
                    //prev steps, next step
                    if (!this.loading && (index < this.activeStep || this.activeStep == (index + 1))) {
                        if (this.steps[this.activeStep].valid)
                            return true;
                    }
                    return false;
                };
                StepperComponent.prototype.startLoader = function () {
                    var _this = this;
                    var currentIteration = 0;
                    var totalIterations = 150;
                    _this.loaderValue = 0;
                    function runLoader() {
                        _this.loaderValue = _this.animate.easeOutCubic(currentIteration, 0, 100, totalIterations);
                        currentIteration++;
                        if (currentIteration == totalIterations) {
                            _this.loaderValue = 0;
                            currentIteration = 0;
                        }
                        if (_this.loading)
                            window.requestAnimationFrame(runLoader);
                    }
                    runLoader();
                };
                StepperComponent.prototype.complete = function () {
                    this.completeChange.emit(true);
                };
                StepperComponent.prototype.handleKeyPress = function (keyboardEvent) {
                    if (keyboardEvent.srcElement.nodeName != "INPUT") {
                        if (keyboardEvent.keyCode == 39)
                            this.gotoNextStep();
                        if (keyboardEvent.keyCode == 37)
                            this.gotoPrevStep();
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], StepperComponent.prototype, "completeLabel", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], StepperComponent.prototype, "completeChange", void 0);
                StepperComponent = __decorate([
                    core_1.Component({
                        selector: 'stepper',
                        template:'<div class="stepper-container" (window:keydown)="handleKeyPress($event)"><div class="stepper-header"><ul class="menu-bar"><li><a *ngFor="let step of steps; let i = index" (click)="selectStep(step)" [class.active]="( i ) == activeStep" [class.past]="i < activeStep" [class.future]="i > activeStep" [class.disabled]="!canActivate(i - 2)"><span class="badge" [class.secondary]="( i ) == activeStep" [class.success]="i < activeStep">{{(i + 1)}}</span>{{step.title}}</a></li></ul></div><progress max="100" [value]="loaderValue" [hidden]="!loading"></progress><div class="stepper-steps" [class.loading]="loading"><ng-content></ng-content></div><div class="stepper-actions inline-block"><div class="button" *ngIf="activeStep > 0" [class.disabled]="!canActivate(activeStep - 2)" (click)="gotoPrevStep()">Back</div><div class="button float-right colored" [class.disabled]="!canActivate(activeStep -1)" *ngIf="activeStep != (steps.length -1)" (click)="gotoNextStep()">Next</div><div class="button float-right colored" [class.disabled]="!canActivate(activeStep -1)" *ngIf="activeStep == (steps.length -1)" (click)="complete()">{{completeLabel || \'Finish\'}}</div></div></div>',
                        directives: [step_component_1.StepComponent],
                    }),
                    __param(0, core_1.Query(step_component_1.StepComponent)), 
                    __metadata('design:paramtypes', [core_1.QueryList, ease_animation_util_1.EaseAnimationUtil])
                ], StepperComponent);
                return StepperComponent;
            }());
            exports_1("StepperComponent", StepperComponent);
            exports_1("STEPPER_DIRECTIVES", STEPPER_DIRECTIVES = [step_component_1.StepComponent, StepperComponent]);
        }
    }
});
