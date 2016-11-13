
import * as Handlebars from 'handlebars';
import { SchemaHelper } from "@maxxton/microdocs-core/helpers/schema/schema.helper";
import { Schema } from "@maxxton/microdocs-core/domain";

Handlebars.registerHelper( 'toUpperCase', function ( str ) {
  return str.toUpperCase();
} );
Handlebars.registerHelper( 'ifEq', function ( v1, v2, options ) {
  if ( v1 === v2 ) {
    return options.fn( this );
  }
  return options.inverse( this );
} );
Handlebars.registerHelper( 'ifEq', function ( v1, v2, options ) {
  if ( v1 === v2 ) {
    return options.fn( this );
  }
  return options.inverse( this );
} );
Handlebars.registerHelper( 'ifNotEmpty', function ( v1, options ) {
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

Handlebars.registerHelper( 'schemaResolver', function ( schema:Schema, rootObject:{}, offset?:number ) {
  return asJson( SchemaHelper.resolveObject( schema, rootObject ), offset );
} );

Handlebars.registerHelper( 'schemaExample', function ( schema:Schema, rootObject:{}, offset?:number ) {
  var example = SchemaHelper.generateExample( schema, undefined, [], rootObject );
  console.info( example );
  return asJson( example, offset );
} );

var asJson = function ( object:any, offset?:number ) {
  var spaces = '';
  for ( var i = 0; i < offset; i++ ) {
    spaces += ' ';
  }
  var json = JSON.stringify( object, undefined, 4 );
  if ( json ) {
    return json.replace( /\n/g, '\n' + spaces );
  }
  return '';
};
Handlebars.registerHelper( 'asJson', asJson );

var lastPort = 51346;
Handlebars.registerHelper('randomPort', function () {
  return lastPort++;
});

Handlebars.registerHelper('resolveProjectVersion', function (projectNode) {
  return projectNode.resolve().version;
});