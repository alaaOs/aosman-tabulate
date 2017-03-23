// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by tabulate.js.
import { name as packageName } from "meteor/tabulate";

// Write your tests here!
// Here is an example.
Tinytest.add('tabulate - example', function (test) {
  test.equal(packageName, "tabulate");
});
