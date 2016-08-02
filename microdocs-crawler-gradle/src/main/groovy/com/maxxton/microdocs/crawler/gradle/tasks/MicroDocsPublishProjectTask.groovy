package com.maxxton.microdocs.crawler.gradle.tasks

import com.maxxton.microdocs.core.domain.check.CheckProblem
import com.maxxton.microdocs.core.domain.check.CheckResponse
import com.maxxton.microdocs.crawler.ErrorReporter
import com.maxxton.microdocs.crawler.gradle.VersionUtil
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
        def version = VersionUtil.getVersion(project)
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

        boolean hasProblems = !"ok".equalsIgnoreCase(response.status);
        int errorCount = 0;
        int warningCount = 0;
        int noticeCount = 0;
        if(response.problems != null){
            for(CheckProblem problem : response.problems){
                switch(problem.getLevel().toLowerCase()){
                    case "error": errorCount++; break;
                    case "warning": warningCount++; break;
                    case "notice": noticeCount++; break;
                }
            }
        }
        String message = "\n";
        if(errorCount + warningCount + noticeCount > 0){
            message += "Project contains problems: ";
            if(errorCount > 0)
                message += String.valueOf(errorCount) + " error" + (errorCount > 1 ? "s" : "") + ",";
            if(warningCount > 0)
                message += String.valueOf(warningCount) + " warning" + (warningCount > 1 ? "s" : "") + ",";
            if(noticeCount > 0)
                message += String.valueOf(noticeCount) + " notice" + (noticeCount > 1 ? "s" : "") + ",";
            if(message.endsWith(","))
                message = message.substring(0, message.length()-1);
        }else{
            message += "No problems found";
        }
        message += "\n";
        if(hasProblems){
            ErrorReporter.get().printError(message);
        }else{
            ErrorReporter.get().printNotice(message);
        }

        if(response.getProblems() != null) {
            for (CheckProblem problem : response.problems) {
                String sourceFile = new File(project.rootDir, "src/main/java/" + problem.getFile() + ":" + String.valueOf(problem.getLineNumber())).getPath();
                String msg = sourceFile + ": " + problem.getLevel() + ": " + problem.getMessage();
                if(hasProblems) {
                    ErrorReporter.get().printError(msg);
                }else{
                    ErrorReporter.get().printNotice(msg);
                }
            }
        }
        ErrorReporter.get().printError("");

        if(hasProblems && this.failOnProblems){
            throw new RuntimeException("Build failed");
        }
    }


}