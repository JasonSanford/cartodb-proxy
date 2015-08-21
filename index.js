var express = require('express');
var request = require('request');

var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, resp) {
  resp.sendfile('public/index.html');
});

var cartodbConfigCache = {};

function sendBadRequestResponse (resp) {
  resp.status(400);
  resp.send('A "cartodb_json" url parameter must be passed and be valid JSON.')
}

function getLayerConfig (cartodbOrg, cartodbConfig, callback) {
  var cacheKey = JSON.stringify(cartodbConfig);

  if (cacheKey in cartodbConfigCache) {
    if (cartodbConfigCache[cacheKey] === 'fetching') {
      console.log('cache miss during initial fetch');
      setTimeout(function () {
        getLayerConfig(cartodbOrg, cartodbConfig, callback);
      }, 200);
    } else {
      console.log('cache hit');
      callback(null, cartodbConfigCache[cacheKey]);
    }
  } else {
    console.log('cache miss');
    cartodbConfigCache[cacheKey] = 'fetching';
    request({
        url: 'https://' + cartodbOrg + '.cartodb.com/api/v1/map',
        method: 'post',
        json: true,
        body: cartodbConfig
      }, function (error, response, layerConfig) {
        if (error) {
          callback(error);
        } else {
          cartodbConfigCache[cacheKey] = layerConfig;
          callback(null, layerConfig);
        }
      });
  }
}

app.get('/tiles/:z/:x/:y', function(req, resp) {
  var z                  = parseInt(req.params.z, 10);
  var x                  = parseInt(req.params.x, 10);
  var y                  = parseInt(req.params.y, 10);
  var cartodbOrg         = req.query.cartodb_org;
  var encodedCartodbJson = req.query.cartodb_json;

  if (!encodedCartodbJson) {
    sendBadRequestResponse(resp);
    return;
  }

  try {
    var cartodbJson = decodeURIComponent(encodedCartodbJson);
    var cartodbConfig = JSON.parse(cartodbJson);
  } catch (error) {
    sendBadRequestResponse(resp);
    return;
  }

  var redirect = req.query.redirect != null && req.query.redirect.toLowerCase() !== "false" ? true : false;

  getLayerConfig(cartodbOrg, cartodbConfig, function (error, layerConfig) {
    var url;

    if (error) {
      console.log('Error: ', error);
      url = 'http://i.imgur.com/w9RAwBL.gif';
    } else {
      if (layerConfig.layergroupid && layerConfig.cdn_url) {
        var layerGroupId  = layerConfig.layergroupid;
        var cartodbServer = layerConfig.cdn_url.https;

        url = 'https://' + cartodbServer + '/' + cartodbOrg + '/api/v1/map/' + layerGroupId +  '/' + z +  '/' + x + '/' + y + '.png';
      } else {
        console.log('Bad layerConfig: ', layerConfig);
        url = 'http://i.imgur.com/w9RAwBL.gif';
      }
    }

    if (redirect) {
      resp.redirect(url);
    } else {
      req.pipe(request(url)).pipe(resp);
    }
  });
});

app.listen(app.get('port'), function() {
  console.log('Running at port: ' + app.get('port'));
});
