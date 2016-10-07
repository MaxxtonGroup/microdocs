System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ModalService;
    return {
        setters:[],
        execute: function() {
            ModalService = (function () {
                function ModalService() {
                    this.modal = null;
                }
                ModalService.prototype.setModal = function (modal) {
                    this.modal = modal;
                    document.dispatchEvent(new CustomEvent('modalAdded', modal));
                };
                ModalService.prototype.unSetModal = function (modal) {
                    this.modal = null;
                    document.dispatchEvent(new CustomEvent('modalRemoved', modal));
                };
                ModalService.prototype.getCurrentActiveModal = function () {
                    return this.modal;
                };
                return ModalService;
            }());
            exports_1("ModalService", ModalService);
        }
    }
});
