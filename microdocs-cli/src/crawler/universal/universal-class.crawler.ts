import { ClassCrawler } from "../common/abstract/class.crawler";
import { ClassIdentity } from "../common/domain/class-identity";
import { ProjectReflection } from "@maxxton/typedoc";
import { ContainerReflection } from "@maxxton/typedoc/dist/lib/models";
import { ProjectBuilder, DependencyBuilder } from "@maxxton/microdocs-core/builder";
import { DependencyTypes } from "@maxxton/microdocs-core/domain";

export class UniversalClassCrawler extends ClassCrawler {

  public crawl( classIdentity: ClassIdentity, projectBuilder: ProjectBuilder, projectReflection: ProjectReflection, classReflection: ContainerReflection ): void {
    if ( classReflection.comment ) {
      var comment = classReflection.comment;
      if ( this.isClient( classReflection ) ) {
        classIdentity.isClient    = true;
        classIdentity.isComponent = true;
      } else if ( this.isService( classReflection ) ) {
        classIdentity.isService   = true;
        classIdentity.isComponent = true;
      } else if ( this.isController( classReflection ) ) {
        classIdentity.isController = true;
        classIdentity.isComponent  = true;
      } else if ( this.isModel( classReflection ) ) {
        classIdentity.isModel = true;
      } else if ( this.isMain( classReflection ) ) {
        classIdentity.isMain = true;
        var applicationName  = comment.getTag( 'application' ).text.trim();
        if ( applicationName && applicationName !== '' ) {
          var splitted                        = applicationName.split( '/' );
          projectBuilder.project().info.title = splitted[ splitted.length - 1 ];
        }
      }

      if ( comment.hasTag( "projectgroup" ) ) {
        projectBuilder.project().info.group = comment.getTag( "projectgroup" ).text.trim();
      }
      if ( comment.hasTag( "projectinclude" ) ) {
        var dependencyName                          = comment.getTag( 'projectinclude' ).text.trim();
        var splitted                                = dependencyName.split( '/' );
        var dependendyBuilder                       = new DependencyBuilder( DependencyTypes.INCLUDES );
        dependendyBuilder.title                     = splitted[ splitted.length - 1 ];
        dependendyBuilder.dependency.dependencyName = dependencyName;
        var version                                 = this.findDependency( dependencyName, projectReflection );
        if ( version ) {
          dependendyBuilder.dependency.version = version;
        }
        projectBuilder.dependency( dependendyBuilder );
      }
    }
  }


  private isClient( classReflection: ContainerReflection ): boolean {
    return classReflection.comment.hasTag( "client" );
  }

  private isService( classReflection: ContainerReflection ): boolean {
    return classReflection.comment.hasTag( "service" );
  }

  private isController( classReflection: ContainerReflection ): boolean {
    return classReflection.comment.hasTag( "controller" );
  }

  private isModel( classReflection: ContainerReflection ): boolean {
    return classReflection.comment.hasTag( "model" );
  }

  private isMain( classReflection: ContainerReflection ): boolean {
    return classReflection.comment.hasTag( "application" );
  }

  private findDependency( title: string, projectReflection: ProjectReflection ): string {
    if ( projectReflection.packageInfo ) {
      if ( projectReflection.packageInfo.dependencies && projectReflection.packageInfo.dependencies[ title ] ) {
        return projectReflection.packageInfo.dependencies[ title ];
      }
      if ( projectReflection.packageInfo.devDependencies && projectReflection.packageInfo.devDependencies[ title ] ) {
        return projectReflection.packageInfo.devDependencies[ title ];
      }
      if ( projectReflection.packageInfo.peerDependencies && projectReflection.packageInfo.peerDependencies[ title ] ) {
        return projectReflection.packageInfo.peerDependencies[ title ];
      }
    }
    return null;
  }

}