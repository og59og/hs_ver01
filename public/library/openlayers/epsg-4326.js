var layers = [
    new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: 'https://ahocevar.com/geoserver/wms',
            params: {
                'LAYERS': 'ne:NE1_HR_LC_SR_W_DR',
                'TILED': true
            }
        })
    })
];
var format = 'image/png';

var layers2 = [
    new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: 'http://10.216.81.118:8080/geoserver/cn_NDIS_DB/wms',
            params: {
                'VERSION': '1.1.1',
                tiled: true,
                STYLES: '',
                LAYERS: 'cn_NDIS_DB:cnGISGroupLayers',
                tilesOrigin: 871334.875 + "," + 1776083
            }
        })
    })
];


var projection = new ol.proj.Projection({
    code: 'EPSG:2097',
    units: 'm',
    axisOrientation: 'neu',
    global: false
});

var map = new ol.Map({
    controls: ol.control.defaults().extend([
        new ol.control.ScaleLine({
            units: 'degrees'
        })
    ]),
    layers: layers2,
    target: 'map',
    view: new ol.View({
        projection: projection,
        center: [0, 0],
        zoom: 2
    })
});