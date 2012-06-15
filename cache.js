/* This file is based on the excellent tutorial by Ben Nadel
 * http://www.bennadel.com/blog/2029-Using-HTML5-Offline-Application-Cache-Events-In-Javascript.htm */
var Cache = {
  filesDownloaded: 0,
  totalFiles: 0,
  getTotalFiles: function () {
    this.filesDownloaded = 0;
    this.totalFiles = 0;
    
    var that = this;
    $.ajax({
      type: 'GET',
      url: './cache.manifest',
      dataType: 'text',
      cache: false,
      success: function (content) {
        // Strip out non-cache sections
        content = content.replace(
          /(NETWORK|FALLBACK):((?!(NETWORK|FALLBACK|CACHE):)[\w\W]*)/gi, '');
        
        // Strip out all comments
        content = content.replace(/#.+/g, '');
        
        // Strip out the cache manifest header and trailing slashes
        content = content.replace(/CACHE MANIFEST/g, '');
        
        // Strip out extra line breaks, replace with a hash sign we can break on
        content = content.trim().replace(/[\r\n]+/g, '#');
        
        // Get the total number of files.  The index is implied, so it's not
        // in the cache manifest
        that.totalFiles = content.split('#').length + 1;
        console.log("I think there's " + that.totalFiles + ' files.');
      },
      error: function () {
        console.log('Ajax Failure');
      }
    });
  }
}