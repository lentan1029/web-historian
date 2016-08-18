var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if (req.method === 'GET') {
    if (req.url === '/') {
      fs.readFile(archive.paths.siteAssets + '/index.html', function(err, data) {
        res.end(data);
      });
    } else {
      var path = archive.paths.archivedSites + req.url;
      fs.readFile(path, function(err, data) {
        if (err) {
          if (err.errno === -2) {
            res.writeHead(404);
            res.end('File not found');
          } else {
            console.log(err);
          }
        }
        res.end(data);
      });
    }
  } else if (req.method === 'POST') {
    var data = '';
    req.on('data', function(chunk) {
      data += chunk;
    }).on('end', function() {
      fs.appendFile(archive.paths.list, data.slice(4) + '\n', function(err, data) {
        res.writeHead(302);
        res.end('posted');
      });
    });
  }
};