"use strict";
/**
 * MicroDocs config class
 *
 * @author R. Sonke (r.sonke@maxxton.com)
 */
var MicroDocsConfig = (function () {
    function MicroDocsConfig() {
    }
    MicroDocsConfig.isProduction = false;
    MicroDocsConfig.applicationName = "MicroDocs";
    MicroDocsConfig.profile = 'acceptance';
    MicroDocsConfig.basePath = "/";
    MicroDocsConfig.apiPath = "/api/v1";
    MicroDocsConfig.isStandAlone = false;
    return MicroDocsConfig;
}());
exports.MicroDocsConfig = MicroDocsConfig;
