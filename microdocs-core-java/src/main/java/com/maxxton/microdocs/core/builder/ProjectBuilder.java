package com.maxxton.microdocs.core.builder;

import com.maxxton.microdocs.core.domain.Project;
import com.maxxton.microdocs.core.domain.common.ExternalDocs;
import com.maxxton.microdocs.core.domain.common.ProjectInfo;
import com.maxxton.microdocs.core.domain.common.SecurityDefinition;
import com.maxxton.microdocs.core.domain.common.Tag;
import com.maxxton.microdocs.core.domain.component.ComponentType;
import com.maxxton.microdocs.core.domain.dependency.Dependency;
import com.maxxton.microdocs.core.domain.path.Parameter;
import com.maxxton.microdocs.core.domain.path.Response;
import com.maxxton.microdocs.core.domain.problem.Problem;
import com.maxxton.microdocs.core.domain.component.Component;
import com.maxxton.microdocs.core.domain.schema.Schema;
import com.maxxton.microdocs.core.domain.path.Path;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * Build project
 *
 * @author Steven Hermans
 */
public class ProjectBuilder implements Builder<Project> {

  private Project project = new Project();
  private List<String> projectClasses;

  @Override
  public Project build() {
    return project;
  }

  public List<String> projectClasses() {
    return projectClasses;
  }

  public ProjectBuilder projectClasses(List<String> projectClasses) {
    this.projectClasses = projectClasses;
    return this;
  }

  public ProjectBuilder projectClass(String projectClass) {
    if (projectClasses == null) {
      projectClasses = new ArrayList();
    }
    projectClasses.add(projectClass);
    return this;
  }

  public ProjectBuilder info(ProjectInfo info) {
    project.setInfo(info);
    return this;
  }

  public ProjectBuilder info(ProjectInfoBuilder projectInfoBuilder) {
    project.setInfo(projectInfoBuilder.build());
    return this;
  }

  public ProjectBuilder host(String host) {
    this.project.setHost(host);
    return this;
  }

  public ProjectBuilder basePath(String basePath) {
    this.project.setBasePath(basePath);
    return this;
  }

  public ProjectBuilder schemas(String... schemas) {
    if (project.getSchemas() == null) {
      project.setSchemas(new ArrayList());
    }
    for (String schema : schemas) {
      project.getSchemas().add(schema);
    }
    return this;
  }

  public ProjectBuilder schemas(List<String> schemas) {
    if (project.getSchemas() == null) {
      project.setSchemas(new ArrayList());
    }
    project.getSchemas().addAll(schemas);
    return this;
  }

  public ProjectBuilder tag(String name) {
    tag(name, null, null);
    return this;
  }

  public ProjectBuilder tag(String name, String description) {
    tag(name, description, null);
    return this;
  }

  public ProjectBuilder tag(String name, String description, String externalDocUrl) {
    tag(name, description, externalDocUrl, null);
    return this;
  }

  public ProjectBuilder tag(String name, String description, String externalDocUrl, String externalDocDescription) {
    Tag tag = new Tag();
    tag.setName(name);
    tag.setDescription(description);
    if (externalDocUrl != null) {
      ExternalDocs externalDocs = new ExternalDocs();
      externalDocs.setUrl(externalDocUrl);
      externalDocs.setDescription(externalDocDescription);
      tag.setExternalDocs(externalDocs);
    }
    tag(tag);
    return this;
  }

  public ProjectBuilder tag(Tag tag) {
    if (project.getTags() == null) {
      project.setTags(new ArrayList());
    }
    project.getTags().add(tag);
    return this;
  }

  public ProjectBuilder tags(Tag... tags) {
    if (project.getTags() == null) {
      project.setTags(new ArrayList());
    }
    for (Tag tag : tags) {
      project.getTags().add(tag);
    }
    return this;
  }

  public ProjectBuilder tags(List<Tag> tags) {
    if (project.getTags() == null) {
      project.setTags(new ArrayList());
    }
    project.getTags().addAll(tags);
    return this;
  }

  public ProjectBuilder externalDoc(String url) {
    externalDoc(url, null);
    return this;
  }

  public ProjectBuilder externalDoc(String url, String description) {
    ExternalDocs externalDocs = new ExternalDocs();
    externalDocs.setUrl(url);
    externalDocs.setDescription(description);
    externalDoc(externalDocs);
    return this;
  }

  public ProjectBuilder externalDoc(ExternalDocs externalDocs) {
    if (project.getExternalDocs() == null) {
      project.setExternalDocs(new ArrayList());
    }
    project.getExternalDocs().add(externalDocs);
    return this;
  }

  public ProjectBuilder externalDocs(ExternalDocs... externalDocs) {
    if (project.getExternalDocs() == null) {
      project.setExternalDocs(new ArrayList());
    }
    for (ExternalDocs externalDoc : externalDocs) {
      project.getExternalDocs().add(externalDoc);
    }
    return this;
  }

  public ProjectBuilder externalDocs(List<ExternalDocs> externalDocs) {
    if (project.getExternalDocs() == null) {
      project.setExternalDocs(new ArrayList());
    }
    project.getExternalDocs().addAll(externalDocs);
    return this;
  }

