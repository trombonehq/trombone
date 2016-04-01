Package.describe({
  name: 'trombonehq:trombone',
  version: '0.0.8',
  // Brief, one-line summary of the package.
  summary: 'Trombone - Hassle free user account management for Meteor',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/trombonehq/trombone.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
  //prodOnly: true
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  //api.use('ecmascript');
  api.use('ddp');
  api.use('alanning:roles@1.2.14');
  api.use('accounts-password');

  api.addFiles('trombone.js', 'server');

  api.addFiles('lib/methods.js', 'server');
  api.export('addMethods', 'server');

  api.addFiles('lib/account.js', 'server');
  api.export('setupAccount', 'server');

  api.addFiles('lib/analytics.js', 'server');
  api.export('setupAnalytics', 'server');

  api.addFiles('lib/publications.js', 'server');
  api.export('configurePublications', 'server');

  api.export('Roles', 'server');
  api.export('Trombone', 'server');

});

Package.onTest(function(api) {
  //api.use('ecmascript');
  api.use('tinytest');
  api.use('trombonehq:trombone');
  api.addFiles('trombone-tests.js');
});
