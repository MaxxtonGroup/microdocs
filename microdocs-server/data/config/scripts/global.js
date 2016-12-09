module.exports.default = {
  dependencies: {
    '{dependencyTitle}': {
      paths: {
        '{path}': {
          '{method}': {
            '~~~IF': {
              condition: ($) => $.scope && $.scope.parameters && $.scope.parameters.filter((param) => param.name === 'field').length > 0,
              'then': ($) => {
                $.scope.responses = {};
                console.info('match: ' + JSON.stringify($.scope));
              },
              'else': ($) => {
                console.info('no match: ' + JSON.stringify($.scope));
              }
            }
          }
        }
      }
    }
  }
};