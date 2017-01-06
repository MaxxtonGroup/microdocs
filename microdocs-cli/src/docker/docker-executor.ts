import { exec, ExecOptions, ChildProcess } from "child_process";

export function dockerComposeUp( options: DockerComposeUpOptions, callback?: ( error: Error, stdout: string, stderr: string ) => void ): ChildProcess {
  var execOptions: ExecOptions = {
    cwd: options.cwd,
    env: options.buildArgs
  };
  var cmd = 'docker-compose';
  if(options.composeFiles){
    options.composeFiles.forEach(composeFile => {
      cmd += ' -f "' + composeFile + '"';
    });
  }
  if(options.projectName){
    cmd += ' -p "' + options.projectName + '"';
  }
  cmd += ' up';
  if(options.detached){
    cmd += ' -d';
  }
  if(options.forceBuild){
    cmd += ' --build';
  }
  if(options.cleanOrphans){
    cmd += ' --remove-orphans';
  }
  console.info('exec: ' + cmd);
  return exec( cmd, execOptions, callback );
}

export interface DockerComposeUpOptions {

  projectName?:string;
  cwd?:string;
  detached?: boolean;
  forceBuild?: boolean;
  cleanOrphans?: boolean;
  buildArgs?: {[key: string]: string};
  composeFiles?:string[];

}

export function dockerComposeDown( options: DockerComposeDownOptions, callback?: ( error: Error, stdout: string, stderr: string ) => void ): ChildProcess {
  var execOptions: ExecOptions = {
    cwd: options.cwd
  };
  var cmd = 'docker-compose';
  if(options.composeFiles){
    options.composeFiles.forEach(composeFile => {
      cmd += ' -f "' + composeFile + '"';
    });
  }
  cmd += ' down';
  if(options.removeVolume){
    cmd += ' -v';
  }
  if(options.cleanOrphans){
    cmd += ' --remove-orphans';
  }
  console.info('exec: ' + cmd);
  return exec( cmd, execOptions, callback );
}

export interface DockerComposeDownOptions {
  cwd?:string;
  removeVolume?: boolean;
  composeFiles?:string[];
  cleanOrphans?: boolean;

}

export function dockerComposePs(options: DockerComposePsOptions, callback?: ( error: Error, stdout: string, stderr: string ) => void ): ChildProcess {
  var execOptions: ExecOptions = {
    cwd: options.cwd
  };
  let cmd = 'docker-compose ps';
  console.info('exec: ' + cmd);
  return exec( cmd, execOptions, callback );
}
export interface DockerComposePsOptions {
  cwd?:string;
}