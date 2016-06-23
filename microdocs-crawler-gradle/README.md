# gradle-documentation-plugin
Gradle plugin for generating api, source and javadoc documentation for our microservices

## Setup

build.gradle
```
buildscript {
  mavenCentral()
  repositories {
    maven{
        name 'Bintray'
        url 'http://jcenter.bintray.com'
    }
  }
  dependencies {
    classpath('com.maxxton.gradle:gradle-documentation-plugin:0.1')
    classpath('net.davidecavestro:gradle-jxr-plugin:0.1')
  }
}
apply plugin: 'mxtdoc'
apply plugin: 'jxr'
```

## Usage

This plugin add the task ```maxxtonDoc```, which generates the documentation in the /build/reports folder
