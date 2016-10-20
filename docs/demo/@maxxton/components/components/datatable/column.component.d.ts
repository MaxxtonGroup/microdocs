/**
 * Created by Reinartz.T on 7-6-2016.
 */
import { TemplateRef } from "@angular/core";
export declare class ColumnComponent {
    field: string;
    pristineField: string;
    editable: boolean;
    header: string;
    colspan: number;
    styleClass: any;
    hidden: boolean;
    expander: boolean;
    direct: boolean;
    /**
     * proxy method, used to format or manipulate data once the user loses focus on the input field.
     * (oldData:the original value, newValue:the new value)
     * return proxied data or newValue
     */
    proxy: Function;
    tempFieldData: string;
    template: TemplateRef<any>;
}
