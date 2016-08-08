package com.maxxton.microdocs.jenkins;

import com.cloudbees.plugins.credentials.Credentials;
import com.cloudbees.plugins.credentials.CredentialsMatcher;
import com.cloudbees.plugins.credentials.common.UsernamePasswordCredentials;

/**
 * @author Steven Hermans
 */
public class MicroDocsCredentialsMatcher implements CredentialsMatcher {
  @Override
  public boolean matches(Credentials credentials) {
    return credentials instanceof UsernamePasswordCredentials;
  }
}
