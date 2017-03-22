Package.describe({
  name: 'aosman:tabulate',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
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
  api.use("materialize:materialize");
  api.use("manuel:viewmodel")
  api.use("fourseven:scss")

  api.addFiles(['client/index.js'], ['client']);
  // api.addFiles(['server/index.js'], ['server']);
  api.mainModule('tabulate.js');
});
