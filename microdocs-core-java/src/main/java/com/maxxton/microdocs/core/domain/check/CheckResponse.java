package com.maxxton.microdocs.core.domain.check;

import java.util.List;

/**
 * @author Steven Hermans
 */
public class CheckResponse {

  private String status;
  private String message;
  private List<CheckProblem> problems;

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public List<CheckProblem> getProblems() {
    return problems;
  }

  public void setProblems(List<CheckProblem> problems) {
    this.problems = problems;
  }
}
