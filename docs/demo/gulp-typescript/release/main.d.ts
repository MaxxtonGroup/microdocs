/// <reference path="../typings/tsd.d.ts" />
import * as ts from 'typescript';
import * as _project from './project';
import * as _reporter from './reporter';
declare function compile(): compile.CompileStream;
declare function compile(proj: _project.Project, theReporter?: _reporter.Reporter): compile.CompileStream;
declare function compile(settings: compile.Settings, theReporter?: _reporter.Reporter): compile.CompileStream;
declare module compile {
    interface Settings {
        out?: string;
        outFile?: string;
        outDir?: string;
        allowNonTsExtensions?: boolean;
        charset?: string;
        codepage?: number;
        declaration?: boolean;
        locale?: string;
        mapRoot?: string;
        noEmitOnError?: boolean;
        noImplicitAny?: boolean;
        noLib?: boolean;
        noLibCheck?: boolean;
        noResolve?: boolean;
        preserveConstEnums?: boolean;
        removeComments?: boolean;
        suppressImplicitAnyIndexErrors?: boolean;
        target?: string | ts.ScriptTarget;
        module?: string | ts.ModuleKind;
        moduleResolution?: string | number;
        jsx?: string | number;
        declarationFiles?: boolean;
        noExternalResolve?: boolean;
        sortOutput?: boolean;
        typescript?: typeof ts;
        isolatedModules?: boolean;
        rootDir?: string;
        sourceRoot?: string;
    }
    type Project = _project.Project;
    type CompileStream = _project.ICompileStream;
    export import reporter = _reporter;
    function createProject(settings?: Settings): any;
    function createProject(tsConfigFileName: string, settings?: Settings): any;
    function filter(...args: any[]): void;
}
export = compile;
