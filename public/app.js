(function(){
  var base_layer = new L.TileLayer('https://{s}.tiles.mapbox.com/v4/base.mapbox-streets+bg-e8e8e8_scale-1_water-0.13x0.13;0.00x0.00;0.81x0.81;0.00x1.00_streets-0.08x0.08;0.00x0.00;0.11x1.00;0.00x1.00_landuse-0.10x0.10;0.00x0.00;0.76x0.98;0.00x1.00_buildings-0.08x0.08;0.00x0.00;0.11x1.00;0.00x1.00/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IlhHVkZmaW8ifQ.hAMX5hSW-QnTeRCMAy9A8Q', {subdomains: 'abcd'});
  var map_options = {
    center: [27.7720769, -82.6420752],
    zoom: 16,
    layers: [base_layer],
    maxZoom: 21
  };
  var map = new L.Map($('.map')[0], map_options);

  var cartoDBLayer;

  function updateLayer(event) {
    if (event) {
      event.preventDefault();
    }

    var url = window.location.origin + '/tiles/{z}/{x}/{y}';

    var params = (function() {
      var encoded_cartodb_json = window.encodeURIComponent($('#cartodb_json').val());
      var key_vals = ['cartodb_json=' + encoded_cartodb_json];
      key_vals.push('cartodb_org=' + $('#cartodb_org').val())
      return key_vals;
    }());

    var url_template = url + '?' + params.join('&');
    $('#proxy_url_template').val(url_template);

    if (cartoDBLayer) {
      cartoDBLayer.setUrl(url_template);
    } else {
      cartoDBLayer = new L.TileLayer(url_template, {maxZoom: 21});
      map.addLayer(cartoDBLayer);
    }
  }

  $('#update-layer').on('click', updateLayer);

  updateLayer();
}());
