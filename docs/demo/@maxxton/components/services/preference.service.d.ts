/**
 * Created by Reinartz.T on 25-5-2016.
 */
import { Observable } from "rxjs/Rx";
import { ViewContainerRef } from "@angular/core";
export declare abstract class PreferenceService {
    constructor();
    /**
     * get value of a certain preference
     * @param viewContainer:ViewContainerRef
     * @param setting:string
     */
    getPreference(viewContainer: ViewContainerRef, setting: string): Observable<any>;
    /**
     * set preference
     * @param viewContainer
     * @param setting:string
     * @param value:any
     */
    setPreference(viewContainer: ViewContainerRef, setting: string, value: any): void;
}
