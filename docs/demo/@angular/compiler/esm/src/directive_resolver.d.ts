/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DirectiveMetadata } from '@angular/core';
import { ReflectorReader } from '../core_private';
import { Type } from '../src/facade/lang';
export declare class DirectiveResolver {
    private _reflector;
    constructor(_reflector?: ReflectorReader);
    /**
     * Return {@link DirectiveMetadata} for a given `Type`.
     */
    resolve(type: Type): DirectiveMetadata;
    private _mergeWithPropertyMetadata(dm, propertyMetadata, directiveType);
    private _merge(dm, inputs, outputs, host, queries, directiveType);
}
export declare var CODEGEN_DIRECTIVE_RESOLVER: DirectiveResolver;
