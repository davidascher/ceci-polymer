var fs = require('fs');

fs.readdir(__dirname, function (err, files) {
  files.forEach(function (cssFilename, cssFilenameIndex) {
    // if (cssFilename.indexOf('counter') === -1) return;
    var cssFilenameMatch = cssFilename.match(/^app-([^\.]+).css$/);
    if (cssFilenameMatch) {
      fs.readFile(__dirname + '/' + cssFilename, 'utf8', function (cssFileErr, cssFileData) {
        if (!cssFileErr) {
          cssFileData = cssFileData.toString();
          var htmlFileName = cssFilenameMatch[1] + '.html';
          fs.readFile(__dirname + '/' + htmlFileName, 'utf8', function (htmlFileErr, htmlFileData) {
            if (htmlFileErr) {
              console.log('Couldn\'t read ' + htmlFileName);
              return;
            }
            htmlFileData = htmlFileData.toString();
            var templateMatch = htmlFileData.match(/<template>(\s+)/);
            var spacing = templateMatch[1];
            var start = templateMatch.index + templateMatch[0].length;

            spacing = spacing.replace('\n', '');
            var indentedSpacing = spacing + '  ';

            // indentedSpacing = indentedSpacing.replace(/ /g, '%')

            var splitCssFileData = cssFileData.split('\n');
            cssFileData = '<style>\n' +
              splitCssFileData.slice(0, splitCssFileData.length - 1).map(function (line) {
                return line.length > 0 ? indentedSpacing + line : '';
              }).join('\n') +
              '\n' + spacing + '</style>';

            htmlFileData = htmlFileData.substring(0, start) + cssFileData + '\n' + htmlFileData.substring(start);

            var oldStylesheetRegexp = new RegExp('<link rel="stylesheet" href="\{\{ASSET_HOST\}\}.*' + cssFilename + '"\s*/?\s*>(</link>)?');

            htmlFileData = htmlFileData.replace(oldStylesheetRegexp, '');

            // console.log(cssFileData);

            fs.writeFile(__dirname + '/' + htmlFileName, htmlFileData);
          });
        }
      });
    }
  });
});