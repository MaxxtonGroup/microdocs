"use strict";
/**
 * MicroDocs config class
 *
 * @author R. Sonke (r.sonke@maxxton.com)
 */
var MicroDocsConfig = (function () {
    function MicroDocsConfig() {
    }
    MicroDocsConfig.isProduction = true;
    MicroDocsConfig.applicationName = "MicroDocs";
    MicroDocsConfig.profile = 'production';
    MicroDocsConfig.basePath = "/demo/";
    MicroDocsConfig.apiPath = "/demo/data";
    MicroDocsConfig.isStandAlone = true;
    return MicroDocsConfig;
}());
exports.MicroDocsConfig = MicroDocsConfig;
