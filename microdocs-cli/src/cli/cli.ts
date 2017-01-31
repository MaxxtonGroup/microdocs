#!/usr/bin/env node

import {Cli} from 'command-script';
var packageJson:any = require('../../package.json');

var cli = new Cli({
  packageJson: packageJson
});

cli.command(require('./cli.build'));
cli.command(require('./cli.check'));
cli.command(require('./cli.login'));

cli.command('help')
    .description('Show help')
    .order(2000)
    .action(() => {
      cli.showHelp();
    });

cli.run(process.argv.splice(2));