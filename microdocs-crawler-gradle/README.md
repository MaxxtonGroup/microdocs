# MicroDocs Gradle plugin
Gradle plugin for generating definitions using the [MicroDocsCrawler Doclet](../microdocs-crawler-doclet).

## Setup

build.gradle
```
buildscript {
  mavenCentral()
  dependencies {
    classpath('com.maxxton:microdocs-crawler-gradle:1.0')
    classpath ("com.fasterxml.jackson.core:jackson-databind:2.7.5")
    classpath ("com.mashape.unirest:unirest-java:1.4.9")
    classpath ("com.maxxton.microdocs:microdocs-core-java:1.0")
  }
}
apply plugin: 'microdocs'

buildMicroDocs{
  options.addStringOption("group", "services")
}

checkMicroDocs{
  reportFile = 'build/reports/microdocs.json';
  url = "http://microdocs-server";
}

publishMicroDocs{
  reportFile = 'build/reports/microdocs.json';
  url = "http://microdocs-server";
  group = "services";
  failOnProblems = true;
}
```

## Usage
* ```gradle microDocs``` - Generate definitions
* ```gradle checkMicroDocs``` - Check new definitions against the MicroDocs server 
* ```gradle publishMicroDocs``` - Publish definitions to the MicroDocs server 

## Build
```
# copy the doclet to resources
cp ../microdocs-crawler-doclet/build/libs/microdocs-crawler-doclet.jar src/main/resources/microdocs-crawler-doclet.jar
gradle publishArchives
```

## Publish to Maven Central
1. Create a [sonatype account](https://issues.sonatype.org/secure/Signup!default.jspa) and create an issue to request access to com.maxxton
2. Install [GnuPG](https://www.gnupg.org/download/)
3. Generate key pair by running:
```
$ gpg --gen-key
```
choose RSA 2048bit with no expiration.
Your key is saved in ~/.gnupg
4. Create ```gradle.properties``` in the gradle home folder (~/.gradle)
~/.gradle/gradle.properties
```
signing.keyId=publickeyid
signing.password=yourpassword
signing.secretKeyRingFile=C:\\Users\\username\\.gnupg\\secring.gpg

sonatypeUsername=username
sonatypePassword=password
```
Fill in these properties correctly.

5. Publish
```
$ gradle publishArchives
```

And follow the [release and deployment manual](http://central.sonatype.org/pages/releasing-the-deployment.html)