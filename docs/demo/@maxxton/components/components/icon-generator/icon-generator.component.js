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
    var IconGenerator;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            /**
             * @author Steven Hermans
             */
            IconGenerator = (function () {
                function IconGenerator(el, renderer) {
                    this.el = el;
                    this.renderer = renderer;
                    this.colorRanges = {
                        'pink': ['a', 'b'],
                        'red': ['c', 'd'],
                        'orange': ['e', 'f'],
                        'amber': ['g', 'h'],
                        'yellow': ['i', 'j'],
                        'lime': ['k', 'l'],
                        'green': ['m', 'n'],
                        'teal': ['o', 'p'],
                        'cyan': ['q', 'r'],
                        'light-blue': ['s', 't'],
                        'blue': ['u', 'v'],
                        'indigo': ['w', 'x'],
                        'purple': ['y', 'z']
                    };
                }
                IconGenerator.prototype.ngOnChanges = function () {
                    console.info("change");
                    if (!this.text) {
                        this.initials = null;
                        return;
                    }
                    var first = this.text.substr(0, 1);
                    var second = this.text.substr(1, 1);
                    this.initials = first.toUpperCase() + second.toLowerCase();
                    var selectedColor = color;
                    for (var color in this.colorRanges) {
                        this.colorRanges[color].forEach(function (char) {
                            if (char == first) {
                                selectedColor = color;
                                return false;
                            }
                        });
                        if (selectedColor) {
                            break;
                        }
                    }
                    if (!selectedColor) {
                        selectedColor = 'blue-grey';
                    }
                    this.renderer.setElementAttribute(this.el.nativeElement, 'class', selectedColor);
                };
                __decorate([
                    core_1.Input("text"), 
                    __metadata('design:type', String)
                ], IconGenerator.prototype, "text", void 0);
                IconGenerator = __decorate([
                    core_1.Component({
                        selector: 'icon-generator',
                        template: '<span *ngIf="initials">{{initials}}</span>'
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer])
                ], IconGenerator);
                return IconGenerator;
            }());
            exports_1("IconGenerator", IconGenerator);
        }
    }
});
