package com.maxxton.microdocs.crawler.gradle

import com.maxxton.microdocs.core.domain.check.CheckProblem
import com.maxxton.microdocs.core.domain.check.CheckResponse
import com.maxxton.microdocs.crawler.ErrorReporter

/**
 * @author Steven Hermans
 */
class MicroDocsUtils {

    public static String getVersion(project){
        Object version = project.properties.version;
        System.out.println("Export version: " + version);
        if (version != null) {
            String versionString = String.valueOf(project.properties.version.toString());
            if (versionString.contains('-')) {
                versionString = versionString.substring(0, versionString.indexOf('-'));
            }
            if (versionString.contains('+')) {
                versionString = versionString.substring(0, versionString.indexOf('+'));
            }
            return versionString;
        }
        return null;
    }

}
