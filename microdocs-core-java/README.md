# MicroDocs core Java
Core functionaries used across other MicroDocs Java projects

## Build
```
$ gradle jar
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