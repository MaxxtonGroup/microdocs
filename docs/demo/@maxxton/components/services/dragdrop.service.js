System.register(["@angular/core"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var core_1;
    var DragdropService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            DragdropService = (function () {
                function DragdropService() {
                    this.onMouseMove = new core_1.EventEmitter();
                    this.onDragOver = new core_1.EventEmitter();
                    this.dropped = new core_1.EventEmitter();
                }
                DragdropService.prototype.setData = function (data) {
                    this.data = data;
                };
                DragdropService.prototype.getData = function () {
                    return this.data;
                };
                /**
                 * set the node thats being dragged
                 * @param node
                 */
                DragdropService.prototype.setDragNode = function (node) {
                    this.dragNode = node;
                };
                return DragdropService;
            }());
            exports_1("DragdropService", DragdropService);
        }
    }
});
