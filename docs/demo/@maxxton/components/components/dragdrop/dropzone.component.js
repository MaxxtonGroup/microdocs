System.register(["@angular/core", "../../services/dragdrop.service"], function(exports_1, context_1) {
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
    var core_1, dragdrop_service_1;
    var DropzoneComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (dragdrop_service_1_1) {
                dragdrop_service_1 = dragdrop_service_1_1;
            }],
        execute: function() {
            DropzoneComponent = (function () {
                function DropzoneComponent(element, dragdropService) {
                    this.element = element;
                    this.dragdropService = dragdropService;
                    this.dropStyle = "full";
                    this.dropLayout = "grid";
                    //event will be triggered once
                    this.dropped = new core_1.EventEmitter();
                    this.dragggedOver = new core_1.EventEmitter();
                    this.clonedDragNode = null;
                    this.dropzone = true;
                    this.dragOver = false;
                }
                DropzoneComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.dragdropService.dropped.subscribe(function () {
                        _this.removeClonedDragNode();
                        if (_this.dragOver) {
                            _this.dropped.emit({
                                before: _this.lastPosToBeforeBoolean(_this.lastPos),
                                data: _this.dragdropService.getData()
                            });
                            _this.dragOver = false;
                            _this.dragggedOver.emit(_this.dragOver);
                        }
                    });
                    this.dragdropService.onMouseMove.subscribe(function () {
                        if (_this.dragdropService.dragNode && _this.dragdropService.dragNode !== _this.element.nativeElement) {
                            _this.lastPos = _this.hitTest(_this.dragdropService.dragNode.getBoundingClientRect());
                            if (_this.lastPos) {
                                _this.dragOver = true;
                                var insertBefore = _this.lastPosToBeforeBoolean(_this.lastPos);
                                if (_this.dropStyle === "move") {
                                    _this.createCopyOfDragElementAtDropZone(insertBefore);
                                }
                                _this.dragggedOver.emit({
                                    before: insertBefore,
                                    data: _this.dragdropService.getData()
                                });
                                _this.dragdropService.onDragOver.emit(true);
                            }
                            else if (_this.dragOver) {
                                _this.dragOver = false;
                                _this.removeClonedDragNode();
                                _this.dragggedOver.emit(false);
                                _this.dragdropService.onDragOver.emit(false);
                            }
                        }
                    });
                };
                DropzoneComponent.prototype.ngOnDestroy = function () {
                    this.removeClonedDragNode();
                };
                DropzoneComponent.prototype.hitTest = function (clientBounds) {
                    if (clientBounds.width > clientBounds.height && this.collideTest(clientBounds, this.element.nativeElement.getBoundingClientRect())) {
                        return this.checkSideOfBounds(this.element.nativeElement.getBoundingClientRect(), clientBounds.left + (clientBounds.width / 2), clientBounds.top + (clientBounds.height / 2));
                    }
                    return this.moveHitTest(clientBounds.left + (clientBounds.width / 2), clientBounds.top + (clientBounds.height / 2));
                };
                DropzoneComponent.prototype.collideTest = function (rect1, rect2) {
                    return !(rect1.top > rect2.bottom ||
                        rect1.right < rect2.left ||
                        rect1.bottom < rect2.top ||
                        rect1.left > rect2.right);
                };
                DropzoneComponent.prototype.moveHitTest = function (x, y) {
                    var dropzoneBounds = this.element.nativeElement.getBoundingClientRect();
                    var clonedBounds = null;
                    if (this.clonedDragNode) {
                        clonedBounds = this.clonedDragNode.getBoundingClientRect();
                    }
                    //you can hit this dropzone
                    // you can hit the cloned element
                    if (x >= dropzoneBounds.left
                        && x <= dropzoneBounds.right
                        && y <= dropzoneBounds.bottom
                        && y >= dropzoneBounds.top) {
                        return this.checkSideOfBounds(dropzoneBounds, x, y);
                    }
                    else if ((clonedBounds !== null &&
                        x >= clonedBounds.left
                        && x <= clonedBounds.right
                        && y <= clonedBounds.bottom
                        && y >= clonedBounds.top) && !this.element.nativeElement.classList.contains("dragging")) {
                        return this.lastPos;
                    }
                    else {
                        return null;
                    }
                };
                DropzoneComponent.prototype.checkSideOfBounds = function (bounds, x, y) {
                    /**
                     *  Define the position of the dragging in relation to the dropzone
                     *
                     *  ---------------
                     *  | x1,y1 | x2,y1 |
                     *  |       |       |
                     *  | ----- |------ |
                     *  | x1,y2 | x2,y2 |
                     *  |       |       |
                     *  ---------------
                     *
                     *  Default position is bottom right
                     */
                    var position = { x: 2, y: 2 };
                    //check left or right
                    if (x < bounds.left + (bounds.width / 2)) {
                        position.x = 1;
                    }
                    //check top or bottom
                    if (y < bounds.top + (bounds.height / 2)) {
                        position.y = 1;
                    }
                    return position;
                };
                DropzoneComponent.prototype.createCopyOfDragElementAtDropZone = function (before) {
                    if (!this.clonedDragNode) {
                        this.clonedDragNode = this.dragdropService.dragNode.cloneNode(true);
                    }
                    if (this.clonedDragNode) {
                        this.clonedDragNode.removeAttribute("style");
                        this.clonedDragNode.classList.add("drag-copy-element");
                        this.clonedDragNode.classList.remove("draggable");
                        if (before) {
                            this.element.nativeElement.parentElement.insertBefore(this.clonedDragNode, this.element.nativeElement);
                        }
                        else {
                            this.element.nativeElement.parentElement.insertBefore(this.clonedDragNode, this.element.nativeElement.nextSibling);
                        }
                    }
                };
                DropzoneComponent.prototype.removeClonedDragNode = function () {
                    if (this.clonedDragNode) {
                        this.clonedDragNode.parentElement.removeChild(this.clonedDragNode);
                        this.clonedDragNode = null;
                    }
                };
                DropzoneComponent.prototype.lastPosToBeforeBoolean = function (pos) {
                    if (this.dropLayout == "grid") {
                        return pos.x == 1;
                    }
                    else {
                        return pos.y == 1;
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], DropzoneComponent.prototype, "dropStyle", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], DropzoneComponent.prototype, "dropLayout", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], DropzoneComponent.prototype, "dropped", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], DropzoneComponent.prototype, "dragggedOver", void 0);
                __decorate([
                    core_1.HostBinding("class.dropzone"), 
                    __metadata('design:type', Boolean)
                ], DropzoneComponent.prototype, "dropzone", void 0);
                __decorate([
                    core_1.HostBinding("class.drag-over"), 
                    __metadata('design:type', Boolean)
                ], DropzoneComponent.prototype, "dragOver", void 0);
                DropzoneComponent = __decorate([
                    core_1.Directive({
                        selector: "[droppingzone]"
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef, dragdrop_service_1.DragdropService])
                ], DropzoneComponent);
                return DropzoneComponent;
            }());
            exports_1("DropzoneComponent", DropzoneComponent);
        }
    }
});
