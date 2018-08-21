
var layers;
var map;
// var cfType, cfText, cfSize, cfColor;
// var cfDraw, cfSnap, cfModify, cfSelect;
// var cfSource, cfVector;
var geoSubStationSource;
var projection;
var mousePositionControl;
// var modifyControlValue ;
// var container;
// var content;
// var closer;
var overlay;
var zoomslider;
var koreaLonLat;
var substationLayerName;
// var contextMenuTable;
var tempTable;
const getServer_url = "http://172.20.10.3:8080", getGISStoreName = "NDIS_Data_Table";
// var getServer_url = "http://localhost:8080";
// var getServer_url = "http://172.20.10.3:8080";
// var substHighlighterSource, substHighlighterStyle;
// var substDefaultSource,  substDefaultStyle;
// var featureOverlay;
// var highlightFeatureEvent, selectSubsFeature, highlightFeatureObject;
var substHighlightStyle;
var subsCoordinateMap;
var prevResolution;
var vectorSource, vectorLayer;
const moveEDResolution =  9.54, showDlOfDBClickedSubsResolution = 9.55, drawLineResolution = 19, movePositionEventResolution = 38.17, initResolution = 300, expandSymbolResolution = 77;
// var moveEDMode = false;

var subsselected;
var dblClickInteraction;
var canvasItem, canvasSource, hubpopSource;
var canvasWidth, canvasHeight;
/*var cfTextStyle = function () {
    return [
        new ol.style.Style({
            text: new ol.style.Text({
                font: '12pt Calibri,sans-serif',
                fill: new ol.style.Fill({ color: '#000' }),
                stroke: new ol.style.Stroke({
                    color: '#fff', width: 2
                }),
                text: this.get('text')
            })
        })
    ];
};*/
/* doReady Function Start*/
$(function () {

    /*cfType = document.getElementById('cfType');
    cfText = document.getElementById('cfTextInput');
    cfSize = document.getElementById('cfSizeInput');
    cfColor = document.getElementById('cfColorInput');
    cfSource = new ol.source.Vector();
    cfVector = new ol.layer.Vector({
        source: cfSource,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: cfColor.value
            }),
            stroke: new ol.style.Stroke({
                color: cfColor.value,
                width: cfSize.value
            }),
            image: new ol.style.Circle({
                radius: cfSize.value,
                fill: new ol.style.Fill({color: cfColor.value})
            })
        })
    });*/

    // console.log('source : ', cfSource);

    // 지도 클릭시 Popup 띄우기 설정 부분 Start
    // container = document.getElementById('popup');
    // content = document.getElementById('popup-content');
    // closer = document.getElementById('popup-closer');
    // koreaLonLat = [957425.78125, 1843250];
    // koreaLonLat = [14112193.22464567, 4456482.070940738];
    // koreaLonLat = [15189566.260830224, 5224623.757348368];
    koreaLonLat = [14137499.999999998, 4383900];

    subsCoordinateMap = new Map();

    overlay = new ol.Overlay({
        element: document.getElementById('popup'),
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    });
    substationLayerName = 'ecl_subst_a';
    substHighlightStyle = new ol.style.Style({
        image: new ol.style.Circle({
            radius: 30,
            snapToPixel: false,
            fill: new ol.style.Fill({color: 'rgba(174, 255, 0, 0.3)'}),
            stroke: new ol.style.Stroke({color: 'rgba(0, 0, 0, 1)', width: 1})
        })
    });

    vectorSource = new ol.source.Vector();
    vectorLayer = new ol.layer.Vector({
        source: vectorSource
    });

    canvasSource = new ol.source.ImageCanvas({
        canvasFunction: function (extent, resolution, pixelRatio, size, projection) {
            canvasWidth = size[0];
            canvasHeight = size[1];

            // console.log("canvas : ", canvasItem);

            return canvasItem;
        },
        // projection: 'EPSG:3857'
    });

    hubpopSource = new ol.source.TileWMS({
        // url: 'http://10.216.81.118:8080/geoserver/cn_NDIS_DB/wms',
        url: getServer_url + '/geoserver/' + getGISStoreName + '/wms',
        // url: 'http://localhost:8080/geoserver/' + getGISStoreName + '/wms',
        params: {
            'VERSION': '1.1.1',
            tiled: true,
            STYLES: '',
            // LAYERS: '' + getGISStoreName + ':hubpop_presentation_layer_origin',
            // LAYERS: '' + getGISStoreName + ':hubpop_presentation_layer',
            LAYERS: '' + getGISStoreName + ':hubpop_presentation_layer'
            // tilesOrigin: 1040823.11525 + "," + 1852591.84775
        }
    });

    layers = [
        /*new ol.layer.Tile({
            source: new ol.source.TileWMS({
                // url: 'http://10.216.81.118:8080/geoserver/' + getGISStoreName + '/wms',
                url:  getServer_url + '/geoserver/' + getGISStoreName + '/wms',
                // url: 'http://localhost:8080/geoserver/' + getGISStoreName + '/wms',
                params: {
                    'VERSION': '1.1.1',
                    tiled: false,
                    STYLES: '',
                    LAYERS: '' + getGISStoreName + ':tl_scco_li',
                    tilesOrigin: 1040823.11525 + "," + 1852591.84775
                }
            })
        }),*/
        new ol.layer.Tile({
            source: new ol.source.TileImage({url: 'http://maps.google.com/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i375060738!3m9!2spl!3sUS!5e18!12m1!1e47!12m3!1e37!2m1!1ssmartmaps!4e0'})
            // , srs: "EPSG:4004"
        }),
        /*new ol.layer.Tile({
            'title': 'Google Maps Uydu',
            // 'type': 'base',
            visible: true,
            // 'opacity': 1.000000,
            source: new ol.source.XYZ({
                // attributions: [new ol.Attribution({ html: '<a href=""></a>' })],
                // url: 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}&s=G
                url: 'http://maps.google.com/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i375060738!3m9!2spl!3sUS!5e18!12m1!1e47!12m3!1e37!2m1!1ssmartmaps!4e0'
            })
        }),*/
        /*new ol.layer.Tile({
            source: new ol.source.OSM()
        }),*/
        /*new ol.layer.Vector({
            source : geoSubStationSource
        }),
        new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: 'http://10.216.81.118:8080/geoserver/' + getGISStoreName + '/wms',
                params: {
                    'VERSION': '1.1.1',
                    tiled: false,
                    STYLES: '',
                    LAYERS: '' + getGISStoreName + ':ecl_subst_a',
                    tilesOrigin: 1040823.11525 + "," + 1852591.84775
                }
            })
        }),*/
        new ol.layer.Tile({
            source:  hubpopSource /*new ol.source.TileWMS({
                // url: 'http://10.216.81.118:8080/geoserver/cn_NDIS_DB/wms',
                url: getServer_url + '/geoserver/' + getGISStoreName + '/wms',
                // url: 'http://localhost:8080/geoserver/' + getGISStoreName + '/wms',
                params: {
                    'VERSION': '1.1.1',
                    tiled: true,
                    STYLES: '',
                    // LAYERS: '' + getGISStoreName + ':hubpop_presentation_layer_origin',
                    // LAYERS: '' + getGISStoreName + ':hubpop_presentation_layer',
                    LAYERS: '' + getGISStoreName + ':hubpop_presentation_layer'
                    // tilesOrigin: 1040823.11525 + "," + 1852591.84775
                }
            })*//*.on('TILELOADEND', function () {
                drawEquipmentOnCanvas();
            })*/
        })
        , new ol.layer.Image({
            source: canvasSource/*new ol.source.ImageCanvas({
                canvasFunction: function (extent, resolution, pixelRatio, size, projection) {
                    canvasWidth = size[0];
                    canvasHeight = size[1];

                    // console.log("canvas : ", canvasItem);

                    return canvasItem;
                },
                // projection: 'EPSG:3857'
            })*//*.on('tileloadend', function () {
                drawEquipmentOnCanvas();
            })*/
        })
        /*,
        new ol.layer.Vector({
            source: new ol.source.Vector({
                // url: 'http://10.216.81.118:8080/geoserver/' + getGISStoreName + '/wms',
                url: getServer_url + '/geoserver/' + getGISStoreName + '/wfs',
                format: new ol.format.GeoJSON(),
                // url: 'http://localhost:8080/geoserver/' + getGISStoreName + '/wms',
                params: {
                    'VERSION': '1.1.0',
                    // tiled: false,
                    // STYLES: '',
                    LAYERS: '' + getGISStoreName + ':ecl_subst_a'
                    // tilesOrigin: 1040823.11525 + "," + 1852591.84775
                }
            }),
            style: function(feature) {
                // style.getText().setText(feature.get('name'));
                return substDefaultStyle;
            }
        })*/
    ];
    // closer.onclick = function() {
    //     overlay.setPosition(undefined);
    //     closer.blur();
    //     return false;
    // };
    zoomslider = new ol.control.ZoomSlider();

    mousePositionControl = new ol.control.MousePosition({
        className: 'custom-mouse-position',
        target: document.getElementById('location'),
        coordinateFormat: ol.coordinate.createStringXY(5),
        undefinedHTML: '&nbsp;'
    });
    projection = new ol.proj.Projection({
        code: 'EPSG:3857'
        // code: 'EPSG:4004'
        , units: 'm'
        , axisOrientation: 'neu'
        , global: false
    });

/*    canvasSource.on('tileloadend', function() {
        console.log('tileloadend In');
        drawEquipmentOnCanvas();
    });*/

    // hubpopSource.on('tileloadend', function() {

    map = new ol.Map({
        target: 'map',
        layers: layers ,
        overlays: [overlay],
        controls: ol.control.defaults({
            attribution: false
        }).extend([mousePositionControl]),
        view: new ol.View({
            // center: ol.proj.fromCoordinate([1534305.81363, 6364452.72314]),
            // center: ol.proj.fromLonLat([153.430581363, 636.445272314]),
            // center: ol.proj.transform([17079039.20518, 18349403.44376], 'EPSG:3857', 'EPSG:2097'),
            // center: ol.proj.fromLonLat([126.8958600238, 33.4772999771]),
            center: koreaLonLat,
            // center: new ol.proj.transform(
            //     [-0.1275, 51.507222], 'EPSG:2097', 'EPSG:4326'),
            projection: projection,
            zoom: 2
        })
    });

    map.addLayer(vectorLayer);

/*    featureOverlay = new ol.layer.Vector({
        source: new ol.source.Vector(),
        map: map,
        /!*style: function(feature) {
            // highlightStyle.getText().setText(feature.get('name'));
            return substHighlighterStyle;
        }*!/
        style : substHighlighterStyle
    });*/
    // 지도 클릭시 Popup 띄우기 설정 부분 End

    // dblClickInteraction;
// find DoubleClickZoom interaction
    map.getInteractions().getArray().forEach(function(interaction) {
        if (interaction instanceof ol.interaction.DoubleClickZoom) {
            dblClickInteraction = interaction;
        }
    });
// remove from map
    map.removeInteraction(dblClickInteraction);

    /*highlightFeatureEvent = function(feature) {

        /!*var feature = map.forEachFeatureAtPixel(pixel, function(feature) {
            return feature;
        });

        if (feature !== selectSubsFeature) {
            if (selectSubsFeature) {
                featureOverlay.getSource().removeFeature(selectSubsFeature);
            }
            if (feature) {
                featureOverlay.getSource().addFeature(feature);
            }
            selectSubsFeature = feature;
        }

    };*/
    map.getView().on('change:resolution', function(evt) {
        var resolution = evt.target.get('resolution');
        /*var units = map.getView().getProjection().getUnits();
        var dpi = 25.4 / 0.28;
        var mpu = ol.proj.METERS_PER_UNIT[units];
        var scale = resolution * mpu * 39.37 * dpi;*/
        // var maxResolution = 4000000 / mpu / 39.37 / dpi;

        disposeContextPopup();

        if(resolution <= 0.3){
            map.getView().setResolution(0.3);
        }

        // console.log('center of View : ', map.getView().getCenter());
        if (resolution <= moveEDResolution) {

            if(!isToggleButtonChecked("gisMoveModeChange")){     // 단선도 이동 모드일 때
                if(resolution <= prevResolution){               // 축척 변화 중 확대 변화일 때
                    map.getView().setResolution(moveEDResolution);
                    ED_displayMode();
                }
            }
            prevResolution = resolution;
            // scale = 68000;
            // return;
        }
        /*
        if (scale >= 9500 && scale <= 950000) {
            // console.log('[K-1] scale : ', scale);
            scale = Math.round(scale / 1000) + "K";
            // console.log('[K-2] scale : ', scale);

        } else if (scale >= 950000) {
            // console.log('[M-1] scale : ', scale);
            scale = Math.round(scale / 1000000) + "M";
            // console.log('[M-2] scale : ', scale);
        } else {
            scale = Math.round(scale);
        }
        document.getElementById('scale').innerHTML = "Scale = 1 : " + scale;
        */


    });
    /*
        map.on('pointermove', function(evt) {
            console.log('layers : ', map.getLayers().length);
            if (evt.dragging) {
                return;
            }
            var pixel = map.getEventPixel(evt.originalEvent);
            highlightFeatureEvent(pixel);
        });
    */

/*    map.on('pointerdrag', function (evt) {


    });*/

    map.on('singleclick', function(evt) {
        // console.log('singleclick in !');
        // console.log('[Client] modifyControlValue :', modifyControlValue);
        console.log('coordinate : ', evt.coordinate);
        setCallObjFlag('GIS');

        // document.getElementById('nodelist').innerHTML = "Loading... please wait...";
        var view = map.getView();
        var viewResolution = view.getResolution();
        var source = layers[1].getSource();
        /* source에서 선택 정보를 가져오는 것으로 보임!!*/
        var url = source.getGetFeatureInfoUrl(
            evt.coordinate, viewResolution, view.getProjection(),
            {'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 50});     // text/javascript
        // console.log('[Client] evt : ', evt);
        // console.log('[Client] source : ', source);

        /*var customSelect =  new ol.interaction.Select();
        customSelect.on('select', function (e) {
            if(e.selected.length > 0) {
                if(typeof(e.selected[0].get('fType'))=='undefined'){
                    return;
                }
            }
            source.changed();
        });
        console.log('[Client] customSelect.getFeatures : ', customSelect.getFeatures());*/
        if (url) {
            // document.getElementById('nodelist').innerHTML = '<iframe seamless src="' + url + '"></iframe>';
            console.log('[Client] url : ', url);

            // 변전소 GIS 정보 가져오기
            $.ajax({
                type: "POST"
                , url: "/electrical_diagram_gis/geo_data_detail"
                , data: { 'url': url }
                , success:function(data){
                    try {
                        // console.log('[Client]Success Data : ', data);
                        // console.log('[Client]url : ', url);
                        // console.log('[Client]Ajax Success !');
                        // alert('Ajax Success ! ');

                        /*
                        * Data Parsing 결과 예시
                        *  - type: "FeatureCollection",
                           - totalFeatures: "unknown",
                           - features: Array(4), crs: {…}}
                        * */
                        var parseResultData = JSON.parse(data);
                        // console.log("json parse success");
                        var resultItems = parseResultData.features;
                        var lastItem = resultItems.pop();
                        var element = overlay.getElement();
                        disposeContextPopup();
                        if(lastItem){
                            var lastItemSplitResult = lastItem.id.split('.');

                            if(lastItemSplitResult[0] == substationLayerName){

                                setRightSelectedInfoTabData(lastItem.properties);

                                selectTreeViewItem(lastItem.properties.substcd);

                                /*tempTable = createTable('SS', lastItem);
                                var substParamArr = [lastItemSplitResult[0], lastItem.properties.substcd];
                                makeHeaderInfo('SS', tempTable, substParamArr);
                                console.log('substcd : ', lastItem.properties.substcd);
                                console.log('lastItem : ', lastItem);*/
                                var setPopupPosition = [];
                                var originPositionArr
                                    = [Number(subsCoordinateMap.get(lastItem.properties.substcd).get('subs_coordinate')[0]), Number(subsCoordinateMap.get(lastItem.properties.substcd).get('subs_coordinate')[1])];
                                    // = evt.coordinate;
                                var setHighlightCirclePosition;
                                console.log('BF setPopupPosition', setPopupPosition);


                                if(map.getView().getResolution() <= 0.3) {
                                    setPopupPosition[0] = evt.coordinate[0] + 10;
                                    setPopupPosition[1] = evt.coordinate[1] + 5;
                                    setHighlightCirclePosition = evt.coordinate;
                                }
                                else if(map.getView().getResolution() <= 0.6) {
                                    setPopupPosition[0] = evt.coordinate[0] + 30;
                                    setPopupPosition[1] = evt.coordinate[1] + 10;
                                    setHighlightCirclePosition = evt.coordinate;
                                }
                                else if(map.getView().getResolution() <= 1.2) {
                                    setPopupPosition[0] = evt.coordinate[0] + 50;
                                    setPopupPosition[1] = evt.coordinate[1] + 15;
                                    setHighlightCirclePosition = evt.coordinate;
                                }
                                else if(map.getView().getResolution() <= 2.5){
                                    setPopupPosition[0] = evt.coordinate[0] + 100;
                                    setPopupPosition[1] = evt.coordinate[1] + 30;
                                    setHighlightCirclePosition = evt.coordinate;
                                }
                                else if(map.getView().getResolution() <= movePositionEventResolution){
                                    setPopupPosition[0] = originPositionArr[0] + 300;
                                    setPopupPosition[1] = originPositionArr[1] + 100;
                                    setHighlightCirclePosition = originPositionArr;
                                }else{
                                    setPopupPosition[0] = originPositionArr[0] + 3000;
                                    setPopupPosition[1] = originPositionArr[1] + 3000;
                                    setHighlightCirclePosition = originPositionArr;
                                }

                                $("#selectObjectInfo").text(lastItem.properties.substnm);
                                overlay.setPosition(setPopupPosition);
                                tempTable = createMoveEDModeButtonMenu(lastItem);
                                $(element).popover({
                                    'placement': 'right',
                                    'animation': false,
                                    'html': true,
                                    'content': tempTable
                                });
                                initSubsInfo(lastItem.properties);
                                $('#substInfoTab').click();
                                getSubsIdValue();
                                // createHighlightFeature(lastItem, subsCoordinateMap.get(lastItem.properties.substcd).get('subs_coordinate'));
                                createHighlightFeature(lastItem, setHighlightCirclePosition);
                                // $("#svgDiv").show();

                                /*var tmpFeature = new ol.geom.MultiPolygon();*/
/*                                var tmpFeature = new ol.Feature();
                                tmpFeature.setGeometry(new ol.geom.MultiPolygon(lastItem.geometry.coordinates));
                                tmpFeature.setProperties(lastItem.properties);
                                console.log('tmpFeature : ', tmpFeature);
                                // tmpFeature.setStyle(substHighlighterStyle);

                                highlightFeatureEvent(tmpFeature);*/
                                // document.getElementById("svgDiv").style.display = "block";
                                // var features = highlighterSource.getFeatures();
                                // features[0].getGeometry().setCoordinates(evt.coordinate);
                            }
                            else{
                                overlay.setPosition(evt.coordinate);
                                tempTable = createTable('SW', lastItem);
                                makeHeaderInfo('SW', tempTable, lastItemSplitResult);
                                $(element).popover({
                                    'placement': 'right',
                                    'animation': false,
                                    'html': true,
                                    'content': tempTable
                                });

                            }
                            console.log('pass');
                            $(element).popover('show');
                            setCallObjFlag("TreeView");
                            // $("#svgDiv").hide();
                            // document.getElementById("svgDiv").style.display ="none";

                        }
                        else{
                            disposeContextPopup();
                            // $("#svgDiv").hide();
                            // document.getElementById("svgDiv").style.display = "none";
                        }
                    } catch(exception) {
                        console.log('Error : ', exception);
                    }
                }
                , error:function(data) {
                    console.log('[Client]Error Data : ', data);
                    console.log('[Client]url : ', url);
                    console.log('Ajax Error!');
                }
            });
        }

        // if(cfType.value === 'Modify' & modifyControlValue === 'DB'){
        // }

    });
    map.on('dblclick', function(evt){
        dblClickInteraction["O"].active = false;
        var view = map.getView();
        var viewResolution = view.getResolution();
        var source = layers[1].getSource();
        /* source에서 선택 정보를 가져오는 것으로 보임!!*/
        var url = source.getGetFeatureInfoUrl(
            evt.coordinate, viewResolution, view.getProjection(),
            {'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 50});     // text/javascript
        if (url) {
            $.ajax({
                type: "POST"
                , url: "/electrical_diagram_gis/geo_data_detail"
                , data: { 'url': url }
                , success:function(data){
                    try {
                        /*
                        * Data Parsing 결과 예시
                        *  - type: "FeatureCollection",
                           - totalFeatures: "unknown",
                           - features: Array(4), crs: {…}}
                        * */
                        var parseResultData = JSON.parse(data);
                        var resultItems = parseResultData.features;
                        var lastItem = resultItems.pop();
                        var element = overlay.getElement();
                        disposeContextPopup();
                        if(lastItem){
                            var lastItemSplitResult = lastItem.id.split('.');

                            if(lastItemSplitResult[0] == substationLayerName){

                                setRightSelectedInfoTabData(lastItem.properties);
                                selectTreeViewItem(lastItem.properties.substcd);

                                var setPopupPosition = [];
                                var selectedSubsCoordiate = subsCoordinateMap.get(lastItem.properties.substcd).get('subs_coordinate');
                                var numberResultCoordinate = [Number(selectedSubsCoordiate[0]), Number(selectedSubsCoordiate[1])];

                                if(map.getView().getResolution() <= movePositionEventResolution){
                                    setPopupPosition[0] = numberResultCoordinate[0] + 400;
                                    setPopupPosition[1] = numberResultCoordinate[1] + 100;
                                }else{
                                    setPopupPosition[0] = numberResultCoordinate[0] + 3000;
                                    setPopupPosition[1] = numberResultCoordinate[1] + 3000;
                                }
                                initSubsInfo(lastItem.properties);
                                $('#substInfoTab').click();
                                getSubsIdValue();

                                console.log('evt : ', evt);
                                map.getView().setResolution(showDlOfDBClickedSubsResolution);

                                map.getView().setCenter(numberResultCoordinate);
                                createHighlightFeature(lastItem, numberResultCoordinate);
                                // evt.stopPropagation();
                            }

                        }
                    } catch(exception) {
                        console.log('Error : ', exception);
                    }
                }
                , error:function(data) {
                    console.log('[Client]Error Data : ', data);
                    console.log('[Client]url : ', url);
                    console.log('Ajax Error!');
                }
            });
        }
        dblClickInteraction["O"].active = true;
    });
    map.on('pointerdrag', function(evt){
        // map.getView().setResolution(initResolution);
        disposeContextPopup();
        $("#display").css("cursor", "Move");

    });
    map.on('pointermove', function(evt){
        if (evt.dragging) {
            return;
        }
        $("#display").css("cursor", "Default");
    });
    map.on('postcompose', function(evt){
        // console.log('tileloadend In');
        // drawEquipmentOnCanvas();
        // console.log('canvas : ', $("canvas.ol-unselectable")[0]);
        /*var canvas = $("canvas.ol-unselectable")[0];
        /!*        canvas.width = 2000;
                canvas.height = 1000;*!/

        var context = canvas.getContext('2d');

        context.strokeStyle = 'blue';
        context.fillStyle = '#8ED6FF';

        for(var i=0; i< 1; i++) {
            for (var j = 0; j < 1; j++) {
                context.beginPath();
                context.arc(95 + j * 15, 50 + i * 5, 10, 0, 2 * Math.PI);
                context.fill();
                context.stroke();
                if (i > 0) {
                    context.moveTo(95 + (j - 1) * 15 + 10, 50 + (i - 1) * 5);
                    context.lineTo(95 + j * 15 - 10, 50 + i * 5);
                    context.stroke();
                }
            }
        }*/
        // begin custom shape
       /* context.beginPath();
        context.moveTo(170, 80);
        context.bezierCurveTo(130, 100, 130, 150, 230, 150);
        context.bezierCurveTo(250, 180, 320, 180, 340, 150);
        context.bezierCurveTo(420, 150, 420, 120, 390, 100);
        context.bezierCurveTo(430, 40, 370, 30, 340, 50);
        context.bezierCurveTo(320, 5, 250, 20, 250, 50);
        context.bezierCurveTo(200, 5, 150, 20, 170, 80);

        // complete custom shape
        context.closePath();
        context.lineWidth = 5;
        context.fillStyle = '#8ED6FF';
        context.fill();
        context.strokeStyle = 'blue';
        context.stroke();*/
    });

    //pointerdrag
    // map.setCenter(new OpenLayers.LonLat(966304.08940, 1819531.66517), 5);
    // map.center.lon = 966304.08940;
    // map.center.lat = 1819531.66517;
    // map.changed('resolution');

    /*$('#removeAll').on('click', function(){
        removeCfFeatures();
    });*/
    /*$('#sendCfData').on('click', function(){
        alert('in : sendCfData');
        var tempCfArr = cfVector.getSource().getFeatures();
        console.log('[Client]tempCfArr :', tempCfArr);
        // url: 'http://10.216.81.118:8080/geoserver/' + getGISStoreName + '/wms',

        // var sendMapData = [{'type': tempCfArr[0]["O"].fType, 'point': tempCfArr[0]["O"].geometry.A},
        //     {'type': tempCfArr[1]["O"].fType, 'point': tempCfArr[1]["O"].geometry.A}];

        var sendMapData = [{}];

        for(var i=0; i< tempCfArr.length; i++){

            console.log('[Client]i : ', i);
            console.log('[Client]i data : ', tempCfArr[i]["O"]);
            var tmpData = tempCfArr[i]["O"];
            console.log('[Client]tmpData : ', tmpData);

            sendMapData[i] =  { 'featureType' : tmpData.fType, 'point' : tmpData.geometry.A, 'xp': tmpData.geometry.xp };
            // sendMapData[i].point = tmpData.geometry.A;
        }

        // console.log('sendMapData :', sendMapData);
        // console.log('item : ', sendMapData[0]);
        // console.log('type: ', typeof(sendMapData), 'type : ',  typeof(sendMapData[0]));

        var jsonMap = JSON.stringify(sendMapData);
        // console.log('json type : ', typeof(jsonMap));
        $.ajaxSettings.traditional = true;
        $.ajax({
            url: 'geo_data_result',
            type:'POST',
            dataType: 'json',
            data: { 'sendMapData': jsonMap },
            // dataType: 'json',
            success:function(result) {
                alert("완료!");
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log("에러 발생 \n" + textStatus + " : " + errorThrown);
            }
        });
    });*/
    $('#getViewArea').on('click', function(){
        getFeaturesInExtent();
    });

    $('#moveBtn').on('click', function(){
        getFeaturesInExtent();
    });

    createCoordinateList();
    // drawEquipmentOnCanvas();


    /*    document.getElementById('removeAll').onclick = function(){
            removeCfFeatures();
        };
        document.getElementById('sendCfData').onclick = function(){
            alert('in : sendCfData');
            var tempCfArr = cfVector.getSource().getFeatures();
            console.log('tempCfArr :', tempCfArr);
            // url: 'http://10.216.81.118:8080/geoserver/' + getGISStoreName + '/wms',

            // var sendMapData = [{'type': tempCfArr[0]["O"].fType, 'point': tempCfArr[0]["O"].geometry.A},
            //     {'type': tempCfArr[1]["O"].fType, 'point': tempCfArr[1]["O"].geometry.A}];

            var sendMapData = [{}];

            for(var i=0; i< tempCfArr.length; i++){

                console.log('i : ', i);
                console.log('i data : ', tempCfArr[i]["O"]);
                var tmpData = tempCfArr[i]["O"];
                console.log('tmpData : ', tmpData);

                sendMapData[i] =  { 'featureType' : tmpData.fType, 'point' : tmpData.geometry.A, 'xp': tmpData.geometry.xp };
                // sendMapData[i].point = tmpData.geometry.A;
            }

            // console.log('sendMapData :', sendMapData);
            // console.log('item : ', sendMapData[0]);
            // console.log('type: ', typeof(sendMapData), 'type : ',  typeof(sendMapData[0]));

            var jsonMap = JSON.stringify(sendMapData);
            // console.log('json type : ', typeof(jsonMap));
            $.ajaxSettings.traditional = true;
            $.ajax({
                url: 'geo_data_result',
                type:'POST',
                dataType: 'json',
                data: { 'sendMapData': jsonMap },
                // dataType: 'json',
                success:function(result) {
                    alert("완료!");
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log("에러 발생 \n" + textStatus + " : " + errorThrown);
                }
            });
        };*/
    /* cfType.onchange = function() {
         map.removeInteraction(cfDraw);
         map.removeInteraction(cfSnap);
         map.removeInteraction(cfModify);
         map.removeInteraction(cfSelect);
         // addCfInteractions();
     };*/

    // map.getView().setZoom(6);
    // console.log('view resolution initialization value : ', map.getView().getResolution());  // > result : 2443.2467494192642
    map.getView().setResolution(initResolution);  // 축척 정보를 처음부터 보여주기 위한 부분
    prevResolution = initResolution;
    // addCfInteractions();
});
/* doReady Function End*/

// Move Circuit Display Mode
function ED_displayMode(){
   /* console.log('displayModeValue', $("#displayModeValue").val());
    console.log('[Client]ED_displayMode in!');*/
    // console.log('[Client]scale : ', scale);
    $("#displayModeValue").val("GIS");
    getFeaturesInExtent();
}
function getFeaturesInExtent(){

    var viewItem = map.getView();
    var viewExtent = viewItem.calculateExtent(map.getSize());
    // var features = geoSubStationSource.getFeatures();

    var url =
        // 'http://10.216.81.118:8080/geoserver/' + getGISStoreName + '/wfs?'
        getServer_url + '/geoserver/' + getGISStoreName + '/wfs?'
        // 'http://localhost:8080/geoserver/' + getGISStoreName + '/wfs?'
        + 'service=WFS'
        + '&version=1.1.0'
        + '&request=GetFeature'
        + '&typename=' + getGISStoreName + ':ecl_subst_a'
        + '&outputFormat=application/json'
        + '&srsname=EPSG:3857'
        + '&bbox=' + viewExtent.join(',')
        + ',EPSG:3857'
    ;

    if (url) {
        console.log('[Client] url : ', url);

        $.ajax({
            type: "POST"
            , url: "/electrical_diagram_gis/geo_feature_data_in_extent"
            , data: { 'url': url }
            , success:function(data){
                // createCoordinateList(data);
                successSubstRequest(data);
                // return;
            }
            , error:function(data) {
                console.log('[Client] Extent Error Data : ', data);
                console.log('[Client] Extent url : ', url);
                console.log('Ajax Error!');
            }
        });
    }

    // for(var i in features){
    //     var feature = features[i];
    //     if (ol.extent.containsExtent(viewExtent, feature.getGeometry().getExtent())) {
    //         console.log("[Client] id: " + feature.getId() );
    //     }
    // }
    /*geoSubStationSource = new ol.source.TileWMS({
        url: 'http://10.216.81.118:8080/geoserver/' + getGISStoreName + '/wfs',
        params: {
            'VERSION': '1.1.1',
            tiled: false,
            STYLES: '',
            LAYERS: '' + getGISStoreName + ':ecl_subst_a',
            format: new ol.format.GeoJSON(),
            tilesOrigin: 1040823.11525 + "," + 1852591.84775
        }
    });

    var url = 'http://10.216.81.118:8080/geoserver/' + getGISStoreName + '/wfs?'
        + 'service=WFS'
        + '&version=1.1.0'
        + '&request=GetFeature'
        + '&typename=' + getGISStoreName + ':ecl_subst_a'
        + '&outputFormat=application/json'
        + '&srsname=EPSG:2097'
        + '&bbox=' + viewExtent.join(',') + ',EPSG:2097';

    geoSubStationSource = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: url,
        strategy: ol.loadingstrategy.bbox
    });

    var mapLayer = map.getLayers().getArray();
    mapLayer[1].setSource(geoSubStationSource);

    var features = geoSubStationSource.getFeatures();
    console.log('features : ', features);

    if (url) {
        // document.getElementById('nodelist').innerHTML = '<iframe seamless src="' + url + '"></iframe>';
        console.log('[Client] url : ', url);

        $.ajax({
            type: "POST"
            , url: "/electrical_diagram_gis/geo_data_request"
            , data: { 'url': url }
            , success:function(data){
                /!*
                * Data Parsing 결과 예시
                *  - type: "FeatureCollection",
                   - totalFeatures: "unknown",
                   - features: Array(4), crs: {…}}
                * *!/
                var parseResultData = JSON.parse(data);
                var resultItems = parseResultData.features;


            }
            , error:function(data) {
                console.log('[Client]Error Data : ', data);
                console.log('[Client]url : ', url);
                console.log('Ajax Error!');
            }
        });
    }*/
}
function successSubstRequest(data){

    console.log('[Client] Success Data : ', data);
    // console.log('[Client] url : ', url);
    console.log('[Client] Ajax Success !');
    // alert('Ajax Success ! ');

    /*
    * Data Parsing 결과 예시
    *  - type: "FeatureCollection",
       - totalFeatures: "unknown",
       - features: Array(4), crs: {…}}
    * */
    var parseResultData = JSON.parse(data);
    var featureItemsInExtent = parseResultData.features;
    if(featureItemsInExtent.length > 0){
        console.log('[Client] parseResultData : ', parseResultData);
        console.log('[Client] featureItemsInExtent : ', featureItemsInExtent);
        var lastSubsId = featureItemsInExtent[featureItemsInExtent.length - 1].properties.substcd;
        selectTreeViewItem(lastSubsId);
        $("#oneLineDiagram").click();
        // callElectricalDiagram_displayMode(lastSubsId);
    }
    else{
        console.log('선택된 범위 내에 변전소 정보가 없습니다.');
    }
}
function createTable(flag, clickData){
    var tableItem = document.createElement("table");
    var tbody = document.createElement("tbody");

    if(flag === 'SS'){
        var tr1 = document.createElement("tr");
        var td1 = document.createElement("td");
        var tr2 = document.createElement("tr");
        var td2 = document.createElement("td");
        var tr3 = document.createElement("tr");
        var td3 = document.createElement("td");

        tr1.setAttribute('id', 'substationInfoTr');
        td1.setAttribute('id', 'substationInfoTd');

        tr2.setAttribute('id', 'substationEquipmentTr');
        td2.setAttribute('id', 'substationEquipmentTd');

        tr3.setAttribute('id', 'moveEDModeTr');
        td3.setAttribute('id', 'moveEDModeTd');

        $(td1).click(function(){
            console.log(this);
            showSubstationInfoItem(clickData);
        }).text("변전소 정보 보기");

        $(td2).click(function(){
            console.log(this);
            showSubstationEquipmentList(clickData);
        }).text("변전소 내부설비 보기");

        $(td3).click(function(){
            console.log(this);
            // moveEDMoveOnSubsClick(clickData);
        }).text("단선도 모드로 이동");

        /*for (var i = 1; i < tableItem.rows.length; i++) {

            tableItem.rows[i].style.cursor = "pointer";
            tableItem.rows[i].onmousemove = function () { this.style.backgroundColor = "#ffb6a8"; this.style.color = "#FFFFFF"; };
            tableItem.rows[i].onmouseout = function () { this.style.backgroundColor = ""; this.style.color = ""; };

        }*/

        tr1.style.borderBottom = "1px solid #000";
        tr1.style.borderBottomWidth = "1px";
        tr1.style.borderBottomColor = "#000";
        tr1.style.borderBottomStyle = "solid";

        tr2.style.borderBottom = "1px solid #000";
        tr2.style.borderBottomWidth = "1px";
        tr2.style.borderBottomColor = "#000";
        tr2.style.borderBottomStyle = "solid";

        $(tr1).append(td1);
        $(tr2).append(td2);
        $(tr3).append(td3);
        $(tbody).append(tr1);
        $(tbody).append(tr2);
        $(tbody).append(tr3);
    }

    $(tableItem).append(tbody);

    return tableItem;
}
function makeHeaderInfo(flag, table, items){
    var titleCell = table.insertRow(0).insertCell(0);
    var tableCell = table.insertRow(1).insertCell(0);
    var idCell = table.insertRow(2).insertCell(0);

    if(flag == 'SW'){
        titleCell.innerHTML = '선택 객체 정보';
    }
    else if(flag == 'SS'){
        titleCell.innerHTML = '변전소 선택';
    }

    tableCell.innerHTML = 'Table : ' + items[0];
    idCell.innerHTML = 'Id : ' + items[1];
}
function showSubstationInfoItem(clickItemData){
    // alert('select Menu : showSubstationInfoItem');
    // console.log(document.getElementById('subsinfo'));

    disposeContextPopup();

   /* $("#subsinfo").modal();*/
    // initSubsInfo(clickItemData);

    $('#substInfoTab').click();
}
function showSubstationEquipmentList(clickItemData){
    // alert('select Menu : showSubstationEquipmentList');


    disposeContextPopup();

   /* $("#subsinfo").modal();*/
    // initSubsInfo(clickItemData);

    $('#substEquipmentTab').click();
}
/*
function moveEDMoveOnSubsClick(clickItemData){
    console.log(clickItemData.properties.substcd);
    callElectricalDiagram_displayMode(clickItemData.properties.substcd);

    disposeContextPopup();
}
*/
function createMoveEDModeButtonMenu(clickData){
    // return "<input type=\"button\" id=\"moveEDMode\" value=\"단선도 모드로 이동\" onclick=\"moveEDMoveOnSubsClick(" + clickData + ")\">"
    /*return "<li class=\"dropdown dropdown-big\" style=\"box-shadow:5px 0 5px -5px  #C0C0C0;width: 200px\">"
        + "<a class=\"dropdown-toggle\" id=\"MoveElectricalDiagramModeBtn\" onclick=\"moveEDMoveOnSubsClick(" + clickData + ")\">단선도 모드로 이동</a></li>"*/
    // return "<button type=\"button\" class=\"btn\" id=\"MoveElectricalDiagramModeBtn\" onclick=\"moveEDMoveOnSubsClick(" + clickData + ")\">단선도 모드로 이동</button>";

    var tableItem = document.createElement("table");
    var tbody = document.createElement("tbody");

    var tr1 = document.createElement("tr");
    var td1 = document.createElement("td");
    var tr2 = document.createElement("tr");
    var td2 = document.createElement("td");
    /*
    var tr3 = document.createElement("tr");
    var td3 = document.createElement("td");
    */

    var btnMove = document.createElement("button");
    var btnInfo = document.createElement("button");

    tr1.setAttribute('id', 'substationInfoTr');
    td1.setAttribute('id', 'substationInfoTd');

    tr2.setAttribute('id', 'moveElectricalDiagramModeTr');
    td2.setAttribute('id', 'moveElectricalDiagramModeTd');

/*
    tr3.setAttribute('id', 'moveEDModeTr');
    td3.setAttribute('id', 'moveEDModeTd');
    */

    td1.style.padding = "11px";
    $(td1).text("[ " + clickData.properties.substnm + " ] 변전소");

    btnMove.setAttribute("class", "btn");
    btnMove.setAttribute("id", "moveElectricalDiagramModeBtn");
    $(btnMove).click(function(){
        console.log(this);
        // selectTreeViewItem(clickItemData.properties.substcd);
        $("#oneLineDiagram").click();
        // moveEDMoveOnSubsClick(clickItemData.properties.substcd);
    }).text("단선도 모드로 이동");

    $(td2).append(btnMove);

    /*
        $(td2).click(function(){
            console.log(this);
            showSubstationEquipmentList(clickData);
        }).text("변전소 내부설비 보기");

        $(td3).click(function(){
            console.log(this);
            moveEDMoveOnSubsClick(clickData);
        }).text("단선도 모드로 이동");*/

    /*for (var i = 1; i < tableItem.rows.length; i++) {

        tableItem.rows[i].style.cursor = "pointer";
        tableItem.rows[i].onmousemove = function () { this.style.backgroundColor = "#ffb6a8"; this.style.color = "#FFFFFF"; };
        tableItem.rows[i].onmouseout = function () { this.style.backgroundColor = ""; this.style.color = ""; };

    }
    tr1.style.borderBottom = "1px solid #000";
    tr1.style.borderBottomWidth = "1px";
    tr1.style.borderBottomColor = "#000";
    tr1.style.borderBottomStyle = "solid";

    tr2.style.borderBottom = "1px solid #000";
    tr2.style.borderBottomWidth = "1px";
    tr2.style.borderBottomColor = "#000";
    tr2.style.borderBottomStyle = "solid";
    */

    $(tr1).append(td1);
    $(tr2).append(td2);
    // $(tr3).append(td3);
    $(tbody).append(tr1);
    $(tbody).append(tr2);
    // $(tbody).append(tr3);


    $(tableItem).append(tbody);

    return tableItem;
}
/*function showAlgorithmListItem(clickItemData){
    // alert('select Menu : showAlgorithmListItem');

    var element = overlay.getElement();
    disposeContextPopup(element);

    $("#subsinfo").modal();
    initSubsInfo(clickItemData);

    $('#algorithmListTab').click();
}*/
function disposeContextPopup() {
    var element = overlay.getElement();
    $(element).popover('dispose');
    vectorSource.clear();
}
function initSubsInfo(clickItemData){
    $("#substnm").val(clickItemData.substnm);
    $("#substcd").val(clickItemData.substcd);
    $("#pwrmngdept").val(clickItemData.pwrmngdept);
}
function getSubstationId(){
    var resturnValue = $("#subs_id").val();
    return resturnValue;
}
function getSubsIdValue(){
    $.ajax({
        type: "POST"
        , url: "/electrical_diagram_gis/request_subsid_using_substcd"
        , data: { 'substcd': $("#substcd").val() }
        , success:function(data){
            // console.log('substcd data : ', data);
            if(data.length > 0){
                $("#subs_id").val(data[0].subs_id);
            }
        }
        , error:function(data) {
            console.log('[Client] Extent Error Data : ', data);
            console.log('Ajax Error!');
        }
    });
}
function createCoordinateList(){
    subsCoordinateMap = new Map();
    var nullDataSymbol = "Not_Exist_Data";

    var str = returnCoordinateString();

    var splitRes = str.split("\n");

    for(var i=0; i< splitRes.length; i++){
        var splitForData = splitRes[i].split(",");
        var valueMap = new Map();
        var coordiArr = [splitForData[3], splitForData[4]];
        valueMap.set('subs_id', splitForData[0]);
        valueMap.set('subs_nm', splitForData[2]);
        valueMap.set('subs_coordinate', coordiArr);

        subsCoordinateMap.set(splitForData[1], valueMap);
    }

}
function getSubsCoordinateMap(){
    return subsCoordinateMap;
}
function moveSelectedSubsCoordinate(subs_no){
    disposeContextPopup();
    /*
     지도에서 변전소를 클릭했을 때와 트리에서 변전소를 선택했을 때를 구분하기 위함
     - 지도에서 클릭 : 이동 효과 없음/ 메뉴 출력 있음/ 트리 선택 처리 (호출)
     - 트리에서 클릭 : 이동 효과 있음/ 메뉴 출력 없음/ 트리 선택 처리 (자동)
     */

    // console.log($("#callFlag").val());
    if(getCallObjFlag() === 'GIS'){
        setCallObjFlag('TreeView');
        return;
    }


    var selectedSubsItem = subsCoordinateMap.get(subs_no);

    if(selectedSubsItem !== undefined){
        moveToSelectedSubstation(selectedSubsItem.get('subs_coordinate'), function() {});
    }
    else{
        alert('선택한 변전소의 GIS 정보가 없습니다.');
    }

}
function moveToSelectedSubstation(location, done) {

    map.getView().setResolution(expandSymbolResolution);
    var view = map.getView();
    var duration = 2000;
    var zoom = view.getZoom();
    var parts = 2;
    var called = false;
    function callback(complete) {
        --parts;
        if (called) {
            return;
        }
        if (parts === 0 || !complete) {
            called = true;
            createHighlightFeature('', location);
            done(complete);
        }
    }
    view.animate({
        center: location,
        duration: duration
    }, callback);
    view.animate({
        zoom: zoom - 1,
        duration: duration / 2
    }, {
        zoom: zoom,
        duration: duration / 2
    }, callback);
}
function setRightSelectedInfoTabData(propData){

    var subs_id = subsCoordinateMap.get(propData.substcd).get('subs_id');

    if(subs_id === "Not_Exist_Data"){
        subs_id = "";
    }

    var objInfo = {
        type: "subs",
        value: [subs_id, "SUBSTATION", propData.substcd, propData.substnm]
    };

    showInfoRightMenu(objInfo);
}
function selectTreeViewItem(subst_cd){
    var treeViewObject = $('#showListDiv').data('treeview'),
        allCollapsedNodes = treeViewObject.getCollapsed(),
        allExpandedNodes = treeViewObject.getExpanded(),
        allNodes = allCollapsedNodes.concat(allExpandedNodes);

    var selectedSubstationNode;

    if(treeViewObject.getSelected().length > 0 || treeViewObject.getExpanded().length > 1){
        // treeViewObject.collapseAll();
        treeViewObject.collapseNode(treeViewObject.getSelected());
        treeViewObject.unselectNode(treeViewObject.getSelected());
    }

    for(var i=0; i<allNodes.length; i++){
        if(allNodes[i].type === "ROOT"){
            treeViewObject.expandNode(allNodes[i]);
        }
        if(allNodes[i].type === "SUBSTATION"){
            // $('#showListDiv').treeview('collapseNode', allNodes[i].id);
            if(allNodes[i].no === subst_cd){
                console.log('type : ', allNodes[i].type);
                console.log('no : ', allNodes[i].no);
                console.log('name : ', allNodes[i].name);
                selectedSubstationNode = allNodes[i];
                break;
            }
        }
    }

    if(selectedSubstationNode !== undefined){
        if(getCallObjFlag() === "Login"){
            setCallObjFlag('TreeView');
        }
        else {
            setCallObjFlag('GIS');
        }

        treeViewObject.selectNode(selectedSubstationNode);
        treeViewObject.expandNode(selectedSubstationNode);


    }
}
function getCallObjFlag(){
    return $("#callFlag").val();
}
function setCallObjFlag(flag) {
    return $("#callFlag").val(flag);
}
function drawEquipmentOnCanvas(){

    canvasItem = document.createElement('canvas');
    canvasItem.width = canvasWidth;
    canvasItem.height = canvasHeight;

    var context = canvasItem.getContext('2d');
    // begin custom shape
    // var c = document.getElementById("myCanvas");
    // var ctx = c.getContext("2d");
    // Create gradient
    var grd = context.createLinearGradient(957425.78125, 1843250,200,0);
    grd.addColorStop(0,"red");
    grd.addColorStop(1,"white");
    // Fill with gradient
    context.fillStyle = grd;
    context.fillRect(10,10,150,80);

    // complete custom shape
    context.closePath();
    context.lineWidth = 5;
    // context.fillStyle = '#8ED6FF';
    // context.fill();
    context.strokeStyle = 'blue';
    context.stroke();
}
function createHighlightFeature(clickItem, clickCoordinate) {
    vectorSource.clear();
    var feature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([12.5, 41.9]))
        // geometry: new ol.geom.MultiPolygon(clickCoordinate),
        // labelPoint: new ol.geom.Point(labelCoords),
        // name: 'select Substation Item'
    });

    if(map.getView().getResolution() <= expandSymbolResolution){
        substHighlightStyle.getImage().setRadius(70);
    }else{
        substHighlightStyle.getImage().setRadius(30);
    }
    feature.setStyle(substHighlightStyle);
    /*feature.setStyle(new ol.style.Style({
        image: new ol.style.Icon(/!** @type {olx.style.IconOptions} *!/ ({
            color: '#4271AE',
            crossOrigin: 'anonymous',
            src: 'https://openlayers.org/en/v4.6.5/examples/data/dot.png'
        }))
    }));*/
    // feature.getGeometry().setCoordinates(clickItem.geometry.coordinates[0]);
    var setCoordinate = [Number(clickCoordinate[0]),  Number(clickCoordinate[1])];

    feature.getGeometry().setCoordinates(setCoordinate);
    console.log('clickCoordinate : ', clickCoordinate);
    console.log('setCoordinate : ', setCoordinate);

    vectorSource.addFeature(feature);

    // console.log('getResolution : ', map.getView().getResolution()); //76.35146091935201

}
function returnCoordinateString(){
    var str =
        "15,2205,신탄진,14185906.7782877,4362087.34997874\n"+
        "16,2672,동대전,14185914.9292228,4350168.88711222\n"+
        "Not_Exist_Data,2215,남대전,14188167.2839532,4342632.20414575\n"+
        "17,S505,신흥,14186620.687715,4345250.54193683\n"+
        "4,2203,서대전,14179063.6074122,4345896.85007131\n"+
        "5,2207,대덕,14179584.2832919,4353091.68693917\n"+
        "3,2512,두마,14163261.8639281,4341858.66714357\n"+
        "1,2671,덕진,14179901.0313951,4358811.5095661\n"+
        "6,2673,둔산,14179516.1019193,4349875.95086447\n"+
        "2,S502,가수원,14174965.1753825,4341850.20300822\n"+
        "8,2786,유천,14181089.9806335,4344483.49218188\n"+
        "7,S504,유성,14172697.5539059,4352964.48970112\n"+
        "11,2680,대화,14183713.6527561,4352385.31262976\n"+
        "Not_Exist_Data,2490,금산,14192675.4468449,4315637.4881047\n"+
        "Not_Exist_Data,2200,은진,14149755.3384295,4325166.48672054\n"+
        "Not_Exist_Data,S521,논산,14143210.4441832,4331235.03890592\n"+
        "Not_Exist_Data,2462,공주,14155417.887497,4367162.96135876\n"+
        "Not_Exist_Data,2823,신풍,14130513.6470832,4367985.31980744\n"+
        "Not_Exist_Data,2209,조치원,14168095.5170096,4382349.83817811\n"+
        "12,S517,월산,14170602.172383,4372330.58582187\n"+
        "Not_Exist_Data,S501,전의,14161686.5359167,4397685.15635474\n"+
        "Not_Exist_Data,S507,불당,14150475.5272344,4413518.41826839\n"+
        "Not_Exist_Data,2610,성거,14160918.9384384,4422936.2120356\n"+
        "Not_Exist_Data,2676,서천안,14150637.4532963,4419528.84864277\n"+
        "Not_Exist_Data,2764,인주,14124085.161388,4417848.27383111\n"+
        "Not_Exist_Data,2724,천안,14156165.22401,4410313.26054269\n"+
        "Not_Exist_Data,S520,동천안,14174272.3953579,4407133.8452439\n"+
        "Not_Exist_Data,2824,옥산,14112884.4053416,4326726.5784955\n"+
        "Not_Exist_Data,2439,부여,14131389.4282023,4341716.75054724\n"+
        "Not_Exist_Data,2437,청양,14114025.9055477,4365283.6909607\n"+
        "Not_Exist_Data,2051,예산,14118184.3269172,4401856.30988622\n"+
        "Not_Exist_Data,2765,대산,14072506.6910047,4436003.73485254\n"+
        "Not_Exist_Data,2044,서산,14078028.3713972,4410873.70854944\n"+
        "Not_Exist_Data,2822,관창,14091004.3657564,4353375.4871905\n"+
        "Not_Exist_Data,2238,대천,14093042.1908829,4343276.92327813\n"+
        "Not_Exist_Data,Z231,외연,14034615.9626639,4331822.11515922\n"+
        "Not_Exist_Data,Z235,녹도,14055779.6819498,4337441.19479623\n"+
        "Not_Exist_Data,Z232,장고도,14063853.1335219,4354339.8421057\n"+
        "Not_Exist_Data,Z233,고대도,14067015.1585559,4354642.08068779\n"+
        "Not_Exist_Data,Z230,삽시도,14065977.5464104,4349058.97916575\n"+
        "Not_Exist_Data,2489,홍성,14100834.5408202,4386069.401736\n"+
        "Not_Exist_Data,2319,장항,14105482.3743806,4305683.25460457\n"+
        "Not_Exist_Data,2229,당진,14104730.8117233,4425452.72929495\n"+
        "Not_Exist_Data,2826,송악,14111725.5537377,4434065.91841135\n"+
        "Not_Exist_Data,2787,신당진,14091004.8260206,4418909.2907267\n"+
        "Not_Exist_Data,2675,태안,14058286.9411721,4403318.37392164\n"+
        "Not_Exist_Data,S523,안면,14063219.638178,4380664.38198936\n"+
        "Not_Exist_Data,2670,아산,14129136.867161,4410081.33852692\n"+
        "Not_Exist_Data,S506,둔포,14147220.5352686,4427936.31026377\n"+
        "Not_Exist_Data,S516,탕정,14144247.0399874,4415127.28164492\n"+
        "Not_Exist_Data,2482,온양,14142089.3769339,4406560.0421018\n"+
        "13,2743,신일,14182231.3936327,4361388.17980295\n"+
        "10,S524,둔지,14179533.3183251,4349813.30172793\n"+
        "9,S525,송강,14181653.5650583,4359557.93646717\n"+
        "Not_Exist_Data,S527,한샘,14150148.0918713,4420331.99684403\n"+
        "Not_Exist_Data,S530,해미,14087982.8556167,4401178.57580997\n"+
        "Not_Exist_Data,S526,신온양,14138344.5052328,4422325.92052128\n"+
        "Not_Exist_Data,S333,서운,14166689.7188822,4427364.55834898\n"+
        "Not_Exist_Data,S528,장재,14149644.3805337,4409950.21064279\n"+
        "Not_Exist_Data,S529,용운,14188619.6767106,4347932.88409904\n"+
        "Not_Exist_Data,Z220,가의,14033965.497782,4393838.76858819\n"+
        "Not_Exist_Data,Z234,호도,14055218.6988394,4342237.4627786\n"+
        "Not_Exist_Data,D455,서세종,14164615.8505725,4365120.1987566\n"+
        "Not_Exist_Data,S510,서천TP,14081377.7333057,4319674.73859091\n"+
        "Not_Exist_Data,D352,석곡변전소,14144789.6545009,4426333.23112028\n"+
        "Not_Exist_Data,D353,추부,14192623.8063617,4331301.92847752\n"+
        "Not_Exist_Data,SC01,진안,14194834.0861538,4298336.94596713\n"+
        "Not_Exist_Data,D354,은하,14092103.5878063,4372630.6680335\n"+
        "Not_Exist_Data,S522,성연,14075519.650318,4417555.29879508\n"+
        "Not_Exist_Data,S419,부강,14178829.9702172,4372417.44656224\n"+
        "Not_Exist_Data,D360,풍세,14149144.0173691,4402277.63554164\n"+
        "Not_Exist_Data,2508,청원변전소,14179649.5095971,4378106.24835219\n"+
        "Not_Exist_Data,D521,석문,14088285.5096127,4440234.79148974\n"+
        "Not_Exist_Data,D355,응봉,14109343.49827,4393338.24190917\n"+
        "Not_Exist_Data,S528,장재,14148113.2357258,4411320.23987453"
    ;

    return str;
}
// Remove customFeature interactions
/* function removeCfInteractions() {
    map.removeInteraction(cfDraw);
    map.removeInteraction(cfSnap);
    map.removeInteraction(cfModify);
    map.removeInteraction(cfSelect);
}
document.getElementById('removeAll').onclick = function(){
    removeCfFeatures();
}

document.getElementById('sendCfData').onclick = function(){
    alert('in : sendCfData');
    var tempCfArr = cfVector.getSource().getFeatures();
    console.log('tempCfArr :', tempCfArr);
    // url: 'http://10.216.81.118:8080/geoserver/' + getGISStoreName + '/wms',

    // var sendMapData = [{'type': tempCfArr[0]["O"].fType, 'point': tempCfArr[0]["O"].geometry.A},
    //     {'type': tempCfArr[1]["O"].fType, 'point': tempCfArr[1]["O"].geometry.A}];

    var sendMapData = [{}];

    for(var i=0; i< tempCfArr.length; i++){

        console.log('i : ', i);
        console.log('i data : ', tempCfArr[i]["O"]);
        var tmpData = tempCfArr[i]["O"];
        console.log('tmpData : ', tmpData);

        sendMapData[i] =  { 'featureType' : tmpData.fType, 'point' : tmpData.geometry.A, 'xp': tmpData.geometry.xp };
        // sendMapData[i].point = tmpData.geometry.A;
    }

    // console.log('sendMapData :', sendMapData);
    // console.log('item : ', sendMapData[0]);
    // console.log('type: ', typeof(sendMapData), 'type : ',  typeof(sendMapData[0]));

    var jsonMap = JSON.stringify(sendMapData);
    // console.log('json type : ', typeof(jsonMap));
    $.ajaxSettings.traditional = true;
    $.ajax({
        url: 'geo_data_result',
        type:'POST',
        dataType: 'json',
        data: { 'sendMapData': jsonMap },
        // dataType: 'json',
        success:function(result) {
            alert("완료!");
        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log("에러 발생 \n" + textStatus + " : " + errorThrown);
        }
    });
}


// 그리기 모드 변경시 수행
cfType.onchange = function() {
    map.removeInteraction(cfDraw);
    map.removeInteraction(cfSnap);
    map.removeInteraction(cfModify);
    map.removeInteraction(cfSelect);
    addCfInteractions();
};
addCfInteractions();


var displayFeatureInfo = function(pixel) {

    var feature = map.forEachFeatureAtPixel(pixel, function (feature) {
        return feature;
    });
    console.log('pixel: ', pixel);
    console.log('feature: ', feature);

    // var info = document.getElementById('info');
    // if (feature) {
    //     info.innerHTML = feature.getId() + ': ' + feature.get('name');
    // } else {
    //     info.innerHTML = '&nbsp;';
    // }
}



map.on('pointermove', function(evt) {
    if (evt.dragging) {
        return;
    }
    if (cfType.value!=='Select'){
        return;
    }
    console.log('in pointermove');
    var pixel = map.getEventPixel(evt.originalEvent);
    displayFeatureInfo(pixel);
});

map.on('click', function(evt) {
    if (cfType.value!=='Select'){
        return;
    }
    console.log('in click');
    displayFeatureInfo(evt.pixel);
});

var format = 'image/png';
var untiled = new ol.layer.Image({
    source: new ol.source.ImageWMS({
        ratio: 1,
        url: 'http://10.216.81.118:8080/geoserver/' + getGISStoreName + '/wms',
        params: {'FORMAT': format,
            'VERSION': '1.1.1',
            STYLES: '',
            LAYERS: '' + getGISStoreName + ':cnGISGroupLayers',
        }
    })
});


map.getView().fit(bounds, map.getSize());
map.on('singleclick', function(evt) {
    document.getElementById('nodelist').innerHTML = "Loading... please wait...";
    var view = map.getView();
    var viewResolution = view.getResolution();
    // var source = untiled.get('visible') ? untiled.getSource() : tiled.getSource();
    var source = layers[0].getSource();
    console.log('source: ', source);
    var url = source.getGetFeatureInfoUrl(
        evt.coordinate, viewResolution, view.getProjection(),
        {'INFO_FORMAT': 'text/html', 'FEATURE_COUNT': 50});
    console.log('url: ', url);
    if (url) {
        document.getElementById('nodelist').innerHTML = '<iframe seamless src="' + url + '"></iframe>';
    }
});


var layers= [
    new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: 'http://10.216.81.118:8080/geoserver/' + getGISStoreName + '/wms',
            params: {
                'VERSION': '1.1.1',
                tiled: false,
                STYLES: '',
                LAYERS: '' + getGISStoreName + ':hubpop_presentation_layer',
                tilesOrigin: 1040823.11525 + "," + 1852591.84775
            }
        })
    })
];
/!* openlayers4 map *!/
var map = new ol.Map({
    target: 'map',
    layers: layers ,
    view: new ol.View({
        center: ol.proj.fromLonLat([126.8958600238, 33.4772999771]),
        zoom: 14
    })
});

/!* customFeature *!/
var cfType = document.getElementById('cfType');
var cfText = document.getElementById('cfTextInput');
var cfSize = document.getElementById('cfSizeInput');
var cfColor = document.getElementById('cfColorInput');

var cfSource = new ol.source.Vector();
var cfVector = new ol.layer.Vector({
    source: cfSource,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: cfColor.value
        }),
        stroke: new ol.style.Stroke({
            color: cfColor.value,
            width: cfSize.value
        }),
        image: new ol.style.Circle({
            radius: cfSize.value,
            fill: new ol.style.Fill({color: cfColor.value})
        })
    })
});

// Add customFeature layer
map.addLayer(cfVector);

var cfDraw, cfSnap, cfModify, cfSelect;

// Text default style
var cfTextStyle = function () {
    return [
        new ol.style.Style({
            text: new ol.style.Text({
                font: '12pt Calibri,sans-serif',
                fill: new ol.style.Fill({ color: '#000' }),
                stroke: new ol.style.Stroke({
                    color: '#fff', width: 2
                }),
                text: this.get('text')
            })
        })
    ];
};


// Add customFeature interactions
function addCfInteractions() {
    if(cfType.value==='Delete'){
        // Delete feature
        cfSelect = new ol.interaction.Select();
        cfSelect.getFeatures().on('add', function(feature){
            console.log('[Client]feature : ', feature);
            if(typeof(feature.element.get('fType'))=='undefined'){
                return;
            }
            cfSource.removeFeature(feature.element);
            feature.target.remove(feature.element);
        });
        map.addInteraction(cfSelect);
        cfSnap = new ol.interaction.Snap({source: cfSource});
        map.addInteraction(cfSnap);
    }else if(cfType.value==='Modify'){// Modify feature
        // modifyControlValue
        if(confirm('DB에서 읽어온 객체를 이동하시겠습니까?')){
            modifyControlValue = 'DB';
        }else{
            modifyControlValue = 'CUSTOM';
            cfSelect = new ol.interaction.Select();
            cfSelect.on('select', function (e) {
                if(e.selected.length > 0) {
                    if(typeof(e.selected[0].get('fType'))=='undefined'){
                        return;
                    }
                    // Modify feature (Text)
                    if(e.selected[0].get('fType')==='Text'){
                        e.selected[0].setStyle(
                            new ol.style.Style({
                                image: new ol.style.Circle({
                                    radius: cfSize.value
                                }),
                                text: new ol.style.Text({
                                    font: cfSize.value+'px Calibri,sans-serif',
                                    fill: new ol.style.Fill({ color: cfColor.value }),
                                    stroke: new ol.style.Stroke({
                                        color: '#FFFFFF', width: 2
                                    }),
                                    text: cfText.value
                                })
                            })
                        );
                        // Modify feature (Other features)
                    }else{
                        e.selected[0].setStyle(
                            new ol.style.Style({
                                stroke: new ol.style.Stroke({
                                    color: cfColor.value,
                                    width: cfSize.value
                                }),
                                fill : new ol.style.Fill({
                                    color: cfColor.value
                                }),
                                image: new ol.style.Circle({
                                    radius: cfSize.value,
                                    fill: new ol.style.Fill({
                                        color: cfColor.value
                                    })
                                })
                            })
                        );
                    }
                }
                cfSource.changed();
            });
            cfSelect.getFeatures().clear();
            map.addInteraction(cfSelect);
            cfSnap = new ol.interaction.Snap({source: cfSource});
            map.addInteraction(cfSnap);
            cfModify = new ol.interaction.Modify({source: cfSource, style: []});
            map.addInteraction(cfModify);
        }
        console.log('[Client] modifyControlValue : ', modifyControlValue);
        //Modify End
    }else if(cfType.value==='Text'){
        // Draw feature (Text)
        cfDraw = new ol.interaction.Draw({
            source: cfSource,
            type: 'Point'
        });
        cfDraw.on('drawend', function(e) {
            e.feature.setStyle(
                new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: cfSize.value
                    }),
                    text: new ol.style.Text({
                        font: cfSize.value+'pt Calibri,sans-serif',
                        fill: new ol.style.Fill({ color: cfColor.value }),
                        stroke: new ol.style.Stroke({
                            color: '#FFFFFF', width: 2
                        }),
                        text: cfText.value
                    })
                })
            );
            e.feature.set('fType', 'Text');
        });
        map.addInteraction(cfDraw);
        cfSnap = new ol.interaction.Snap({source: cfSource});
        map.addInteraction(cfSnap);
    }
    /!*else if (cfType.value==='Select'){

        cfSelect = new ol.interaction.Select();
        var tempSource = layers[0].getSource();
        cfSelect.on('select', function (e) {
            if(e.selected.length > 0) {
                if(typeof(e.selected[0].get('fType'))=='undefined'){
                    return;
                }
                alert('Select Mode Click!');
                e.selected[0].setStyle(
                    new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: cfColor.value,
                            width: cfSize.value
                        }),
                        fill : new ol.style.Fill({
                            color: cfColor.value
                        }),
                        image: new ol.style.Circle({
                            radius: cfSize.value,
                            fill: new ol.style.Fill({
                                color: cfColor.value
                            })
                        })
                    })
                );
            }
            tempSource.changed();
        });
        cfSelect.getFeatures().clear();
        map.addInteraction(cfSelect);
        cfSnap = new ol.interaction.Snap({source: tempSource});
        map.addInteraction(cfSnap);
        cfModify = new ol.interaction.Modify({source: tempSource, style: []});
        map.addInteraction(cfModify);
    }*!/
    else{
        // Draw feature (Other features)
        cfDraw = new ol.interaction.Draw({
            source: cfSource,
            type: cfType.value
        });
        cfDraw.on('drawend', function(e) {
            e.feature.setStyle(
                new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: cfColor.value
                    }),
                    stroke: new ol.style.Stroke({
                        color: cfColor.value,
                        width: cfSize.value
                    }),
                    image: new ol.style.Circle({
                        radius: cfSize.value,
                        fill: new ol.style.Fill({
                            color: cfColor.value
                        })
                    })
                })
            );
            e.feature.set('fType', cfType.value);
        });
        map.addInteraction(cfDraw);
        cfSnap = new ol.interaction.Snap({source: cfSource});
        map.addInteraction(cfSnap);
    }
}
// Remove all features
function removeCfFeatures() {
    var features = cfVector.getSource().getFeatures();
    features.forEach(function(feature) {
        cfVector.getSource().removeFeature(feature);
    });
}
*/

