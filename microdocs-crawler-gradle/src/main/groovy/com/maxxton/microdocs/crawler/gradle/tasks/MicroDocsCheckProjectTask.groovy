package com.maxxton.microdocs.crawler.gradle.tasks

import com.maxxton.microdocs.core.domain.check.CheckProblem
import com.maxxton.microdocs.core.domain.check.CheckResponse
import com.maxxton.microdocs.crawler.ErrorReporter
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
        if("ok" == response.status){
            ErrorReporter.get().printNotice('No problems found')
        }else if(response.problems == null) {
            ErrorReporter.get().printError('\nproject contains problems\n');
        }else{
            ErrorReporter.get().printError("\n" + String.valueOf(response.problems.size()) + ' problem' + (response.problems.size() > 1 ? 's':'') + ' found');
            for(CheckProblem problem : response.problems){
                String sourceFile = new File(project.rootDir, "src/main/java/" + problem.getFile() + ":" + String.valueOf(problem.getLineNumber())).getPath();
                ErrorReporter.get().printError(sourceFile + ": " + problem.getLevel() + ": " + problem.getMessage());
            }
            ErrorReporter.get().printError("");
        }
    }


}