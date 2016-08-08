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

    @TaskAction
    def checkProject(){
        CheckResponse response = MicroDocsPublisher.checkProject(new ServerConfiguration(url), new File(reportFile), project.name);

        MicroDocsPublisher.checkReport(response, project.getRootDir());
    }


}