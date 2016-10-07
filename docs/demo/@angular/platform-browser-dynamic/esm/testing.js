/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DirectiveResolver, ViewResolver } from '@angular/compiler';
import { MockDirectiveResolver, MockViewResolver, OverridingTestComponentBuilder } from '@angular/compiler/testing';
import { TestComponentBuilder, TestComponentRenderer } from '@angular/core/testing';
import { TEST_BROWSER_APPLICATION_PROVIDERS, TEST_BROWSER_PLATFORM_PROVIDERS } from '@angular/platform-browser/testing';
import { BROWSER_APP_COMPILER_PROVIDERS } from './index';
import { DOMTestComponentRenderer } from './testing/dom_test_component_renderer';
export * from './private_export_testing';
/**
 * Default platform providers for testing.
 *
 * @stable
 */
export const TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS = [TEST_BROWSER_PLATFORM_PROVIDERS];
/**
 * Default application providers for testing.
 *
 * @stable
 */
export const TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS = [
    TEST_BROWSER_APPLICATION_PROVIDERS, BROWSER_APP_COMPILER_PROVIDERS,
    [
        { provide: TestComponentBuilder, useClass: OverridingTestComponentBuilder },
        { provide: DirectiveResolver, useClass: MockDirectiveResolver },
        { provide: ViewResolver, useClass: MockViewResolver },
        { provide: TestComponentRenderer, useClass: DOMTestComponentRenderer },
    ]
];
//# sourceMappingURL=testing.js.map