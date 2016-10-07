import { ViewContainerRef } from "@angular/core";
import { Observable } from "rxjs/Rx";
export declare class LocalStoragePreferenceService {
    prefix: string;
    getPreference(viewContainer: ViewContainerRef, setting: string): Observable<any>;
    setPreference(viewContainer: ViewContainerRef, setting: string, value: any): void;
}
