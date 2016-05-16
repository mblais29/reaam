$(document).ready(function(){
	/****************************************
	ADDING GOOGLE MAP LAYERS
	****************************************/
	
	var map = new L.Map('map', {center: new L.LatLng(54.0000, -125.0000), zoom: 6});
	      var googleLayerHybrid = new L.Google('HYBRID');  // Possible types: SATELLITE, ROADMAP, HYBRID
		  var googleLayerSatellite = new L.Google('SATELLITE');
		  var googleLayerStreet = new L.Google('ROADMAP');
		  var googleLayerTerrain = new L.Google('TERRAIN');
		  //var esriMapTopo = L.esri.basemapLayer("Topographic");
		  //var esriMapImagery = L.esri.basemapLayer("Imagery");	  
		  map.addLayer(googleLayerHybrid);
		  
	/****************************************
	BASEMAP AND LAYER CONTROL FOR LEGEND
	****************************************/
	
	var baseLayers = {'Google - Street':googleLayerStreet, 'Google - Hybrid':googleLayerHybrid, 'Google - Satellite':googleLayerSatellite, 'Google - Terrain':googleLayerTerrain /*'ESRI - Imagery':esriMapImagery, 'ESRI - Topo':esriMapTopo*/};
	
	L.control.groupedLayers(baseLayers).addTo(map);
});