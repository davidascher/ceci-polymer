var fs = require('fs');
var  HTML5 = require('html5');
var jsdom = require('jsdom');

var cssDir = process.argv[2];
console.log(cssDir);

var window = jsdom.jsdom(null, null, {parser: HTML5}).createWindow();

fs.readdir(__dirname, function (err, files) {
  files.forEach(function (htmlFilename, htmlFilenameIndex) {
    var parser = new HTML5.Parser({document: window.document});
    var htmlFilenameMatch = htmlFilename.match(/^([^\.]+).html$/);

    if (htmlFilenameMatch) {
      if (htmlFilename !== 'metronome.html') return;
      fs.readFile(__dirname + '/' + htmlFilename, 'utf8', function (htmlFileErr, htmlFileData) {
        if (htmlFileErr) {
          console.error('Couldn\'t read ' + htmlFilename);
          return;
        }

        parser.parse(htmlFileData);

        var polymerElement = window.document.querySelector('polymer-element');
        var ceciScript = polymerElement.querySelector('script[type="text/ceci"]');
        var ceciFn = new Function('Ceci', ceciScript.innerHTML);

        var friends = polymerElement.querySelector('friends');
        var thumbnail = polymerElement.querySelector('thumbnail');
        var tags = polymerElement.querySelector('tags');
        var description = polymerElement.querySelector('description');

        friends && polymerElement.removeChild(friends);
        thumbnail && polymerElement.removeChild(thumbnail);
        tags && polymerElement.removeChild(tags);
        description && polymerElement.removeChild(description);

        friends = friends ? friends.innerHTML : '';
        thumbnail = thumbnail ? thumbnail.innerHTML : htmlFilename;
        description = description ? description.innerHTML : htmlFilename;
        tags = tags ? tags.innerHTML : htmlFilename;

        friends = friends.split(',');
        tags = tags.split(',');

        thumbnail = thumbnail.replace(/\n/g, '').replace(/^\s+/g, '').replace(/\s+$/g, '');
        description = description.replace(/\n/g, '').replace(/^\s+/g, '').replace(/\s+$/g, '');

        function makeSpace (stuff, numSpaces) {
          var spacing = '                                      '.substr(0, numSpaces);
          return stuff.split('\n').map( function(line, index) {
            return (index > 0) ? spacing + line : line;
          }).join('\n');
        }

        function correctFunctionSpacing (functionString, extraSpacing) {
          var spacingCapture = 0;
          var lines = functionString.split('\n');

          extraSpacing = extraSpacing || '';

          return lines.map(function (line, index) {
            var currentSpacing = line.match(/^\s+/);

            if (currentSpacing) {
              currentSpacing = currentSpacing[0].length;
            }

            if (index === 1) {
              spacingCapture = currentSpacing;
            }
            if (index > 0) {
              return extraSpacing + line.replace(/^\s+/, '                 '.substring(0, currentSpacing - spacingCapture + 4));
            }
            else {
              return line;
            }
          }).join('\n');
        }

        function Ceci (whoCares, definition) {
          var editable = definition.editable || {};
          var listeners = definition.listeners || {};
          var broadcasts = definition.broadcasts || [];
          var defaultListeners = definition.defaultListener ? [definition.defaultListener] : [];
          var defaultBroadcasts = definition.defaultBroadcasts;

          var editableString = '{';
          var listenersString = '{';
          var extraFunctionsString = '';

          Object.keys(editable).forEach(function (editableKey) {
            var editableContents = editable[editableKey];
            editableString += '\n  ' + editableKey + ': {';
            Object.keys(editableContents).forEach(function (ecKey) {
              var value = editableContents[ecKey];
              if (ecKey === 'postset') {
                editableString += '\n    ' + ecKey + ': ' + correctFunctionSpacing(value.toString(), '  ');
              }
              else {
                editableString += '\n    ' + ecKey + ': ' + (typeof value === 'string' ? '"' + value + '"' : editableContents[ecKey]) + ',';
              }
            });
            editableString += '\n  },';
          });

          Object.keys(listeners).forEach(function (listenerKey) {
            var listenerFunction = listeners[listenerKey];
            listenersString += '\n  ' + listenerKey + ': ' + correctFunctionSpacing(listenerFunction.toString());
          });

          listenersString += '\n}';
          editableString += '\n}';

          var polymerScript = '\n' +
            '    Polymer("' + htmlFilenameMatch[1] + '", {\n' +
            '      ready: function () {\n' +
            '        this.ceci({\n' +
            '          broadcasts: ' + JSON.stringify(broadcasts) + ',\n' +
            '          defaultBroadcasts: ' + JSON.stringify(defaultBroadcasts) + ',\n' +
            '          defaultListeners: ' + JSON.stringify(defaultListeners) + ',\n' +
            '          editable: ' + makeSpace(editableString, 10) + ',\n' +
            '          listeners: ' + makeSpace(listenersString, 10) + ',\n' +
            '          friends: ' + JSON.stringify(friends) + ',\n' +
            '          thumbnail: "' + thumbnail + '",\n' +
            '          description: "' + description + '",\n' +
            '          tags: ' + JSON.stringify(tags) + '\n' +
            '        });\n' +
            '      },\n'+
            '      ' + extraFunctionsString + '\n' +
            '    });\n  ';

          ceciScript.innerHTML = polymerScript;
        }

        ceciFn(Ceci);

        ceciScript.removeAttribute('type');

        var template = polymerElement.querySelector('template');

        // fs.readFile(cssDir + '/app-' + htmlFilenameMatch[1] + '.css', 'utf8', function (cssErr, cssData) {
          
        // });

        template.insertBefore(styleElement, template.firstChild);

        // console.log(polymerElement.outerHTML);
      });
    }
  });
});