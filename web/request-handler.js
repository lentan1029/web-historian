var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
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
    var inputURL = '';
    req.on('data', function(chunk) {
      inputURL += chunk;
    }).on('end', function() {
      archive.isUrlArchived(inputURL.slice(4), function(exists, url) {
        if (exists) {
          console.log('file exists');
          fs.readFile(archive.paths.archivedSites + '/' + url, function(err, data) {
            res.writeHead(302, helpers.headers);
            res.end(data);
          });
        } else {
          console.log('file does not exist');
          fs.readFile(archive.paths.siteAssets + '/loading.html', function(err, data) {
            res.writeHead(302, helpers.headers);
            res.end(data);
          });
          // console.log('inputurl', inputUrl);
          archive.isUrlInList(inputURL.slice(4))
            .then(function(exists, url) {
              console.log('in','url', url,'exists', exists);
              if (!exists && url.length < 40) { //TODO: have a *real* URL validator
                archive.addUrlToList(url, function() {
                  console.log('URL was added to the list.');
                });
              }
            });
        }
      });
    });
  }
};
