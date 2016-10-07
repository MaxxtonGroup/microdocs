import { snckbrNotificationModel, SnackbarService } from "../../services/snackbar.service";
export declare class SnackbarComponent {
    private snackbarService;
    notification: snckbrNotificationModel;
    private autoCloseAfterTime;
    private hideNotificationTimer;
    private showSnackbar;
    private snackbarNotificationAddedSub;
    private iterationCount;
    private snackBarWillBeHidden;
    constructor(snackbarService: SnackbarService);
    ngOnDestroy(): void;
    private getHiddenNotification();
    listenForNotifications(): void;
    showNotification(): void;
    hideNotification(): void;
}
export declare const SNACKBAR: any[];
