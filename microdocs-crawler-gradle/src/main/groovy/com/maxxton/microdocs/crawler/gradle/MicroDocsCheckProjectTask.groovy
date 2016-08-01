package com.maxxton.microdocs.crawler.gradle

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
        CheckResponse response = MicroDocsPublisher.checkProject(new File(reportFile), project.name, new ServerConfiguration(url));
        if(response.status == "ok"){
            ErrorReporter.get().printNotice('No problems found')
        }else if(response.problems == null) {
            ErrorReporter.get().printError('\nproject contains problems\n');
        }else{
            ErrorReporter.get().printError("\n" + String.valueOf(response.problems.size()) + ' problem' + (response.problems.size() > 1 ? 's':'') + ' found');
            for(CheckProblem problem : response.problems){
                String sourceFile = new File(project.rootDir, "src/main/java/" + problem.getFile() + ":" + String.valueOf(problem.getLineNumber()));
                ErrorReporter.get().printError(sourceFile + ": " + problem.getLevel() + ": " + problem.getMessage());
            }
            ErrorReporter.get().printError("");
        }
    }


}