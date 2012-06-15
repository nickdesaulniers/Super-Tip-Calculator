// This code based on excellent code from:
// http://www.html5rocks.com/en/mobile/workingoffthegrid/
// https://github.com/blog/467-smart-js-polling
var Connectivity = {
  fireEvent: function (name, data) {
    var e = document.createEvent("Event");
    e.initEvent(name, true, true);
    e.data = data;
    window.dispatchEvent(e);
  },
  checkConnection: function (url, timeout) {
    timeout = timeout != null ? timeout : 5000;
    var xhr = new XMLHttpRequest();
    var that = this;
    
    var noResponseTimer = setTimeout(function () {
      xhr.abort();
      that.fireEvent('connection_timeout', {});
    }, timeout);
    
    xhr.onreadystatechange = function () {
      if (xhr.readyState != 4) return;
      clearTimeout(noResponseTimer);
      if (xhr.status == 200) {
        that.fireEvent('connected', {});
      } else {
        that.fireEvent('not_connected');
      }
    }
    
    xhr.open('GET', url);
    xhr.send();
  },
  poll: function (url, interval, timeout, backoff_flag) {
    var that = this;
    console.log('Calling check connection with an inteval of: ' + interval);
    this.checkConnection(url, timeout);
    if (backoff_flag && interval < 60000) interval = interval << 1;
    setTimeout(function () {
      that.poll(url, interval, timeout, backoff_flag);
    }, interval);
  }
}