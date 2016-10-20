System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var SearchbarInputModel;
    return {
        setters:[],
        execute: function() {
            SearchbarInputModel = (function () {
                function SearchbarInputModel() {
                    this.value = '';
                }
                SearchbarInputModel.prototype.writeValue = function (value) {
                    this.value = value;
                };
                SearchbarInputModel.prototype.clearValue = function () {
                    this.value = '';
                };
                return SearchbarInputModel;
            }());
            exports_1("SearchbarInputModel", SearchbarInputModel);
        }
    }
});
