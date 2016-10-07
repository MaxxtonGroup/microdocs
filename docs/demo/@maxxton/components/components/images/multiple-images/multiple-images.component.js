System.register(["@angular/core"], function(exports_1, context_1) {
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
    var core_1;
    var MultipleImagesComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            MultipleImagesComponent = (function () {
                function MultipleImagesComponent() {
                    this.imagesize = 'large';
                    this.selectedImage = null;
                }
                MultipleImagesComponent.prototype.ngOnChanges = function (changes) {
                    //if there are images available
                    //if(changes.images.currentValue.length > 0){
                    //  //if the selected image is not set
                    //  if(this.selectedImage == null)
                    //    this.selectedImage = this.images[0];
                    //}
                };
                MultipleImagesComponent.prototype.getSelectedImageUrl = function () {
                    if (this.selectedImage == null && this.images != null)
                        this.selectedImage = this.images[0];
                    return this.getLargeImageUrlForImage(this.selectedImage);
                };
                MultipleImagesComponent.prototype.getImageUrlForImage = function (image) {
                    if (image != null)
                        return image.imageUrl[this.imagesize] || null;
                };
                MultipleImagesComponent.prototype.getLargeImageUrlForImage = function (image) {
                    if (image != null)
                        return image.imageUrl.large || null;
                };
                MultipleImagesComponent.prototype.getSmallImageUrlForImage = function (image) {
                    if (image != null)
                        return image.imageUrl.medium || null;
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], MultipleImagesComponent.prototype, "images", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], MultipleImagesComponent.prototype, "imagesize", void 0);
                MultipleImagesComponent = __decorate([
                    core_1.Component({
                        selector: 'multiple-images',
                        template:'<div class="vertical medium-horizontal grid-block"><div class="selected-image grid-block medium-6 large-8"><div class="image-holder" [ngStyle]="{\'background-image\': \'url( \' + getSelectedImageUrl() + \' )\'}"></div><div class="image-count">{{images.length}} images available | selected image id: {{selectedImage?.imageId}}</div></div><div class="all-images medium-6 large-4"><div class="small-images grid-content"><div class="small-image" *ngFor="let image of images"><img [attr.src]="getSmallImageUrlForImage(image)" (click)="selectedImage = image"></div></div></div></div>',
                        directives: []
                    }), 
                    __metadata('design:paramtypes', [])
                ], MultipleImagesComponent);
                return MultipleImagesComponent;
            }());
            exports_1("MultipleImagesComponent", MultipleImagesComponent);
        }
    }
});
