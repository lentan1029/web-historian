// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

var helpers = require('../helpers/archive-helpers');
var fs = require('fs');

var download = function() {
  //get entire list 
  //run isarchived
  //if not archived, push into array
  //if not archived, then run download func
  helpers.readListOfUrls(function(sitesArray) {
    var counter = 0;
    for (var i = 0; i < sitesArray.length; i++) {
      var notArchivedArr = [];
      helpers.isUrlArchived(sitesArray[i], function(exists, url) {
        if (!exists && url !== '') {
          notArchivedArr.push(url);
        }
        counter++;
        if (counter === sitesArray.length) {
          console.log(notArchivedArr);
          helpers.downloadUrls(notArchivedArr);
        }
      });
    }
  });
};

download();