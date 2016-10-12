/**
 * Created by Kromhout.P on 14-07-16.
 */
import { EventEmitter } from "@angular/core";
import { SnackbarService } from "../../../services/snackbar.service";
export declare class FloatingActionButtonComponent {
    private snackbarService;
    icon: string;
    color: string;
    title: string;
    onActivate: EventEmitter<MouseEvent>;
    isSnackbarOpen: boolean;
    private snackbarNotificationAddedSub;
    private snackbarNotificationRemovedSub;
    private onClick(event);
    constructor(snackbarService: SnackbarService);
    ngOnDestroy(): void;
}
