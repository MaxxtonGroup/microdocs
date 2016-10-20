export declare class ImageHelperService {
    /**
     * get employee image from firstname, (should be changed once there is an option to bind icons to users)
     *
     * @param employee
     * @returns {string}
     */
    employeeImage(employee: {
        firstname: string;
        lastname: string;
        sex: string;
    }): string;
}
export interface ImagesUrlGroup {
    small: string;
    medium: string;
    large: string;
    [key: string]: string;
}
export interface Image {
    imageRef: number;
    imageId: number;
    imageUrl: ImagesUrlGroup;
}
