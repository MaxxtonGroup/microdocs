/**
 * Material Framework
 * @type {{colors: {assoc}, loaded: boolean}}
 */
var paper = {

    version: "0.1.3",

    /**
     * Predefined Colors
     */
    colors: {
        red: "#F44336",
        pink: "#E91E63",
        purple: "#9C27B0",
        'deep-purple': "#673AB7",
        indigo: "#3F51B5",
        blue: "#2196F3",
        'light-blue': "#03A9F4",
        cyan: "#00BCD4",
        teal: "#009688",
        green: "#4CAF50",
        'light-green': "#8BC34A",
        lime: "#CDDC39",
        yellow: "#FFEB3B",
        amber: "#FFC107",
        orange: "#FF9800",
        'deep-orange': "#FF5722",
        brown: "#795548",
        gray: "#9E9E9E",
        'dark-gray': "#333333",
        'light-gray': "#CCCCCC",
        'blue-gray': "#607D8B",
        black: "black",
        white: "white",
        transparent: "rgba(0,0,0,0)"
    },

    /**
     * If page is fully loaded true, if not loaded false
     */
    loaded: false,

    /**
     * List of all modules
     */
    modules: ["app", "checkbox", "radio", "switch", "header", "input", "lang", "list", "alert", "snackbar", "toast", "wrippels", "loading", "progress", "tabs"],

    /**
     * Get list of installed modules
     * @returns {Array}
     */
    getInstalledModules: function(){
        var installedModules = [];
        for(var i = 0; i < paper.modules.length; i++){
            var module = paper.modules[i];
            if(typeof(paper[module]) !== "undefined"){
                installedModules.push(module);
            }
        }
        return installedModules;
    },

    /**
     * Call init function on all modules
     * @param element - rootElement to initialize (default is body)
     */
    initModules: function(element){
        if(typeof(element) === "undefined"){
            var e = $("body");
        }else{
            var e = $(element);
        }
        var modules = paper.getInstalledModules();
        for(var i = 0; i < modules.length; i++){
            var module = paper[modules[i]];
            if(typeof(module["init"]) !== "undefined"){
                module["init"](e);
            }
        }
    },

    loading: {
        /**
         * Find and initialze 'paper-loader' elements
         * @param element - rootElement to initialize (default is body)
         */
        init: function(element){
            if(typeof(element) === "undefined"){
                var e = $("body");
            }else{
                var e = $(element);
            }
            if(e.hasClass("paper-loading") && e.children().length === 0){
                $("<svg viewBox='0 0 52 52'><circle cx='26px' cy='26px' r='20px' fill='none' stroke-width='4px' /></svg>").appendTo(e);
            }else{
                var loaders = e.find(".paper-loading");
                loaders.each(function(){
                    if($(this).children().length === 0){
                        $("<svg viewBox='0 0 52 52'><circle cx='26px' cy='26px' r='20px' fill='none' stroke-width='4px' /></svg>").appendTo($(this));
                    }
                });
            }
        },

        /**
         * Create loader element
         * @param color - predefined color
         */
        create: function(color){
            var loader = $("<div class='paper-loading'></div>");
            paper.loading.init(loader);
            if(typeof(color) !== "undefined"){
                loader.addClass(color);
            }
            return loader;
        }
    }
};

