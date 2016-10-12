System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ImageHelperService;
    return {
        setters:[],
        execute: function() {
            ImageHelperService = (function () {
                function ImageHelperService() {
                }
                /**
                 * get employee image from firstname, (should be changed once there is an option to bind icons to users)
                 *
                 * @param employee
                 * @returns {string}
                 */
                ImageHelperService.prototype.employeeImage = function (employee) {
                    var _name = 'Miss doe';
                    if (employee.firstname != undefined || employee.firstname != null)
                        _name = employee.firstname;
                    else if (employee.lastname != undefined || employee.lastname != null)
                        _name = employee.lastname;
                    var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
                    var baseUrl = " https://newyse-res.cloudinary.com/image/upload/maxxton2/avatar-{%n}.png";
                    var totalImages = 5;
                    var imageNumber = Math.ceil(alphabet.indexOf(_name.substring(0, 1).toLowerCase()) / 26 * (totalImages - 1)) + 1;
                    if (employee.sex == "f" || employee.sex == "u")
                        imageNumber = imageNumber + totalImages;
                    return baseUrl.replace(new RegExp("{%n}"), imageNumber.toString());
                };
                return ImageHelperService;
            }());
            exports_1("ImageHelperService", ImageHelperService);
        }
    }
});
