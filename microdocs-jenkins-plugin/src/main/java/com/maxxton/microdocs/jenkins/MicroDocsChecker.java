package com.maxxton.microdocs.jenkins;

import com.cloudbees.plugins.credentials.Credentials;
import com.cloudbees.plugins.credentials.CredentialsMatchers;
import com.cloudbees.plugins.credentials.CredentialsProvider;
import com.cloudbees.plugins.credentials.common.CertificateCredentials;
import com.cloudbees.plugins.credentials.common.StandardCredentials;
import com.cloudbees.plugins.credentials.common.StandardListBoxModel;
import com.cloudbees.plugins.credentials.common.UsernamePasswordCredentials;
import com.cloudbees.plugins.credentials.domains.DomainRequirement;
import com.maxxton.microdocs.core.domain.check.CheckProblem;
import com.maxxton.microdocs.core.domain.check.CheckResponse;
import com.maxxton.microdocs.crawler.ErrorReporter;
import com.maxxton.microdocs.jenkins.notifier.BuildInfo;
import com.maxxton.microdocs.jenkins.notifier.stash.StashClient;
import com.maxxton.microdocs.publisher.MicroDocsPublisher;
import com.maxxton.microdocs.publisher.ServerConfiguration;
import hudson.EnvVars;
import hudson.Extension;
import hudson.Launcher;
import hudson.model.*;
import hudson.security.ACL;
import hudson.tasks.BuildStepDescriptor;
import hudson.tasks.Builder;
import hudson.util.FormValidation;
import hudson.util.ListBoxModel;
import jenkins.model.Jenkins;
import net.sf.json.JSONObject;
import org.acegisecurity.Authentication;
import org.apache.commons.lang.StringUtils;
import org.kohsuke.stapler.AncestorInPath;
import org.kohsuke.stapler.DataBoundConstructor;
import org.kohsuke.stapler.QueryParameter;
import org.kohsuke.stapler.StaplerRequest;

import javax.servlet.ServletException;
import java.io.File;
import java.io.IOException;
import java.io.PrintStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @author Steven Hermans
 */
public class MicroDocsChecker extends Builder {

  private final String microDocsReportFile;
  private final String microDocsProjectName;
  private final String microDocsGroupName;
  private final String microDocsSourceFolder;
  private final boolean microDocsFailBuild;
  private final boolean microDocsPublish;
  private final boolean microDocsNotifyPullRequest;

