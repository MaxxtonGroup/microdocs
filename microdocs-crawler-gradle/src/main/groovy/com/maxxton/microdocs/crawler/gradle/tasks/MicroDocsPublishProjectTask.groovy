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
    String username = null;
    String password = null;
    String env = null;
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

        CheckResponse response = MicroDocsPublisher.publishProject(new ServerConfiguration(url, username, password), new File(reportFile), project.name, groupName, version, failOnProblems, env);

        if(!MicroDocsPublisher.printCheckResponse(response, project.getRootDir()) && failOnProblems){
            throw new RuntimeException("Build failed");
        }
    }


}