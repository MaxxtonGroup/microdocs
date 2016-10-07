import { OnChanges } from "@angular/core";
import { Image } from "../../../helpers/image-helper.util";
import { ModalComponent } from "../../modal/modal.component";
import { DomSanitizationService, SafeStyle } from "@angular/platform-browser";
/**
 * Single image class - shows the first image of an image array
 * @input() images: Array <Image>
 * @input() imagesize: string (small/medium/large)
 */
export declare class SingleImageComponent implements OnChanges {
    private sanitationService;
    private loading;
    images: Array<Image>;
    imagesize: string;
    showModal: boolean;
    constructor(sanitationService: DomSanitizationService);
    sanitize(context: any, value: any): void;
    ngOnChanges(changes: {}): any;
    /**
     *
     * @returns imageUrl:string || defaultImageUrl
     */
    getImage(): SafeStyle;
    showImageModal(modal: ModalComponent): void;
}
