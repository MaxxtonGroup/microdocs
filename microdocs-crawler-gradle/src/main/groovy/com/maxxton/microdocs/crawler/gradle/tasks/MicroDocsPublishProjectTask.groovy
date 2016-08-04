package com.maxxton.microdocs.crawler.gradle.tasks

import com.maxxton.microdocs.core.domain.check.CheckResponse
import com.maxxton.microdocs.crawler.ErrorReporter
import com.maxxton.microdocs.crawler.gradle.MicroDocsUtils
import com.maxxton.microdocs.publisher.MicroDocsPublisher
import com.maxxton.microdocs.publisher.ServerConfiguration
import org.gradle.api.DefaultTask
import org.gradle.api.tasks.TaskAction

/**
 * @author Steven Hermans
 */
class MicroDocsPublishProjectTask  extends DefaultTask {

    String groupName;
    String reportFile;
    String url;
    boolean failOnProblems = true;

    @TaskAction
    def publishReport(){
        def version = MicroDocsUtils.getVersion(project)
        if(version == null){
            throw new RuntimeException("Could not find version");
        }
        if(project.name == null){
            throw new RuntimeException("Project name not set");
        }
        if(groupName == null){
            throw new RuntimeException("Group name not set");
        }

        CheckResponse response = MicroDocsPublisher.publishProject(new ServerConfiguration(url), new File(reportFile), project.name, groupName, version, failOnProblems);
        ErrorReporter.get().printNotice("Successfully published report " + project.name + ":" + version + "\n");

        if(!MicroDocsPublisher.checkReport(report, project.getRootDir()) && failOnProblems){
            throw new RuntimeException("Build failed");
        }
    }


}