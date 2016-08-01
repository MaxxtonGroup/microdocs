package com.maxxton.microdocs.crawler.gradle

import com.maxxton.microdocs.crawler.ErrorReporter
import org.gradle.api.*
import org.gradle.api.artifacts.*;
import org.gradle.api.tasks.bundling.Zip
import org.gradle.api.tasks.javadoc.Javadoc

class MicroDocsCrawlerPlugin implements Plugin<Project> {

    def jarName = "microdocs-crawler-doclet.jar";

    void apply(Project project) {

        ErrorReporter.set(new GradleErrorReporter(project.logger));

        project.task('extractMicroDocsDoclet', group: 'microdocs') << {
            File tmpDir = new File("$project.buildDir/tmp")
            File jarFile = new File(tmpDir, jarName)
//            if(jarFile.exists()){
//                return;
//            }
            InputStream inputStream
            FileOutputStream fileOut
            try {
                tmpDir.mkdirs()
                jarFile.delete()

                inputStream = MicroDocsCrawlerPlugin.class.getResourceAsStream("/" + jarName)
                if (inputStream == null) {
                    throw new NullPointerException("Could not find '/" + jarName + "' in resources")
                }
                fileOut = new FileOutputStream(jarFile)
                byte[] buffer = new byte[1024]
                int l
                while ((l = inputStream.read(buffer)) > -1) {
                    fileOut.write(buffer, 0, l);
                    fileOut.flush();
                }
                fileOut.close();
                inputStream.close()
            } catch (Exception e) {
                if (fileOut != null)
                    fileOut.close();
                if (inputStream != null)
                    inputStream.close()
                throw e
            }
        }

        project.task('buildMicroDoc', type: Javadoc, dependsOn: ['extractMicroDocsDoclet'], group: 'microdocs') {
            title = ""
            source = project.sourceSets.main.allJava
            classpath = project.configurations.compile
            destinationDir = project.reporting.file('./')
            options.docletpath = [new File("$project.buildDir/tmp/" + jarName)]
            options.doclet = 'com.maxxton.microdocs.crawler.doclet.DocletRunner'
            options.addStringOption("linkpath", "../jxr/");
        }

        project.task('buildJavadoc', type: Javadoc, group: 'microdocs') {
            title = ""
            source = project.sourceSets.main.allJava
            destinationDir = project.reporting.file("javadoc")
            classpath = project.configurations.compile
            options.tags = ['response', 'dummy']
        }

        project.task('microDocs', type: Zip, dependsOn: ['buildMicroDoc', 'buildJavadoc'], group: 'microdocs') {
            from project.reporting.file("./")
            baseName = "microdocs"
            version = "latest";
        }

        project.task('exportVersion', group: 'microdocs') {
            doLast {
                Object version = project.properties.version;
                System.out.println("Export version: " + version);
                if (version != null) {
                    String versionString = String.valueOf(project.properties.version.toString());
                    if (versionString.contains('-')) {
                        versionString = versionString.substring(0, versionString.indexOf('-'));
                    }
                    if (versionString.contains('+')) {
                        versionString = versionString.substring(0, versionString.indexOf('+'));
                    }
                    FileWriter writer = new FileWriter(new File("${project.buildDir}/version"));
                    writer.write(versionString);
                    writer.flush();
                    writer.close();
                }
            }
        }

        project.task('checkMicroDocs', type: MicroDocsCheckProjectTask, group: 'microdocs', dependsOn: ['buildMicroDoc']) {
            println(project.reporting.file('./microdocs.json'))
            reportFile = project.reporting.file('./microdocs.json');
            url = "http://localhost:3000";
        }
    }
}