(function(){

    //Check dependency
    if(typeof($) === "undefined"){
        console.error("\'paper\' dependence on JQuery");
    }

    //Watch loading
    $(window).load(function(){
        paper.loaded = true;
        console.info("Installed modules: " + paper.getInstalledModules());
        paper.initModules();
        $(".paper-startup").fadeOut(200, function(){
            $(this).remove();
        });
    });

    //Cookie library
    paper.cookie = {
        getItem: function (sKey) {
            if (!sKey) { return null; }
            return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
        },
        setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
            if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
            var sExpires = "";
            if (vEnd) {
                switch (vEnd.constructor) {
                    case Number:
                        sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                        break;
                    case String:
                        sExpires = "; expires=" + vEnd;
                        break;
                    case Date:
                        sExpires = "; expires=" + vEnd.toUTCString();
                        break;
                }
            }
            document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
            return true;
        },
        removeItem: function (sKey, sPath, sDomain) {
            if (!this.hasItem(sKey)) { return false; }
            document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
            return true;
        },
        hasItem: function (sKey) {
            if (!sKey) { return false; }
            return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
        },
        keys: function () {
            var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
            for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
            return aKeys;
        }
    };

    paper.toNormalText = function(text){
        var normalText = text.replace("-", " ");
        return paper.uppercaseWord(normalText);
    };

    paper.uppercaseFirst = function(text){
        return text.substring(0,1).toUpperCase() + text.substring(1).toLowerCase();
    };

    paper.uppercaseWord = function(text){
        var out = "";
        var words = text.split(" ");
        for(var i = 0; i < words.length; i++){
            if(out !== ""){
                out += " ";
            }
            out += paper.uppercaseFirst(words[i]);
        }
        return out;
    };

})();
(function () {

    //Check dependency
    if (typeof(paper) === "undefined") {
        console.error("\'paper-wrippels\' dependence on \'paper\'");
    }

    paper.wrippels = {

        isLightBackground: function(comp) {
            try {
                if($(comp).attr("bg") === "light"){
                    return true;
                }
                if($(comp).attr("bg") === "dark"){
                    return false;
                }

                var bg = $(comp).css("background-color");
                if (bg === "transparent" || typeof(bg) === "undefined") {
                    return paper.wrippels.isLightBackground($(comp).parent());
                } else if (bg.indexOf("rgba") == 0) {
                    bg = bg.substring(5, bg.length - 1);
                    var clrs = bg.split(",");
                    if (parseInt(clrs[3]) == 0) {
                        return paper.wrippels.isLightBackground($(comp).parent());
                    } else {
                        return (parseInt(clrs[0]) + parseInt(clrs[1]) + parseInt(clrs[2])) / 3 > 130;
                    }
                } else {
                    bg = bg.substring(4, bg.length - 1);
                    var clrs = bg.split(",");
                    return (parseInt(clrs[0]) + parseInt(clrs[1]) + parseInt(clrs[2])) / 3 > 130;
                }
            } catch (e) {
                return true;
            }
        },

        setWrippels: function(element){
            $(element).addClass("wrippels");
        },

        removeWrippels: function(element){
            $(element).removeClass("wrippels");
        }

    };

    var mouseDown = function (event) {
        var tthis = this;

        //find background
        var isLight = paper.wrippels.isLightBackground(tthis);
        var cls = "overlay" + (isLight ? " dark" : "");

        //find border-radius
        var isRound = $(tthis).css("border-radius") === "100%";

        //calc size
        var w = $(tthis).width();
        w += parseInt($(tthis).css("padding-left"));
        w += parseInt($(tthis).css("padding-right"));
        var h = $(tthis).height();
        h += parseInt($(tthis).css("padding-top"));
        h += parseInt($(tthis).css("padding-bottom"));

        //if(!isLight || !isRound) {
        var size = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2)) * 2;

        //calc pos
        var offset = $(tthis).offset();
        var x = Math.round(event.pageX - offset.left) - size / 2;
        var y = Math.round(event.pageY - offset.top) - size / 2;
        //}else{
        //    var size = (w < h ? w : h);
        //    var x = 0;
        //    var y = 0;
        //}

        var html = "<div class='" + cls + "' style='width: " + size + "px; height: " + size + "px; top: " + y + "px; left: " + x + "px;'/>";
        var overlay = $(html).appendTo(tthis);
        setTimeout(function () {
            var tick = 5;
            var interval = window.setInterval(function () {
                tick += 3;
                var scale = tick / 100;
                overlay.css("transform", "scale(" + scale + ")");
                if (overlay.hasClass("wrippel-expand")) {
                    overlay.css("transform", "");
                    window.clearInterval(interval);
                }
                if (tick >= 100) {
                    window.clearInterval(interval);
                }
            }, 20);
        }, 10);
    };

    var mouseUp = function (e) {
        var tthis = this;
        var overlay = $(tthis).children(".overlay");
        overlay.addClass("wrippel-ani");
        setTimeout(function () {
            overlay.addClass("wrippel-expand");
            setTimeout(function () {
                overlay.addClass("wrippel-hide");
                setTimeout(function () {
                    overlay.remove();
                }, 300);
            }, 200);
        }, 10);
    };

    //if (paper.isTouchDevice) {
    //    $("body").on("touchstart, mousedown", ".wrippels", mouseDown);
    //    $("body").on("touchend, mouseup, blur, click", ".wrippels", mouseUp);
    //    $("body").on("touchmove", ".wrippels", mouseUp);
    //} else {
    $("body").ready(function(){
        $("body").on("mousedown", ".wrippels:not(.touchonly)", mouseDown);
        $("body").on("mouseup, blur, click", ".wrippels:not(.touchonly)", mouseUp);
        $("body").on("mousemove", ".wrippels:not(.touchonly)", mouseUp);
    });
    //}
})();
(function(){

    //Check dependency
    if (typeof(paper) === "undefined") {
        console.error("\'paper-app\' dependence on \'paper\'");
    }

    /**
     * Material List Framework
     * @type {{version: number, create: Function}}
     */
    paper.list = {

        create: function(element, render){
            return new List(element, render);
        }

    };

    function List(element, render){
        this.element = $(element);
        this.renderFunction = render;
    }

    List.prototype.setRender = function(func){
        this.renderFunction = func;
    };

    List.prototype.append = function(array, timeout){
        var tthis = this;
        if(this.element.children(".paper-list").length == 0){
            $("<ul></ul>").addClass("paper-list").appendTo(this.element);
        }
        var eList = this.element.children(".paper-list");
        doRender(tthis, eList, array, timeout);
    };

    List.prototype.render = function(array, timeout){
        var tthis = this;
        if(this.element.children(".paper-list").length == 0){
            $("<ul></ul>").addClass("paper-list").appendTo(this.element);
        }
        var eList = this.element.children(".paper-list");
        if(eList.children().length > 0){
            eList.children().addClass("fade");
            setTimeout(function(){
                eList.children().remove();
                doRender(tthis, eList, array, timeout);
            }, 200);
        }else{
            doRender(tthis, eList, array, timeout);
        }
    };

    function doRender(list, eList, array, timeout){
        if(Array.isArray(array)){
            for(var i = 0; i < array.length; i++){
                var li = $("<li></li>");
                var ret = list.renderFunction(li, array[i], false);
                if(ret !== false) {
                    li.addClass("fade");
                    li.appendTo(eList);
                }
            }
        }else if(!isNumeric(array)){
            for(var key in array){
                var li = $("<li></li>");
                var ret = list.renderFunction(li, key, true);
                if(ret !== false) {
                    li.addClass("fade");
                    li.appendTo(eList);
                }
                var subArray = array[key];
                for(var i = 0; i < subArray.length; i++){
                    var li2 = $("<li></li>");
                    var ret = list.renderFunction(li2, subArray[i], false);
                    if(ret !== false) {
                        li2.addClass("fade");
                        li2.appendTo(eList);
                    }
                }
            }
        }else{
            throw "Can only render arrays and associative arrays";
        }

        var t = 70;
        if(typeof(timeout) !== "undefined"){
            t = timeout;
        }

        setTimeout(function(){
            var interval = setInterval(function(){
                eList.children(".fade").first().removeClass("fade");
                if(eList.children(".fade").length == 0){
                    clearInterval(interval);
                }
            }, t);
        }, 20);

    }

    function isNumeric(obj) {
        try {
            return (((obj - 0) == obj) && (obj.length > 0));
        } catch (e) {
            return false;
        }
    }

})();
(function () {
    //Check dependency
    if (typeof(paper) === "undefined") {
        console.error("\'paper-header\' dependence on \'paper\'");
    }

    /**
     * Material Header Framework
     * @type {{create: Function, render: Function, attach: Function, update: Function}}
     */
    paper.header = {

        /**
         * Create new header object
         * @param  {{title: string, icon: string, leftAction: null | 'menu' | 'back', actions: [{orderInCategory: int, id: string, title: string, icon: string, showAsAction: 'ifroom' | 'never' | 'always' | 'withtext'}]}} options -
         * @returns {Header}
         */
        create: function(options) {
            return new Header(options);
        },

        /**
         * Render the object to jQuery
         * @param {Header} header
         * @returns {jQuery}
         */
        render: function (header) {
            var eHeader = $("<div class='paper-header'></div>");
            eHeader.addClass(header.getColor());
            eHeader.addClass(header.getSize());
            if(header.getTitle() !== null || (header.getIcon() !== null || header.getLeftAction() !== null)){
                var leftAction = $("<div class='left-action'></div>").appendTo(eHeader);
                var hasIcon = header.getPushLeft();
                if(header.getIcon() != null || header.getLeftAction() != null || header.getSource() != null) {
                    hasIcon = true;
                    var icon = $("<div class='icon'><div class='bar-container'><div class='bar'></div><div class='bar'></div><div class='bar'></div></div><i></i></div>").appendTo(leftAction);
                    if(header.hasWrippels()){
                        icon.addClass("wrippels");
                    }
                    if (header.getLeftAction() !== null) {
                        icon.addClass("action-" + header.getLeftAction()).addClass("wrippels");
                    } else {
                        var icon_i = icon.find("i").addClass(header.getIcon()).appendTo(icon);
                        if (header.getSource() != null) {
                            icon_i.css("background-image", "url(" + header.getSource() + ")");
                        }
                    }
                }
                if(header.getTitle() !== null) {
                    var key = header.getTitle();
                    var value = key;
                    var attr = "";
                    if(typeof(paper.lang) !== "undefined"){
                        value = paper.lang.replace(key);
                        if(value !== key){
                            attr = " lang-key='" + paper.lang.extractKey(key) + "'";
                        }
                    }
                    var title = $("<div class='title'" + attr + ">" + key + "</div>").appendTo(leftAction);
                    if(hasIcon){
                        title.addClass("push-left");
                    }
                }
            }
            updateActionButtons(header, eHeader);

            eHeader.append("<div class='middle-bar'></div>");
            var bottomBar = $("<div class='bottom-bar'></div>");
            bottomBar.appendTo(eHeader);
            if(header.getTabs() !== null && typeof(paper.tabs) !== "undefined"){
                paper.tabs.render(header.getTabs(), bottomBar);
            }

            return eHeader;
        },

        /**
         * Attach Header to an element when DOM is ready
         * @param {Header} header
         * @param {html | selector} element - Element to attach the header to
         */
        attach: function (header, element) {
            var attachElement = function(){
                var e = $(element);
                var eHeader = paper.header.render(header);
                eHeader.prependTo(e);
                header.setElement(eHeader);
                eHeader.bind("resize", function(){
                    updateActionButtons(header, eHeader);
                });
            };

            if($("body").isReady) {
                attachElement();
            }else{
                $("body").ready(function(){
                    attachElement();
                });
            }
        },

        /**
         * Detach Header from DOM
         * @param {Header} header
         */
        detach: function(header){
            var eHeader = header.getElement();
            eHeader.unbind("resize");
            header.setElement(null);
            eHeader.remove();
        },

        /**
         * Update changes of the header to the DOM
         * @param {Header} header
         */
        update: function (header) {
            var element = header.getElement();

            element.attr("class", "paper-header " + header.getColor() + " " + header.getSize());

            var renderIcon = !(header.getLeftAction() === null && header.getSource() === null && header.getIcon() === null);
            var eLeftAction = element.find(".left-action");
            if(renderIcon || header.getTitle() !== null){
                if(eLeftAction.length === 0){
                    eLeftAction = $("<div class='left-action'></div>").prependTo(element);
                }
            }else{
                eLeftAction.remove();
            }

            var key = header.getTitle();
            if(key !== null){
                var value = key;
                var attr = null;
                if(typeof(paper.lang) !== "undefined"){
                    value = paper.lang.replace(key);
                    if(value !== key){
                        attr = paper.lang.extractKey(key);
                    }
                }
                var eTitle = eLeftAction.find(".title");
                if(eTitle.length === 0){
                    eTitle = $("<div class='title'></div>").appendTo(eLeftAction);
                }
                eTitle.html(value);
                if(attr != null){
                    eTitle.attr("lang-key", attr);
                }else{
                    eTitle.removeAttr("lang-key");
                }
                var pushLeft = renderIcon || header.getPushLeft();
                if(pushLeft){
                    eTitle.addClass("push-left");
                }else{
                    eTitle.removeClass("push-left");
                }
            }else{
                eLeftAction.find(".title").remove();
            }

            if(renderIcon){
                var icon = eLeftAction.find(".icon");
                if(icon.length === 0){
                    icon = $("<div class='icon'><div class='bar-container'><div class='bar'></div><div class='bar'></div><div class='bar'></div></div><i></i></div>").prependTo(eLeftAction);
                }
                icon.removeClass("action-menu").removeClass("action-back").removeClass("wrippels");
                if(header.hasWrippels()){
                    icon.addClass("wrippels");
                }

                if(header.getLeftAction() === "menu"){
                    icon.addClass("action-menu");
                }else if(header.getLeftAction() === "back"){
                    icon.addClass("action-back");
                }
                if(header.getIcon() !== null){
                    icon.find("i").attr("class", header.getIcon());
                }
                if(header.getSource() !== null){
                    icon.find("i").css("background-image", "url(" + header.getSource() + ")");
                }
                if(header.getLeftAction() === null && header.getSource() === null && header.getIcon() === null){
                    icon.remove();
                }

            }else{
                eLeftAction.find(".icon").remove();
            }

            updateActionButtons(header, element);
        }

    };

    var updateActionButtons = function(header, eHeader){
        var actionList = header.getActions();

        //Remove actionbar if empty
        if(actionList.length === 0){
            eHeader.find(".action-bar").remove();
            return;
        }

        //Add action bar if missing
        var eActionBar = eHeader.find(".action-bar");
        if(eActionBar.length === 0 ){
            eActionBar = $("<div class='action-bar'></div>").appendTo(eHeader);
        }
        eActionBar.children().remove();

        //Order actions
        var orderedList = orderActions(actionList);

        //Render always icons
        var takenSlots = 0;
        if(typeof(orderedList["always"]) !== "undefined"){
            takenSlots = orderedList["always"].length;
            for (var i = 0; i < orderedList["always"].length; i++) {
                var action = orderedList["always"][i];
                if(action.getContent() != null){
                    var hContent = action.getContent();
                    if(typeof(paper.lang) !== "undefined"){
                        hContent = paper.lang.replace(hContent);
                    }
                    $(hContent).appendTo(eActionBar);
                }else {
                    var eAction = $("<div class='action wrippels' tabindex='0'></div>").appendTo(eActionBar);
                    if (action.getId() !== null) {
                        eAction.attr("id", action.getId());
                    }
                    $("<i></i>").addClass(action.getIcon()).appendTo(eAction);
                }
            }
        }

        //Find amount of slot available
        var headerWidth = eHeader.width();
        var slots = 0;
        if(headerWidth <= 400){
            slots = 1;
        }else if(headerWidth <= 456){
            slots = 2;
        }else if(headerWidth <= 512){
            slots = 3;
        }else{
            slots = 4;
        }
        var freeSlots = slots - takenSlots;
        var overlaySlosts = 0;
        if(typeof(orderedList["never"]) !== "undefined"){
            overlaySlosts = orderedList["never"].length;
        }
        var renderedActions = [];

        //Render ifroom and withtext actions
        for(var i = 0; i < orderedList["all"].length; i++){
            if(freeSlots <= 0){
                break;
            }
            var action = orderedList["all"][i];
            if(action.getShowAsAction() === "ifroom" || action.getShowAsAction() === "withtext"){
                if(action.getContent() != null){
                    var hContent = action.getContent();
                    if(typeof(paper.lang) !== "undefined"){
                        hContent = paper.lang.replace(hContent);
                    }
                    $(hContent).appendTo(actionBar);
                    freeSlots += -1;
                    renderedActions.push(action.getId());
                }else {
                    var eAction = $("<div class='action wrippels' tabindex='0'></div>").appendTo(eActionBar);
                    if (action.getId() !== null) {
                        eAction.attr("id", action.getId());
                    }
                    if(action.getShowAsAction() === "withtext"){
                        eAction.addClass("with-text");
                    }
                    if(action.getShowAsAction() === "withtext" && freeSlots >= 3){
                        var title = action.getTitle();
                        if(typeof(paper.lang) !== "undefined"){
                            title = paper.lang.replace(title);
                        }
                        $("<span>" + title + "</span>").appendTo(eAction);
                        freeSlots += -3;
                    }else{
                        freeSlots += -1;
                    }
                    $("<i></i>").addClass(action.getIcon()).appendTo(eAction);
                    renderedActions.push(action.getId());
                }
            }
        }

        var eOverlay = $("<div class='action-overlay hide'></div>");
        for(var i = 0; i < orderedList["all"].length; i++){
            var action = orderedList["all"][i];
            if(action.getShowAsAction() !== "always"){
                var exists = false;
                for(var j = 0; j < renderedActions.length; j++){
                    if(renderedActions[j] === action.getId()){
                        exists = true;
                    }
                }
                if(exists){
                    continue;
                }

                var title = action.getTitle();
                if(typeof(paper.lang) !== "undefined"){
                    title = paper.lang.replace(title);
                }
                var eAction = $("<div class='action wrippels' tabindex='0'>" + title + "</div>").appendTo(eOverlay);
                if(action.getId() !== null){
                    eAction.attr("id", action.getId());
                }
                if(action.getIcon() !== null){
                    $("<i></i>").addClass(action.getIcon()).appendTo(eAction);
                }

            }
        }
        if(eOverlay.children().length > 0){
            var expandButton = $("<div class='action wrippels expand-button' tabindex='0'><i class='mdi-navigation-more-vert'></i></div>").appendTo(eActionBar);
            eOverlay.appendTo(eActionBar);
        }
        setTimeout(function(){
            var eTitle = eHeader.find(".title");
            if(eTitle.length > 0){
                var width = eActionBar.width();
                eTitle.css("right", width + "px");
            }
        }, 20);
    };

    var orderActions = function(actionList){
        var orderList = {};
        var min = 0;
        var max = 0;
        for(var i = 0; i < actionList.length; i++){
            var action = actionList[i];
            var order = action.getOrderInCategory();
            if(typeof(orderList[order]) === "undefined"){
                orderList[order] = [];
                if(order > max){
                    max = order;
                }
                if(order < min){
                    min = order;
                }
            }
            orderList[order].push(action);
        }

        var newActionList = {"all":[]};
        for(var i = min; i <= max; i++){
            if(typeof(orderList[i]) !== "undefined"){
                for(var j = 0; j < orderList[i].length; j++){
                    var action = orderList[i][j];
                    if(typeof(newActionList[action.getShowAsAction()]) === "undefined"){
                        newActionList[action.getShowAsAction()] = [];
                    }
                    newActionList[action.getShowAsAction()].push(action);
                    newActionList["all"].push(action);
                }
            }
        }
        return newActionList;
    };

    //Listen to header action
    $("body").ready(function(){
        var timeout;
        //On expand-button click
        $("body").on("click", ".paper-header .action-bar .action.expand-button", function(){
            var actionOverlay = $(this).parent().children(".action-overlay");
            actionOverlay.addClass("fade").removeClass("hide");
            setTimeout(function(){
                actionOverlay.removeClass("fade");
            }, 20);
        });

        //On expand-button lose focus
        $("body").on("blur", ".paper-header .action-bar .action.expand-button", function(){
            var tthis = $(this).parent().children(".action-overlay").addClass("fade");
            timeout = setTimeout(function(){
                $(tthis).addClass("hide").removeClass("fade");
            }, 200);
        });

        //On action-overlay click
        $("body").on("click", ".paper-header .action-bar .action-overlay", function(){
            var tthis = $(this).addClass("fade");
            setTimeout(function(){
                $(tthis).addClass("hide").removeClass("fade");
            }, 200);
        });

        //On action in overlay gain focus
        $("body").on("focus", ".paper-header .action-bar .action-overlay .action", function(){
            if(timeout){
                clearTimeout(timeout);
            }
            $(this).parent().removeClass("fade");
        });
    });

    /**
     * Header object
     * @param {{color: string, title: string, icon: string, leftAction: null | 'menu' | 'back', actions: [{orderInCategory: int, id: string, title: string, icon: string, showAsAction: 'ifroom' | 'never' | 'always' | 'withtext'}]}} options
     * @constructor
     */
    function Header(options) {
        this.element = null;

        this.color = "light-gray";
        this.title = null;
        this.icon = null;
        this.actions = [];
        this.leftAction = null;
        this.src = null;
        this.pushLeft = false;
        this.wrippels = true;
        this.tabs = null;
        this.size = "small";

        if (typeof(options) !== "undefined") {

            if (typeof(options.color) !== "undefined") {
                this.setColor(options.color);
            }
            if (typeof(options.title) !== "undefined") {
                this.setTitle(options.title);
            }
            if (typeof(options.icon) !== "undefined") {
                this.setIcon(options.icon);
            }
            if (typeof(options.actions) !== "undefined") {
                this.setActions(options.actions);
            }
            if (typeof(options.leftAction) !== "undefined") {
                this.setLeftAction(options.leftAction);
            }
            if (typeof(options.src) !== "undefined") {
                this.setSource(options.src);
            }
            if (typeof(options.pushLeft) !== "undefined") {
                this.setPushLeft(options.pushLeft);
            }
            if (typeof(options.wrippels) !== "undefined") {
                this.setWrippels(options.wrippels);
            }
            if (typeof(options.tabs) !== "undefined") {
                this.setTabs(options.tabs);
            }
            if (typeof(options.size) !== "undefined") {
                this.setSize(options.size);
            }

        }
    }

    Header.prototype.setSize = function(size){
        if(size !== "small" && size !== "medium" && size !== "large"){
            throw "Unknown size '" + size + "'";
        }
        this.size = size;
    };

    Header.prototype.getSize = function(){
        return this.size;
    };

    Header.prototype.setTabs = function(tabs){
        this.tabs = tabs;
    };

    Header.prototype.getTabs = function(){
        return this.tabs;
    };

    Header.prototype.setWrippels = function(wrippels){
        this.wrippels = wrippels;
    };

    Header.prototype.hasWrippels = function(){
        return this.wrippels;
    };

    Header.prototype.setPushLeft = function(pushLeft){
        this.pushLeft = pushLeft;
    };

    Header.prototype.getPushLeft = function(){
        return this.pushLeft;
    };

    Header.prototype.setElement = function(element){
        this.element = element;
    };

    Header.prototype.getElement = function(){
        return this.element;
    };

    Header.prototype.setTitle = function (title) {
        if(typeof(title) === "undefined"){
            this.title = null;
        }else{
            this.title = title;
        }
    };

    Header.prototype.getTitle = function(){
        return this.title;
    };

    Header.prototype.setIcon = function (icon) {
        if(typeof(icon) === "undefined"){
            this.icon = null;
        }else{
            this.icon = icon;
        }
    };

    Header.prototype.getIcon = function () {
        return this.icon;
    };

    Header.prototype.setSource = function (src) {
        if(typeof(src) === "undefined"){
            this.src = null;
        }else{
            this.src = src;
        }
    };

    Header.prototype.getSource = function () {
        return this.src;
    };

    /**
     * Add Action
     * @param {{orderInCategory: int, id: string, title: string, icon: string, showAsAction: 'ifroom' | 'never' | 'always' | 'withtext'}} action
     */
    Header.prototype.addAction = function (action) {
        this.actions.push(new Action(action));
    };

    /**
     * Remove Action by id
     * @param {string} id - Action id
     */
    Header.prototype.removeAction = function (id) {
        for (var i = 0; i < this.actions.length; i++) {
            if (this.actions[i].getId() === id) {
                this.actions.remove(i);
                break;
            }
        }
    };

    /**
     * Set Actions
     * @param [{orderInCategory: int, id: string, title: string, icon: string, showAsAction: 'ifroom' | 'never' | 'always' | 'withtext'}] actions
     */
    Header.prototype.setActions = function (actions) {
        this.actions = [];
        for(var i = 0; i < actions.length; i++){
            this.addAction(actions[i]);
        }
    };

    Header.prototype.getActions = function(){
        return this.actions;
    };

    /**
     * Show defined icon, menu-icon or back-icon
     * @param {null | 'menu' | 'back'} leftAction
     */
    Header.prototype.setLeftAction = function (leftAction) {
        if (leftAction === null || leftAction === "menu" || leftAction === "back") {
            this.leftAction = leftAction;
        } else {
            throw "Wrong usage leftAction: null | 'menu' | 'back'";
        }
    };

    Header.prototype.getLeftAction = function(){
        return this.leftAction;
    };

    Header.prototype.setColor = function (color) {
        if(typeof(paper.colors[color]) === "undefined"){
            throw "Unknown color \'" + color + "\'";
        }else{
            this.color = color;
        }
    };

    Header.prototype.getColor = function(){
        return this.color;
    };

    Header.prototype.render = function(){
        return paper.header.render();
    };

    Header.prototype.update = function(){
        paper.header.update(this);
    };

    Header.prototype.attach = function(element){
        paper.header.attach(this, element);
    };

    Header.prototype.detach = function(){
        paper.header.detach(this);
    };

    /**
     * Create new Action
     * @param {{orderInCategory: int, id: string, title: string, icon: string, showAsAction: 'ifroom' | 'never' | 'always' | 'withtext'}} options
     * @constructor
     */
    function Action(options){
        this.orderInCategory = -1;
        this.id = null;
        this.icon = null;
        this.title = null;
        this.showAsAction = "ifRoom";
        this.contet = null;

        if(typeof(options) !== "undefined"){

            if(typeof(options.orderInCategory) !== "undefined"){
                this.orderInCategory = parseInt(options.orderInCategory);
            }
            if(typeof(options.id) !== "undefined"){
                this.id = options.id;
            }
            if(typeof(options.title) !== "undefined"){
                this.title = options.title;
            }
            if(typeof(options.icon) !== "undefined"){
                this.icon = options.icon;
            }
            if(typeof(options.content) !== "undefined"){
                this.content = options.content;
            }
            if(typeof(options.showAsAction) !== "undefined" && options.showAsAction != null){
                var saa = options.showAsAction.toLowerCase();
                if(saa === "ifroom" || saa === "never" || saa === "always" || saa === "withtext") {
                    this.showAsAction = saa;
                }else{
                    throw "Wrong usage showAsAction: always | withtext | ifRoom | never";
                }
            }

        }
    }

    Action.prototype.getOrderInCategory = function(){
        return this.orderInCategory;
    };

    Action.prototype.getId = function(){
        return this.id;
    };

    Action.prototype.getIcon = function(){
        return this.icon;
    };

    Action.prototype.getTitle = function(){
        return this.title;
    };

    Action.prototype.getShowAsAction = function(){
        return this.showAsAction;
    };

    Action.prototype.getContent = function(){
        return this.content;
    };

})();
(function(){

    //Check dependency
    if (typeof(paper) === "undefined") {
        console.error("\'paper-app\' dependence on \'paper\'");
    }
    if (typeof(paper.header) === "undefined") {
        console.error("\'paper-app\' dependence on \'paper-header\'");
    }

    var working = false;
    var appTitle = null;

    var ajaxRegister = [];

    var findEmptyKey = function(map, i){
        if(typeof(i) === "undefined"){
            i = 1;
        }
        if(typeof(map[i]) === "undefined"){
            return i;
        }else{
            return findEmptyKey(map, i+1);
        }
    };

    /**
     * Material Application Framework
     * @type {{version: string, create: Function}}
     */
    paper.app = {

        /**
         * Create new application
         * @param {string} title - Application title
         * @param {string} color - Default color of your app
         * @param {string} iconSrc - The source path to your icon
         * @returns {App}
         */
        create: function(title, color, iconSrc){
            return new App(title, color, iconSrc);
        },

        post: function(url, data, success, dataType){
            if(typeof(this.id) !== "undefined"){
                return this.ajax({url: url, data: data, success: success, dataType: dataType, type: "POST"});
            }else{
                return paper.app.ajax({url: url, data: data, success: success, dataType: dataType, type: "POST"});
            }
        },

        get: function(url, data, success, dataType){
            if(typeof(this.id) !== "undefined"){
                return this.ajax({url: url, data: data, success: success, dataType: dataType, type: "GET"});
            }else{
                return paper.app.ajax({url: url, data: data, success: success, dataType: dataType, type: "GET"});
            }
        },

        ajax: function(url, settings){
            var jqXHR = $.ajax(url, settings);
            var onFail = undefined;
            var onAlways = undefined;

            var customJqXHR = {
                done: jqXHR.done,
                fail: function(func){
                    onFail = func;
                },
                always: function(func){
                    onAlways = func;
                },
                then: jqXHR.then,
                readyState: jqXHR.readyState,
                status: jqXHR.status,
                statusText: jqXHR.statusText,
                responseXML : jqXHR.responseXML ,
                responseText : jqXHR.responseText ,
                setRequestHeader: jqXHR.setRequestHeader,
                getAllResponseHeaders: jqXHR.getAllResponseHeaders,
                getResponseHeader: jqXHR.getResponseHeader,
                statusCode: jqXHR.statusCode,
                abort: jqXHR.abort,
                original: jqXHR
            };

            if(typeof(this.ajaxRegister) !== "undefined"){
                var index = findEmptyKey(this.ajaxRegister);
                var xhrStore = this.ajaxRegister;
                this.ajaxRegister[index] = customJqXHR;
            }else{
                var index = findEmptyKey(ajaxRegister);
                var xhrStore = ajaxRegister;
                ajaxRegister[index] = customJqXHR;
            }

            jqXHR.fail(function(jqXHR, textStatus, errorThrown){
                var canceled = false;
                if(typeof(onFail) !== "undefined"){
                    canceled = onFail(jqXHR, textStatus, errorThrown) === false;
                }

                if(canceled){return;}
                if(typeof(paper.app.errorHandlers[jqXHR.status]) !== "undefined"){
                    canceled = paper.app.errorHandlers[jqXHR.status](jqXHR, textStatus, errorThrown) === false;
                }

                if(canceled){return;}
                if (jqXHR.status === 0) {
                    if (jqXHR.statusText === 'abort') {
                        if(typeof(paper.app.errorHandlers.canceled) !== "undefined"){
                            canceled = paper.app.errorHandlers.canceled(jqXHR, textStatus, errorThrown) === false;
                        }
                    }else{
                        if(typeof(paper.app.errorHandlers.connectionError) !== "undefined") {
                            canceled = paper.app.errorHandlers.connectionError(jqXHR, textStatus, errorThrown) === false;
                        }
                    }
                }else if(jqXHR.status >= 400 && jqXHR.status < 500){
                    if(typeof(paper.app.errorHandlers.connectionError) !== "undefined") {
                        canceled = paper.app.errorHandlers.connectionError(jqXHR, textStatus, errorThrown) === false;
                    }
                }else if(jqXHR.status >= 500){
                    if(typeof(paper.app.errorHandlers.serverError) !== "undefined") {
                        canceled = paper.app.errorHandlers.serverError(jqXHR, textStatus, errorThrown) === false;
                    }
                }
                if(canceled){return;}
                if(!(jqXHR.status === 0 && jqXHR.statusText === "abort")){
                    if(typeof(paper.app.errorHandlers.error) !== "undefined") {
                        paper.app.errorHandlers.error(jqXHR, textStatus, errorThrown) === false;
                    }
                }
            });
            jqXHR.always(function(data, textStatus, jqXHR){
                if(typeof(onAlways) !== "undefined"){
                    onAlways(data, textStatus, jqXHR);
                }
                delete xhrStore[index];
            });

            return customJqXHR;
        },

        errorHandlers: {
            error: undefined,
            canceled: undefined,
            connectionError: undefined,
            serverError: undefined,
            notfound: "<h1><i class='mdi-alert-error fg-red'></i>Nothing here...</h1><button onclick='history.back()' class='paper-button wrippels'><i class='mdi-navigation-arrow-back'></i>back</button>"
        },

        generateLocation: generateLocation

    };

    /**
     * Create new App
     * @param {string} title - Application title
     * @param {string} color - Default color of your app
     * @param {string} iconSrc - The source path to your icon
     * @constructor
     */
    function App(title, color, iconSrc){
        if(title === null || title === "" || typeof(title) === "undefined" || title === false){
            this.title = "@+app-name+@";
        }else{
            this.title = title;
        }
        if(typeof(paper.colors[color]) === "undefined"){
            throw "Unknown color '" + color + "'";
        }

        this.color = color;
        this.iconSrc = iconSrc;

        this.activityGroups = [];
        this.activities = [];

        this.element;
    }

    /**
     * Create new Activity
     * @param {string} id - Unique name for this activity
     * @param {html | selector} content - Structure of this activity
     * @param {object} activity - Activity object
     */
    App.prototype.activity = function(id, content, activity){
        //Check arguments
        if(typeof(activity) === "undefined"){
            var clss = content;
            var pContent = "[activity='" + id + "']";
        }else{
            var pContent = content;
            var clss = activity;
        }
        if(typeof(clss) === "undefined"){
            throw "missing argument";
        }
        if(id === null || id === ""){
            throw "Activity id cannot be empty";
        }
        var existingActivity = this.activities[id];
        if(typeof(existingActivity) !== "undefined") {
            if(existingActivity._temp !== true) {
                throw "Activity '" + id + "' already exists";
            }
        }

        //Add properties to activity
        var props = {};
        props.content = pContent;
        props.id = id;
        props["class"] = clss

        //Store activity
        this.activities[id] = props;
        return id;
    };

    /**
     * Create new ActivityGroup
     * @param {string} id - Unique name for this ActivityGroup
     * @param {{color: string, leftAction: null | 'menu' | 'back', icon: string, title: string, activity_1: Activity, activity_2: Activity, activity_3: Activity}} options - activityGroup settings
     */
    App.prototype.group = function(id, options){
        //Check arguments
        if(id === null || id === ""){
            throw "Group id cannot be empty";
        }
        if(typeof(this.activityGroups[id]) !== "undefined"){
            throw "Group '" + id + "' already exists";
        }

        //Store group
        this.activityGroups[id] = options;
        return id;
    };

    /**
     * Set theme color
     * @param color predefined color
     */
    App.prototype.setTheme = function(color){
        if(typeof(paper.colors[color]) === "undefined"){
            throw "'" + color + "' is not predefined";
        }
        this.element.attr("class", "material-app theme-" + color);
        this.element.children(".app-header").attr("class", "app-header " + color);
        $("head meta[name='theme-color']").attr("content", paper.colors[color]);
        if (typeof(paper.wrippels) !== "undefined") {
            var isLight = paper.wrippels.isLightBackground(this.element.children(".app-header"));
            this.element.children(".app-header").attr("bg", (isLight ? "light" : "dark"));
            this.element.children(".app-content").children(".paper-group").children(".paper-activity").attr("bg", (isLight ? "light" : "dark"));
        }
    };

    /**
     * Get UrlData
     * @param url
     * @returns {*}
     */
    App.prototype.getUrlData = function(url){
        return getPath(url);
    };

    /**
     * Show overlay
     * (use back() to hide it)
     * @param {string} activityName
     * @param {string} arg
     */
    App.prototype.overlay = function(activityName, arg){
        var urlData = getPath();
        urlData.overlay = activityName;
        urlData.overlayArg = arg;
        this.goToUrl(generateLocation(urlData.group, urlData.arg, urlData.acts, urlData.overlay, urlData.overlayArg), true);
    };

    /**
     * Go back
     */
    App.prototype.back = function(){
        var urlData = getPath();
        if(urlData.overlay !== null){
            urlData.overlay = null;
            urlData.overlayArg = null;
        }else if(urlData.acts.length == 2){
            urlData.acts.splice(1, 1);
        }else if(urlData.acts.length == 1){
            urlData.acts.splice(0, 1);
        }else{
            var group = this.activityGroups[urlData.group];
            var prevGroup = "home";
            if(typeof(group.prevGroup) !== "undefined"){
                prevGroup = group.prevGroup;
            }
            urlData.group = prevGroup;
            urlData.arg = undefined;
        }
        this.goToUrl(generateLocation(urlData.group, urlData.arg, urlData.acts, urlData.overlay, urlData.overlayArg), true);
    };

    /**
     * Go group back
     * Warning - Does NOT go back in the browser history
     */
    App.prototype.groupBack = function(){
        var urlData = getPath();
        var group = this.activityGroups[urlData.group];
        var prevGroup = "home"
        if(typeof(group.prevGroup) !== "undefined"){
            prevGroup = group.prevGroup;
        }
        urlData.group = prevGroup;
        urlData.arg = undefined;
        urlData.acts = [];
        this.goToUrl(generateLocation(urlData.group, urlData.arg, urlData.acts), true);
    };

    /**
     * Navigate to home ActivityGroup
     * @param {boolean} pushState - History pushState
     */
    App.prototype.goHome = function(pushState){
        this.goToGroup("home", null, pushState);
    };

    /**
     * Navigate to ActivityGroup
     * @param {string} groupName - ActivityGroup name
     * @param {string} arg - invokeArg
     * @param {boolean} pushState - History pushState
     */
    App.prototype.goToGroup = function(groupName, arg, pushState){
        var url = getScriptName() + "#!" + groupName;
        if(typeof(arg) !== "undefined" && arg !== null){
            url += ":" + arg
        }
        this.goToUrl(url, pushState);
    };

    /**
     * Navigate to Activity
     * @param {string} activityName - Activity name
     * @param {int} index - index of the Activity (1 or 2)
     * @param {string} arg - invokeArg
     * @param {boolean} pushState - History pushState
     */
    App.prototype.goToActivity = function(activityName, index, arg, pushState){
        var app = this;
        var urlData = getPath();
        urlData.overlay = null;
        urlData.overlayArg = null;
        if(index == 2){
            urlData.acts = [{activity:activityName, arg: arg}];
        }else if(index == 3){
            if(typeof(urlData.acts[0]) === "undefined"){
                throw "Activity 2 is not set";
            }
            urlData.acts[1] = {activity:activityName, arg: arg};
        }else{
            throw "Index must be 2 or 3";
        }
        app.goToUrl(generateLocation(urlData.group, urlData.arg, urlData.acts), pushState);
    };

    /**
     * Navigate to URL
     * @param {string} path - URL
     * @param {boolean} pushState - History pushState
     */
    App.prototype.goToUrl = function(path, pushState){
        //Check if the app is initialized
        if(!this.isInit){
            this.init();
        }
        if(working){
            return;
        }
        working = true;
        setTimeout(function(){
            working = false;
        }, 300);
        console.debug("goTo: " + path);
        var app = this;
        var currentGroup = getCurrentGroup(app);
        var urlData = getPath(path);
        var group = app.activityGroups[urlData.group];

        var overlayVisible = app.element.children(".paper-overlay").length > 0;
        hideOverlay(app);

        //Set history
        var title = app.title;

        if(typeof(group) !== "undefined") {
            if (typeof(group.title) !== "undefined" && group.title !== null) {
                title = group.title + " | " + title;
            }
        }
        if(typeof(paper.lang) !== "undefined"){
            title = paper.lang.replace(title);
        }
        for(var i = 0; i < urlData.acts.length; i++){
            var activity = app.activities[urlData.acts[i]];
            if(typeof(activity) !== "undefined"){
                if(typeof(activity.title) !== "undefined" && activity.title !== null){
                    title = activity.title + " - " + title;
                }
            }
        }
        var url = generateLocation(urlData.group, urlData.arg, urlData.acts, urlData.overlay, urlData.overlayArg);
        if(url !== location.href) {
            if (pushState || typeof(pushState) === "undefined") {
                var isBack = routingManager.goTo(url, title);
                if(isBack === true){
                    return;
                }
            }else{
                routingManager.replaceUrl(url, title);
            }
        }
        document.title = title;
        $("body").trigger("navigate", [url, urlData]);

        console.debug("check group -> " + currentGroup[0] + ":"  + currentGroup[1] + " === " + urlData.group + ":" + urlData.arg);
        if(currentGroup[0] === urlData.group && currentGroup[1] === urlData.arg){
            console.debug("same group");
            //Change Activities
            if(urlData.acts.length == 0){
                console.debug("clear activity 2 and 3");
                //Remove Activity 2 and 3 if exists
                closeActivity(app, 1);
                closeActivity(app, 2);
            }
            if(urlData.acts.length >= 1){
                console.debug("check if activity 2 exists");
                //Check if Activity 2 should change
                var activity_2 = getCurrentActivity(app, 1);
                var shouldChange = activity_2 != null;
                if(shouldChange) {
                    console.debug("yeas");
                    var arg = activity_2.element.attr("data-arg");
                    if (arg === null || typeof(arg) === "undefined") {
                        arg = null;
                    }
                    console.debug("should activity 2 change");
                    if (arg !== urlData.acts[0].arg || activity_2.id !== urlData.acts[0].activity) {
                        console.debug("yes");
                        //Remove activity
                        hideActivity(activity_2);
                        setTimeout(function(){
                            destroyActivity(activity_2);
                            setCurrentActivity(app, urlData.acts[0].activity, 2, urlData.acts[0].arg);
                        }, 200);
                    }
                }else{
                    console.debug("no");
                    var closed = closeActivity(app, 1);
                    if(closed){
                        setTimeout(function(){
                            setCurrentActivity(app, urlData.acts[0].activity, 2, urlData.acts[0].arg);
                        }, 200);
                    }else{
                        setCurrentActivity(app, urlData.acts[0].activity, 2, urlData.acts[0].arg);
                    }
                }
            }
            if(urlData.acts.length >= 2){
                console.debug("check if activity 3 exists");
                var activity_3 = getCurrentActivity(app, 2);
                if(activity_3 != null){
                    console.debug("yeas");
                    var arg = activity_3.element.attr("data-arg");
                    if (arg === null || typeof(arg) === "undefined") {
                        arg = null;
                    }
                    console.debug("should activity 3 change");
                    if (arg !== urlData.acts[1].arg || activity_3.id !== urlData.acts[1].activity) {
                        console.debug("yes");
                        //Remove activity
                        hideActivity(activity_3);
                        setTimeout(function(){
                            destroyActivity(activity_3);
                            setCurrentActivity(app, urlData.acts[1].activity, 3, urlData.acts[1].arg);
                        }, 200);
                    }
                }else{
                    console.debug("no");
                    var closed = closeActivity(app, 2);
                    if(closed){
                        setTimeout(function(){
                            setCurrentActivity(app, urlData.acts[1].activity, 3, urlData.acts[1].arg);
                        }, 200);
                    }else{
                        setCurrentActivity(app, urlData.acts[1].activity, 3, urlData.acts[1].arg);
                    }
                }
            }else{
                //Remove Activity 3
                closeActivity(app, 2);
            }
        }else{
            console.debug("different group");
            //Change ActivityGroup
            setCurrentGroup(app, urlData.group, urlData.arg, urlData.acts);
        }

        if(urlData.overlay !== null){
            console.debug("Show overlay '" + urlData.overlay + "'");
            if(overlayVisible){
                setTimeout(function(){
                    showOverlay(app, urlData.overlay, urlData.overlayArg);
                }, 201);
            }else{
                showOverlay(app, urlData.overlay, urlData.overlayArg);
            }
        }
    };

    /**
     * Hide and destroy activity
     * @param app
     * @param index
     * @return {boolean} - if activity closed true otherwise false
     */
    function closeActivity(app, index){
        var eActivities = app.element.children(".app-content").children(".paper-group").children(".paper-activity");
        if(eActivities.length <= index){
            return false;
        }
        var eActivity = eActivities.eq(index);
        var name = eActivity.attr("activity");
        var activity = app.activities[name];
        if(typeof(activity) === "undefined"){
            eActivity.find(".activity-body").addClass("fade");
            eActivity.find(".paper-header").addClass("fade");
            setTimeout(function(){
                eActivity.remove();
            }, 200);
        }else{
            hideActivity(activity);
            setTimeout(function(){
                destroyActivity(activity);
                app.updateLayout();
            }, 200);
        }
        return true;
    }

    /**
     * Show activity as overlay
     * @param {App} app
     * @param {string} activityName
     * @param {string} arg
     */
    function showOverlay(app, activityName, arg){
        var activity = app.activities[activityName];

        var clr = app.color;
        var groupName = getCurrentGroup(app)[0];
        var group = app.activityGroups[groupName];
        if(typeof(group.color) !== "undefined"){
            clr = group.color;
        }

        if(typeof(activity) === "undefined"){
            console.error("Cannot find Activity '" + activityName + "'");
        }else{
            if(typeof(activity.color) !== "undefined"){
                clr = activity.color;
            }
        }

        var eActivity = createActivity(app, activityName, arg, clr);
        eActivity.children(".paper-header").removeClass("fade");
        var eOverlay = $("<div class='paper-overlay fade'></div>");
        eActivity.appendTo(eOverlay);
        var leftAction = eActivity.children(".paper-header").children(".left-action");
        var icon = leftAction.children(".icon");
        leftAction.children(".title").addClass("push-left");
        if(icon.length == 0){
            icon = $("<div class='icon wrippels'><i></i></div>").appendTo(leftAction);
        }
        icon.children("i").attr("class", "mdi-content-clear");

        if(group.drawer === activityName){
            eOverlay.addClass("paper-drawer");
            eActivity.children(".paper-header").remove();
            eActivity.children(".activity-frame").children(".activity-body").children(".drawer-head").addClass("fade");
        }

        eOverlay.appendTo(app.element);
        setTimeout(function(){
            eOverlay.removeClass("fade");
            if(typeof(activity) === "undefined") {
                eActivity.children().removeClass("fade").children().removeClass("fade");
            }else{
                if(group.drawer === activityName){
                    setTimeout(function(){
                        eActivity.children(".activity-frame").children(".activity-body").children(".drawer-head").removeClass("fade");
                    }, 200);
                }
                showActivity(activity);
            }
        }, 20);
    }

    /**
     * Hide all visible overlays
     * @param {App} app
     */
    function hideOverlay (app) {
        var eOverlay = app.element.children(".paper-overlay");
        eOverlay.addClass("fade");
        setTimeout(function(){
            eOverlay.remove();
        }, 200);
        var eActivity = eOverlay.children(".paper-activity");
        if (eActivity.length > 0) {
            var activityId = eActivity.attr("activity");
            if(activityId !== null && typeof(activityId) !== "undefined") {
                var activity = app.activities[activityId];
                if(typeof(activity) !== "undefined") {
                    hideActivity(activity);
                    activity.element.children(".paper-header").removeClass("fade");
                    setTimeout(function () {
                        destroyActivity(activity);
                    }, 200);
                }
            }
        }
    }

    /**
     * Set Activity to current index of the current group
     * @param {App} app
     * @param {string} activityName
     * @param {int} index - 2 or 3
     * @param {string} arg
     */
    function setCurrentActivity(app, activityName, index, arg){
        var eGroup = app.element.children(".app-content").children(".paper-group");
        var group = app.activityGroups[getCurrentGroup(app)[0]];
        var activity = app.activities[activityName];

        var color = app.color;
        if(typeof(group.color) !== "undefined"){
            color = group.color;
        }

        var pos = "normal";
        if(index == 2 && typeof(group.activity_2_type) !== "undefined"){
            pos = group.activity_2_type;
        }else if(index == 3 && typeof(group.activity_3_type) !== "undefined"){
            pos = group.activity_3_type;
        }

        if(typeof(activity) === "undefined"){
            console.error("Cannot find Activity '" + activityName + "'");
            var eActivity = createActivity(app, activityName, arg, color);
            eActivity.addClass("pos-" + pos);
            eActivity.appendTo(eGroup);

            setTimeout(function(){
                eActivity.children().removeClass("fade").children().removeClass("fade");
            }, 20);
            app.updateLayout();
        }else{
            var eActivity = createActivity(app, activityName, arg, color);
            eActivity.addClass("pos-" + pos);
            eActivity.appendTo(eGroup);
            if(typeof(paper.wrippels) !== "undefined"){
                var isLight = paper.wrippels.isLightBackground(app.element.children(".app-header"));
                eGroup.children(".paper-activity").attr("bg", (isLight ? "light" : "dark"));
            }

            setTimeout(function(){
                showActivity(activity);
            }, 20);
            app.updateLayout();
        }
    }


    /**
     * Get current activity by index
     * @param {App} app
     * @param {int} index
     * @returns {Activity}
     */
    function getCurrentActivity (app, index){
        var eActivities = app.element.children(".app-content").children(".paper-group").children(".paper-activity");
        if(eActivities.length <= index){
            return null;
        }
        var eActivity = eActivities.eq(index);
        return app.activities[eActivity.attr("activity")];
    }

    /**
     * Get current ActivityGroup
     * @param {App} app
     * @returns {[groupName, arg]}
     */
    function getCurrentGroup(app){
        var appContent = app.element.children(".app-content");
        if(appContent.children(".paper-group").length == 0){
            return [null, null];
        }else{
            var groupName = appContent.children(".paper-group").attr("group");
            var arg = appContent.children(".paper-group").attr("data-arg");
            if(arg === "" || arg === null || typeof(arg) === "undefined"){
                arg = null;
            }
            return [groupName, arg];
        }
    }

    /**
     * Set current ActivityGroup
     * @param {App} app
     * @param {string} groupName - ActivityGroup
     * @param {string} arg - argument
     * @param {[{activity: Activity, arg: string}]} acts - Activities
     */
    function setCurrentGroup(app, groupName, arg, acts){
        var appContent = app.element.children(".app-content");

        //Check if old group exists
        if(appContent.children(".paper-group").length > 0){
            destroyActivityGroup(app, function(){
                createGroup(app, groupName, arg, acts);
                app.updateLayout();
            });
        }else{
            createGroup(app, groupName, arg, acts);
            app.updateLayout();
        }
    }

    /**
     * Destroy ActivityGroup with children
     * @param {App} app
     * @param {Function} callBack - called when destroyed
     */
    function destroyActivityGroup(app, callBack){
        var eGroup = app.element.children(".app-content").children(".paper-group");
        eGroup.addClass("fade");
        var eActivities = eGroup.children(".paper-activity").each(function(){
            var activityId = $(this).attr("activity");
            var activity = app.activities[activityId];
            if(typeof(activity) !== "undefined") {
                hideActivity(activity);
                destroyActivity(activity);
            }
        });

        setTimeout(function(){
            eGroup.remove();
            if(typeof(callBack) !== "undefined"){
                callBack();
            }
        }, 200);
    }

    /**
     * Create ActivityGroup
     * @param {App} app
     * @param {string} groupName - ActivityGroup name
     * @param {string} arg - argument
     * @param {[{activity: Activity, arg: string}]} acts - Activities
     */
    function createGroup(app, groupName, arg, acts){
        var appContent = app.element.children(".app-content");
        var appHeader = app.element.children(".paper-header");
        var color = app.color;

        var group = app.activityGroups[groupName];
        //Create group
        var eGroup = $("<div class='paper-group fade' group='" + groupName + "'></div>");
        if (typeof(arg) !== "undefined" && arg !== null) {
            eGroup.attr("data-arg", arg);
        }
        if(typeof(group) === "undefined"){
            console.error("Cannot find ActivityGroup '" + groupName + "'");
            //Create undefined activity
            var e1 = createActivity(app, undefined, arg, color).appendTo(eGroup);
            e1.addClass("pos-large");
            e1.children().removeClass("fade").children().removeClass("fade");
            app.setTheme(app.color);

            //Add to DOM
            eGroup.appendTo(appContent);
            setTimeout(function(){
                app.updateLayout();
                eGroup.removeClass("fade");
            }, 20);
        }else {
            if(typeof(group.color) !== "undefined"){
                color = group.color;
            }

            //Create activities
            var e1 = createActivity(app, group.activity_1, arg, color).appendTo(eGroup);
            var eTitle = e1.find(".paper-header .title");

            var pos = "normal";
            if (typeof(group.activity_1_type) !== "undefined") {
                pos = group.activity_1_type;
            }
            e1.addClass("pos-" + pos);

            for (var i = 0; i < acts.length; i++) {
                var ex = createActivity(app, acts[i].activity, acts[i].arg, color).appendTo(eGroup);
                var pos = "normal";
                if (i == 0 && typeof(group.activity_2_type) !== "undefined") {
                    pos = group.activity_2_type;
                } else if (i == 1 && typeof(group.activity_3_type) !== "undefined") {
                    pos = group.activity_3_type;
                }
                ex.addClass("pos-" + pos);
            }

            //Update header

            var leftAction = appHeader.children(".left-action");
            if(group.leftAction === "menu"){
                app.header.setLeftAction(group.leftAction);
            }else if(group.leftAction === "back"){
                app.header.setLeftAction(group.leftAction);
            }else{
                app.header.setLeftAction(null);
                if(typeof(group.icon) !== "undefined" && group.icon !== null){
                    app.header.setIcon(group.icon);
                }else{
                    app.header.setIcon(app.icon);
                }
            }
            app.header.update();

            //Add to DOM
            eGroup.appendTo(appContent);
            app.setTheme(color);
            setTimeout(function(){
                app.updateLayout();
                eGroup.removeClass("fade");
                showActivity(app.activities[group.activity_1]);
                for(var i = 0; i < acts.length; i++){
                    showActivity(app.activities[acts[i].activity]);
                }
            }, 20);
        }

    }

    /**
     * Render Activity to jQuery object
     * @param {App} app
     * @param {string} activityName - Activity name
     * @param {object} invokeArg - Object to pass through to Activity.onCreate function
     * @param {string} color - Default color
     * @param {string} title - Activity title
     * @returns {jQuery}
     */
    function createActivity(app, activityName, invokeArg, color){
        console.debug("Create Activity: " + activityName);
        var activity = app.activities[activityName];
        if(typeof(activity) !== "undefined") {
            return buildActivity(app, activity, invokeArg, color)
        }else{
            var emptyActivity = new function(){

                var activity = this;
                this.content = $("<div></div>");
                this.id = activityName;
                this.get = paper.app.get;
                this.ajax = paper.app.ajax;
                this._temp = true;

                this.onCreate = function(eActivity, invokeArg){

                    activity.get('activities/' + activity.id + '.html').done(function(data){
                        $("body").append(data);
                        setTimeout(function(){
                            var newProp = app.activities[activity.id];
                            if(typeof(newProp) !== "undefined"){
                                var newActivity = callActivity(newProp);
                                initActivity(newActivity);
                                activity.onCreate = undefined;
                                activity._temp = undefined;
                                var loadedFunc = activity.loaded;
                                for(var key in newActivity){
                                    activity[key] = newActivity[key];
                                }
                                activity.loaded = loadedFunc;
                                activity.isLoaded = false;
                                app.activities[activity.id] = activity;

                                var eActivityNew = buildActivity(app, activity, invokeArg, color);
                                $("[activity='" + activity.id + "'] .paper-header").html(eActivityNew.children(".paper-header").html());
                                $("[activity='" + activity.id + "'] style").remove();
                                if(eActivityNew.children("style").length > 0){
                                    $("[activity=" + activity.id + "]").prepend(eActivityNew.children("style"));
                                }
                                eActivity.html(eActivityNew.children(".paper-activity").html());
                                activity.loaded();
                            }else{
                                console.error("Initialize " + activity.id + ": Failed to register");
                                $("<div class='activity-empty'>" + paper.app.errorHandlers.notfound + "</div>").appendTo(eActivity);
                                activity.loaded();
                            }
                        }, 20);
                    }).fail(function(){
                        console.error("Cannot find activity: " + activity.id);
                        $("<div class='activity-empty'>" + paper.app.errorHandlers.notfound + "</div>").appendTo(eActivity);
                        activity.loaded();
                    });

                    return false;
                };

            };
            app.activities[emptyActivity.id] = emptyActivity;
            return buildActivity(app, emptyActivity, invokeArg, color);
        }
    }

    /**
     * Build activity element from activity object
     * @param app
     * @param activity
     * @param {string} color - Default color
     * @param {string} title - Activity title
     * @returns {*|jQuery|HTMLElement}
     */
    function buildActivity(app, activity, invokeArg, color){
        //Reset settings
        activity.loaded = function () {};
        activity.isLoaded = false;

        //Create jQuery object
        var eActivity = $("<div class='paper-activity'></div>");
        activity.element = eActivity;
        eActivity.attr("activity", activity.id);
        var activityArg = invokeArg;
        if (activityArg === null) {
            activityArg = undefined;
        }
        if (typeof(activityArg) !== "undefined") {
            eActivity.attr("data-arg", invokeArg);
        }

        //Add activity-frame
        var activityFrame = $("<div class='activity-frame fade'></div>").appendTo(eActivity);
        activityFrame.attr("bg", "light");

        //Add content from the activity it self
        var clone = activity.content.clone();
        var content = $("<div></div>");
        content.html(clone.html());
        content.addClass("activity-body").addClass("fade");
        content.attr("id", "body-" + activity.id);
        content.removeAttr("activity");

        //Call Activity.onCreate
        if (typeof(activity.onCreate) !== "undefined") {
            var succeed = activity.onCreate(content, activityArg);
            if (succeed === false) {
                //Activity is still loading
                //Add loaded callback to continue initializing the activity when it is loaded
                activity.loaded = function () {
                    activity.isLoaded = true;
                    if (activity.visible) {
                        // Hide load rotator and show content
                        // (Only when the activity is visible, otherwise it will be called on the onVisible event)
                        activityFrame.addClass("fade");
                        setTimeout(function () {
                            activityFrame.children(".paper-loading").remove();
                            paper.initModules(content);
                            content.appendTo(activityFrame);
                            if(typeof(paper.lang) !== "undefined"){
                                paper.lang.updateLanguage(activity.element);
                            }
                            setTimeout(function () {
                                content.removeClass("fade");
                                activityFrame.removeClass("fade");
                            }, 20);
                        }, 200);
                    }
                };
                //Add load rotator when the activity is still loading
                paper.loading.create().addClass("center").appendTo(activityFrame);
            } else {
                //Append content to frame
                activity.isLoaded = true;
                paper.initModules(content);
                content.appendTo(activityFrame);
            }
        } else {
            //Append content to frame
            activity.isLoaded = true;
            paper.initModules(content);
            content.appendTo(activityFrame);
        }

        //Create header
        var hOptions = {color: color, title: activity.title, src: activity.src, pushLeft: activity.pushLeft};
        if(typeof(activity.hOptions) !== "undefined"){
            for(var key in activity.hOptions){
                hOptions[key] = activity.hOptions[key];
            }
        }
        if (typeof(activity.actions) !== "undefined") {
            hOptions.actions = activity.actions;
        }
        var header = paper.header.create(hOptions);
        paper.header.attach(header, eActivity);
        activity.header = header;

        //Add fade in class
        eActivity.children(".paper-header").addClass("fade");

        //Move <style> from activity-body to activity root
        var styles = content.children("style");
        if(styles.length > 0) {
            styles.prependTo(eActivity);
        }

        return eActivity;
    }

    /**
     * Show Activity (triggers loaded() )
     * @param {Activity} activity - Activity
     */
    function showActivity(activity){
        if(activity.visible){
            return;
        }
        console.debug("Show Activity: " + activity.id);
        if(typeof(paper.lang) !== "undefined"){
            paper.lang.updateLanguage($("[activity='" + activity.id + "']"));
        }
        activity.element.children(".activity-frame").removeClass("fade").children(".activity-body").removeClass("fade");
        activity.element.children(".paper-header").removeClass("fade");
        activity.visible = true;
        if (typeof(activity.onVisible) !== "undefined") {
            activity.onVisible();
        }
        if (activity.isLoaded === true && typeof(activity.loaded) !== "undefined") {
            activity.loaded();
        }
    }

    /**
     * Hide Activity
     * @param {Activity} activity - Activity
     */
    function hideActivity(activity){
        if(!activity.visible){
            return;
        }
        console.debug("Hide Activity: " + activity.id);
        if(typeof(activity.element) !== "undefined") {
            activity.element.children(".activity-frame").children(".activity-body").addClass("fade");
            activity.element.children(".paper-header").addClass("fade");
        }
        activity.visible = false;
        if(typeof(activity.onInvisible) !== "undefined"){
            activity.onInvisible();
        }
    }

    /**
     * Destroy Activity (does not update url)
     * @param {Activity} activity - Activity
     */
    function destroyActivity(activity){
        console.debug("Destory Activity: " + activity.id);
        if(typeof(activity.onDestroy) !== "undefined"){
            activity.onDestroy();
        }
        if(typeof(activity.header) !== "undefined"){
            activity.header.detach();
        }
        if(typeof(activity.element) !== "undefined") {
            activity.element.remove();
            activity.element = undefined;
        }
        if(typeof(activity.ajaxRegister) !== "undefined"){
            for(var key in activity.ajaxRegister){
                var customXHR = activity.ajaxRegister[key];
                customXHR.abort();
            }
            activity.ajaxRegister = [];
        }
    }

    function callActivity(prop){
        var object = new prop["class"]();

        object.content = prop.content;
        object.id = prop.id;
        object.visible = false;
        object.isLoaded = false;
        object.post = paper.app.post;
        object.get = paper.app.get;
        object.ajax = paper.app.ajax;
        object.ajaxRegister = [];

        return object;
    }

    function initActivity(activity, importedHtml){
        var content = $(activity.content);
        if(content.length == 0){
            //Not found in DOM -> Search imports
            var exists = false;
            if(typeof(importedHtml) !== "undefined") {
                for (var i = 0; i < importedHtml.length; i++) {
                    var template = importedHtml[i];
                    if (template.attr("activity") === activity.id) {
                        //Copy template into div
                        content = $("<div></div>").html(template.html());
                        var attributes = template[0].attributes;
                        $.each(attributes, function () {
                            content.attr(this.name, this.value);
                        });
                        exists = true;
                        break;
                    }
                }
            }

            if(!exists) {
                //Create new element
                content = $("<div></div>");
            }
        }else{
            content.remove();
        }
        activity.content = content;
        return activity;
    }

    /**
     * Initialze application
     */
    App.prototype.init = function(){
        if(this.isInit){
            return;
        }
        console.info("init app");
        if (!("import" in document.createElement("link"))) {
            // HTML5 Imports not supported
            // Do it manually
            $.holdReady(true);
            var importsTodo = 0;
            $("link[rel='import']").each(function(){
                importsTodo++;
                var url = $(this).attr("href");
                var getter = $.get(url);
                getter.done(function(data){
                    $("body").append(data);
                });
                getter.always(function(){
                    importsTodo--;
                    if(importsTodo == 0){
                        $.holdReady(false);
                    }
                });
            });
        }

        this.isInit = true;
        var app = this;
        appTitle = app.title;
        if(typeof(paper.lang) !== "undefined"){
            appTitle = paper.lang.replace(appTitle);
        }
        $("head").append("<meta name='theme-color' content='" + paper.colors[app.color] + "'>");
        var materialApp = $("<div class='material-app fade'></div>");
        var appHeader = $("<div class='app-header'></div>").addClass(this.color).appendTo(materialApp);
        var header = paper.header.create({
            icon: app.iconSrc,
            color: app.color
        });
        paper.header.attach(header, materialApp);
        app.header = header;
        var appContent = $("<div class='app-content'></div>").appendTo(materialApp);

        this.element = materialApp;

        var showApp = function(){
            // Call activities
            console.info("init activities");
            for(var key in app.activities){
                var prop = app.activities[key];
                var object = callActivity(prop);
                app.activities[key] = object;
            }

            //Get content from imports
            var importedHtml = [];
            $("link[rel='import']").each(function(){
                if(this.import !== null && typeof(this.import) !== "undefined") {
                    var template = $(this.import.querySelector("template"));
                    if (template.length > 0) {
                        importedHtml.push(template);
                        console.debug("load import: " + $(this).attr("href"));
                    }
                }
            });

            //Init activities
            for(var key in app.activities){
                initActivity(app.activities[key], importedHtml);
            }

            //Init groups
            for(var key in app.activityGroups){
                var object = new app.activityGroups[key]();

                if(typeof(object.activity_1) === "undefined"){
                    throw "'activity_1' must be declared";
                }
                object.activity_1 = encodeURI(object.activity_1);
                object.id = key;
                app.activityGroups[key] = object;
            }

            //Add app to DOM
            materialApp.appendTo("body");
            setTimeout(function(){
                materialApp.removeClass("fade");
                routingManager.update();
                installAppListeners(app);
                app.goToUrl(location.href, false);

                if(typeof(paper.wrippels) !== "undefined"){
                    var lightBackground = paper.wrippels.isLightBackground(appHeader);
                    header.getElement().attr("bg", (lightBackground ? "light" : "dark"));
                }
            }, 20);
        };

        $("body").ready(function(){
            showApp();
        });
    };

    /**
     * Install app listeners
     * @param {App} app
     */
    function installAppListeners(app){
        //When window resizes
        $(window).resize(function(){
            app.updateLayout();
        });
        //When navigate (eg. forward and back)
        $(window).bind("popstate", function(event){
            app.goToUrl(location.href, false);
        });

        $("body").on("click", ".material-app > .paper-overlay > *", function(){
            return false;
        });
        //Close overlay when click on close button, or the overlay
        $("body").on("click", ".material-app > .paper-overlay, .material-app > .paper-overlay .paper-header .left-action .icon", function(){
            if($(this).hasClass("paper-overlay") || $(this).hasClass("icon")){
                app.back();
            }
        });
        //Fire activity.onVisible and activity.onInvisible when tab becomes invisible
        document.addEventListener("visibilitychange", function(){
            for (var i = 0; i <= 3; i++) {
                var activity = getCurrentActivity(app, i);
                if(activity != null){
                    if(document.hidden && activity.visible){
                        if(typeof(activity.onInvisible) !== "undefined"){
                            activity.onInvisible();
                        }
                    }else if(!document.hidden && activity.visible){
                        if(typeof(activity.onVisible) !== "undefined"){
                            activity.onVisible();
                        }
                    }

                }
            }
        }, false);
        //Click event on icon button (top-left icon)
        $("body").on("click", ".material-app > .paper-header .left-action .icon", function(){
            var groupData = getCurrentGroup(app);
            var groupName = groupData[0];
            var groupArg = groupData[1];
            var group = app.activityGroups[groupName];

            if($(this).hasClass("action-menu")){
                //open drawer
                if(typeof(group) !== "undefined") {
                    if (typeof(group.drawer) !== "undefined") {
                        app.overlay(group.drawer, groupArg);
                    } else if (typeof(group.onLeftAction) !== "undefined") {
                        group.onLeftAction();
                    }
                }
            }else if($(this).hasClass("action-back")){
                //back
                var slots = app.element.children(".app-content").attr("slots");
                var groupBack = true;
                if($("body").width() < 1080 && $("body").width() >= 720){
                    if(slots === "3"){
                        groupBack = false;
                    }
                }else if($("body").width() < 720){
                    if(slots === "2" || slots === "3"){
                        groupBack = false;
                    }
                }
                if(groupBack){
                    app.groupBack();
                }else{
                    app.back();
                }
            }else{
                if(typeof(group) !== "undefined") {
                    if (typeof(group.onLeftAction) !== "undefined") {
                        group.onLeftAction();
                    }
                }
            }
        });
    }

    /**
     * Update positions and sizes of the activities and position of the viewport
     */
    App.prototype.updateLayout = function(){
        console.debug("update layout");
        var selectedActivity = 1;
        var eIcon = this.header.getElement().children(".left-action").children(".icon");
        var group = this.element.children(".app-content").children(".paper-group");
        var slots = 0;
        var eActivities = group.children(".paper-activity.pos-normal, .paper-activity.pos-medium, .paper-activity.pos-large");
        eActivities.each(function(){
            if($(this).hasClass("pos-normal")){
                slots += 1;
            }else if($(this).hasClass("pos-medium")){
                slots += 2;
            }else if($(this).hasClass("pos-large")){
                slots += 3;
            }
        });
        if(slots > 3){
            slots = 3;
        }
        group.parent().attr("slots", slots);
        if($("body").width() >= 1080){
            //Set position
            if(eActivities.length == 1){
                var activity_1 = getCurrentActivity(this, 0);
                if(typeof(activity_1) !== "undefined"){
                    if(activity_1.visible === false){
                        showActivity(activity_1);
                    }
                }

                if(eActivities.eq(0).hasClass("pos-normal")){
                    eActivities.eq(0).attr("pos", "xoo");
                }else if(eActivities.eq(0).hasClass("pos-medium")){
                    eActivities.eq(0).attr("pos", "xxo");
                }else if(eActivities.eq(0).hasClass("pos-large")){
                    eActivities.eq(0).attr("pos", "xxx");
                }
            }else if(eActivities.length == 2){
                var activity_1 = getCurrentActivity(this, 0);
                var activity_2 = getCurrentActivity(this, 1);
                if(typeof(activity_1) !== "undefined") {
                    if (activity_1.visible === false) {
                        showActivity(activity_1);
                    }
                }
                if(typeof(activity_2) !== "undefined") {
                    if (activity_2.visible === false) {
                        showActivity(activity_2);
                    }
                }

                if(eActivities.eq(1).hasClass("pos-normal")){
                    if(eActivities.eq(0).hasClass("pos-normal")){
                        eActivities.eq(0).attr("pos", "xoo");
                        eActivities.eq(1).attr("pos", "oxo");
                    }else{
                        eActivities.eq(0).attr("pos", "xxo");
                        eActivities.eq(1).attr("pos", "oox");
                    }
                }else{
                    eActivities.eq(0).attr("pos", "xoo");
                    eActivities.eq(1).attr("pos", "oxx");
                }
            }else if(eActivities.length == 3){
                var activity_1 = getCurrentActivity(this, 0);
                var activity_2 = getCurrentActivity(this, 1);
                var activity_3 = getCurrentActivity(this, 2);
                if(typeof(activity_1) !== "undefined") {
                    if (activity_1.visible === false) {
                        showActivity(activity_1);
                    }
                }
                if(typeof(activity_2) !== "undefined") {
                    if (activity_2.visible === false) {
                        showActivity(activity_2);
                    }
                }
                if(typeof(activity_3) !== "undefined") {
                    if (activity_3.visible === false) {
                        showActivity(activity_3);
                    }
                }

                eActivities.eq(0).attr("pos", "xoo");
                eActivities.eq(1).attr("pos", "oxo");
                eActivities.eq(2).attr("pos", "oox");
            }

            //Remove back icon
            if(eIcon.attr("last-action") === "icon"){
                eIcon.removeClass("action-back").removeClass("action-menu");
                eIcon.removeAttr("last-action");
            }
            if(eIcon.attr("last-action") === "menu"){
                eIcon.addClass("action-menu").removeClass("action-back");
                eIcon.removeAttr("last-action");
            }
        }else if($("body").width() >= 720){
            if(eActivities.length == 1){
                var activity_1 = getCurrentActivity(this, 0);
                if(typeof(activity_1) !== "undefined") {
                    if (activity_1.visible === false) {
                        showActivity(activity_1);
                    }
                }

                group.parent().attr("slots", 1);
                eActivities.eq(0).attr("pos", "xxo");
            }else if(eActivities.length == 2){
                if(eActivities.eq(1).hasClass("pos-large") || eActivities.eq(1).hasClass("pos-medium")){
                    var activity_1 = getCurrentActivity(this, 0);
                    var activity_2 = getCurrentActivity(this, 1);
                    if(typeof(activity_1) !== "undefined") {
                        if (activity_1.visible === true) {
                            hideActivity(activity_1);
                        }
                    }
                    if(typeof(activity_2) !== "undefined") {
                        if (activity_2.visible === false) {
                            showActivity(activity_2);
                        }
                    }

                    group.parent().attr("slots", 3);
                    eActivities.eq(0).attr("pos", "xoo");
                    eActivities.eq(1).attr("pos", "oxx");
                    selectedActivity = 2;
                }else{
                    var activity_1 = getCurrentActivity(this, 0);
                    var activity_2 = getCurrentActivity(this, 1);
                    if(typeof(activity_1) !== "undefined") {
                        if (activity_1.visible === false) {
                            showActivity(activity_1);
                        }
                    }
                    if(typeof(activity_2) !== "undefined") {
                        if (activity_2.visible === false) {
                            showActivity(activity_2);
                        }
                    }
                    group.parent().attr("slots", 1);
                    eActivities.eq(0).attr("pos", "xoo");
                    eActivities.eq(1).attr("pos", "oxo");
                }
            }else if(eActivities.length == 3){
                var activity_1 = getCurrentActivity(this, 0);
                var activity_2 = getCurrentActivity(this, 1);
                var activity_3 = getCurrentActivity(this, 2);
                if(typeof(activity_1) !== "undefined") {
                    if (activity_1.visible === false) {
                        showActivity(activity_1);
                    }
                }
                if(typeof(activity_2) !== "undefined") {
                    if (activity_2.visible === false) {
                        showActivity(activity_2);
                    }
                }
                if(typeof(activity_3) !== "undefined") {
                    if (activity_3.visible === false) {
                        showActivity(activity_3);
                    }
                }

                eActivities.eq(0).attr("pos", "xoo");
                eActivities.eq(1).attr("pos", "oxo");
                eActivities.eq(2).attr("pos", "oox");
                selectedActivity = 2;
            }

            //Set Back icon if necessary
            if(group.parent().attr("slots") === "3"){
                if(!eIcon.hasClass("action-back")){
                    if(eIcon.hasClass("action-menu")){
                        eIcon.attr("last-action", "menu");
                        eIcon.addClass("action-back").removeClass("action-menu");
                    }else{
                        eIcon.attr("last-action", "icon");
                        eIcon.addClass("action-back")
                    }
                }
            }else{
                if(eIcon.attr("last-action") === "icon"){
                    eIcon.removeClass("action-back").removeClass("action-menu");
                    eIcon.removeAttr("last-action");
                }
                if(eIcon.attr("last-action") === "menu"){
                    eIcon.addClass("action-menu").removeClass("action-back");
                    eIcon.removeAttr("last-action");
                }
            }
        }else{
            if(eActivities.length == 1){
                var activity_1 = getCurrentActivity(this, 0);
                if(typeof(activity_1) !== "undefined") {
                    if (activity_1.visible === false) {
                        showActivity(activity_1);
                    }
                }

                group.parent().attr("slots", 1);
                eActivities.eq(0).attr("pos", "xoo");
            }else if(eActivities.length == 2){
                var activity_1 = getCurrentActivity(this, 0);
                var activity_2 = getCurrentActivity(this, 1);
                if(typeof(activity_1) !== "undefined") {
                    if (activity_1.visible === true) {
                        hideActivity(activity_1);
                    }
                }
                if(typeof(activity_2) !== "undefined") {
                    if (activity_2.visible === false) {
                        showActivity(activity_2);
                    }
                }

                group.parent().attr("slots", 2);
                eActivities.eq(0).attr("pos", "xoo");
                eActivities.eq(1).attr("pos", "oxo");
                selectedActivity = 2;
            }else if(eActivities.length == 3){
                var activity_1 = getCurrentActivity(this, 0);
                var activity_2 = getCurrentActivity(this, 1);
                var activity_3 = getCurrentActivity(this, 2);
                if(typeof(activity_1) !== "undefined") {
                    if (activity_1.visible === true) {
                        hideActivity(activity_1);
                    }
                }
                if(typeof(activity_2) !== "undefined") {
                    if (activity_2.visible === true) {
                        hideActivity(activity_2);
                    }
                }
                if(typeof(activity_3) !== "undefined") {
                    if (activity_3.visible === false) {
                        showActivity(activity_3);
                    }
                }

                group.parent().attr("slots", 3);
                eActivities.eq(0).attr("pos", "xoo");
                eActivities.eq(1).attr("pos", "oxo");
                eActivities.eq(2).attr("pos", "oox");
                selectedActivity = 3;
            }

            //Set back icon if necessary
            if(group.parent().attr("slots") === "3" || group.parent().attr("slots") === "2"){
                if(!eIcon.hasClass("action-back")){
                    if(eIcon.hasClass("action-menu")){
                        eIcon.attr("last-action", "menu");
                        eIcon.addClass("action-back").removeClass("action-menu");
                    }else{
                        eIcon.attr("last-action", "icon");
                        eIcon.addClass("action-back")
                    }
                }
            }else{
                if(eIcon.attr("last-action") === "icon"){
                    eIcon.removeClass("action-back").removeClass("action-menu");
                    eIcon.removeAttr("last-action");
                }
                if(eIcon.attr("last-action") === "menu"){
                    eIcon.addClass("action-menu").removeClass("action-back");
                    eIcon.removeAttr("last-action");
                }
            }
        }

        var title = this.title;
        var groupName = getCurrentGroup(this)[0];
        var vGroup = this.activityGroups[groupName];
        if(typeof(vGroup) !== "undefined") {
            if (typeof(vGroup.title) !== "undefined") {
                title = vGroup.title;
            }
        }

        if(selectedActivity > 1){
            for(var i = 1; i < selectedActivity; i++){
                var iActivity = getCurrentActivity(this, i-1);
                if(typeof(iActivity.title) !== "undefined"){
                    title = iActivity.title;
                }
            }
        }

        var vActivity = getCurrentActivity(this, selectedActivity-1);
        if(typeof(vActivity) !== "undefined") {
            if (typeof(vActivity.title) !== "undefined") {
                title = vActivity.title;
            }
            vActivity.header.setTitle(title);
            vActivity.header.setPushLeft(true);
            vActivity.header.setIcon(null);
            vActivity.header.setSource(null);
            vActivity.header.setWrippels(true);
            vActivity.header.update();
            if(selectedActivity != 1){
                var iActivity = getCurrentActivity(this, 0);
                if(typeof(iActivity) !== "undefined" && iActivity != null){
                    iActivity.header.setTitle(iActivity.title);
                    iActivity.header.setPushLeft(iActivity.pushleft);
                    iActivity.header.setIcon(iActivity.icon);
                    iActivity.header.setSource(iActivity.src);
                    iActivity.header.setWrippels(false);
                    iActivity.header.update();
                }
            }
            if(selectedActivity != 2){
                var iActivity = getCurrentActivity(this, 1);
                if(typeof(iActivity) !==  "undefined" && iActivity != null){
                    iActivity.header.setTitle(iActivity.title);
                    iActivity.header.setPushLeft(iActivity.pushleft);
                    iActivity.header.setIcon(iActivity.icon);
                    iActivity.header.setSource(iActivity.src);
                    iActivity.header.setWrippels(false);
                    iActivity.header.update();
                }
            }
            if(selectedActivity != 3){
                var iActivity = getCurrentActivity(this, 2);
                if(typeof(iActivity) !==  "undefined" && iActivity != null){
                    iActivity.header.setTitle(iActivity.title);
                    iActivity.header.setPushLeft(iActivity.pushleft);
                    iActivity.header.setIcon(iActivity.icon);
                    iActivity.header.setSource(iActivity.src);
                    iActivity.header.setWrippels(false);
                    iActivity.header.update();
                }
            }
        }

    };

    /**
     * Get the name of this script (eg. http://localhost/index.php)
     * @returns {string}
     */
    function getScriptName(){
        var url = window.location.href;
        if(url.indexOf("#") != -1){
            url = url.split("#")[0];
        }
        return url;
    }

    /**
     * Get application path
     */
    function getPath(url) {
        var location = {
            group: "home",
            arg: null,
            acts: [],
            overlay: null,
            overlayArg: null
        };

        if (typeof(url) === "undefined") {
            var u = window.location.href;
        }else{
            var u = url;
        }
        while(u.substring(u.length-1, u.length) === "*"){
            u = u.substring(0, u.length-1);
        }
        if(u.indexOf("#!") != -1){
            var path = u.split("#!")[1];
            if(path.indexOf("+") != -1){
                path = path.split("+")[0];
            }
            if(path.indexOf("/") != -1){
                var paths = path.split("/");
                for(var i = 0; i < paths.length; i++){
                    var p = paths[i];
                    if(i == 0){
                        if(p.indexOf(":") != -1){
                            var entry = p.split(":");
                            location.group = entry[0];
                            if(isArgDefined(entry[1])){
                                location.arg = entry[1];
                            }else{
                                location.arg = null;
                            }
                        }else{
                            location.group = p;
                            location.arg = null;
                        }
                    }else{
                        if(p.indexOf(":") != -1){
                            var entry = p.split(":");
                            if(!isArgDefined(entry[1])){
                                entry[1] = null;
                            }
                            location.acts.push({
                                activity: entry[0],
                                arg: entry[1]
                            });
                        }else{
                            location.acts.push({
                                activity: p,
                                arg: null
                            });
                        }
                    }
                }
            }else if(path.indexOf(":") != -1){
                var entry = path.split(":");
                location.group = entry[0];
                if(!isArgDefined(entry[1])){
                    entry[1] = null;
                }
                location.arg = entry[1];
            }else{
                location.group = path;
            }
            if(u.indexOf("+") != -1){
                var overlayName = u.split("+")[1];
                if(typeof(overlayName) !== "undefined" && overlayName !== null && overlayName !== ""){
                    if(overlayName.indexOf(":") != -1){
                        var overlayData = overlayName.split(":");
                        location.overlay = overlayData[0];
                        if(!isArgDefined(overlayData[1])){
                            overlayData[1] = null;
                        }
                        location.overlayArg = overlayData[1];
                    }else{
                        location.overlay = overlayName;
                    }
                }
            }
        }
        return location;
    }

    /**
     * Generate Application path
     * @param group
     * @param arg
     * @param acts
     * @returns {string}
     */
    function generateLocation(group, arg, acts, overlay, overlayArg){
        var groupName;
        if(typeof(group.id) === "undefined"){
            groupName = group;
        }else {
            groupName = group.id;
        }
        var hasActs = false;
        if(typeof(acts) !== "undefined"){
            hasActs = acts.length > 0;
        }
        if(groupName === "home" && !isArgDefined(arg) && (typeof(overlay) === "undefined" || overlay === null) && !hasActs){
            return getScriptName();
        }

        var url = getScriptName() + "#!" + groupName;
        if(isArgDefined(arg)){
            url += ":" + arg;
        }
        if(typeof(acts) !== "undefined"){
            for(var i = 0; i < acts.length; i++){
                if(typeof(acts[i]) !== "undefined") {
                    if (typeof(acts[i].activity.id) === "undefined") {
                        url += "/" + acts[i].activity;
                    } else {
                        url += "/" + acts[i].activity.id;
                    }
                    if(isArgDefined(acts[i].arg)){
                        url += ":" + acts[i].arg;
                    }
                }
            }
        }

        if(typeof(overlay) !== "undefined" && overlay !== null){
            if(typeof(overlay.id) === "undefined"){
                url += "+" + overlay;
            }else{
                url += "+" + overlay.id;
            }
            if(isArgDefined(overlayArg)){
                url += ":" + overlayArg;
            }
        }

        return url;
    }

    function isArgDefined(arg){
        if(typeof(arg) !== "undefined" && arg !== null && arg !== "undefined" && arg !== "null" && arg !== "0"){
            return true;
        }
        return false;
    }

    function RoutingManager(){

        var manager = this;
        var isInit = false;
        var autoBack = false;

        var customStates = [];

        /**
         * Find the current position
         * @param urlList list of urls in the history
         * @param url Current url
         * @returns {number, boolean} position or false if the url does not exists in the url list
         */
        var findPosition = function(urlList, url){
            console.debug("routing -> [FIND POSITION] " + url);
            var pos = -1;
            for(var i = 0; i < urlList.length; i++){
                var u = urlList[i];
                var indexBack = urlList.length - i - 1;
                if(u === url){
                    console.debug("routing -> " + indexBack + ". (x) " + u);
                    pos = indexBack;
                }else{
                    console.debug("routing -> " + indexBack + ". ( ) " + u);
                }
            }
            console.debug("routing -> [POSITION] " + pos);
            if(pos === -1){
                return false;
            }else{
                return pos;
            }
        };

        /**
         * Find how many positions the new url is back from the current position
         * @param newUrl The new URL
         * @param oldUrl The current URL
         * @param oldUrls List of all the urls in the history
         * @returns {boolean, int} number of positions back, false if it cannot find the new or the old position
         */
        var getAmountBack = function(oldUrls, oldUrl, newUrl){
            var newIndex = findPosition(oldUrls, newUrl);
            var currentIndex = findPosition(oldUrls, oldUrl);

            var amountBack = false;
            if(newIndex !== false && currentIndex !== false) {
                var amountBack = currentIndex - newIndex;
            }
            console.debug("routing -> [AMOUNT BACK] " + amountBack);
            return amountBack;
        };

        /**
         * Find out how many popups should be closed
         * @param oldUrl
         * @param newUrl
         * @return {int} amount of popups should close
         */
        var shouldClosePopup = function(oldUrl, newUrl){
            var oldPopupCount = 0;
            var newPopupCount = 0;
            //Count old popups
            console.debug("routing -> POPUPS OLD: " + oldUrl);
            for(var i = 0; i < oldUrl.length; i++){
                var sub = oldUrl.substring(oldUrl.length-1-i, oldUrl.length-i);
                if(sub === "*"){
                    oldPopupCount++;
                }else{
                    break;
                }
            }
            //Count new popups
            console.debug("routing -> POPUPS NEW: " + newUrl);
            for(var i = 0; i < newUrl.length; i++){
                var sub = newUrl.substring(newUrl.length-1-i, newUrl.length-i);
                if(sub === "*"){
                    newPopupCount++;
                }else{
                    break;
                }
            }
            console.debug("routing -> PopupCount [" + oldPopupCount + "] [" + newPopupCount + "]");
            var dif = oldPopupCount - newPopupCount;
            if(dif < 0){
                dif = 0;
            }
            return dif;
        };

        /**
         * Register new pushState with callBack
         * @param callBack - called when the popup should close
         */
        this.pushCustomState = function(callBack){
            console.debug("routing -> [POPUP] " + location.href);
            customStates.push(callBack);
            history.pushState(document.title, document.title, location.href + "*");
            var urls = getHistoryItems();
            urls.push(location.href);
            setHistoryItems(urls);
            setHistoryLength(history.length);
            setLastUrl(location.href);
        };

        /**
         * Replace current URL with a new one
         * @param url - new url
         * @param title - new title
         */
        this.replaceUrl = function(url, title){
            console.debug("routing -> [REPLACE] " + location.href + " ->" + url);
            var urls = getHistoryItems();
            urls[urls.length-1] = url;
            setHistoryItems(urls);
            setLastUrl(url);
            history.replaceState(title, title, url);
        };

        /**
         * Check if new url is in the past or future,
         * if future pushState to browser history
         * if past go back in browser history
         * @param {string} url
         * @param {string} title
         * @param {boolean} modifyHistory
         * @return {boolean} true if back
         */
        this.goTo = function(newUrl, title, old, modifyHistory){
            var oldUrl = old;
            if(typeof(oldUrl) === "undefined"){
                oldUrl = location.href;
            }
            var modHistory = true;
            if(modifyHistory === false){
                modHistory = false;
            }
            console.debug("routing -> [GOTO] " + oldUrl + " ->" + newUrl);

            var oldLength = getHistoryLength();
            var oldUrls = getHistoryItems();
            var newLength = history.length;

            if(newUrl !== oldUrl){
                console.debug("routing -> [LOCATION CHANGED]");
                var oldUrlData = getPath(oldUrl);
                var newUrlData = getPath(newUrl);
                var isNewLower = false;
                var isReplace = false;

                //Check if popups should close
                var popupsShouldClose = shouldClosePopup(oldUrl, newUrl);
                //Close popups
                for(var i = 0; i < popupsShouldClose; i++){
                    console.debug("routing -> [CLOSE POPUP]");
                    if(typeof(customStates[customStates.length - 1]) !== "undefined"){
                        customStates[customStates.length - 1]();
                        customStates.splice(customStates.length - 1, 1);
                    }
                }

                if(oldUrlData.overlay === newUrlData.overlay &&
                    oldUrlData.overlayArg === newUrlData.overlayArg &&
                    oldUrlData.group === newUrlData.group &&
                    oldUrlData.arg === newUrlData.arg &&
                    oldUrlData.acts.length === newUrlData.acts.length){
                    var same = true;
                    for(var i = 0; i < oldUrlData.acts.length; i++){
                        if(oldUrlData.acts[i].activity !== newUrlData.acts[i].activity ||
                            oldUrlData.acts[i].arg !== newUrlData.acts[i].arg){
                            same = false;
                        }
                    }
                    if(same){
                        console.debug("routing -> [LOCATION SAME]");
                        for(var i = 0; i < popupsShouldClose; i++){
                            if(oldUrls.length >= 3) {
                                var closeUrl = oldUrls[oldUrls.length - 1];
                                var gotoUrl = oldUrls[oldUrls.length - 2];
                                if(closeUrl.substring(closeUrl.length-1, closeUrl.length) === "*"){
                                    console.debug("routing -> [CLOSE URL] " + closeUrl + " -> " + gotoUrl);
                                    var title = document.title;
                                    autoBack = true;
                                    history.go(-1);
                                    setTimeout(function(){
                                        history.pushState(title, title, gotoUrl);
                                    }, 10);
                                    oldUrls.splice(oldUrls.length-1, 1);
                                }
                            }
                        }

                        setHistoryItems(oldUrls);
                        setHistoryLength(history.length);
                        setLastUrl(newUrl);
                        return false;
                    }
                }

                if(oldUrlData.overlay !== null && newUrlData.overlay === null){
                    isReplace = true;
                }

                if (newUrlData.group === oldUrlData.group && newUrlData.arg === oldUrlData.arg) {
                    if(newUrlData.acts.length < oldUrlData.acts.length){
                        isNewLower = true;
                    }
                    if(newUrlData.acts.length == oldUrlData.acts.length && newUrlData.overlay === null && oldUrlData.overlay !== null){
                        isNewLower = true
                    }
                }else if(newUrlData.group === "home" && oldUrlData.group !== "home"){
                    isNewLower = true;
                }

                console.debug("routing -> [isNewLower] " + isNewLower);
                console.debug("routing -> [isReplace] " + isReplace);
                if(isReplace && !isNewLower){
                    //Replace current state
                    manager.replaceUrl(newUrl, title);
                }else if(isNewLower){
                    //Go back
                    var amountBack = getAmountBack(oldUrls, oldUrl, newUrl);

                    console.debug("routing -> [goBack] " + amountBack);
                    if(amountBack === false){
                        //History item not exists
                        console.debug("routing -> [NOT FOUND]");

                        var oldTitle = document.title;
                        history.replaceState(title, title, newUrl);
                        history.pushState(oldTitle, oldTitle, oldUrl);
                        if(modHistory) {
                            autoBack = true;
                            history.back();
                        }
                        var currentPos = findPosition(oldUrls, oldUrl);
                        if(currentPos === false) {
                            oldUrls[oldUrls.length - 1] = newUrl;
                            oldUrls.push(oldUrl);
                        }else{
                            var newUrls = [];
                            for(var i = 0; i < oldUrls.length - currentPos -1; i++){
                                newUrls.push(oldUrls[i]);
                            }
                            newUrls.push(newUrl);
                            newUrls.push(oldUrl);
                            for(var i = currentPos; i < oldUrls.length; i++){
                                newUrls.push(oldUrls[i]);
                            }
                            oldUrls = newUrls;
                        }
                        setHistoryItems(oldUrls);
                        setHistoryLength(history.length);
                        setLastUrl(newUrl);
                        return false;
                    }else{
                        //History item exists
                        console.debug("routing -> [GO BACK] " + amountBack);
                        autoBack = true;
                        if(modHistory) {
                            history.go(amountBack);
                        }
                        setHistoryLength(history.length);
                        setLastUrl(newUrl);
                        return false;
                    }
                }else{
                    console.debug("routing -> [GO FORWARD]");
                    //Go forward
                    var oldLength = history.length;
                    if(modHistory) {
                        history.pushState(title, title, newUrl);
                    }
                    var newLength = history.length;
                    if(newLength == oldLength +1){
                        //Do nothing
                        console.debug("routing -> [DO NOTHING]");
                    }else if(newLength <= oldLength){
                        //Rewrite history
                        console.debug("routing -> [REWRITE HISTORY]");
                        console.debug("routing -> [OLD LENGTH] " + oldLength);
                        console.debug("routing -> [NEW LENGTH] " + newLength);
                        var dif = oldLength - newLength;
                        console.debug("routing -> [DIFFERENTS] " + dif);
                        if(dif > oldUrls.length){
                            oldUrls = [];
                        }else{
                            var nurls = [];
                            for(var i = 0; i < oldUrls.length-dif-1; i++){
                                nurls.push(oldUrls[i]);
                            }
                            oldUrls = nurls;
                        }
                        console.debug("routing -> [NEW HISTORY] -> " + oldUrls.length);
                    }
                    oldUrls.push(newUrl);

                    setHistoryItems(oldUrls);
                    setHistoryLength(history.length);
                    setLastUrl(newUrl);
                }
            }else{
                console.debug("routing -> [LOCATION SAME]");

                setHistoryLength(history.length);
                setLastUrl(newUrl);
            }
            return false;
        };

        /**
         * Check if there are changes in the browser history, and respond to it if necessary
         */
        this.update = function(){
            console.debug("routing -> [UPDATE]");
            if(!isInit){
                init();
            }else {
                if(autoBack){
                    console.debug("routing -> [AUTO BACK]");
                    autoBack = false;
                    return;
                }

                var oldUrl = getLastUrl();
                var oldLength = getHistoryLength();
                var oldUrls = getHistoryItems();
                var newUrl = location.href;
                var newLength = history.length;

                if(oldLength == null || oldUrls.length == 0 || oldUrl == null){
                    //No session -> do nothing
                    console.debug("routing -> [NEW SESSION]");
                    oldUrls.push(newUrl);
                    setHistoryItems(oldUrls);
                    setHistoryLength(newLength);
                    setLastUrl(newUrl);
                }else{
                    var moved = false;
                    if(oldLength == newLength){
                        if(oldUrl === newUrl){
                            //Reload -> do nothing
                            console.debug("routing -> [RELOAD]");
                        }else{
                            //Moved
                            moved = true;
                            console.debug("routing -> [MOVED]");
                        }
                    }else if(oldLength +1 == newLength){
                        //Go forward -> Add new entry
                        oldUrls.push(newUrl);
                        console.debug("routing -> [FORWARD]");
                    }else if(oldLength +1 < newLength){
                        //Went away - Clear history
                        oldUrls = [newUrl];
                        console.debug("routing -> [AWAY]");
                    }else{
                        //Moved
                        moved = true;
                        console.debug("routing -> [MOVED]");
                    }
                    if(moved){
                        manager.goTo(newUrl, document.title, oldUrl, false);
                        //var amountBack = getAmountBack(oldUrls, oldUrl, newUrl);
                        //if(amountBack === false){
                        //    //Cannot find current point
                        //    oldUrls.push(newUrl);
                        //    console.debug("routing -> not found: push " + newUrl);
                        //}else{
                        //    //Create new history
                        //    console.debug("routing -> [CREATE NEW HISTORY]");
                        //    console.debug(oldUrls);
                        //    var newUrls = [];
                        //    for(var i = 0; i < oldUrls.length + amountBack; i++){
                        //        newUrls.push(oldUrls[i]);
                        //    }
                        //    newUrls.push(newUrl);
                        //    console.debug(newUrls);
                        //    oldUrls = newUrls;
                        //}
                    }else{
                        setHistoryItems(oldUrls);
                        setHistoryLength(newLength);
                        setLastUrl(newUrl);
                    }
                }
            }
        };

        /**
         * Bind popstate listener
         */
        var init = function(){
            if(isInit){
                return;
            }
            isInit = true;
            console.debug("routing -> [INIT]");
            $(window).bind("popstate", function(){
                manager.update();
            });
            manager.update();
        };

        /**
         * Get the last url
         * @returns {string,null}
         */
        var getLastUrl = function(){
            return window.sessionStorage.getItem(appTitle + ".routing.lasturl");
        };

        /**
         * Get the last history length from sessionStorage
         * @returns {string,null}
         */
        var getHistoryLength = function(){
            return window.sessionStorage.getItem(appTitle + ".routing.length");
        };

        /**
         * Get array of history items from sessionStorage
         * @returns {Array} urls
         */
        var getHistoryItems = function(){
            var itemLength = window.sessionStorage.getItem(appTitle + ".routing.items");
            var items = [];
            if(itemLength != null){
                for(var i = 0; i < itemLength; i++){
                    items.push(window.sessionStorage.getItem(appTitle + ".routing.item_" + i));
                }
            }
            return items;
        };

        /**
         * Set the last url in the sessionStorage
         * @param {int} historyLength
         */
        var setLastUrl = function(lastUrl){
            window.sessionStorage.setItem(appTitle + ".routing.lasturl", lastUrl);
        };

        /**
         * Set the current history length in the sessionStorage
         * @param {int} historyLength
         */
        var setHistoryLength = function(historyLength){
            window.sessionStorage.setItem(appTitle + ".routing.length", historyLength);
        };

        /**
         * Set the history items in the sessionStorage
         * @param {Array} items - urls
         */
        var setHistoryItems = function(items){
            window.sessionStorage.setItem(appTitle + ".routing.items", items.length);
            for(var i = 0; i < items.length; i++){
                window.sessionStorage.setItem(appTitle + ".routing.item_" + i, items[i]);
            }
        };

    };

    var routingManager = new RoutingManager();
    paper.app.routingManager = routingManager;

})();
(function () {

    paper.form = {

        init: function(element){
            if(typeof(element) === "undefined"){
                var e = $("body");
            }else{
                var e = $(element);
            }
            if(e.hasClass("paper-input")){
                if(e.children(".stat").length === 0){
                    e.append("<div class='stat'></div>");
                }
                if(e.children(".stat-active").length === 0){
                    e.append("<div class='stat-active'></div>");
                }
                if(e.children("label").length > 0){
                    e.addClass("paper-label");
                }
            }else{
                e.find(".paper-input").each(function(){
                    paper.form.init(this);
                });
            }
        }

    }

    $("body").ready(function () {
        $("body").on("keyup, focus", ".paper-input input, .paper-input textarea", function () {
            var passed = validatePaperInput(this);
            if(passed){
                $(this).parent().removeClass("danger");
            }else{
                $(this).parent().addClass("danger");
            }
        });

        $("body").on("blur", ".paper-input.paper-label input, .paper-input.paper-label textarea", function () {
            var val = $(this).val();
            if(val === "" || val === null){
                $(this).parent().children("label").removeClass("selected");
            }else{
                $(this).parent().children("label").addClass("selected");
            }
        });

        $("body").on("click", ".paper-input.paper-label label", function(){
            $(this).parent().children("input, textarea, select").focus();
        });

        $("body").on("change focus", ".paper-input select", function () {
            var label = $(this).parent().children("label");
            if($(this).find(":selected").val() === "0"){
                label.removeClass("selected");
            }else{
                label.addClass("selected");
            }
            $(this).removeClass("danger");
        });

        $("body").on("blur", ".paper-input select", function(){
            var label = $(this).parent().children("label");
            if($(this).find(":selected").val() === "0"){
                label.removeClass("selected");
            }else{
                label.addClass("selected");
            }
        });
    });

    function validatePaperInput(input) {
        var value = $(input).val();
        var required = $(input).attr("required");
        var max_length = $(input).attr("max-length");
        var email = $(input)[0].type == "email";
        var youtube = false;
        var cls = $(input).attr("class");
        if (cls != null) {
            youtube = cls.indexOf("ytb-field") > -1;
        }

        var passed = true;
        if (required && (value == null || value == "") && false) {
            passed = false;
        }
        if (max_length && value != null) {
            if (value.length > max_length) {
                passed = false;
            }
        }
        if (email && value != null) {
            var atpos = value.indexOf("@");
            if (atpos < 1 || atpos + 1 >= value.length) {
                passed = false;
            }
        }

        if (youtube) {
            if (!isValidYoutubeCode(value)) {
                passed = false;
            }
        }

        return passed;
    }

})();
(function(){

    paper.switch = {

        init: function(element){
            if(typeof(element) === "undefined"){
                var e = $("body");
            }else{
                var e = $(element);
            }
            if(e.hasClass("paper-switch")){
                if(!e.parent().hasClass("paper-switch-container")){
                    var container = $("<div class='paper-switch-container'></div>");
                    e.before(container);
                    e.appendTo(container);
                }
                if(!e.next().hasClass("bar")){
                    e.after("<div class='bar'></div>");
                }
                if(!e.next().next().hasClass("dot")){
                    e.next().after("<div class='dot wrippels'></div>");
                }
            }else{
                e.find(".paper-switch").each(function(){
                    paper.switch.init(this);
                });
            }
        }

    };

    $("body").ready(function(){
        $("body").on("click", ".paper-switch-container", function(){
            $(this).find("input[type=checkbox]").prop("checked", !$(this).find("input[type=checkbox]").prop("checked"));
        });
    });

})();
(function(){

    paper.checkbox = {

        init: function(element){
            if(typeof(element) === "undefined"){
                var e = $("body");
            }else{
                var e = $(element);
            }
            if(e.hasClass("paper-checkbox")){
                if(!e.parent().hasClass("paper-checkbox-container")){
                    var container = $("<div class='paper-checkbox-container'></div>");
                    e.before(container);
                    e.appendTo(container);
                }
                if(!e.next().hasClass("box")){
                    e.after("<div class='box'><div class='wrippels'></div></div>");
                }
                if(e.next().children(".wrippels").length === 0){
                    e.next().html("<div class='wrippels'></div>");
                }
            }else{
                e.find(".paper-checkbox").each(function(){
                    paper.checkbox.init(this);
                });
            }
        }

    };

    $("body").ready(function(){
        $("body").on("click", ".paper-checkbox-container", function(){
            $(this).find("input[type=checkbox]").prop("checked", !$(this).find("input[type=checkbox]").prop("checked"));
        });
    });

})();
(function(){

    paper.radio = {

        init: function(element){
            if(typeof(element) === "undefined"){
                var e = $("body");
            }else{
                var e = $(element);
            }
            if(e.hasClass("paper-radio")){
                if(!e.parent().hasClass("paper-radio-container")){
                    var container = $("<div class='paper-radio-container'></div>");
                    e.before(container);
                    e.appendTo(container);
                }
                if(!e.next().hasClass("box")){
                    e.after("<div class='box'><div class='wrippels'></div></div>");
                }
                if(e.next().children(".wrippels").length === 0){
                    e.next().html("<div class='wrippels'></div>");
                }
            }else{
                e.find(".paper-radio").each(function(){
                    paper.radio.init(this);
                });
            }
        }

    };

    $("body").ready(function(){
        $("body").on("click", ".paper-radio-container", function(){
            $(this).find("input[type=radio]").prop("checked", true);
        });
    });

})();
(function () {

    //Check dependency
    if (typeof(paper) === "undefined") {
        console.error("\'paper-modal\' dependence on \'paper\'");
    }

    paper.lang = {

        getLanguage: function () {
            return language;
        },

        get: function(key){
            var map = paper.lang.getLanguageMap();
            if(map != null){
                return map[key];
            }
            return null;
        },

        replace: function(text){
            if(text.indexOf("@+") != -1){
                var blocks = text.split("@+");
                for(var i = 1; i < blocks.length; i++){
                    var block = blocks[i];
                    if(block.indexOf("+@") != -1){
                        var key = block.split("+@")[0];
                        text = text.replace("@+" + key + "+@", paper.lang.get(key));
                    }
                }
            }
            return text;
        },

        extractKey: function(key){
            if(key.indexOf("@+") != -1){
                var blocks = key.split("@+");
                for(var i = 1; i < blocks.length; i++){
                    var block = blocks[i];
                    if(block.indexOf("+@") != -1){
                        return block.split("+@")[0];
                    }
                }
            }
            return key;
        },

        getLanguageMap: function(lang){
            var l = lang;
            if(typeof(lang) === "undefined"){
                l = language;
            }
            if(typeof(languages[l]) !== "undefined") {
                return languages[l];
            }else{
                return null;
            }
        },

        getLanguages: function(){
            return languages;
        },

        getSupportedLanguages: function(){
            return supportedLanguages;
        },

        getBrowserLanguage: function () {
            var language = navigator.browserLanguage;
            if (navigator.appName == 'Netscape') {
                language = navigator.language;
            }
            if(language.indexOf("-") != -1){
                language = language.split("-")[0];
            }
            return language.toLowerCase();
        },

        setSupportedLanguages: function(langs){
            supportedLanguages = langs;
            var supported = false;
            for(var i = 0; i < supportedLanguages.length; i++){
                if(language === supportedLanguages[i]){
                    supported = true;
                }
            }
            if(supported == false){
                paper.lang.setLanguage(supportedLanguages[0]);
            }
        },

        setLanguage: function (lang) {
            init = false;
            var supported = false;
            for(var i = 0; i < supportedLanguages.length; i++){
                if(lang === supportedLanguages[i]){
                    supported = true;
                }
            }
            if(!supported){
                throw "Language '" + lang + "' is not supported"
            }
            language = lang;
            localStorage.setItem("language", lang);
            if(typeof(languages[lang]) !== "undefined"){
                paper.lang.updateLanguage();
            }
        },

        updateLanguage: function (element) {
            var e = $(element);
            if(typeof(element) === "undefined"){
                e = $("body");
            }
            if(typeof(languages[language]) !== "undefined") {
                var map = languages[language];
                e.find("[lang-key]").each(function(){
                    var langKey = $(this).attr("lang-key");
                    var langValue = map[langKey];
                    if(typeof(langValue) === "undefined"){
                        langValue = "";
                    }
                    $(this).html(langValue);
                });
                init = true;
            }
        },

        installLanguage: function (key, map) {
            if(key.length == 2){
                var langName = key.toLowerCase();
                if(typeof(languages[langName]) !== "undefined"){
                    for(var key in map){
                        languages[langName][key] = map[key];
                    }
                }else{
                    languages[key.toLowerCase()] = map;
                }

                if(init = false && key.toLowerCase() === language){
                    paper.lang.updateLanguage();
                }
            }else{
                "Key must be two letter code (iso 639-1)";
            }
        }

    };

    var init = false;

    var languages = {};
    var supportedLanguages = [];
    var language = paper.lang.getBrowserLanguage();
    if(localStorage.getItem("language") != null){
        language = localStorage.getItem("language");
    }

})();
(function () {

    //Check dependency
    if (typeof(paper) === "undefined") {
        console.error("\'paper-modal\' dependence on \'paper\'");
    }

    paper.alert = {

        info: function (title, message, func, btnText) {
            paperPop(func, THEME_INFO, title, message, false, btnText);
        },

        warning: function (title, message, func, okText, cancelTxt) {
            paperPop(func, THEME_WARNING, title, message, cancelTxt, okText);
        },

        error: function (title, message, func, okText, cancelTxt) {
            paperPop(func, THEME_ERROR, title, message, cancelTxt, okText);
        },

        question: function (title, message, func, okText, cancelTxt) {
            paperPop(func, THEME_QUESTION, title, message, cancelTxt, okText);
        },

        input: function (title, value, placeholder, required, func, okText, cancelTxt) {
            if (value == null) {
                value = "";
            }
            if (placeholder == null) {
                placeholder = "";
            }

            var message = "<form onsubmit='$(\".paper-modal .paper-modal-footer .actionbtn\").click(); return false;'>\n\
                                <div class='paper-input paper-label'>\n\
                                <div class='paper-input-field'>\n\
                                <label>" + placeholder + "</label>\n\
                                <input type='text' value='" + value + "' name='modal-input'";
            if (required) {
                message += " required=''";
            }
            message += ">\n\
                        <div class='stat'></div>\n\
                        <div class='stat_active'></div></div></form>";
            if (cancelTxt == null) {
                cancelTxt = "Cancel";
            }
            if (okText == null) {
                okText = "Save";
            }
            paperPop(func, THEME_INPUT, title, message, cancelTxt, okText);
        },


        options: function(title, options, selectedOptions, func, cancelTxt){
            if(selectedOptions == null){
                selectedOptions = -1;
            }

            var message = "";
            for(var i = 0; i < options.length; i++){
                var checked = options[i] === selectedOptions;
                message += "<div class='paper-radio" + (checked ? " checked" : "") + "'>";
                message += '<input type="radio" name="modal-options" value="1"' + (checked ? " checked='checked'" : "") + '/>';
                message += "<div class='box-overlay wrippels'>";
                message += '<div class="box"></div>';
                message += '</div>';
                message += "<div class='paper-radio-label'>";
                message += '<h4>' + options[i] + '</h4>';
                message += '</div>';
                message += '</div>';

            }

            if (cancelTxt == null) {
                cancelTxt = "Cancel";
            }
            paperPop(func, THEME_INPUT, title, message, cancelTxt, false);
        }


    };

    var THEME_INFO = 'modal-info';
    var THEME_WARNING = 'modal-warning';
    var THEME_ERROR = 'modal-error';
    var THEME_QUESTION = 'modal-question';
    var THEME_INPUT = 'modal-input';

    function paperPop(action, theme, title, message, btnCancel, btnOk) {
        $(".paper-modal").remove();
        $("body").append(generatePaperModalHTML(theme, title, message, btnCancel, btnOk));
        setTimeout(function () {
            installListeners();
            show();
        }, 10);
        if(typeof(paper.app) !== "undefined"){
            paper.app.routingManager.pushCustomState(function(){
                destroy();
            });
        }

        var FADE_TIME = 500;

        var installListeners = function () {
            $(".paper-modal-overlay").click(function () {
                if(typeof(paper.app) !== "undefined"){
                    history.back();
                }else{
                    destroy();
                }
            });
            $(".paper-modal .paper-modal-footer .d-button").click(function () {
                if(typeof(paper.app) !== "undefined"){
                    history.back();
                }else{
                    destroy();
                }
            });
            $(".paper-modal .paper-modal-footer .actionbtn").click(function () {
                if (theme === THEME_INPUT && $("input[name='modal-input']").prop('required')) {
                    if ($("input[name='modal-input']").val() == null || $("input[name='modal-input']").val() === "") {
                        $("input[name='modal-input']").focus();
                        var stat = $("input[name='modal-input']").parent().children(".mat_input_stat_active");
                        var label = $("input[name='modal-input']").parent().children("label");
                        stat.css("background-color", "#F44336");
                        label.css("color", "#F44336");
                        return;
                    }
                }
                if(typeof(paper.app) !== "undefined"){
                    history.back();
                }else{
                    destroy();
                }
                if (action && (typeof action == "function")) {
                    if (theme === THEME_INPUT) {
                        action($("input[name='modal-input']").val());
                    } else {
                        action();
                    }
                }
            });
            if (theme === THEME_INPUT) {
                $("input[name='modal-input']").select();
            }
            $(".paper-modal .paper-radio").click(function(){
                var value = $(this).find("h4").html();
                if(typeof(paper.app) !== "undefined"){
                    history.back();
                }else{
                    destroy();
                }
                if (action && (typeof action == "function")) {
                    if (theme === THEME_INPUT) {
                        action(value);
                    } else {
                        action();
                    }
                }
            });
        };

        var show = function () {
            $(".paper-modal").addClass("paper-show");
        };

        var destroy = function () {
            $(".paper-modal").removeClass("paper-show");
            setTimeout(function () {
                $(".paper-modal").remove();
            }, FADE_TIME);
        };
    }

    function generatePaperModalHTML(theme, title, message, btnCancel, btnOk) {
        if (theme == null) {
            theme = THEME_INFO;
        }
        if (title == null) {
            title = "Modal title";
        }
        if (message == null) {
            message = "One fine body...";
        }
        if (btnCancel == null) {
            btnCancel = "Cancel";
        }
        if (btnOk == null) {
            btnOk = "Ok";
        }

        var buttonType;
        if (theme == THEME_INFO) {
            buttonType = "blue";
        } else if (theme == THEME_WARNING) {
            buttonType = "orange";
        } else if (theme == THEME_ERROR) {
            buttonType = "red";
        } else if (theme == THEME_QUESTION) {
            buttonType = "blue";
        } else if (theme == THEME_INPUT) {
            buttonType = "blue";
        } else {
            throw "Unknown theme: " + theme;
        }

        var btn_cancel_html = (btnCancel === false ? "" : "<button type='button' class='paper-button wrippels d-button' data-dismiss='modal'>" + btnCancel + "</button>");
        var btn_ok_html = (btnOk === false ? "" : "<button type='button' class='paper-button wrippels " + buttonType + " actionbtn'>" + btnOk + "</button>");
        return "<div class='paper-modal " + theme + "'>\n\
                    <div class='paper-modal-overlay'></div>\n\
                    <div class='paper-modal-dialog'>\n\
                        <div class='paper-modal-content'>\n\
                            <div class='paper-modal-header'>\n\
                                <h4 class='paper-modal-title'>" + title + "</h4>\n\
                            </div>\n\
                            <div class='paper-modal-body'>\n\
                                " + message + "\n\
                            </div>\n\
                            <div class='paper-modal-footer'>\n\
                                " + btn_cancel_html + "\n\
                                " + btn_ok_html + "\n\
                            </div>\n\
                        </div>\n\
                    </div>\n\
                </div>";
    }

})();
(function(){

    //Check dependency
    if (typeof(paper) === "undefined") {
        console.error("\'paper-snackbar-toast\' dependence on \'paper\'");
    }

    $("body").on("click", ".paper-toast, .paper-snackbar", function(){
        var tthis = this;
        $(tthis).addClass("fade");
        setTimeout(function(){
            $(tthis).remove();
        }, 200);
    });

    /**
     * Create and show snackbar
     * @param {type} msg snackbar text
     * @param {type} actionText text of the button: eg. 'Undo' or 'Dismiss'
     * @param {type} color the color of the button
     * @param {type} func when the button is clicked
     * @returns {jQuery} snackbar
     */
    paper.snackbar = function(msg, actionText, color, func){
        if(msg == null || msg == ""){
            throw "Can't create empty snackbar";
        }

        if($(".paper-snackbar").length > 0){
            var oldSnack = $(".paper-snackbar").addClass("fade");
            setTimeout(function(){
                oldSnack.remove();
            }, 200);
        }

        var html = "<div class='paper-snackbar fade'><span>" + msg + "</span>";

        if(actionText && color){
            var cls = "";
            var styls = "";
            cls = " class='fg-" + color + "'";
            html += "<button" + cls + styls + ">" + actionText + "</button>";
            if(typeof(func) !== 'function'){
                throw "Second argument should be a function";
            }
        }
        html += "</div>";
        var snackbar = $(html).appendTo($("body"));
        setTimeout(function(){
            snackbar.removeClass("fade");
            $(snackbar).children("button").click(function(){
                if(typeof(func) !== 'function'){
                    func();
                }
            });
        }, 20);
        return $(snackbar);
    };

    /**
     * Create and show toast
     * @param {type} msg toast test
     * @param {type} hideTimeout timeout to fadeout (null == never)
     * @returns {jQuery} toast
     */
    paper.toast = function(msg, hideTimeout){
        if(msg == null || msg == ""){
            throw "Can't create empty toast";
        }

        if($(".paper-toast").length > 0){
            var oldToast = $(".paper-toast").addClass("fade");
            setTimeout(function(){
                oldToast.remove();
            }, 200);
        }

        var html = "<div class='paper-toast fade'><span>" + msg + "</span></div>";
        var toast = $(html).appendTo($("body"));
        setTimeout(function(){
            toast.removeClass("fade");
            if(hideTimeout !== null){
                if(!hideTimeout){
                    hideTimeout = 3000;
                }
                setTimeout(function(){
                    $(toast).click();
                }, hideTimeout);
            }
        }, 20);

        return $(toast);
    };

})();
(function(){

    paper.progress = {

        /**
         * Find and initialze 'paper-progress' elements
         * @param element - rootElement to initialize (default is body)
         */
        init: function(element){
            if(typeof(element) === "undefined"){
                var e = $("body");
            }else{
                var e = $(element);
            }
            if(e.hasClass("paper-progress")){
                if(e.find(".container").length === 0){
                    e.append("<div class='container'></div>");
                }
                if(e.find(".bar").length === 0){
                    e.append("<div class='bar'></div>");
                }
                paper.progress.update(e);
            }else{
                e.find(".paper-progress").each(function(){
                    paper.progress.init($(this));
                });
            }
        },

        /**
         * Update paper-progress, check new value and type
         * @param element - rootElement to update (default is body)
         * @param value - new value (0 - 100)
         */
        update: function(element, value){
            if(typeof(element) === "undefined"){
                var e = $("body");
            }else{
                var e = $(element);
            }
            if(e.hasClass("paper-progress")){
                var type = "determinate";
                var attr = e.attr("type");
                if(attr === "indeterminate"){
                    type = attr;
                }else if(attr === "reverse-indeterminate"){
                    type = attr;
                }else {
                    e.attr("type", attr);
                    var v = value;
                    if (typeof(value) !== "undefined") {
                        e.attr("value", value);
                    } else {
                        v = e.attr("value");
                    }
                    if (typeof(v) === "undefined") {
                        v = 0;
                    }
                    try {
                        v = parseInt(v);
                    } catch (e) {
                        v = 0;
                    }
                    if (v > 100) {
                        v = 100;
                    }
                    v = 100 - v;
                    e.find(".bar").css("right", v + "%");
                }
            }else{
                e.find(".paper-progress").each(function(){
                    paper.progress.update($(this));
                });
            }
        }

    };



})();
(function(){

    paper.tabs = {

        init: function(element){
            if(typeof(element) === "undefined"){
                var e = $("body");
            }else{
                var e = $(element);
            }
            if(e.hasClass("paper-tabs")){
                var selectedIndex = 0;
                var tabs = e.children(".tab");
                tabs.each(function(index){
                    var left = index * (100 / tabs.length);
                    var right = (tabs.length - index -1) * (100 / tabs.length);
                    $(this).css("left", left + "%");
                    $(this).css("right", right + "%");
                    if($(this).hasClass("selected")){
                        selectedIndex = index;
                    }
                });
                paper.tabs.setSelectedTab(e, selectedIndex);
            }else{
                e.find(".paper-tabs").each(function(){
                    paper.tabs.init(this);
                });
            }
        },

        create: function(options){
            return new Tabs(options);
        },

        render: function(tabs, element){
            var eTabs = $("<div class='paper-tabs'></div>");
            if(tabs.getFor() !== null){
                eTabs.attr("for", tabs.getFor());
            }
            eTabs.attr("value", tabs.getSelectedTab());
            for(var i = 0; i < tabs.getTabs().length; i++){
                var eTab = $("<div class='tab wrippels'>" + tabs.getTabs()[i] + "</div>");
                if(tabs.getSelectedTab() === i){
                    eTab.addClass("selected");
                }
                eTab.appendTo(eTabs);
            }
            if(tabs.getSelectionColor() !== null){
                var eSelectionBar = $("<div class='selection-bar'></div>");
                eSelectionBar.addClass(tabs.getSelectionColor());
                eSelectionBar.appendTo(eTabs);
            }
            paper.tabs.init(eTabs);
            eTabs.appendTo(element);
        },

        setSelectedTab: function(element, selectedIndex){
            var tabContainer = $(element);
            tabContainer.children(".tab").removeClass("selected");
            tabContainer.attr("value", selectedIndex);
            var selectedTab = tabContainer.children(".tab").eq(selectedIndex);
            selectedTab.addClass("selected");
            var selectionBar = tabContainer.children(".selection-bar");
            selectionBar.css("left", selectedTab.css("left"));
            selectionBar.css("right", selectedTab.css("right"));
            var panelContainer = $(tabContainer.attr("for"));
            if(panelContainer.length > 0){
                var panels = panelContainer.children(".tab-panel");
                panels.removeClass("selected").removeClass("before").removeClass("after");
                panelContainer.children(".tab-panel").each(function(i){
                    if(i < selectedIndex){
                        $(this).addClass("before");
                    }else if(i == selectedIndex){
                        $(this).addClass("selected");
                    }else if(i > selectedIndex){
                        $(this).addClass("after");
                    }
                });
            }
            tabContainer.trigger("change", [selectedIndex]);
        }

    };

    $("body").ready(function(){
        $("body").on("click", ".paper-tabs .tab", function(){
            paper.tabs.setSelectedTab($(this).parent(), $(this).index());
        });
        $(window).resize(function(){
            var tabContainer = $(".paper-tabs");
            var selectedTab = tabContainer.children(".tab.selected");
            var selectionBar = tabContainer.children(".selection-bar");
            selectionBar.css("left", selectedTab.css("left"));
            selectionBar.css("right", selectedTab.css("right"));
        });
    });

    function Tabs(options){
        this.tabs = [];
        this.selectedTab = 0;
        this.selectionColor = null;
        this.link = null;

        if(typeof(options) !== "undefined"){
            if(typeof(options.tabs) !== "undefined"){
                this.tabs = options.tabs;
            }
            if(typeof(options.selectedTab) !== "undefined"){
                this.selectedTab = options.selectedTab;
            }
            if(typeof(options.selectionColor) !== "undefined"){
                this.selectionColor = options.selectionColor;
            }
            if(typeof(options.for) !== "undefined"){
                this.link = options.for;
            }
        }
    }

    Tabs.prototype.setFor = function(link){
        this.link = link;
    };

    Tabs.prototype.getFor = function(){
        return this.link;
    };

    Tabs.prototype.setTabs = function(tabs){
        this.tabs = tabs;
    };

    Tabs.prototype.getTabs = function(){
        return this.tabs;
    };

    Tabs.prototype.setSelectionColor = function(color){
        this.selectionColor = color;
    };

    Tabs.prototype.getSelectionColor = function(){
        return this.selectionColor;
    };

    Tabs.prototype.render = function(element){
        paper.tabs.render(this, element);
    };

    Tabs.prototype.setSelectedTab = function(index){
        this.selectedTab = index;
    };

    Tabs.prototype.getSelectedTab = function(){
        return this.selectedTab;
    };

})();
