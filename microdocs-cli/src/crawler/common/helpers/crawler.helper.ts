import {ContainerReflection, ReferenceType, DeclarationReflection} from "@maxxton/typedoc/dist/lib/models";

/**
 * Check if the instance has a parent with that name
 * @param instance
 * @param baseName
 * @returns {boolean}
 */
export function isSubClassOf(instance: ContainerReflection, baseName: string, instanceStore:string[] = []): boolean {
  var declaration = instance as DeclarationReflection;
  if (declaration) {
    // check super classes
    if (declaration.extendedTypes) {
      for (var i = 0; i < declaration.extendedTypes.length; i++) {
        var superClass = declaration.extendedTypes[i] as ReferenceType;
        if (superClass.name === baseName) {
          return true;
        } else if (superClass.reflection && isInstanceOf(superClass.reflection as ContainerReflection, baseName, instanceStore)) {
          return true;
        }
      }
    }

    // check interfaces
    if (declaration.implementedTypes) {
      for (var i = 0; i < declaration.implementedTypes.length; i++) {
        var iface = declaration.implementedTypes[i] as ReferenceType;
        if (iface.name === baseName) {
          return true;
        } else if (iface.reflection && isInstanceOf(iface.reflection as ContainerReflection, baseName, instanceStore)) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Check if the instance has a parent or itself with that name
 * @param instance
 * @param baseName
 * @returns {boolean}
 */
export function isInstanceOf(instance: ContainerReflection, baseName: string, instanceStore:string[] = []): boolean {
  if (instance.name === baseName) {
    return true;
  }
  if(instanceStore.indexOf(instance.name) > -1) {
    return false;
  }else{
    instanceStore.push( instance.name );
    return isSubClassOf( instance, baseName, instanceStore );
  }
}

/**
 * Check if the instance or parents has a decorator with that name
 * @param instance
 * @param decoratorName
 * @returns {boolean}
 */
export function hasDecorator(instance: ContainerReflection, decoratorName: string, instanceStore:string[] = []): boolean {
  if(instanceStore.indexOf(instance.name) > -1) {
    return false;
  }
  instanceStore.push( instance.name );

  if (instance.decorators) {
    for (var i = 0; i < instance.decorators.length; i++) {
      if (instance.decorators[i].name == decoratorName) {
        return true;
      }
    }
  }

  var declaration = instance as DeclarationReflection;
  if (declaration) {
    // check super classes
    if (declaration.extendedTypes) {
      for (var i = 0; i < declaration.extendedTypes.length; i++) {
        var superClass = declaration.extendedTypes[i] as ReferenceType;
        if (superClass.reflection && hasDecorator(superClass.reflection as ContainerReflection, decoratorName, instanceStore)) {
          return true;
        }
      }
    }

    // check interfaces
    if (declaration.implementedTypes) {
      for (var i = 0; i < declaration.implementedTypes.length; i++) {
        var iface = declaration.implementedTypes[i] as ReferenceType;
        if (iface.reflection && hasDecorator(iface.reflection as ContainerReflection, decoratorName, instanceStore)) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Evaluate argument as string
 * @param arg argument as string
 * @returns {any}
 */
export function evalArgument(arg: string) {
  try {
    return eval("(" + arg + ")");
  }catch(e){
    console.warn(e);
  }
}