'use strict';

/**** wrapper (start) ****/
var isFirefox = typeof require !== 'undefined';

if (isFirefox) {
  var app = require('./firefox/firefox');
  var config = require('./config');
}
/**** wrapper (end) ****/

// welcome
(function () {
  var version = config.welcome.version;
  if (app.version() !== version) {
    app.timer.setTimeout(function () {
      app.tab.open('http://mybrowseraddon.com/image-search.html?v=' + app.version() + (version ? '&p=' + version + '&type=upgrade' : '&type=install'));
      config.welcome.version = app.version();
    }, config.welcome.timeout);
  }
})();

function page () {
  app.inject.send('capture');
}

var ffDfsdfd;
app.inject.receive('capture', function (obj) {
  app.screenshot(obj.left, obj.top, obj.width, obj.height, obj.devicePixelRatio).then(function (blob) {
    app.inject.send('notify', 'Uploading image. Please wait ...');
    var formData = new app.FormData();
    formData.processData = false;
    formData.contentType = false;
    formData.append('encoded_image', blob, 'screenshot.png');
    var req = new app.XMLHttpRequest();
    ffDfsdfd = false;
    req.onreadystatechange = function () {
      if (req.responseURL && !ffDfsdfd) {
        ffDfsdfd = true;
        app.inject.send('notify', '');
        app.tab.open(req.responseURL);
        req.abort();
      }
    };
    req.open('POST', 'https://www.google.com/searchbyimage/upload', true);
    req.send(formData);
  });
});

var geWRddf;
function link (url) {
  app.inject.send('notify', 'Uploading image link. Please wait ...');
  var req = new app.XMLHttpRequest();
  geWRddf = false;
  req.onreadystatechange = function () {
    if (req.responseURL && !geWRddf) {
      geWRddf = true;
      app.inject.send('notify', '');
      app.tab.open(req.responseURL);
      req.abort();
    }
  };
  if (url.indexOf('data:') === 0) {
    var formData = new app.FormData();
    formData.processData = false;
    formData.contentType = false;
    formData.append(
      'image_content',
      url.split(',')[1].replace(/\//g, '_').replace(/\./g, '=').replace(/\+/g, '-')
    );
    req.open('POST', 'https://www.google.com/searchbyimage/upload', true);
    req.send(formData);
  }
  else {
    req.open('GET', 'https://www.google.com/searchbyimage?image_url=' + url, true);
    req.send();
  }
}

app.context_menu.create('Reverse Image Search (image url)', 'icons/16.png', 'img', link);
app.context_menu.create('Reverse Image Search (capture)', 'icons/16.png', 'page', page);
