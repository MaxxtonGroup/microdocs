System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var HotlinkService, HotLinkModel;
    return {
        setters:[],
        execute: function() {
            HotlinkService = (function () {
                function HotlinkService() {
                    this.hotLinkAdded = new CustomEvent('hotLinkAdded');
                    this._hotlinks = [];
                }
                Object.defineProperty(HotlinkService.prototype, "hotlinks", {
                    get: function () {
                        return this._hotlinks;
                    },
                    enumerable: true,
                    configurable: true
                });
                HotlinkService.prototype.setHotlinkFromCard = function (card) {
                    var updatedCard = false;
                    //console.log(card);
                    var _this = this;
                    this._hotlinks.forEach(function (hotlink, idx) {
                        if (hotlink.id == card.id) {
                            _this._hotlinks[idx] = new HotLinkModel(card);
                            updatedCard = true;
                        }
                    });
                    if (!updatedCard)
                        this._hotlinks.push(new HotLinkModel(card));
                    document.dispatchEvent(this.hotLinkAdded);
                };
                HotlinkService.prototype.removeHotlink = function (id) {
                    var _this = this;
                    this._hotlinks.forEach(function (card, idx) {
                        if (id == card.id) {
                            _this._hotlinks.splice(idx, 1);
                        }
                    });
                };
                return HotlinkService;
            }());
            exports_1("HotlinkService", HotlinkService);
            HotLinkModel = (function () {
                function HotLinkModel(card) {
                    this._active = false;
                    this.id = card.id;
                    this.title = card.title;
                    this.subTitle = card.subTitle;
                    this.cardObject = card;
                }
                Object.defineProperty(HotLinkModel.prototype, "active", {
                    get: function () {
                        return this._active;
                    },
                    set: function (value) {
                        this._active = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(HotLinkModel.prototype, "offSetTop", {
                    get: function () {
                        if (this.id)
                            return document.getElementById(this.id).offsetTop;
                        else
                            return 0;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(HotLinkModel.prototype, "card", {
                    get: function () {
                        if (this.id != undefined)
                            return document.getElementById(this.id);
                    },
                    enumerable: true,
                    configurable: true
                });
                return HotLinkModel;
            }());
            exports_1("HotLinkModel", HotLinkModel);
        }
    }
});
