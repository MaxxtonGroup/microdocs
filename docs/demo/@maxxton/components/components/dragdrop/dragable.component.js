System.register(["@angular/core", "../../services/dragdrop.service", "rxjs/Rx"], function(exports_1, context_1) {
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
    var core_1, dragdrop_service_1, Rx_1;
    var DraggableComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (dragdrop_service_1_1) {
                dragdrop_service_1 = dragdrop_service_1_1;
            },
            function (Rx_1_1) {
                Rx_1 = Rx_1_1;
            }],
        execute: function() {
            /**
             * Created by Reinartz.T on 9-8-2016.
             */
            DraggableComponent = (function () {
                function DraggableComponent(element, dragdropService, zone) {
                    var _this = this;
                    this.element = element;
                    this.dragdropService = dragdropService;
                    this.zone = zone;
                    this.dragable = true;
                    this.dragging = false;
                    this.hidden = false;
                    this.draggable = null;
                    //queryselector to choose the element you want to start dragging from
                    this.dragElem = null;
                    this.mouseup = new core_1.EventEmitter();
                    this.mousedown = new core_1.EventEmitter();
                    this.mousemove = new core_1.EventEmitter();
                    this.clonedNode = null;
                    this.lastMouseMove = null;
                    this.mouseIsDown = false;
                    this.mousedrag = this.mousedown.map(function (event) {
                        return {
                            top: event.layerY,
                            left: event.layerX,
                        };
                    })
                        .flatMap(function (imageOffset) { return _this.mousemove.map(function (pos) {
                        return {
                            top: pos.pageY - imageOffset.top,
                            left: pos.pageX - imageOffset.left
                        };
                    })
                        .takeUntil(_this.mouseup); });
                }
                DraggableComponent.prototype.ngOnInit = function () {
                    this.handleSubscriptions();
                    this.startMouseListners();
                };
                DraggableComponent.prototype.ngOnDestroy = function () {
                    if (this.clonedNode) {
                        this.clonedNode.parentNode.removeChild(this.clonedNode);
                        this.clonedNode = null;
                    }
                    this.mouseMoveSubscription.unsubscribe();
                    this.mousedownSubscription.unsubscribe();
                    this.mouseupSubscription.unsubscribe();
                };
                //  @HostListener( 'document:mouseup', [ '$event' ] )
                DraggableComponent.prototype.onMouseup = function (event) {
                    var _this = this;
                    this.mouseIsDown = false;
                    this.zone.run(function () {
                        if (_this.dragging) {
                            _this.dragging = false;
                            _this.dragdropService.setDragNode(null);
                            _this.element.nativeElement.style.transform = null;
                            _this.element.nativeElement.style.display = null;
                            if (_this.clonedNode) {
                                _this.clonedNode.parentNode.removeChild(_this.clonedNode);
                                _this.clonedNode = null;
                            }
                            _this.mouseup.emit(event);
                            _this.dragdropService.dropped.emit(true);
                            _this.dragdropService.onMouseMove.emit({ top: 0, left: 0 });
                        }
                    });
                };
                //  @HostListener( 'mousedown', [ '$event' ] )
                DraggableComponent.prototype.onMousedown = function (event) {
                    var _this = this;
                    if (this.dragElem == null || event.target == this.element.nativeElement.querySelector(this.dragElem)) {
                        this.mouseIsDown = true;
                        this.zone.run(function () {
                            _this.dragging = true;
                            _this.mousedown.emit(event);
                            _this.clonedNode = _this.element.nativeElement.cloneNode(true);
                            _this.clonedNode.style.position = 'absolute';
                            _this.clonedNode.style.width = _this.element.nativeElement.getBoundingClientRect().width + 'px';
                            _this.clonedNode.style.height = _this.element.nativeElement.getBoundingClientRect().height + 'px';
                            _this.clonedNode.style.left = '-1000px';
                            // this.element.nativeElement.style.display = 'none';
                            // this.clonedNode.classList.add( 'cloned' );
                            document.body.appendChild(_this.clonedNode);
                            _this.dragdropService.setData(_this.draggable);
                            _this.dragdropService.setDragNode(_this.clonedNode);
                            //trigger mouse drag
                            _this.onMousemove(event);
                        });
                    }
                    return false;
                };
                //  @HostListener( 'document:mousemove', [ '$event' ] )
                DraggableComponent.prototype.onMousemove = function (event) {
                    var _this = this;
                    if (this.mouseIsDown) {
                        this.zone.run(function () {
                            _this.lastMouseMove = event;
                            _this.mousemove.emit(event);
                        });
                    }
                };
                //
                //  @HostListener( 'document:scroll', [ '$event' ] )
                //  onScroll( event: Event ) {
                //    let simulatedEvent: MouseEvent = document.createEvent( "MouseEvent" )
                //        .initMouseEvent( "mousemove", true, true, window, 1,
                //            this.lastMouseMove.screenX, this.lastMouseMove.screenY,
                //            this.lastMouseMove.clientX, this.lastMouseMove.clientY, false,
                //            false, false, false, 0, null );
                //
                //    this.onMousemove( simulatedEvent );
                //  }
                DraggableComponent.prototype.touchStart = function (event) {
                    this.touchHandler(event);
                };
                DraggableComponent.prototype.touchMove = function (event) {
                    this.touchHandler(event);
                };
                DraggableComponent.prototype.touchEnd = function (event) {
                    this.touchHandler(event);
                };
                DraggableComponent.prototype.handleSubscriptions = function () {
                    var _this = this;
                    this.mousedrag.subscribe({
                        next: function (pos) {
                            _this.dragging = true;
                            _this.dragdropService.onMouseMove.emit(pos);
                            _this.clonedNode.style.top = pos.top + "px";
                            _this.clonedNode.style.left = pos.left + "px";
                        }
                    });
                    this.dragdropService.onDragOver.subscribe(function (dragOver) {
                        _this.hidden = _this.dragging && dragOver;
                    });
                    this.dragdropService.dropped.subscribe(function () {
                        _this.hidden = false;
                    });
                };
                DraggableComponent.prototype.startMouseListners = function () {
                    var _this = this;
                    this.zone.runOutsideAngular(function () {
                        _this.mouseMoveSubscription = Rx_1.Observable.fromEvent(document, "mousemove").subscribe(function (event) {
                            event.preventDefault();
                            _this.onMousemove(event);
                        });
                        _this.mousedownSubscription = Rx_1.Observable.fromEvent(_this.element.nativeElement, "mousedown").subscribe(function (event) {
                            event.preventDefault();
                            _this.onMousedown(event);
                        });
                        _this.mouseupSubscription = Rx_1.Observable.fromEvent(document, "mouseup").subscribe(function (event) {
                            event.preventDefault();
                            _this.onMouseup(event);
                        });
                    });
                };
                DraggableComponent.prototype.touchHandler = function (event) {
                    var touches = event.changedTouches, first = touches[0], type = "";
                    switch (event.type) {
                        case "touchstart":
                            type = "mousedown";
                            break;
                        case "touchmove":
                            type = "mousemove";
                            break;
                        case "touchend":
                            type = "mouseup";
                            break;
                        default:
                            return;
                    }
                    var simulatedEvent = document.createEvent("MouseEvent");
                    simulatedEvent.initMouseEvent(type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, false, false, false, false, 0, null);
                    first.target.dispatchEvent(simulatedEvent);
                    event.preventDefault();
                };
                __decorate([
                    core_1.HostBinding('class.draggable'), 
                    __metadata('design:type', Boolean)
                ], DraggableComponent.prototype, "dragable", void 0);
                __decorate([
                    core_1.HostBinding('class.dragging'), 
                    __metadata('design:type', Boolean)
                ], DraggableComponent.prototype, "dragging", void 0);
                __decorate([
                    core_1.HostBinding('hidden'), 
                    __metadata('design:type', Boolean)
                ], DraggableComponent.prototype, "hidden", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], DraggableComponent.prototype, "draggable", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], DraggableComponent.prototype, "dragElem", void 0);
                __decorate([
                    core_1.HostListener('touchstart', ['$event']), 
                    __metadata('design:type', Function), 
                    __metadata('design:paramtypes', [TouchEvent]), 
                    __metadata('design:returntype', void 0)
                ], DraggableComponent.prototype, "touchStart", null);
                __decorate([
                    core_1.HostListener('touchmove', ['$event']), 
                    __metadata('design:type', Function), 
                    __metadata('design:paramtypes', [TouchEvent]), 
                    __metadata('design:returntype', void 0)
                ], DraggableComponent.prototype, "touchMove", null);
                __decorate([
                    core_1.HostListener('touchend', ['$event']), 
                    __metadata('design:type', Function), 
                    __metadata('design:paramtypes', [TouchEvent]), 
                    __metadata('design:returntype', void 0)
                ], DraggableComponent.prototype, "touchEnd", null);
                DraggableComponent = __decorate([
                    core_1.Directive({
                        selector: '[draggable]'
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef, dragdrop_service_1.DragdropService, core_1.NgZone])
                ], DraggableComponent);
                return DraggableComponent;
            }());
            exports_1("DraggableComponent", DraggableComponent);
        }
    }
});
