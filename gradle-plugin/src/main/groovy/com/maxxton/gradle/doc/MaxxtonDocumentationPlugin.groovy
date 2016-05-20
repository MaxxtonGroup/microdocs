
package com.maxxton.gradle.doc

import org.gradle.api.*
import org.gradle.api.tasks.Copy
import org.gradle.api.tasks.bundling.Zip
import org.gradle.api.tasks.javadoc.Javadoc

class MaxxtonDocumentationPlugin implements Plugin<Project>{
    void apply(Project project){
        
        project.task('extractSpringDoclet') <<{
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
        
		// deprecated
        project.task('maxxtonDocSpring', type: Javadoc, dependsOn: ['maxxtonDocJxr', 'extractSpringDoclet'], group: 'maxxton') {
            title = ""
            source = project.sourceSets.main.allJava
            classpath = project.sourceSets.main.compileClasspath
            destinationDir = project.reporting.file("springdoc")
            options.docletpath = [new File("$project.buildDir/tmp/spring-doclet-all.jar")]
            options.doclet = 'org.springdoclet.SpringDoclet'
            options.addStringOption("linkpath", "../jxr/");
        }
        
		// deprecated
        project.task('maxxtonDocJavadoc', type: Javadoc, group: 'maxxton'){
            title = ""
            source = project.sourceSets.main.allJava
            destinationDir = project.reporting.file("javadoc")
            classpath = project.sourceSets.main.compileClasspath
        }
        
		// deprecated
        project.task('maxxtonDocJxr', type: Copy, dependsOn: ['jxr'], group: 'maxxton'){
            from new File(project.buildDir, 'jxr')
            into project.reporting.file("jxr")
        }
        
		// deprecated
        project.task('maxxtonDoc', type:Zip, dependsOn: ['maxxtonDocSpring', 'maxxtonDocJavadoc', 'maxxtonDocJxr'], group: 'maxxton'){
            from project.reporting.file("./")
            baseName = "maxxton-doc"
        }
		
        
        project.task('buildApidoc', type: Javadoc, dependsOn: ['buildJxrDoc', 'extractSpringDoclet'], group: 'documentation') {
            title = ""
            source = project.sourceSets.main.allJava
            classpath = project.sourceSets.main.compileClasspath
            destinationDir = project.reporting.file("springdoc")
            options.docletpath = [new File("$project.buildDir/tmp/spring-doclet-all.jar")]
            options.doclet = 'org.springdoclet.SpringDoclet'
            options.addStringOption("linkpath", "../jxr/");
        }
        
        project.task('buildJavadoc', type: Javadoc, group: 'documentation'){
            title = ""
            source = project.sourceSets.main.allJava
            destinationDir = project.reporting.file("javadoc")
            classpath = project.sourceSets.main.compileClasspath
        }
        
        project.task('buildJxrDoc', type: Copy, dependsOn: ['jxr'], group: 'documentation'){
            from new File(project.buildDir, 'jxr')
            into project.reporting.file("jxr")
        }
        
        project.task('buildDoc', type:Zip, dependsOn: ['buildApidoc', 'buildJavadoc', 'buildJxrDoc'], group: 'documentation'){
            from project.reporting.file("./")
            baseName = "maxxton-doc"
        }
    }
}