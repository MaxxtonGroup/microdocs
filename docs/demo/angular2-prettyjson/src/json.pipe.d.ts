import { PipeTransform } from "@angular/core";
export declare class SafeJsonPipe implements PipeTransform {
    transform(obj: any, spaces?: number): string;
}
