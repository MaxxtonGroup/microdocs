System.register(["@angular/core"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var core_1;
    var SnackbarService, snckbrNotificationModel;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            SnackbarService = (function () {
                function SnackbarService() {
                    this.notificationAdded = new core_1.EventEmitter();
                    this.notificationRemoved = new core_1.EventEmitter();
                    this.notifications = [];
                }
                SnackbarService.prototype.getNotifications = function () {
                    return this.notifications;
                };
                SnackbarService.prototype.getNotification = function () {
                    if (this.notifications.length > 0)
                        return this.notifications[0];
                    else
                        return false;
                };
                SnackbarService.prototype.addNotification = function (title, action, style, image, autoclose) {
                    var notificationObj = new snckbrNotificationModel(title, action, style, image, autoclose);
                    this.notifications.push(notificationObj);
                    //emit event
                    this.notificationAdded.emit(notificationObj);
                    return notificationObj;
                };
                ;
                SnackbarService.prototype.removeNotification = function () {
                    var _this = this;
                    if (this.notifications.length > 0) {
                        this.notificationRemoved.emit(new snckbrNotificationModel(this.notifications[0].title, this.notifications[0].action, this.notifications[0].style, this.notifications[0].icon, this.notifications[0].autoclose));
                        this.notifications.shift();
                    }
                };
                ;
                SnackbarService.prototype.removeNotificationById = function (notificationId) {
                    var _this = this;
                    this.notifications.forEach(function (notification) {
                        //remove notification from list
                        if (notification.id === notificationId) {
                            _this.notificationRemoved.emit(new snckbrNotificationModel(notification.title, notification.action, notification.style, notification.icon, notification.autoclose));
                            var ind = _this.notifications.indexOf(notification);
                            _this.notifications.splice(ind, 1);
                        }
                    });
                };
                ;
                //remove all notifications
                SnackbarService.prototype.removeAllNotifications = function () {
                    while (this.notifications.length > 0) {
                        this.notifications.pop();
                    }
                };
                ;
                return SnackbarService;
            }());
            exports_1("SnackbarService", SnackbarService);
            snckbrNotificationModel = (function () {
                function snckbrNotificationModel(title, action, style, icon, autocloseAfter) {
                    this.id = generateUUID();
                    this.title = title;
                    this.action = action;
                    this.style = style;
                    this.icon = icon;
                    this.autoclose = autocloseAfter;
                    if (this.style == "error" && !this.icon)
                        this.icon = "error";
                    if (this.style == "warning" && !this.icon)
                        this.icon = "warning";
                    function generateUUID() {
                        var d = new Date().getTime();
                        var uuid = 'NOTIF-xxxx-5xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                            var r = (d + Math.random() * 16) % 16 | 0;
                            d = Math.floor(d / 16);
                            return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
                        });
                        return uuid.toUpperCase();
                    }
                }
                return snckbrNotificationModel;
            }());
            exports_1("snckbrNotificationModel", snckbrNotificationModel);
        }
    }
});
