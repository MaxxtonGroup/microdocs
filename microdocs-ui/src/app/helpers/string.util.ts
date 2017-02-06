export class StringUtil {

  public static getColorCodeFromString( string: string ) {
    let colorRanges   = {
      'pink': [ 'a', 'b' ],
      'red': [ 'c', 'd' ],
      'orange': [ 'e', 'f' ],
      'amber': [ 'g', 'h' ],
      'yellow': [ 'i', 'j' ],
      'lime': [ 'k', 'l' ],
      'green': [ 'm', 'n' ],
      'teal': [ 'o', 'p' ],
      'cyan': [ 'q', 'r' ],
      'light-blue': [ 's', 't' ],
      'blue': [ 'u', 'v' ],
      'indigo': [ 'w', 'x' ],
      'purple': [ 'y', 'z' ]
    };
    let first         = string.substr( 0, 1 ).toLowerCase();
    let selectedColor = "amber";

    Object.keys( colorRanges ).forEach( function ( color ) {
      colorRanges[ color ].forEach( ( char: string ) => {
        if ( char == first ) {
          selectedColor = color;
        }
      } )
    } );
    return selectedColor;
  }

}
