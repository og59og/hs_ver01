var raster = new ol.layer.Tile({
  source: new ol.source.OSM()
});

var source = new ol.source.Vector();
var vector = new ol.layer.Vector({
  source: source,
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 0.2)'
    }),
    stroke: new ol.style.Stroke({
      color: '#ffcc33',
      width: 2
    }),
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({
        color: '#ffcc33'
      })
    })
  })
});

console.log('vector : ', vector);

var select = new ol.interaction.Select({
    wrapX: false
});

var modify = new ol.interaction.Modify({
    source: source,
    features: select.getFeatures()
});

var map = new ol.Map({
  interactions: ol.interaction.defaults().extend([select, modify]),
  layers: [raster, vector],
  target: 'map',
  view: new ol.View({
    center: [-11000000, 4600000],
    zoom: 4
  })
});

map.addInteraction(modify);

console.log('modify : ', modify);

var draw, snap; // global so we can remove them later
var typeSelect = document.getElementById('type');

function addInteractions() {
  draw = new ol.interaction.Draw({
    source: source,
    type: typeSelect.value
  });
  map.addInteraction(draw);
  snap = new ol.interaction.Snap({source: source});
  console.log('source: ', source);
  console.log('draw: ', draw);
  console.log('snap: ', snap);
  map.addInteraction(snap);

}

/**
 * Handle change event.
 */
typeSelect.onchange = function() {
  map.removeInteraction(draw);
  map.removeInteraction(snap);
  addInteractions();
};

addInteractions();
// map.addControl(new ol.control.dragFeature(vector));
