package com.maxxton.microdocs.jenkins.notifier;

/**
 * @author Steven Hermans
 */
public class BuildInfo {

    private final String projectKey;
    private final String repositoryName;
    private final String pullRequestId;
    private final String pullRequestUrl;

    public BuildInfo(String projectKey, String repositoryName, String pullRequestId, String pullRequestUrl) {
        this.projectKey = projectKey;
        this.repositoryName = repositoryName;
        this.pullRequestId = pullRequestId;
        this.pullRequestUrl = pullRequestUrl;
    }

    public String getProjectKey() {
        return projectKey;
    }

    public String getRepositoryName() {
        return repositoryName;
    }

    public String getPullRequestId() {
        return pullRequestId;
    }

    public String getPullRequestUrl() {
        return pullRequestUrl;
    }
}
