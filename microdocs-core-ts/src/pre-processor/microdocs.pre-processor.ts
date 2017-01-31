
import {Project, ProjectSettings} from "../domain";
import {SchemaHelper} from "../helpers/schema/schema.helper";
import { PreProcessor } from "./pre-processor";

const VARIABLES_PLACEHOLDER = "~~~VARIABLES";
const IF_PLACEHOLDER = "~~~IF";
const COMMENT_PLACEHOLDER = "~~~#";

/**
 * Helper for applying custom settings
 * @author Steven Hermans
 */
export class MicroDocsPreProcessor implements PreProcessor{

  /**
   * Resolve project on different levels: global, env, group and project
   * @param settings
   * @param project
   * @param env
   * @returns {Project}
   */
  public processProject(settings: ProjectSettings, project: Project, env: string): Project {
    // load variables
    var variables = {};
    if ( settings.global && settings.global[ VARIABLES_PLACEHOLDER ] ) {
      Object.assign( variables, settings.global[ VARIABLES_PLACEHOLDER ] );
      delete settings.global[ VARIABLES_PLACEHOLDER ];
    }
    if ( settings.environments && settings.environments[ env ] && settings.environments[ env ][ VARIABLES_PLACEHOLDER ] ) {
      Object.assign( variables, settings.environments[ env ][ VARIABLES_PLACEHOLDER ] );
      delete settings.environments[ env ][ VARIABLES_PLACEHOLDER ];
    }
    if ( project.info && project.info.group && settings.groups && settings.groups[ project.info.group ] && settings.groups[ project.info.group ][ VARIABLES_PLACEHOLDER ] ) {
      Object.assign( variables, settings.groups[ project.info.group ][ VARIABLES_PLACEHOLDER ] );
      delete settings.groups[ project.info.group ][ VARIABLES_PLACEHOLDER ];
    }
    if ( project.info && project.info.title && settings.projects && settings.projects[ project.info.title ] && settings.projects[ project.info.title ][ VARIABLES_PLACEHOLDER ] ) {
      Object.assign( variables, settings.projects[ project.info.title ][ VARIABLES_PLACEHOLDER ] );
      delete settings.projects[ project.info.title ][ VARIABLES_PLACEHOLDER ];
    }

    console.error( variables );

    // process project
    if (settings.global) {
      project = this.process(project, settings.global, variables);
    }
    if (settings.environments && settings.environments[env]) {
      project = this.process(project, settings.environments[env], variables);
    }
    if (project.info && project.info.group && settings.groups && settings.groups[project.info.group]) {
      project = this.process(project, settings.groups[project.info.group], variables);
    }
    if (project.info && project.info.title && settings.projects && settings.projects[project.info.title]) {
      project = this.process(project, settings.projects[project.info.title], variables);
    }

    return project;
  }

