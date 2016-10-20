/**
 * Exports of all services
 * @author R. Reinartz (r.reinartz@maxxton.com)
 */
System.register(["./hotlink.service", "./modal.service", "./snackbar.service", "./dragdrop.service", "./preference.service", "./impl/localstorage-preverence.service"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var hotlink_service_1, modal_service_1, snackbar_service_1, dragdrop_service_1;
    var APP_WIDE_SERVICES;
    return {
        setters:[
            function (hotlink_service_1_1) {
                hotlink_service_1 = hotlink_service_1_1;
                exports_1({
                    "HotlinkService": hotlink_service_1_1["HotlinkService"]
                });
            },
            function (modal_service_1_1) {
                modal_service_1 = modal_service_1_1;
                exports_1({
                    "ModalService": modal_service_1_1["ModalService"]
                });
            },
            function (snackbar_service_1_1) {
                snackbar_service_1 = snackbar_service_1_1;
                exports_1({
                    "SnackbarService": snackbar_service_1_1["SnackbarService"]
                });
            },
            function (dragdrop_service_1_1) {
                dragdrop_service_1 = dragdrop_service_1_1;
            },
            function (preference_service_1_1) {
                exports_1({
                    "DummyPreferenceService": preference_service_1_1["PreferenceService"]
                });
            },
            function (localstorage_preverence_service_1_1) {
                exports_1({
                    "LocalStoragePreferenceService": localstorage_preverence_service_1_1["LocalStoragePreferenceService"]
                });
            }],
        execute: function() {
            //combined app servies (app wide)
            exports_1("APP_WIDE_SERVICES", APP_WIDE_SERVICES = [
                hotlink_service_1.HotlinkService,
                modal_service_1.ModalService,
                snackbar_service_1.SnackbarService,
                dragdrop_service_1.DragdropService
            ]);
        }
    }
});
