// Update the version numbers and library sizes in index.md

var fs = require('fs'),
    zlib = require('zlib');

var VIS = 'vis.js',
    VIS_MIN = 'vis.min.js',
    INDEX = 'index.html';

// get development size
function developmentSize(callback) {
  fs.readFile(VIS, function (err, data) {
    if (!err) {
      var size = Math.round(data.length / 1024) + ' kB';
      callback(null, size);
    }
    else {
      callback(err);
    }
  });
}

// get (gzipped) production size
function productionSize(callback) {
  fs.readFile(VIS_MIN, function (err, data) {
    if (!err) {
      zlib.gzip(data, function (err, data) {
        if (!err) {
          var size = Math.round(data.length / 1024) + ' kB';
          callback(null, size)
        }
        else {
          callback(err);
        }
      });
    }
    else {
      callback(err);
    }
  });
}

// get version
function version(callback) {
  fs.readFile(VIS_MIN, function (err, data) {
    if (!err) {
      var match = /@version\s*([\w\.-]*)/i.exec(data);
      var version = undefined;
      if (match) {
        version = match[1];
      }
      callback(null, version);
    }
    else {
      callback(err);
    }
  });
}

// update version and library sizes in index.md
function updateVersion(developmentSize, productionSize, version, callback) {
  fs.readFile(INDEX, function (err, data) {
    if (!err) {
      data = String(data);
      data = data.replace(/<span id="development-size">([\w\s]*)<\/span>/g,
          '<span id="development-size">' + developmentSize + '</span>');

      data = data.replace(/<span id="production-size">([\w\s]*)<\/span>/g,
          '<span id="production-size">' + productionSize + '</span>');

      data = data.replace(/<span class="version">([\w\.-]*)<\/span>/g,
          '<span class="version">' + version + '</span>');

      fs.writeFile(INDEX, data, callback);
    }
    else {
      callback(err);
    }
  });
}

developmentSize(function (err, devSize) {
  console.log('development size: ' + devSize);
  productionSize(function (err, prodSize) {
    console.log('production size: ' + prodSize);
    version(function (err, version) {
      console.log('version: ' + version);
      if (devSize && prodSize && version) {
        updateVersion(devSize, prodSize, version, function (err, res) {
          if (err) {
            console.log(err);
          }
          else {
            console.log('done');
          }
        });
      }
      else {
      }
    });
  });
});
