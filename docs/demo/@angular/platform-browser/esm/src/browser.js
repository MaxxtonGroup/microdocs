/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FORM_PROVIDERS, PlatformLocation } from '@angular/common';
import { APPLICATION_COMMON_PROVIDERS, ExceptionHandler, OpaqueToken, PLATFORM_COMMON_PROVIDERS, PLATFORM_INITIALIZER, ReflectiveInjector, RootRenderer, Testability, assertPlatform, createPlatform, getPlatform } from '@angular/core';
import { AnimationDriver, NoOpAnimationDriver, SanitizationService, wtfInit } from '../core_private';
import { WebAnimationsDriver } from '../src/dom/web_animations_driver';
import { BrowserDomAdapter } from './browser/browser_adapter';
import { BrowserPlatformLocation } from './browser/location/browser_platform_location';
import { BrowserGetTestability } from './browser/testability';
import { ELEMENT_PROBE_PROVIDERS } from './dom/debug/ng_probe';
import { getDOM } from './dom/dom_adapter';
import { DomRootRenderer, DomRootRenderer_ } from './dom/dom_renderer';
import { DOCUMENT } from './dom/dom_tokens';
import { DomEventsPlugin } from './dom/events/dom_events';
import { EVENT_MANAGER_PLUGINS, EventManager } from './dom/events/event_manager';
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerGesturesPlugin } from './dom/events/hammer_gestures';
import { KeyEventsPlugin } from './dom/events/key_events';
import { DomSharedStylesHost, SharedStylesHost } from './dom/shared_styles_host';
import { isBlank } from './facade/lang';
import { DomSanitizationService, DomSanitizationServiceImpl } from './security/dom_sanitization_service';
const BROWSER_PLATFORM_MARKER = new OpaqueToken('BrowserPlatformMarker');
/**
 * A set of providers to initialize the Angular platform in a web browser.
 *
 * Used automatically by `bootstrap`, or can be passed to {@link platform}.
 *
 * @experimental API related to bootstrapping are still under review.
 */
export const BROWSER_PLATFORM_PROVIDERS = [
    { provide: BROWSER_PLATFORM_MARKER, useValue: true }, PLATFORM_COMMON_PROVIDERS,
    { provide: PLATFORM_INITIALIZER, useValue: initDomAdapter, multi: true },
    { provide: PlatformLocation, useClass: BrowserPlatformLocation }
];
/**
 * @security Replacing built-in sanitization providers exposes the application to XSS risks.
 * Attacker-controlled data introduced by an unsanitized provider could expose your
 * application to XSS risks. For more detail, see the [Security Guide](http://g.co/ng/security).
 * @experimental
 */
export const BROWSER_SANITIZATION_PROVIDERS = [
    { provide: SanitizationService, useExisting: DomSanitizationService },
    { provide: DomSanitizationService, useClass: DomSanitizationServiceImpl },
];
/**
 * A set of providers to initialize an Angular application in a web browser.
 *
 * Used automatically by `bootstrap`, or can be passed to {@link PlatformRef.application}.
 *
 * @experimental API related to bootstrapping are still under review.
 */
export const BROWSER_APP_PROVIDERS = [
    APPLICATION_COMMON_PROVIDERS, FORM_PROVIDERS, BROWSER_SANITIZATION_PROVIDERS,
    { provide: ExceptionHandler, useFactory: _exceptionHandler, deps: [] },
    { provide: DOCUMENT, useFactory: _document, deps: [] },
    { provide: EVENT_MANAGER_PLUGINS, useClass: DomEventsPlugin, multi: true },
    { provide: EVENT_MANAGER_PLUGINS, useClass: KeyEventsPlugin, multi: true },
    { provide: EVENT_MANAGER_PLUGINS, useClass: HammerGesturesPlugin, multi: true },
    { provide: HAMMER_GESTURE_CONFIG, useClass: HammerGestureConfig },
    { provide: DomRootRenderer, useClass: DomRootRenderer_ },
    { provide: RootRenderer, useExisting: DomRootRenderer },
    { provide: SharedStylesHost, useExisting: DomSharedStylesHost },
    { provide: AnimationDriver, useFactory: _resolveDefaultAnimationDriver }, DomSharedStylesHost,
    Testability, EventManager, ELEMENT_PROBE_PROVIDERS
];
/**
 * @experimental API related to bootstrapping are still under review.
 */
export function browserPlatform() {
    if (isBlank(getPlatform())) {
        createPlatform(ReflectiveInjector.resolveAndCreate(BROWSER_PLATFORM_PROVIDERS));
    }
    return assertPlatform(BROWSER_PLATFORM_MARKER);
}
function initDomAdapter() {
    BrowserDomAdapter.makeCurrent();
    wtfInit();
    BrowserGetTestability.init();
}
function _exceptionHandler() {
    return new ExceptionHandler(getDOM());
}
function _document() {
    return getDOM().defaultDoc();
}
function _resolveDefaultAnimationDriver() {
    if (getDOM().supportsWebAnimation()) {
        return new WebAnimationsDriver();
    }
    return new NoOpAnimationDriver();
}
//# sourceMappingURL=browser.js.map