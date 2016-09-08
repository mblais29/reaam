/****************************************
	GLOBAL VARIABLES
****************************************/
	var navBarMargin = 52;
	
$(window).on('load',function(){
	/****************************************
	ADJUST MAP BASED ON WINDOW HEIGHT
	****************************************/
	
	// Adjust the map div to the screen size first
	$("#map").height($(window).height()- navBarMargin).width($(window).width());
	$(window).on("resize", resize);
	
	
	/****************************************
	ADDING GOOGLE MAP LAYERS
	****************************************/
	var map = L.map('map', {center: new L.LatLng(54.0000, -125.0000), zoom: 6});
		//var map = new L.Map('map', {center: new L.LatLng(54.0000, -125.0000), zoom: 6});
	      // var googleLayerHybrid = new L.Google('HYBRID');  // Possible types: SATELLITE, ROADMAP, HYBRID
		  // var googleLayerSatellite = new L.Google('SATELLITE');
		  // var googleLayerStreet = new L.Google('ROADMAP');
		  // var googleLayerTerrain = new L.Google('TERRAIN');
		  var esriMapTopo = L.esri.basemapLayer("Topographic");
		  var esriMapImagery = L.esri.basemapLayer("Imagery");
        mapLink = 
            '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        var osm = L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink + ' Contributors',
            maxZoom: 18,
            }).addTo(map);;
		map.addLayer(osm);
		  
	/****************************************
	BASEMAP AND LAYER CONTROL FOR LEGEND
	****************************************/
	
	var baseLayers = {'Open Street':osm, 'ESRI - Imagery':esriMapImagery, 'ESRI - Topo':esriMapTopo};
	
	L.control.groupedLayers(baseLayers).addTo(map);
	
	// Initialise the FeatureGroup to store editable layers 
	
	// Other layers - draw, measure layers etc.
	var drawnItems = new L.FeatureGroup(); // for drawn items
	var osm = new L.FeatureGroup(); // for measurements
	
	// Draw control
	var drawControl = new L.Control.Draw({
		draw: { position: 'topleft', 
		polygon: { 
			title: 'Draw a polygon!',
			metric: false,  
			allowIntersection: false, 
			drawError: { color: '#662d91', timeout: 1000 }, 
			shapeOptions: { color: '#662d91' }, 
			showArea: true 
			}, 
			polyline: { metric: false, shapeOptions: { color: '#662d91' } }, 
			circle: { metric: false, shapeOptions: { color: '#662d91' } } 
		}, 
		edit: {
	        featureGroup: drawnItems,
	        remove: true
	    }
	});
	map.addControl(drawControl);
	map.addLayer(drawnItems);
	map.addLayer(osm);
	map.on('draw:created', function (e) { 
		var type = e.layerType, 
		layer = e.layer;  
		if (type === 'marker') {
			var latLon = layer.getLatLng();
			//toFixed(3) allows only three decimal places
			layer.bindPopup('<strong>Latitude:</strong> ' + latLon.lat.toFixed(3) + "<br/><strong>Longitude:</strong> " + latLon.lng.toFixed(3));
		}
		drawnItems.addLayer(layer);
	});
	      
});


/****************************************
	GLOBAL FUNCTIONS
****************************************/

//Resizes Map when window is resized
function resize(){
	$('#map').css("height", ($(window).height() - navBarMargin));
	$('#map').css("width", ($(window).width()));    
}