#!/usr/bin/env node
var app = require('./app');
var pkg = require('./package.json');

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  console.log(pkg.name, 'listening on port ', server.address().port);
});


process.on("unhandledRejection", err => {
  console.log(`An error occurred: ${err.message}`);
  server.close(() => process.exit(1));
});