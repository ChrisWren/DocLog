var fs = require('fs');
require('should');
var spawn = require('child_process').spawn;

describe('When the theme is built', function () {

  before(function (done) {
    var buildProcess = spawn('grunt', ['build']);
    buildProcess.stdout.on('close', function () {
      done();
    });
  });

  it('it creates posts in the expected location', function() {
    fs.existsSync('dist/index.html').should.be.ok;
    fs.existsSync('dist/Tests.html').should.be.ok;
  });
});
