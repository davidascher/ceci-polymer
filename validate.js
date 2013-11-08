var sys = require('sys');
var child_process = require('child_process');
var fs = require('fs');

function checkElement (elementXMLData) {

}

function findAndCheckTags (tagName, xmlData) {
  while (true) {
    var startIndex = xmlData.search(new RegExp('<' + tagName + '/?\s*>');
    var endIndex = xmlData.indexOf('</' + tagName + '>', )
    break;
  }
}

function checkApp (appXMLData) {
  var child = child_process.spawn('xmllint', ['--schema', 'ceci-app.xsd', '-']);

  child.stdout.on('data', function (data) {
  });

  var errorData = '';
  child.stderr.on('data', function (data) {
    errorData += data.toString();
  });

  child.stdin.write(inputXMLData);
  child.stdin.end();

  child.on('exit', function (e) {
    var errorLines = errorData.split('\n');
    console.log(errorLines.length);

    errorLines.forEach(function (errorLine) {
      var match = errorLine.match(/^-:\d+: element ([^:]+)/);
      if (match) {
        var tagName = match[1];
        if (tagName.indexOf('ceci-') === 0) {
          findAndCheckTags(tagName, appXMLData);
        }
      }
      else if (errorLine !== '- fails to validate' && errorLine.length > 0) {
        console.error('unknown error: ' + errorLine, errorLine.length);
      }
    });
  });
}

checkApp(fs.readFileSync('ceci-app-test.html', 'utf8'));
