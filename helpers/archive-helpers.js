var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var Promise = require('bluebird');
var request = require('request');
var fsAsync = Promise.promisifyAll(fs);

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

//TODO:
// exports.readListOfUrls = function() {
//   //      1) should read urls from sites.txt
//   return new Promise(function(resolve, reject) {
//     fsAsync.readFileAsync(this.paths.list)
//     .then(function(data) {
//       var fileString = '';
//       fileString += data;
//       var sitesArray = fileString.split('\n');
//       resolve(sitesArray);
//     }).catch(function(err) {
//       reject(err);
//     });
//   });
// };

// exports.readListOfUrls = function(cb) {
//   var context = this;
//   return new Promise(function(resolve, reject) {
//     fsAsync.readFileAsync(context.paths.list)
//       .then(function(data) {
//         var fileString = '';
//         fileString += data;
//         resolve(sitesArray = fileString.split('\n'));
//       }).then(function(array) {
//         console.log('in resolve',resolve, array, cb);
//         cb(array);
//         resolve(array);
//       }).catch(function(err) {
//         console.log('in catch');
//         reject(err);
//       });
      // .catch(function(err) {
      //   console.log('failed fsAsync', err);
      //   cb(err);
      // });

exports.readListOfUrls = Promise.promisify(function(cb) {
  var context = this;
  fsAsync.readFileAsync(context.paths.list)
    .then(function(data) {
      var fileString = '';
      fileString += data;
      var sitesArray = fileString.split('\n');
      cb(null, sitesArray);
    }).catch(function(err) {
      console.log('failed readListOfUrls');
      cb(null);
    });
});

exports.isUrlInList = Promise.promisify(function(url, cb) {
  this.readListOfUrls()
    .then(function(array) {
      // console.log('in then', array)
      // console.log('in isUrlINlist array', array, 'url', url)
      // cb(null, array.indexOf(url) !== -1, url);
      if (array.indexOf(url) === -1) {
        throw new Error();
        // cb(new Error('site not in list'), false, null);
      } else {
        cb(null, true, url);
      }
    }).catch(function(err) {
      console.log('failed isUrlInList', err);
      cb(err);
    });
});

exports.addUrlToList = Promise.promisify(function(url, cb) {
  //      1) should add a url to the list
  fsAsync.appendFileAsync(this.paths.list, url + '\n')
    .then(function() {
      cb(null);
    })
    .catch(function(err) {
      console.log('failed addUrlToList');
      cb(new Error(err));
    });
});

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
