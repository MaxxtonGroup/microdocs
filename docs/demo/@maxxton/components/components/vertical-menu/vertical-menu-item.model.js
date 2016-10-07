System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var MenuItemModel;
    return {
        setters:[],
        execute: function() {
            MenuItemModel = (function () {
                function MenuItemModel(title, action, icon, inMenu, parent) {
                    this.title = title;
                    this.action = action;
                    this.icon = icon;
                    this.inMenu = inMenu;
                    this.parent = parent;
                    this.childrenVisible = false;
                    this.active = false;
                    function generateUUID() {
                        var d = new Date().getTime();
                        var uuid = 'MENUID-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                            var r = (d + Math.random() * 16) % 16 | 0;
                            d = Math.floor(d / 16);
                            return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
                        });
                        return uuid.toUpperCase();
                    }
                    this.id = generateUUID();
                }
                MenuItemModel.prototype.setActive = function () {
                    this.active = true;
                };
                MenuItemModel.prototype.setInactive = function () {
                    this.active = false;
                };
                MenuItemModel.prototype.toggleActive = function () {
                    this.active = !this.active;
                };
                MenuItemModel.prototype.showChildren = function () {
                    this.childrenVisible = true;
                };
                MenuItemModel.prototype.hideChildren = function () {
                    this.childrenVisible = false;
                };
                MenuItemModel.prototype.toggleChildren = function () {
                    this.childrenVisible = !this.childrenVisible;
                };
                return MenuItemModel;
            }());
            exports_1("MenuItemModel", MenuItemModel);
        }
    }
});
