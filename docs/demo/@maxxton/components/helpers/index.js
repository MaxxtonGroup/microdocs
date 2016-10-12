/**
 * Exports of all helpers
 * @author R. Reinartz (r.reinartz@maxxton.com)
 */
System.register(["./ease-animation.util", "./image-helper.util"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ease_animation_util_1, image_helper_util_1;
    var MXT_HELPERS;
    return {
        setters:[
            function (ease_animation_util_1_1) {
                ease_animation_util_1 = ease_animation_util_1_1;
                exports_1({
                    "EaseAnimationUtil": ease_animation_util_1_1["EaseAnimationUtil"]
                });
            },
            function (image_helper_util_1_1) {
                image_helper_util_1 = image_helper_util_1_1;
                exports_1({
                    "ImageHelperService": image_helper_util_1_1["ImageHelperService"]
                });
            }],
        execute: function() {
            //combined common services
            exports_1("MXT_HELPERS", MXT_HELPERS = [
                ease_animation_util_1.EaseAnimationUtil,
                image_helper_util_1.ImageHelperService,
            ]);
        }
    }
});
