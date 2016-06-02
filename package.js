Package.describe({
  name: 'trombonehq:trombone',
  version: '0.0.17',
  // Brief, one-line summary of the package.
  summary: 'Trombone - A hassle free user account / accounts management admin panel for Meteor',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/trombonehq/trombone.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md',
  // prodOnly: true
});

Package.onUse(function (api) {
  api.versionsFrom('1.3');
  api.use('ecmascript');
  api.use('check');
  api.use('ddp');
  api.use('alanning:roles@1.2.14');
  api.use('accounts-password');

  api.export('Trombone', 'server');
  api.mainModule('trombone.js', 'server');
});

Package.onTest(function (api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('trombonehq:trombone');
  api.addFiles('trombone-tests.js');
});