  @DataBoundConstructor
  public MicroDocsChecker(String microDocsReportFile, String microDocsProjectName, String microDocsGroupName, String microDocsSourceFolder, boolean microDocsFailBuild, boolean microDocsPublish, boolean microDocsNotifyPullRequest) {
    this.microDocsReportFile = microDocsReportFile;
    this.microDocsProjectName = microDocsProjectName;
    this.microDocsGroupName = microDocsGroupName;
    this.microDocsFailBuild = microDocsFailBuild;
    this.microDocsPublish = microDocsPublish;
    this.microDocsSourceFolder = microDocsSourceFolder;
    this.microDocsNotifyPullRequest = microDocsNotifyPullRequest;
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

  public String getMicroDocsSourceFolder() {
    return microDocsSourceFolder;
  }

  public boolean isMicroDocsFailBuild() {
    return microDocsFailBuild;
  }

  public boolean isMicroDocsPublish() {
    return microDocsPublish;
  }

  public boolean isMicroDocsNotifyPullRequest() {
    return microDocsNotifyPullRequest;
  }

  @Extension
  public static class Descriptor extends BuildStepDescriptor<Builder> {

    private String microDocsServerUrl;
    private String microDocsStashUrl;
    private String microDocsStashCredentialsId;

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

    public String getMicroDocsStashUrl() {
      return microDocsStashUrl;
    }

    public String getMicroDocsStashCredentialsId() {
      return microDocsStashCredentialsId;
    }

    public ListBoxModel doFillMicroDocsStashCredentialsIdItems(@AncestorInPath Item project) {

      if (project != null && project.hasPermission(Item.CONFIGURE)) {
        return new StandardListBoxModel().withEmptySelection()
            .withMatching(new MicroDocsCredentialsMatcher(), CredentialsProvider.lookupCredentials(StandardCredentials.class, project, ACL.SYSTEM, new ArrayList<DomainRequirement>()));

      } else if (Jenkins.getInstance().hasPermission(Item.CONFIGURE)) {
        return new StandardListBoxModel().withEmptySelection()
            .withMatching(new MicroDocsCredentialsMatcher(), CredentialsProvider.lookupCredentials(StandardCredentials.class, Jenkins.getInstance(), ACL.SYSTEM, new ArrayList<DomainRequirement>()));
      }

      return new StandardListBoxModel();
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
      microDocsStashUrl = formData.getString("microDocsStashUrl");
      microDocsStashCredentialsId = formData.getString("microDocsStashCredentialsId");

      save();
      return super.configure(req, formData);
    }

    public FormValidation doCheckMicroDocsServerUrl(@QueryParameter String value) throws IOException, ServletException {
      if (value == null || value.trim().isEmpty()) {
        return FormValidation.error("Please specify a valid URL");
      }
      try {
        new URL(value);
      } catch (MalformedURLException e) {
        return FormValidation.error("Please specify a valid URL");
      }
      return FormValidation.ok();
    }

    public FormValidation doCheckMicroDocsStashUrl(@QueryParameter String value) throws IOException, ServletException {
      if (value != null && !value.trim().isEmpty()) {
        try {
          new URL(value);
        } catch (MalformedURLException e) {
          return FormValidation.error("Please specify a valid URL");
        }
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

    if (microDocsReportFile == null || microDocsReportFile.trim().isEmpty()) {
      logger.println("Missing MicroDocs report file");
      return false;
    }
    String workspaceFolder = build.getEnvironment(listener).get("WORKSPACE");
    File reportFile = new File(workspaceFolder, microDocsReportFile);
    if (!reportFile.isFile()) {
      logger.println("Missing MicroDocs report file: " + reportFile);
      return false;
    }

    if (descriptor.getMicroDocsServerUrl() == null || descriptor.getMicroDocsServerUrl().trim().isEmpty()) {
      logger.println("Missing MicroDocs server url");
      return false;
    }
    try {
      new URL(descriptor.getMicroDocsServerUrl());
    } catch (MalformedURLException e) {
      logger.println("Invalid MicroDocs server url");
      return false;
    }

    CheckResponse response = null;
    if (microDocsPublish) {
      response = MicroDocsPublisher.publishProject(new ServerConfiguration(descriptor.getMicroDocsServerUrl()), reportFile, microDocsProjectName, microDocsGroupName, null, microDocsFailBuild);
    } else {
      response = MicroDocsPublisher.checkProject(new ServerConfiguration(descriptor.getMicroDocsServerUrl()), reportFile, microDocsProjectName);
    }

    boolean isOk = MicroDocsPublisher.printCheckResponse(response, new File(microDocsSourceFolder));

    if (this.microDocsNotifyPullRequest) {
      commentToStash(response, build, listener);
    }

    if (!isOk && this.microDocsFailBuild) {
      return false;
    }

    return true;
  }

  private void commentToStash(CheckResponse response, AbstractBuild<?, ?> build, BuildListener listener) throws IOException, InterruptedException {
    Descriptor descriptor = (Descriptor) getDescriptor();
    BuildInfo buildInfo = getBuildInfo(build, listener);
    UsernamePasswordCredentials usernamePasswordCredentials = getCredentials(UsernamePasswordCredentials.class, build.getProject());

    StashClient stashClient = new StashClient(descriptor.getMicroDocsStashUrl(), usernamePasswordCredentials);

    // collect problems with each file and line number
    Map<String, Map<Integer, List<CheckProblem>>> problemsMap = new HashMap();

    for(CheckProblem problem : response.getProblems()){
      if(problem.getPath() == null){
        stashClient.postPullRequestComment(buildInfo, problem.getLevel() + ": " + problem.getMessage());
      }else {
        String file = new File(microDocsSourceFolder, problem.getPath()).getPath();
        if (!problemsMap.containsKey(file)) {
          problemsMap.put(file, new HashMap());
        }

        Map<Integer, List<CheckProblem>> fileMap = problemsMap.get(file);
        if (!fileMap.containsKey(problem.getLineNumber())) {
          fileMap.put(problem.getLineNumber(), new ArrayList());
        }
        List<CheckProblem> problemList = fileMap.get(problem.getLineNumber());
        problemList.add(problem);
      }
    }

    for(String file : problemsMap.keySet()){
      for(int lineNumber : problemsMap.get(file).keySet()){
        String comment = "";
        for(CheckProblem problem : problemsMap.get(file).get(lineNumber)){
          String message = problem.getLevel() + ": " + problem.getMessage();
          if(problem.getClient() != null){
            message = "**Breaking change detected with [" + problem.getClient().getTitle() + "](" + problem.getClient().getSourceLink() + "):** " + message;
          }
          comment += message + "\n";
        }
        String quote = QuoteGenerator.randomQuote();
        comment += "\n> " + quote;

        int commentId = stashClient.postPullRequestComment(buildInfo, comment, file, lineNumber);
        for(CheckProblem problem : problemsMap.get(file).get(lineNumber)){
          stashClient.postTask(problem.getMessage(), commentId);
        }
      }
    }
  }

  private BuildInfo getBuildInfo(AbstractBuild<?, ?> build, BuildListener listener) throws IOException, InterruptedException {
    EnvVars envVars = build.getEnvironment(listener);
    String pullRequestUrl = envVars.get("PULL_REQUEST_URL");
    String pullRequestId = envVars.get("PULL_REQUEST_ID");

    return new BuildInfo(
        getProjectKey(pullRequestUrl),
        getRepositoryName(pullRequestUrl),
        pullRequestId,
        pullRequestUrl);
  }

  /**
   * Fetches the project key from the PULL_REQUEST_URL parameter
   *
   * @param pullRequestUrl url pointing to the pull request
   * @return the real project key or a dummy one
   */
  private String getProjectKey(String pullRequestUrl) {
    Matcher matcher = Pattern.compile("projects/(.*?)/repos").matcher(pullRequestUrl);
    if (matcher.find()) {
      return matcher.group(1);
    }
    return "{PULL_REQUEST_URL}";
  }

  /**
   * Fetches the repository name for the PULL_REQUEST_URL parameter
   *
   * @param pullRequestUrl url pointing to the pull request
   * @return the real repository name or a dummy one
   */
  private String getRepositoryName(String pullRequestUrl) {
    Matcher matcher = Pattern.compile("repos/(.*?)/pull-requests").matcher(pullRequestUrl);
    if (matcher.find()) {
      return matcher.group(1);
    }
    return "{PULL_REQUEST_URL}";
  }

  /**
   * A helper method to obtain the configured credentials.
   *
   * @param clazz   The type of {@link com.cloudbees.plugins.credentials.Credentials} to return.
   * @param project The hierarchical project context within which the credentials are searched for.
   * @return The first credentials of the given type that are found withing the project hierarchy, or null otherwise.
   */
  private <T extends Credentials> T getCredentials(final Class<T> clazz, final Item project) {

    T credentials = null;

    if (clazz == CertificateCredentials.class) {
      return null;
    }
    Descriptor descriptor = (Descriptor) getDescriptor();

    String credentialsId = descriptor.getMicroDocsStashCredentialsId();
    if (StringUtils.isNotBlank(credentialsId) && clazz != null && project != null) {
      credentials = CredentialsMatchers.firstOrNull(lookupCredentials(clazz, project, ACL.SYSTEM, new ArrayList<DomainRequirement>()), CredentialsMatchers.withId(credentialsId));
    }

    if (credentials == null) {
      if (StringUtils.isBlank(credentialsId) && descriptor != null) {
        credentialsId = descriptor.getMicroDocsStashCredentialsId();
      }
      if (StringUtils.isNotBlank(credentialsId) && clazz != null && project != null) {
        credentials = CredentialsMatchers.firstOrNull(lookupCredentials(clazz, Jenkins.getInstance(), ACL.SYSTEM, new ArrayList<DomainRequirement>()), CredentialsMatchers.withId(credentialsId));
      }
    }

    return credentials;
  }

  /**
   * Returns all credentials which are available to the specified {@link Authentication} for use by the specified {@link Item}.
   *
   * @param type               the type of credentials to get.
   * @param authentication     the authentication.
   * @param item               the item.
   * @param domainRequirements the credential domains to match.
   * @param <C>                the credentials type.
   * @return the list of credentials.
   */
  protected <C extends Credentials> List<C> lookupCredentials(Class<C> type, Item item, Authentication authentication, ArrayList<DomainRequirement> domainRequirements) {
    return CredentialsProvider.lookupCredentials(type, item, authentication, domainRequirements);
  }

  /**
   * Returns all credentials which are available to the specified {@link Authentication} for use by the specified {@link Item}.
   *
   * @param type               the type of credentials to get.
   * @param authentication     the authentication.
   * @param itemGroup          the item group.
   * @param domainRequirements the credential domains to match.
   * @param <C>                the credentials type.
   * @return the list of credentials.
   */
  protected <C extends Credentials> List<C> lookupCredentials(Class<C> type, ItemGroup<?> itemGroup, Authentication authentication, ArrayList<DomainRequirement> domainRequirements) {
    return CredentialsProvider.lookupCredentials(type, itemGroup, authentication, domainRequirements);
  }


}
