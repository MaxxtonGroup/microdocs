package com.maxxton.microdocs.jenkins.notifier.stash;

import com.cloudbees.plugins.credentials.common.UsernamePasswordCredentials;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.ObjectMapper;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.maxxton.microdocs.crawler.ErrorReporter;
import com.maxxton.microdocs.jenkins.notifier.BuildInfo;
import com.maxxton.microdocs.jenkins.notifier.stash.domain.*;

import java.io.IOException;

/**
 * Stash Notifier
 * Handles Stash integration
 *
 * @author Steven Hermans
 */
public class StashClient {

  private final String stashUrl;
  private final UsernamePasswordCredentials credentials;

  public StashClient(String stashUrl, UsernamePasswordCredentials credentials) {
    this.stashUrl = stashUrl;
    this.credentials = credentials;
  }


  /**
   * Post comment on pull request in stash
   *
   * @param buildInfo
   * @param message
   * @return comment id
   */
  public int postPullRequestComment(BuildInfo buildInfo, String message) throws IOException {
    return postPullRequestComment(buildInfo, message, null);
  }

  /**
   * Post comment on file on pull request in stash
   *
   * @param buildInfo
   * @param message
   * @param path
   * @return comment id
   */
  public int postPullRequestComment(BuildInfo buildInfo, String message, String path) throws IOException {
    return postPullRequestComment(buildInfo, message, path, null);
  }

  /**
   * Post comment in file on pull request in stash
   *
   * @param buildInfo
   * @param message
   * @param path
   * @param lineNumber
   * @return comment id
   */
  public int postPullRequestComment(BuildInfo buildInfo, String message, String path, Integer lineNumber) throws IOException {
    StashComment comment = new StashComment();
    comment.setText(message);
    if (path != null) {
      StashAnchor anchor = new StashAnchor();
      String unixPath = path.replaceAll("\\\\", "/");
      anchor.setPath(unixPath);
      anchor.setSourcePath(unixPath);
      if (lineNumber != null) {
        anchor.setLine(lineNumber);
        anchor.setLineType(StashLineType.CONTEXT);
      }
      comment.setAnchor(anchor);
    }

    try {
      String url = stashUrl + "/rest/api/1.0/projects/" + buildInfo.getProjectKey() + "/repos/" + buildInfo.getRepositoryName() + "/pull-requests/" + buildInfo.getPullRequestId() + "/comments";
      ErrorReporter.get().printNotice("post " + url);
      initObjectMapper();
      HttpResponse<JsonNode> response = Unirest.post(url)
          .basicAuth(credentials.getUsername(), credentials.getPassword().getPlainText())
          .header("content-type", "application/json")
          .body(comment)
          .asJson();
      if (response.getStatus() != 201) {
        throw new IOException("Wrong response status " + response.getStatus() + ", expected 200");
      }
      return response.getBody().getObject().getInt("id");
    } catch (UnirestException e) {
      throw new IOException(e);
    }
  }

  /**
   * Post task on a existing comment
   * @param message task message
   * @param commentId comment id
   * @return task id
   * @throws IOException
   */
  public int postTask(String message, int commentId) throws IOException {
    StashTask task = new StashTask();
    task.setText(message);
    task.setState(StashTaskState.OPEN);
    StashAnchor anchor = new StashAnchor();
    anchor.setType(StashAnchorType.COMMENT);
    anchor.setId(commentId);
    task.setAnchor(anchor);

    try {
      String url = stashUrl + "/rest/api/1.0/tasks";
      ErrorReporter.get().printNotice("post " + url);
      initObjectMapper();
      HttpResponse<JsonNode> response = Unirest.post(url)
          .basicAuth(credentials.getUsername(), credentials.getPassword().getPlainText())
          .header("content-type", "application/json")
          .body(task)
          .asJson();
      if (response.getStatus() != 201) {
        throw new IOException("Wrong response status " + response.getStatus() + ", expected 200");
      }
      return response.getBody().getObject().getInt("id");
    } catch (UnirestException e) {
      throw new IOException(e);
    }
  }

  private static void initObjectMapper() {
    com.fasterxml.jackson.databind.ObjectMapper jacksonObjectMapper = new com.fasterxml.jackson.databind.ObjectMapper();
    jacksonObjectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    jacksonObjectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
    Unirest.setObjectMapper(new ObjectMapper() {

      public <T> T readValue(String value, Class<T> valueType) {
        try {
          return jacksonObjectMapper.readValue(value, valueType);
        } catch (IOException e) {
          throw new RuntimeException(e);
        }
      }

      public String writeValue(Object value) {
        try {
          return jacksonObjectMapper.writeValueAsString(value);
        } catch (JsonProcessingException e) {
          throw new RuntimeException(e);
        }
      }
    });
  }

}
