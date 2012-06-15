/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

function require_fail_handler (package_name) {
  console.log('Error: This example requires the ' + package_name +
    ' package. Please run:');
  console.log('npm install ' + package_name);
  process.exit(1);
}

try {
  var express = require('express');
} catch (err) {
  require_fail_handler('express');
}
var app = express.createServer();

try {
  var Verifier = require('receiptverifier').receipts.Verifier;
} catch (err) {
  require_fail_handler('receiptverifier');
}


/* This block is needed to parse the HTTP POST body.  It also needs to go
 * before any routes are defined! */
app.configure(function () {
  app.use(express.bodyParser());
});

function isEmpty (obj) {
  return Object.keys(obj).length === 0;
}

app.post('/', function (req, res) {
  /* Here we set the console.log function to be used for logging.
   * Remove the options hash from the constructor if this added logging is 
   * unnecessary.  Or you could have your custom logging function to write to
   * files. */
  var myVerifier = new Verifier({ onlog: console.log });

  myVerifier.verifyReceipts(req.body, function (verifier) {
    verifier.app = req.body;
    
    // Log the verifier object after verification.
    console.log(verifier);
    if (verifier.state.toString() === '[OK]' && isEmpty(verifier.receiptErrors)) {
      console.log('Verification success!');
      res.send('{ receiptState: ' + verifier.state.toString() + '}',
        {'Content-Type': 'application/json'}, 200);
    } else {
      console.log('Verification failure!');
      res.send('{ receiptState: ' + verifier.state.toString() + '}',
        {'Content-Type': 'application/json'}, 400);
    }
  });
});

var content_types = {
  html: 'text/html',
  css: 'text/css',
  js: 'application/javascript',
  webapp: 'application/x-web-app-manifest+json',
  png: 'image/png',
  gif: 'image/gif',
  jpg: 'image/jpeg',
  ico: 'image/x-icon',
  manifest: 'text/cache-manifest'
}
/* Here we can use express to serve files as well.  Note how you must set the
 * content type to 'application/x-web-app-manifest+json' for webapp
 * manifests! */
app.get('/:filename', function (req, res, next) {
  res.contentType(content_types[req.params.filename.split('.')[1]]);
  res.sendfile(req.params.filename);
  console.log('Serving: ' + req.params.filename);
});
app.get('/', function (req, res) {
  res.sendfile('index.html');
});

app.listen(3000);
console.log('server running on port 3000');