  /**
   * Resolve project with given settings
   * @param project
   * @param settings
   * @param projectScope
   * @param settingsScope
   * @param variables
   * @returns {any}
   */
  public process(project: Project, settings: {},  variables:{scope?:{},project?:{},settings?:{},settingsScope?:{},[key:string]:any} = {}, projectScope?: any, settingsScope?: any, prevScope?:{}): any {
    if (settingsScope === undefined) {
      settingsScope = settings;
    }
    if ( projectScope === undefined ) {
      projectScope = project;
    }
    if(prevScope === undefined){
      prevScope = projectScope;
    }
    variables.project       = project;
    variables.scope         = projectScope;
    variables.settingsScope = settingsScope;
    variables.settings      = settings;

    if ( Array.isArray( settingsScope ) ) {
      if ( projectScope == null ) {
        projectScope = [];
      }
      if (Array.isArray(projectScope)) {
        for (var i = 0; i < settingsScope.length; i++) {
          projectScope.push(this.process(project, settings, variables, null, settingsScope[i]));
        }
      } else {
        console.warn( 'Could not process array when it is not one' );
      }
    } else if ( typeof(settingsScope) == "object" ) {
      if ( projectScope == null || typeof(projectScope) !== 'object' ) {
        projectScope = {};
      }
      for ( var key in settingsScope ) {
        var newSettingsScope = settingsScope[ key ];
        if ( !newSettingsScope ) {
          newSettingsScope = {};
        }
        if ( key === IF_PLACEHOLDER ) {
          let condition = newSettingsScope[ 'condition' ];
          if ( condition ) {
            let scopeVars = Object.assign({}, variables, {settingsScope: settingsScope});
            var result = SchemaHelper.resolveCondition( condition, scopeVars );
            if(result){
              if(newSettingsScope['then']){
                SchemaHelper.resolveCondition( newSettingsScope['then'], scopeVars );
              }else{
                console.warn( "No 'then' in ~~~IF statement" );
              }
            }else{
              if(newSettingsScope['else']){
                SchemaHelper.resolveCondition( newSettingsScope['else'], scopeVars );
              }else{
                console.warn( "No 'else' in ~~~IF statement" );
              }
            }
          } else {
            console.warn( 'No condition in ~~~IF statement' );
          }
        } else if ( key === COMMENT_PLACEHOLDER ) {
          continue;
        } else {
          var resolvedKey = SchemaHelper.resolveString( key, variables );
          if ( resolvedKey ) {
            if ( resolvedKey.indexOf( '{' ) == 0 && resolvedKey.indexOf( '}' ) == resolvedKey.length - 1 ) {
              var variableName = resolvedKey.substring( 1, resolvedKey.length - 1 );
              var oldVarValue  = variables[ variableName ];
              if ( Array.isArray( projectScope ) ) {
                let newProjectScopes:any[] = [];
                for ( let existingKey = 0; existingKey < projectScope.length; existingKey++ ) {
                  variables[ variableName ] = existingKey;
                  var newProjectScope       = projectScope[ existingKey ];
                  if ( !newProjectScope ) {
                    newProjectScope = null;
                  }

                  newProjectScope = this.process( project, settings, variables, newProjectScope, newSettingsScope, projectScope );
                  newProjectScopes.push( newProjectScope );

                  // clean up
                  if ( oldVarValue ) {
                    variables[ variableName ] = oldVarValue;
                  } else {
                    delete variables[ variableName ];
                  }
                }
                projectScope = newProjectScopes;
              } else {
                let newProjectScopes:any = {};
                for ( let existingKey in projectScope ) {
                  variables[ variableName ] = existingKey;
                  var newProjectScope       = projectScope[ existingKey ];
                  if ( !newProjectScope ) {
                    newProjectScope = null;
                  }

                newProjectScope = this.process(project, settings, variables, newProjectScope, newSettingsScope, projectScope);
                  newProjectScopes[ existingKey ] = newProjectScope;

                  // clean up
                  if ( oldVarValue ) {
                    variables[ variableName ] = oldVarValue;
                  } else {
                    delete variables[ variableName ];
                  }
                }
                projectScope = newProjectScopes;
              }
            } else {
              if ( Array.isArray( projectScope ) ) {
                console.warn( "Could process array as object" );
              } else {
                var newProjectScope = projectScope[ resolvedKey ];
                if ( !newProjectScope ) {
                  newProjectScope = null;
                }

                newProjectScope = this.process(project, settings, variables, newProjectScope, newSettingsScope, projectScope);
                if ( newProjectScope != undefined ) {
                  projectScope[ resolvedKey ] = newProjectScope;
                }

                // clean up
//                if (oldVarValue) {
//                  variables[variableName] = oldVarValue;
//                } else {
//                  delete variables[variableName];
//                }
              }
            }
          } else {
            if (Array.isArray(projectScope)) {
              console.warn("Could process array as object");
            } else {
              var newProjectScope = projectScope[resolvedKey];
              if (!newProjectScope) {
                newProjectScope = null;
              }
              newProjectScope = this.process(project, settings, variables, newProjectScope, newSettingsScope);
              if (newProjectScope != undefined) {
                projectScope[resolvedKey] = newProjectScope;
              }
            }
          }
        }
      }
    } else if ( typeof(settingsScope) === 'string' ) {
      let varCopy:{scope?:{},project?:{},settings?:{},settingsScope?:{},[key:string]:any} = {};
      for(let key in variables){
        varCopy[key] = variables[key];
      }
      varCopy.scope = prevScope;
      var resolvedValue = SchemaHelper.resolveString( settingsScope, varCopy );
      if ( resolvedValue != undefined ) {
        projectScope = resolvedValue;
      }
    } else {
      projectScope = settingsScope;
    }
    return projectScope;
  }


}