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
    private final boolean microDocsFailBuild;

    @DataBoundConstructor
    public MicroDocsChecker(String task, String microDocsReportFile, String microDocsProjectName, boolean microDocsFailBuild) {
        this.task = task;
        this.microDocsReportFile = microDocsReportFile;
        this.microDocsProjectName = microDocsProjectName;
        this.microDocsFailBuild = microDocsFailBuild;
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

    public boolean isMicroDocsFailBuild() {
        return microDocsFailBuild;
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
            return "MicroDocs Check for problems";
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

        CheckResponse response = MicroDocsPublisher.checkProject(reportFile, microDocsProjectName, new ServerConfiguration(descriptor.getMicroDocsServerUrl()));

        boolean isOk = "ok".equals(response.getStatus());
        if(isOk){
            ErrorReporter.get().printNotice("\nNo problems found");
        }else if(response.getProblems() == null) {
            ErrorReporter.get().printError("\nProject contains problems");
        }else{
            ErrorReporter.get().printError("\n" + String.valueOf(response.getProblems().size()) + " problem" + (response.getProblems().size() > 1 ? "s":"") + " found");
            for(CheckProblem problem : response.getProblems()){
                String sourceFile = new File("src/main/java/" + problem.getFile() + ":" + String.valueOf(problem.getLineNumber())).getPath();
                ErrorReporter.get().printError(sourceFile + ": " + problem.getLevel() + ": " + problem.getMessage());
            }
        }
        logger.println();

        if(!isOk && microDocsFailBuild){
            return false;
        }

        return true;
    }
}
