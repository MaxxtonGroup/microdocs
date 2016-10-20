import { SimpleChange } from "@angular/core";
import { Image } from "../../../helpers/image-helper.util";
export declare class MultipleImagesComponent {
    images: Array<Image>;
    imagesize: string;
    private selectedImage;
    ngOnChanges(changes: {
        [propName: string]: SimpleChange;
    }): any;
    getSelectedImageUrl(): string;
    getImageUrlForImage(image: Image): string;
    getLargeImageUrlForImage(image: Image): string;
    getSmallImageUrlForImage(image: Image): string;
}
