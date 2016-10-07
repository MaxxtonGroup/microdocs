import { EventEmitter } from "@angular/core";
export declare class SnackbarService {
    notificationAdded: EventEmitter<snckbrNotificationModel>;
    notificationRemoved: EventEmitter<snckbrNotificationModel>;
    notifications: snckbrNotificationModel[];
    getNotifications(): snckbrNotificationModel[];
    getNotification(): boolean | snckbrNotificationModel;
    addNotification(title: string, action: {
        method: Function;
        name: string;
    }, style: string, image: string, autoclose: number): snckbrNotificationModel;
    removeNotification(): void;
    removeNotificationById(notificationId: string): void;
    removeAllNotifications(): void;
}
export declare class snckbrNotificationModel {
    id: string;
    style: any;
    title: any;
    icon: string;
    autoclose: number;
    action: {
        method: Function;
        name: string;
    };
    constructor(title: string, action: {
        method: Function;
        name: string;
    }, style: string, icon: string, autocloseAfter: number);
}