  public ProjectBuilder securityDefinitions(String name, SecurityDefinition securityDefinition) {
    if (project.getSecurityDefinitions() == null) {
      project.setSecurityDefinitions(new HashMap());
    }
    project.getSecurityDefinitions().put(name, securityDefinition);
    return this;
  }

  public ProjectBuilder security(String name, String... scopes) {
    List<String> scopeList = new ArrayList();
    for (String scope : scopes) {
      scopeList.add(scope);
    }
    security(name, scopeList);
    return this;
  }

  public ProjectBuilder security(String name, List<String> scopeList) {
    if (project.getSecurity() == null) {
      project.setSecurity(new HashMap());
    }
    project.getSecurity().put(name, scopeList);
    return this;
  }

  public ProjectBuilder consumes(String... consumes) {
    List<String> consumeList = new ArrayList();
    for (String consume : consumes) {
      consumeList.add(consume);
    }
    consumes(consumeList);
    return this;
  }

  public ProjectBuilder consumes(List<String> consumes) {
    if (project.getConsumes() == null) {
      project.setConsumes(new ArrayList());
    }
    project.getConsumes().addAll(consumes);
    return this;
  }

  public ProjectBuilder produces(String... produces) {
    List<String> produceList = new ArrayList();
    for (String produce : produces) {
      produceList.add(produce);
    }
    produces(produceList);
    return this;
  }

  public ProjectBuilder produces(List<String> produces) {
    if (project.getProduces() == null) {
      project.setProduces(new ArrayList());
    }
    project.getProduces().addAll(produces);
    return this;
  }

  public ProjectBuilder path(PathBuilder pathBuilder) {
    path(pathBuilder.path(), pathBuilder.requestMethod(), pathBuilder.build());
    return this;
  }

  public ProjectBuilder path(String path, String method, Path endpoint) {
    if (project.getPaths() == null) {
      project.setPaths(new HashMap());
    }
    if (project.getPaths().get(path) == null) {
      project.getPaths().put(path, new HashMap());
    }
    project.getPaths().get(path).put(method, endpoint);
    return this;
  }

  public ProjectBuilder definition(String name, Schema schema) {
    if (project.getDefinitions() == null) {
      project.setDefinitions(new HashMap());
    }
    project.getDefinitions().put(name, schema);
    return this;
  }

  public ProjectBuilder parameter(String name, Parameter parameter) {
    if (project.getParameters() == null) {
      project.setParameters(new HashMap());
    }
    project.getParameters().put(name, parameter);
    return this;
  }

  public ProjectBuilder response(String name, Response response) {
    if (project.getResponses() == null) {
      project.setResponses(new HashMap());
    }
    project.getResponses().put(name, response);
    return this;
  }

  public ProjectBuilder component(String name, Component component) {
    if (project.getComponents() == null) {
      project.setComponents(new HashMap());
    }
    project.getComponents().put(name, component);
    if (project.getInfo() == null || (project.getInfo() != null && project.getInfo().getDescription() != null && !project.getInfo().getDescription().trim().isEmpty())) {
      if (component.getType() == ComponentType.APPLICATION && component.getDescription() != null && !component.getDescription().trim().isEmpty()) {
        this.info(new ProjectInfoBuilder().description(component.getDescription()).build());
      }
    }
    return this;
  }

  public ProjectBuilder dependency(DependencyBuilder dependencyBuilder) {
    return dependency(dependencyBuilder.title(), dependencyBuilder.build());
  }

  public ProjectBuilder dependency(String name, Dependency dependency) {
    if (project.getDependencies() == null) {
      project.setDependencies(new HashMap());
    }

    if(project.getDependencies().containsKey(name.toLowerCase())){
      Dependency existingDependency = project.getDependencies().get(name.toLowerCase());
      if(existingDependency.getDescription() == null || existingDependency.getDescription().isEmpty()){
        existingDependency.setDescription(dependency.getDescription());
      }
      dependency.getPaths().entrySet().forEach(entry -> {
        if(!existingDependency.getPaths().containsKey(entry.getKey())){
          existingDependency.getPaths().put(entry.getKey(),entry.getValue());
        }else{
          entry.getValue().entrySet().forEach(subEntry -> {
            existingDependency.getPaths().get(entry.getKey()).put(subEntry.getKey(), subEntry.getValue());
          });
        }
      });
    }else {
      project.getDependencies().put(name.toLowerCase(), dependency);
    }
    return this;
  }

  public ProjectBuilder problem(Problem problem) {
    if (project.getProblems() == null) {
      project.setProblems(new ArrayList());
    }
    project.getProblems().add(problem);
    return this;
  }

  public ProjectBuilder problems(Problem... problems) {
    List<Problem> problemList = new ArrayList();
    for (Problem problem : problems) {
      problemList.add(problem);
    }
    problems(problemList);
    return this;
  }

  public ProjectBuilder problems(List<Problem> problems) {
    if (project.getProblems() == null) {
      project.setProblems(new ArrayList());
    }
    project.getProblems().addAll(problems);
    return this;
  }

}
