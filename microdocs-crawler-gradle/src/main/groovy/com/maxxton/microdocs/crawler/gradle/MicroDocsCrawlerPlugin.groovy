
package com.maxxton.microdocs.crawler.gradle;

import org.gradle.api.*
import org.gradle.api.tasks.Copy
import org.gradle.api.tasks.bundling.Zip
import org.gradle.api.tasks.javadoc.Javadoc

class MicroDocsCrawlerPlugin implements Plugin<Project>{
    void apply(Project project){
        
        project.task('extractDoclet', group: 'microdocs') <<{
            File tmpDir = new File("$project.buildDir/tmp")
            File jarFile = new File(tmpDir, "spring-doclet-all.jar")
            if(jarFile.exists()){
                return;
            }
            InputStream inputStream
            FileOutputStream fileOut
            try{
                tmpDir.mkdirs()
                jarFile.delete()
            
                inputStream = MaxxtonDocumentationPlugin.class.getResourceAsStream("/spring-doclet-all.jar")
                if(inputStream == null){
                    throw new NullPointerException("Could not find '/spring-doclet-all.jar' in resources")
                }
                fileOut = new FileOutputStream(jarFile)
                byte[] buffer = new byte[1024]
                int l
                while((l = inputStream.read(buffer)) > -1){
                    fileOut.write(buffer, 0, l);
                    fileOut.flush();
                }
                fileOut.close();
                inputStream.close()
            }catch(Exception e){
                if(fileOut != null)
                    fileOut.close();
                if(inputStream != null)
                    inputStream.close()
                throw e
            }
        }
		
        project.task('buildMicroDoc', type: Javadoc, dependsOn: ['buildJxrDoc', 'extractDoclet'], group: 'microdocs') {
            title = ""
            source = project.sourceSets.main.allJava
            classpath = project.configurations.compile
            destinationDir = project.reporting.file('./')
            options.docletpath = [new File("$project.buildDir/tmp/spring-doclet-all.jar")]
            options.doclet = 'org.springdoclet.SpringDoclet'
            options.addStringOption("linkpath", "../jxr/");
        }
        
        project.task('buildJavadoc', type: Javadoc, group: 'microdocs'){
            title = ""
            source = project.sourceSets.main.allJava
            destinationDir = project.reporting.file("javadoc")
            classpath = project.configurations.compile
            options.tags = ['response', 'dummy']
        }
        
        project.task('buildJxrDoc', type: Copy, dependsOn: ['jxr'], group: 'microdocs'){
            from new File(project.buildDir, 'jxr')
            into project.reporting.file("source")
        }
        
        project.task('buildDoc', type:Zip, dependsOn: ['buildMicroDoc', 'buildJavadoc', 'buildJxrDoc'], group: 'microdocs'){
            from project.reporting.file("./")
            baseName = "microdoc"
            version = "latest";
        }

        project.task('exportVersion', group: 'microdocs'){
            doLast {
                FileWriter writer = new FileWriter(new File("${project.buildDir}/version"));
                System.out.println("Export version: " + project.properties.version);
                writer.write(String.valueOf(project.properties.version.toString()));
                writer.flush();
                writer.close();
            }
        }
    }
}