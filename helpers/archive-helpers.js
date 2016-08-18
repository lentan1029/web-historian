var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(cb) {
  //      1) should read urls from sites.txt
  fs.readFile(this.paths.list, function(err, data) {
    var fileString = '';
    fileString += data;
    var sitesArray = fileString.split('\n');
    cb(sitesArray);
  });
};

exports.isUrlInList = function(url, cb) {
  this.readListOfUrls( function(array) {
    cb(array.indexOf(url) !== -1);
  });
};

exports.addUrlToList = function(url, cb) {
  //      1) should add a url to the list
  fs.appendFile(this.paths.list, url + '\n', function(err) {
    cb();
  });
};

exports.isUrlArchived = function(url, cb) {
  fs.readFile(this.paths.archivedSites + '/' + url, function(err, data) {
    if (err) {
      cb(false, url);
    } else {
      cb(true, url);
    }
  });
};

exports.downloadUrls = function(urlArray) {
  for (var i = 0; i < urlArray.length; i++) {
    this.isUrlArchived(urlArray[i], function(exists, url) {
      if (!exists) {
        fs.writeFile(this.paths.archivedSites + '/' + url, '');
        // console.log(url);
        request.get('http://' + url).pipe(fs.createWriteStream(this.paths.archivedSites + '/' + url));
      }
    }.bind(this));
  }
};
