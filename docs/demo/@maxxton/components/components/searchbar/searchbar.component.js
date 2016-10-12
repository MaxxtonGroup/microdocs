System.register(["@angular/core", "@angular/common", "rxjs/Rx", "./searchbar-input.model"], function(exports_1, context_1) {
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
    var core_1, common_1, Rx_1, searchbar_input_model_1;
    var SearchbarComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (Rx_1_1) {
                Rx_1 = Rx_1_1;
            },
            function (searchbar_input_model_1_1) {
                searchbar_input_model_1 = searchbar_input_model_1_1;
            }],
        execute: function() {
            SearchbarComponent = (function () {
                function SearchbarComponent() {
                    this.placeHolder = null;
                    this.search = new core_1.EventEmitter();
                    this.debouncedSearch = new core_1.EventEmitter();
                    this.isFocused = false;
                    this.shouldLeftAlign = false;
                }
                SearchbarComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    // If there is no control then we shouldn't do anything
                    this.searchBarInput = new searchbar_input_model_1.SearchbarInputModel();
                    this.hideCancelButton = (this.value == undefined || this.value == '');
                    this.placeholder = this.placeholder || 'Search';
                    this.searchBarInput.value = this.value || '';
                    Rx_1.Observable.create(function (observer) { return _this.debounceObserver = observer; })
                        .debounceTime(this.debounceDelay ? this.debounceDelay : 1000)
                        .distinctUntilChanged()
                        .subscribe(function () { return _this.debouncedSearch.emit(_this.searchBarInput.value); });
                };
                SearchbarComponent.prototype.inputFocused = function () {
                    this.isFocused = true;
                    this.shouldLeftAlign = true;
                };
                SearchbarComponent.prototype.inputBlurred = function () {
                    this.isFocused = false;
                    this.shouldLeftAlign = (this.searchBarInput.value && this.searchBarInput.value.trim() != '');
                };
                SearchbarComponent.prototype.inputChanged = function (event) {
                    //clear value on escape
                    if (event.type == "keyup" && event.keyCode == 27) {
                        event.target.value = '';
                    }
                    if (event.type == "keyup" && event.keyCode == 13) {
                        return this.updateValue();
                    }
                    //only update if value has changed
                    if (this.searchBarInput.value != event.target.value.trim()) {
                        this.searchBarInput.value = event.target.value;
                        this.updateValue();
                    }
                };
                SearchbarComponent.prototype.clearInput = function () {
                    this.searchBarInput.clearValue();
                    this.updateValue();
                };
                SearchbarComponent.prototype.cancelSearchbar = function () {
                    this.shouldLeftAlign = false;
                };
                SearchbarComponent.prototype.updateValue = function () {
                    this.value = this.searchBarInput.value || '';
                    this.searchBarInput.value = this.value;
                    this.hideCancelButton = (this.value == undefined || this.value == '');
                    //direct emit
                    this.search.emit(this.searchBarInput.value);
                    //debounced emit
                    this.debounceObserver.next(this.searchBarInput.value);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], SearchbarComponent.prototype, "value", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Number)
                ], SearchbarComponent.prototype, "debounceDelay", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], SearchbarComponent.prototype, "placeHolder", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], SearchbarComponent.prototype, "search", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], SearchbarComponent.prototype, "debouncedSearch", void 0);
                SearchbarComponent = __decorate([
                    core_1.Component({
                        selector: 'searchbar',
                        providers: [common_1.NgControl],
                        template:'<div class="searchbar-container"><div class="left-icon"><a [hidden]="!shouldLeftAlign" (click)="cancelSearchbar($event, query)" class="icon" role="img" aria-label="arrow back">arrow_back</a><div class="icon" [hidden]="shouldLeftAlign">search</div></div><div class="input-field"><input #searchInput [(value)]="searchBarInput.value" class="searchbar-input" type="search" [attr.placeholder]="placeHolder || \'Search\'" (focus)="inputFocused()" (blur)="inputBlurred()" (keyup)="inputChanged($event)" (change)="inputChanged($event)"></div><div class="right-icon"><a class="icon" clear (click)="clearInput()" [hidden]="hideCancelButton">close</a></div></div>'
                    }), 
                    __metadata('design:paramtypes', [])
                ], SearchbarComponent);
                return SearchbarComponent;
            }());
            exports_1("SearchbarComponent", SearchbarComponent);
        }
    }
});
