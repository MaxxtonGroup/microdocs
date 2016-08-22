package com.maxxton.microdocs.publisher;

/**
 * @author Steven Hermans
 */
public class ServerConfiguration {

  private final String url;
  private final String username;
  private final String password;

  public ServerConfiguration(String url) {
    this.url = url;
    username = null;
    password = null;
  }

  public ServerConfiguration(String url, String username, String password) {
    this.url = url;
    this.username = username;
    this.password = password;
  }

  public String getUsername() {
    return username;
  }

  public String getPassword() {
    return password;
  }

  public String getUrl() {
    return url;
  }
}
