System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var EaseAnimationUtil;
    return {
        setters:[],
        execute: function() {
            /**
             * Animation utility
             *
             * @author R. Reinartz (r.reinartz@maxxton.com)
             */
            EaseAnimationUtil = (function () {
                function EaseAnimationUtil() {
                }
                EaseAnimationUtil.prototype.linearEase = function (currentIteration, startValue, changeInValue, totalIterations) {
                    return changeInValue * currentIteration / totalIterations + startValue;
                };
                EaseAnimationUtil.prototype.easeInQuad = function (currentIteration, startValue, changeInValue, totalIterations) {
                    return changeInValue * (currentIteration /= totalIterations) * currentIteration + startValue;
                };
                EaseAnimationUtil.prototype.easeOutQuad = function (currentIteration, startValue, changeInValue, totalIterations) {
                    return -changeInValue * (currentIteration /= totalIterations) * (currentIteration - 2) + startValue;
                };
                EaseAnimationUtil.prototype.easeInOutQuad = function (currentIteration, startValue, changeInValue, totalIterations) {
                    if ((currentIteration /= totalIterations / 2) < 1) {
                        return changeInValue / 2 * currentIteration * currentIteration + startValue;
                    }
                    return -changeInValue / 2 * ((--currentIteration) * (currentIteration - 2) - 1) + startValue;
                };
                EaseAnimationUtil.prototype.easeInCubic = function (currentIteration, startValue, changeInValue, totalIterations) {
                    return changeInValue * Math.pow(currentIteration / totalIterations, 3) + startValue;
                };
                EaseAnimationUtil.prototype.easeOutCubic = function (currentIteration, startValue, changeInValue, totalIterations) {
                    return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 3) + 1) + startValue;
                };
                EaseAnimationUtil.prototype.easeInOutCubic = function (currentIteration, startValue, changeInValue, totalIterations) {
                    if ((currentIteration /= totalIterations / 2) < 1) {
                        return changeInValue / 2 * Math.pow(currentIteration, 3) + startValue;
                    }
                    return changeInValue / 2 * (Math.pow(currentIteration - 2, 3) + 2) + startValue;
                };
                EaseAnimationUtil.prototype.easeInQuart = function (currentIteration, startValue, changeInValue, totalIterations) {
                    return changeInValue * Math.pow(currentIteration / totalIterations, 4) + startValue;
                };
                EaseAnimationUtil.prototype.easeOutQuart = function (currentIteration, startValue, changeInValue, totalIterations) {
                    return -changeInValue * (Math.pow(currentIteration / totalIterations - 1, 4) - 1) + startValue;
                };
                EaseAnimationUtil.prototype.easeInOutQuart = function (currentIteration, startValue, changeInValue, totalIterations) {
                    if ((currentIteration /= totalIterations / 2) < 1) {
                        return changeInValue / 2 * Math.pow(currentIteration, 4) + startValue;
                    }
                    return -changeInValue / 2 * (Math.pow(currentIteration - 2, 4) - 2) + startValue;
                };
                EaseAnimationUtil.prototype.easeInQuint = function (currentIteration, startValue, changeInValue, totalIterations) {
                    return changeInValue * Math.pow(currentIteration / totalIterations, 5) + startValue;
                };
                EaseAnimationUtil.prototype.easeOutQuint = function (currentIteration, startValue, changeInValue, totalIterations) {
                    return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 5) + 1) + startValue;
                };
                EaseAnimationUtil.prototype.easeInOutQuint = function (currentIteration, startValue, changeInValue, totalIterations) {
                    if ((currentIteration /= totalIterations / 2) < 1) {
                        return changeInValue / 2 * Math.pow(currentIteration, 5) + startValue;
                    }
                    return changeInValue / 2 * (Math.pow(currentIteration - 2, 5) + 2) + startValue;
                };
                EaseAnimationUtil.prototype.easeInSine = function (currentIteration, startValue, changeInValue, totalIterations) {
                    return changeInValue * (1 - Math.cos(currentIteration / totalIterations * (Math.PI / 2))) + startValue;
                };
                EaseAnimationUtil.prototype.easeOutSine = function (currentIteration, startValue, changeInValue, totalIterations) {
                    return changeInValue * Math.sin(currentIteration / totalIterations * (Math.PI / 2)) + startValue;
                };
                EaseAnimationUtil.prototype.easeInOutSine = function (currentIteration, startValue, changeInValue, totalIterations) {
                    return changeInValue / 2 * (1 - Math.cos(Math.PI * currentIteration / totalIterations)) + startValue;
                };
                EaseAnimationUtil.prototype.easeInExpo = function (currentIteration, startValue, changeInValue, totalIterations) {
                    return changeInValue * Math.pow(2, 10 * (currentIteration / totalIterations - 1)) + startValue;
                };
                EaseAnimationUtil.prototype.easeOutExpo = function (currentIteration, startValue, changeInValue, totalIterations) {
                    return changeInValue * (-Math.pow(2, -10 * currentIteration / totalIterations) + 1) + startValue;
                };
                EaseAnimationUtil.prototype.easeInOutExpo = function (currentIteration, startValue, changeInValue, totalIterations) {
                    if ((currentIteration /= totalIterations / 2) < 1) {
                        return changeInValue / 2 * Math.pow(2, 10 * (currentIteration - 1)) + startValue;
                    }
                    return changeInValue / 2 * (-Math.pow(2, -10 * --currentIteration) + 2) + startValue;
                };
                EaseAnimationUtil.prototype.easeInCirc = function (currentIteration, startValue, changeInValue, totalIterations) {
                    return changeInValue * (1 - Math.sqrt(1 - (currentIteration /= totalIterations) * currentIteration)) + startValue;
                };
                EaseAnimationUtil.prototype.easeOutCirc = function (currentIteration, startValue, changeInValue, totalIterations) {
                    return changeInValue * Math.sqrt(1 - (currentIteration = currentIteration / totalIterations - 1) * currentIteration) + startValue;
                };
                EaseAnimationUtil.prototype.easeInOutCirc = function (currentIteration, startValue, changeInValue, totalIterations) {
                    if ((currentIteration /= totalIterations / 2) < 1) {
                        return changeInValue / 2 * (1 - Math.sqrt(1 - currentIteration * currentIteration)) + startValue;
                    }
                    return changeInValue / 2 * (Math.sqrt(1 - (currentIteration -= 2) * currentIteration) + 1) + startValue;
                };
                return EaseAnimationUtil;
            }());
            exports_1("EaseAnimationUtil", EaseAnimationUtil);
        }
    }
});
