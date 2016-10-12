System.register(["rxjs/Rx"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Rx_1;
    var PreferenceService;
    return {
        setters:[
            function (Rx_1_1) {
                Rx_1 = Rx_1_1;
            }],
        execute: function() {
            PreferenceService = (function () {
                function PreferenceService() {
                }
                /**
                 * get value of a certain preference
                 * @param viewContainer:ViewContainerRef
                 * @param setting:string
                 */
                PreferenceService.prototype.getPreference = function (viewContainer, setting) {
                    console.warn('method getPreference is not implemented please override this with your own implementation');
                    return Rx_1.Observable.create(function () {
                    });
                };
                /**
                 * set preference
                 * @param viewContainer
                 * @param setting:string
                 * @param value:any
                 */
                PreferenceService.prototype.setPreference = function (viewContainer, setting, value) {
                    console.warn('method setPreferece is not implemented please override this with your own implementation');
                };
                return PreferenceService;
            }());
            exports_1("PreferenceService", PreferenceService);
        }
    }
});
