import {ContainerReflection, ReferenceType, DeclarationReflection} from "typedoc/lib/models";

export function isSubClassOf(instance: ContainerReflection, base: string): boolean {
  var declaration = instance as DeclarationReflection;
  if (declaration) {
    // check super classes
    if (declaration.extendedTypes) {
      for (var i = 0; i < declaration.extendedTypes.length; i++) {
        var superClass = declaration.extendedTypes[i] as ReferenceType;
        if (superClass.name === base) {
          return true;
        } else if (superClass.reflection && isInstanceOf(superClass.reflection as ContainerReflection, base)) {
          return true;
        }
      }
    }

    // check interfaces
    if (declaration.implementedTypes) {
      for (var i = 0; i < declaration.implementedTypes.length; i++) {
        var iface = declaration.implementedTypes[i] as ReferenceType;
        if (iface.name === base) {
          return true;
        } else if (iface.reflection && isInstanceOf(iface.reflection as ContainerReflection, base)) {
          return true;
        }
      }
    }
  }

  return false;
}

export function isInstanceOf(instance: ContainerReflection, base: string): boolean {
  if (instance.name === base) {
    return true;
  }

  return isSubClassOf(instance, base);
}