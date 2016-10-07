System.register(["@angular/core", "../multiple-images/multiple-images.component", "../../modal/modal.component", "@angular/platform-browser"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, multiple_images_component_1, modal_component_1, platform_browser_1;
    var SingleImageComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (multiple_images_component_1_1) {
                multiple_images_component_1 = multiple_images_component_1_1;
            },
            function (modal_component_1_1) {
                modal_component_1 = modal_component_1_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            }],
        execute: function() {
            /**
             * Single image class - shows the first image of an image array
             * @input() images: Array <Image>
             * @input() imagesize: string (small/medium/large)
             */
            SingleImageComponent = (function () {
                function SingleImageComponent(sanitationService) {
                    this.sanitationService = sanitationService;
                    this.loading = false;
                    this.images = [];
                    this.imagesize = 'large';
                    this.showModal = true;
                }
                SingleImageComponent.prototype.sanitize = function (context, value) {
                    console.log(context, value);
                };
                SingleImageComponent.prototype.ngOnChanges = function (changes) {
                    return null;
                };
                /**
                 *
                 * @returns imageUrl:string || defaultImageUrl
                 */
                SingleImageComponent.prototype.getImage = function () {
                    var imageSize = 'medium';
                    if (this.imagesize != undefined && (this.imagesize == 'small' || this.imagesize == 'medium' || this.imagesize == 'large'))
                        imageSize = this.imagesize;
                    //get image from object, or fallback to default image
                    if (this.images.length > 0)
                        return this.sanitationService.bypassSecurityTrustStyle('url( ' + this.images[0].imageUrl[imageSize] + ' )');
                    else
                        return null;
                };
                SingleImageComponent.prototype.showImageModal = function (modal) {
                    if (this.showModal && this.images.length > 0)
                        modal.show();
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], SingleImageComponent.prototype, "images", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], SingleImageComponent.prototype, "imagesize", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], SingleImageComponent.prototype, "showModal", void 0);
                SingleImageComponent = __decorate([
                    core_1.Component({
                        selector: 'single-image',
                        template:'<modal #modal title="All images" size="large"><multiple-images [images]="images" *ngIf="modal.active"></multiple-images></modal><div (click)="showImageModal(modal)" class="grid-block image-holder" [style.backgroundImage]="getImage()"><div class="image-count">{{images.length}} images available</div></div>',
                        directives: [multiple_images_component_1.MultipleImagesComponent, modal_component_1.ModalComponent],
                    }), 
                    __metadata('design:paramtypes', [platform_browser_1.DomSanitizationService])
                ], SingleImageComponent);
                return SingleImageComponent;
            }());
            exports_1("SingleImageComponent", SingleImageComponent);
        }
    }
});
