package com.maxxton.microdocs.jenkins;

import com.maxxton.microdocs.core.domain.check.CheckProblem;
import com.maxxton.microdocs.core.domain.check.CheckResponse;
import com.maxxton.microdocs.crawler.ErrorReporter;
import com.maxxton.microdocs.publisher.MicroDocsPublisher;
import com.maxxton.microdocs.publisher.ServerConfiguration;
import hudson.Extension;
import hudson.Launcher;
import hudson.model.*;
import hudson.tasks.BuildStepDescriptor;
import hudson.tasks.Builder;
import hudson.util.FormValidation;
import net.sf.json.JSONObject;
import org.kohsuke.stapler.DataBoundConstructor;
import org.kohsuke.stapler.QueryParameter;
import org.kohsuke.stapler.StaplerRequest;

import javax.servlet.ServletException;
import java.io.File;
import java.io.IOException;
import java.io.PrintStream;
import java.net.MalformedURLException;
import java.net.URL;

/**
 * @author Steven Hermans
 */
public class MicroDocsChecker extends Builder {

    private final String task;
    private final String microDocsReportFile;
    private final String microDocsProjectName;
    private final String microDocsGroupName;
    private final boolean microDocsFailBuild;
    private final boolean microDocsPublish;
    private final String microDocsSourceFolder;

    @DataBoundConstructor
    public MicroDocsChecker(String task, String microDocsReportFile, String microDocsProjectName, String microDocsGroupName, boolean microDocsFailBuild, boolean microDocsPublish, String microDocsSourceFolder) {
        this.task = task;
        this.microDocsReportFile = microDocsReportFile;
        this.microDocsProjectName = microDocsProjectName;
        this.microDocsGroupName = microDocsGroupName;
        this.microDocsFailBuild = microDocsFailBuild;
        this.microDocsPublish = microDocsPublish;
        this.microDocsSourceFolder = microDocsSourceFolder;
    }

    public String getTask() {
        return task;
    }

    public String getMicroDocsReportFile() {
        return microDocsReportFile;
    }

    public String getMicroDocsProjectName() {
        return microDocsProjectName;
    }

    public String getMicroDocsGroupName() {
        return microDocsGroupName;
    }

    public boolean isMicroDocsFailBuild() {
        return microDocsFailBuild;
    }

    public boolean isMicroDocsPublish() {
        return microDocsPublish;
    }

    public String getMicroDocsSourceFolder() {
        return microDocsSourceFolder;
    }

    @Extension
    public static class Descriptor extends BuildStepDescriptor<Builder> {

        private String microDocsServerUrl;

        public Descriptor() {
            this(true);
        }

        protected Descriptor(boolean load) {
            if (load)
                load();
        }

        public String getMicroDocsServerUrl() {
            return microDocsServerUrl;
        }

        @Override
        public boolean isApplicable(Class<? extends AbstractProject> jobType) {
            return true;
        }

        @Override
        public String getDisplayName() {
            return "MicroDocs Integration";
        }

        @Override
        public boolean configure(StaplerRequest req, JSONObject formData) throws FormException {

            // to persist global configuration information,
            // set that to properties and call save().
            microDocsServerUrl = formData.getString("microDocsServerUrl");

            save();
            return super.configure(req, formData);
        }

        public FormValidation doCheckMicroDocsServerUrl(@QueryParameter String value) throws IOException, ServletException {
            if (value == null || value.isEmpty() || value.trim().isEmpty()) {
                return FormValidation.error("Please specify a valid URL");
            }
            try {
                new URL(value);
            }catch(MalformedURLException e){
                return FormValidation.error("Please specify a valid URL");
            }
            return FormValidation.ok();
        }
    }

    @Override
    public boolean perform(AbstractBuild<?, ?> build, Launcher launcher, BuildListener listener) throws InterruptedException, IOException {
        PrintStream logger = listener.getLogger();
        ErrorReporter.set(new JenkinsErrorReporter(logger));
        Descriptor descriptor = (Descriptor) getDescriptor();

        logger.println("\nMicroDocs: check project...");

        if(microDocsReportFile == null || microDocsReportFile.trim().isEmpty()){
            logger.println("Missing MicroDocs report file");
            return false;
        }
        String workspaceFolder = build.getEnvironment(listener).get("WORKSPACE");
        File reportFile = new File(workspaceFolder, microDocsReportFile);
        if(!reportFile.isFile()){
            logger.println("Missing MicroDocs report file: " + reportFile);
            return false;
        }

        if(descriptor.getMicroDocsServerUrl() == null || descriptor.getMicroDocsServerUrl().trim().isEmpty()){
            logger.println("Missing MicroDocs server url");
            return false;
        }
        try {
            new URL(descriptor.getMicroDocsServerUrl());
        }catch(MalformedURLException e){
            logger.println("Invalid MicroDocs server url");
            return false;
        }

        CheckResponse response = null;
        if(microDocsPublish){
            response = MicroDocsPublisher.publishProject(new ServerConfiguration(descriptor.getMicroDocsServerUrl()), reportFile, microDocsProjectName, microDocsGroupName, null, microDocsFailBuild);
        }else{
            response = MicroDocsPublisher.checkProject( new ServerConfiguration(descriptor.getMicroDocsServerUrl()), reportFile, microDocsProjectName);
        }

        boolean hasProblems = !"ok".equalsIgnoreCase(response.getStatus());
        int errorCount = 0;
        int warningCount = 0;
        int noticeCount = 0;
        if(response.getProblems() != null){
            for(CheckProblem problem : response.getProblems()){
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
            for (CheckProblem problem : response.getProblems()) {
                String sourceFile = new File(microDocsSourceFolder, problem.getFile() + ":" + String.valueOf(problem.getLineNumber())).getPath();
                String msg = sourceFile + ": " + problem.getLevel() + ": " + problem.getMessage();
                if(hasProblems) {
                    ErrorReporter.get().printError(msg);
                }else{
                    ErrorReporter.get().printNotice(msg);
                }
            }
        }
        ErrorReporter.get().printError("");

        if(hasProblems && this.microDocsFailBuild){
            return false;
        }

        return true;
    }
}
