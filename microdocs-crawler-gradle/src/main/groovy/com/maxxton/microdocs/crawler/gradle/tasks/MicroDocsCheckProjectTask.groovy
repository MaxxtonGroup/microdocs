package com.maxxton.microdocs.crawler.gradle.tasks

import com.maxxton.microdocs.core.domain.check.CheckResponse
import com.maxxton.microdocs.crawler.gradle.MicroDocsUtils
import com.maxxton.microdocs.publisher.MicroDocsPublisher
import com.maxxton.microdocs.publisher.ServerConfiguration
import org.gradle.api.DefaultTask
import org.gradle.api.tasks.TaskAction

/**
 * @author Steven Hermans
 */
class MicroDocsCheckProjectTask  extends DefaultTask {

    String reportFile;
    String url;
    String username = null;
    String password = null;
    String env = null;

    @TaskAction
    def checkProject(){
        CheckResponse response = MicroDocsPublisher.checkProject(new ServerConfiguration(url, username, password), new File(reportFile), project.name, env);

        MicroDocsPublisher.printCheckResponse(response, project.getRootDir());
    }


}