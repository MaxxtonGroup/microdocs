System.register(["@angular/core", "../../services/snackbar.service"], function(exports_1, context_1) {
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
    var core_1, snackbar_service_1;
    var SnackbarComponent, SNACKBAR;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (snackbar_service_1_1) {
                snackbar_service_1 = snackbar_service_1_1;
            }],
        execute: function() {
            SnackbarComponent = (function () {
                function SnackbarComponent(snackbarService) {
                    this.snackbarService = snackbarService;
                    this.autoCloseAfterTime = 5000;
                    this.showSnackbar = false;
                    this.iterationCount = 0;
                    this.snackBarWillBeHidden = false;
                    this.getHiddenNotification();
                    this.listenForNotifications();
                }
                SnackbarComponent.prototype.ngOnDestroy = function () {
                    this.snackbarNotificationAddedSub.unsubscribe();
                };
                SnackbarComponent.prototype.getHiddenNotification = function () {
                    this.notification = new snackbar_service_1.snckbrNotificationModel('Dont show', null, 'hidden', null, null);
                };
                SnackbarComponent.prototype.listenForNotifications = function () {
                    var _this = this;
                    this.snackbarNotificationAddedSub = this.snackbarService.notificationAdded.subscribe(function () {
                        _this.showNotification();
                    });
                };
                SnackbarComponent.prototype.showNotification = function () {
                    var _this = this;
                    var newNotification = this.snackbarService.getNotification();
                    //if the new notification is not available add an empty notification
                    if (newNotification == false)
                        return this.getHiddenNotification();
                    //check if notification needs to be updated;
                    if (newNotification !== false && this.notification !== newNotification) {
                        //update current notification
                        _this.notification = newNotification;
                        setTimers();
                        _this.showSnackbar = true;
                        _this.snackBarWillBeHidden = false;
                    }
                    function setTimers() {
                        //if autoclose has been set override the default time
                        if (_this.notification.autoclose)
                            _this.autoCloseAfterTime = _this.notification.autoclose;
                        //remove notification after the time expires
                        _this.hideNotificationTimer = setTimeout(function () {
                            _this.hideNotification();
                        }, _this.autoCloseAfterTime);
                    }
                };
                SnackbarComponent.prototype.hideNotification = function () {
                    var _this = this;
                    this.snackBarWillBeHidden = true;
                    //wait for animation to be completed
                    window.setTimeout(function () {
                        _this.showSnackbar = false;
                        removeAndShowNextNotification();
                    }, 300);
                    function removeAndShowNextNotification() {
                        //remove current notification
                        _this.snackbarService.removeNotification();
                        //show next notification
                        _this.showNotification();
                    }
                };
                SnackbarComponent = __decorate([
                    core_1.Component({
                        selector: 'snackbar',
                        directives: [],
                        template:'<div class="notification-container snackbar"><div id="{{notification.id}}" class="notification {{notification.style}} is-active animated {{!snackBarWillBeHidden ? \'fadeInUp\' : \'fadeOut\'}}" [hidden]="!showSnackbar"><span class="notification-content"><i class="icon" *ngIf="notification.icon">{{notification.icon}}</i> {{notification.title}} <a class="action" *ngIf="notification.action" (click)="notification.action.method; hideNotification();">{{notification.action.name}}</a></span></div></div>'
                    }), 
                    __metadata('design:paramtypes', [snackbar_service_1.SnackbarService])
                ], SnackbarComponent);
                return SnackbarComponent;
            }());
            exports_1("SnackbarComponent", SnackbarComponent);
            exports_1("SNACKBAR", SNACKBAR = [SnackbarComponent]);
        }
    }
});
