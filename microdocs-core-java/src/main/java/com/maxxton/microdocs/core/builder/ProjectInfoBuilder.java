package com.maxxton.microdocs.core.builder;

import com.maxxton.microdocs.core.domain.common.Contact;
import com.maxxton.microdocs.core.domain.common.License;
import com.maxxton.microdocs.core.domain.common.ProjectInfo;
import com.maxxton.microdocs.core.domain.common.ProjectType;

/**
 * Build project info
 * @author Steven Hermans
 */
public class ProjectInfoBuilder implements Builder<ProjectInfo>{

    private ProjectInfo projectInfo = new ProjectInfo();

    @Override
    public ProjectInfo build(){
        return projectInfo;
    }

    public ProjectInfoBuilder description(String description){
        projectInfo.setDescription(description);
        return this;
    }

    public ProjectInfoBuilder title(String title){
        projectInfo.setTitle(title);
        return this;
    }

    public ProjectInfoBuilder group(String group){
        projectInfo.setGroup(group);
        return this;
    }

    public ProjectInfoBuilder type(ProjectType type){
        projectInfo.setType(type);
        return this;
    }

    public ProjectInfoBuilder termsOfService(String termsOfService){
        projectInfo.setTermsOfService(termsOfService);
        return this;
    }

    public ProjectInfoBuilder contactName(String contactName){
        if(projectInfo.getContact() == null){
            projectInfo.setContact(new Contact());
        }
        projectInfo.getContact().setName(contactName);
        return this;
    }

    public ProjectInfoBuilder contactUrl(String contactUrl){
        if(projectInfo.getContact() == null){
            projectInfo.setContact(new Contact());
        }
        projectInfo.getContact().setUrl(contactUrl);
        return this;
    }

    public ProjectInfoBuilder contactEmail(String contactEmal){
        if(projectInfo.getContact() == null){
            projectInfo.setContact(new Contact());
        }
        projectInfo.getContact().setEmail(contactEmal);
        return this;
    }

    public ProjectInfoBuilder licenseName(String licenseName){
        if(projectInfo.getLicense() == null){
            projectInfo.setLicense(new License());
        }
        projectInfo.getLicense().setName(licenseName);
        return this;
    }

    public ProjectInfoBuilder licenseUrl(String licenseUrl){
        if(projectInfo.getLicense() == null){
            projectInfo.setLicense(new License());
        }
        projectInfo.getLicense().setUrl(licenseUrl);
        return this;
    }

}
