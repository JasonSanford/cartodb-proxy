## CartoDB Proxy

This is a node application that creates a simple proxy for serving up CartoDB map tiles without using cartodb.js. These tiles can be easily added to any slippy map (Leaflet, OpenLayers, Google Maps).

[View a demo](http://cartodb-proxy.herokuapp.com/)

### Install - Run

```
cd /path/to/cartodb-proxy
npm install
npm start
```

### Deployment

#### The Easy Way

Click this button.

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/JasonSanford/cartodb-proxy)

#### The Slightly Harder But Still Really Easy Way

The `Procfile` makes this application easy to deploy to [heroku](https://www.heroku.com/).

```
cd /path/to/cartodb-proxy
heroku create
git push heroku master
```

### Usage

After running your application visit the application root (`http://localhost:5000/`) for some documentation and an interactive demo.

The tiling proxy can be found at `http://localhost:5000/tiles/{z}/{x}/{y}`. Those funny looking letters are placholders for the tiles located at specific zoom levels and coordinates. Your [mapping library](http://leafletjs.com/reference.html#tilelayer) should automatically replace these with actual values at runtime.

There are two required URL parameters, `cartodb_org` and `cartodb_json`. The `cartodb_json` parameter **should be URL encoded!**

You can URL encode by doing:

```javascript
var cartodbJson = '{"version": "1.0.1", "layers": [{"foo": "bar"}]}';
var encoded = encodeURIComponent(cartodbJson);
console.log(cartodbJson);
// %7B%22version%22%3A%20%221.0.1%22%2C%20%22layers%22%3A%20%5B%7B%22foo%22%3A%20%22bar%22%7D%5D%7D
```

An example URL looks like:

    http://localhost:5000/{z}/{x}/{y}?cartodb_json=%7B%22version%22%3A%20%221.0.1%22%2C%20%22layers%22%3A%20%5B%7B%22foo%22%3A%20%22bar%22%7D%5D%7D&cartodb_org=fulcrum

### Use a Hosted Version

I've deployed an instance of this application at Heroku. You're free to use it as you wish. In the examples above just use the `cartodb-proxy.herokuapp.com` domain instead of `localhost:5000`.

http://cartodb-proxy.herokuapp.com
