
import * as Handlebars from 'handlebars';
import { SchemaHelper } from "@maxxton/microdocs-core/helpers/schema/schema.helper";
import { Schema } from "@maxxton/microdocs-core/domain";

Handlebars.registerHelper( 'toUpperCase', function ( str: string ) {
  return str.toUpperCase();
} );
Handlebars.registerHelper( 'ifEq', function ( v1: any, v2: any, options: any ) {
  if ( v1 === v2 ) {
    return options.fn( this );
  }
  return options.inverse( this );
} );
Handlebars.registerHelper( 'ifEq', function ( v1: any, v2: any, options: any ) {
  if ( v1 === v2 ) {
    return options.fn( this );
  }
  return options.inverse( this );
} );
Handlebars.registerHelper( 'ifNotEmpty', function ( v1: any, options: any ) {
  if ( v1 ) {
    if ( typeof(v1) === 'string' ) {
      if ( v1.length > 0 ) {
        return options.fn( this );
      }
    } else if ( Array.isArray( v1 ) ) {
      if ( v1.length > 0 ) {
        return options.fn( this );
      }
    } else if ( typeof(v1) === 'object' ) {
      if ( Object.keys( v1 ).length > 0 ) {
        return options.fn( this );
      }
    } else {
      return options.fn( this );
    }
  }
  return options.inverse( this );
} );

Handlebars.registerHelper( 'schemaResolver', function ( schema: Schema, rootObject: {}, offset?: number ) {
  return asJson( SchemaHelper.resolveObject( schema, rootObject ), offset );
} );

Handlebars.registerHelper( 'schemaExample', function ( schema: Schema, rootObject: {}, offset?: number ) {
  const example = SchemaHelper.generateExample( schema, undefined, [], rootObject );
  console.info( example );
  return asJson( example, offset );
} );

const asJson = function ( object: any, offset?: number ) {
  let spaces = '';
  for ( let i = 0; i < offset; i++ ) {
    spaces += ' ';
  }
  const json = JSON.stringify( object, undefined, 4 );
  if ( json ) {
    return json.replace( /\n/g, '\n' + spaces );
  }
  return '';
};
Handlebars.registerHelper( 'asJson', asJson );

let lastPort = 51346;
Handlebars.registerHelper('randomPort', function () {
  return lastPort++;
});

Handlebars.registerHelper('resolveProjectVersion', function (projectNode: any) {
  return projectNode.resolve().version;
});
