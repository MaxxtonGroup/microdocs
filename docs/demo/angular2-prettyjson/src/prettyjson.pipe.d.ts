import { PipeTransform } from "@angular/core";
export declare class PrettyJsonPipe implements PipeTransform {
    transform(obj: any, spaces?: number): string;
    private _syntaxHighlight(json, serializer, spacing);
}
