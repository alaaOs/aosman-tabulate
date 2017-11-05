Package.describe({
  name: 'aosman:tabulate',
  version: '0.0.11',
  // Brief, one-line summary of the package.
  summary: 'Meteor Package that creates a reactive table from any given mongo collection',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/alaaOs/aosman-tabulate',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.4.1');
  api.use('ecmascript');
  api.use('templating');
  api.use('jquery');
  api.use("underscore");
  api.use("materialize:materialize@0.98.0");
  api.use("manuel:viewmodel@6.2.1")
  api.use("tmeasday:publish-counts@0.8.0")

  api.addFiles(['client/index.js'], ['client']);
  api.mainModule('tabulate.js');
});
