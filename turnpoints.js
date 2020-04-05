	const scPathToIcons = "";
	const scCDNURL = "http://rasp.mrsap.org/cdn/viewer/"; // was "http://cdn.mrsap.org/viewer/"; // was
	const scTPJSONFile = scCDNURL + "bgaturnpoints_full.json";
	var gTPGeoJson;
	var gGeoJsonA;
	var gGeoJsonC;
	var gGeoJsonD;
	var gGeoJsonE;
	var gGeoJsonG;
	var gGeoJsonX;
	
    var giGreenTPIcon = new L.icon({
        iconUrl: scPathToIcons+'iconGreen.png',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -5]
    });
    var giCyanTPIcon = new L.icon({
        iconUrl: scPathToIcons+'iconCyan.png',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -5]
    });
    var giMagentaTPIcon = new L.icon({
        iconUrl: scPathToIcons+'iconMagenta.png',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -5]
    });
    var giBlueTPIcon = new L.icon({
        iconUrl: scPathToIcons+'iconBlue.png',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -5]
    });
    var giWhiteTPIcon = new L.icon({
        iconUrl: scPathToIcons+'iconWhite.png',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -5]
    });

	
// end of main body
// ------------------------------------------------------------------------------------------------	
function onEachTPFeature(feature, layer) {
	if (feature.properties && feature.properties.description) {
		layer.bindPopup("<em>"+feature.properties.description+"</em><br>Feature: "+feature.properties.exactpoint+"<br>Cat: "+feature.properties.category).bindTooltip(feature.properties.name + " ["+feature.properties.category+"]").openTooltip();
	}
	// use different icon depending on category
	if (feature.properties && feature.properties.category) {
	    // get first character of type
	    var sCategory =feature.properties.category.charAt(0);
	    // assign right colour icon
	    // Cat "A" is green
	    if (sCategory == "A"){
	        layer.setIcon(giGreenTPIcon);
	    } else {
	        // Cat "B" is light blue
	        if (sCategory == "B"){
	            layer.setIcon(giCyanTPIcon);
	        } else {
    	        if (sCategory == "C"){ // or C# C##
    	            layer.setIcon(giMagentaTPIcon);
    	        } else {
    	            // must be D or D# D##
        	        if (sCategory == "D"){ // or D# D##
        	            layer.setIcon(giBlueTPIcon);
        	        } else {
        	            // set white as a catcha ll
        	            layer.setIcon(giWhiteTPIcon);
        	        }
    	        }
	        }
	    }
	}	
}
// ------------------------------------------------------------------------------------------------
function style(feature) {
  return {
	fillColor: "#FCB81E",
	weight: 2,
	opacity: 1,
	color: "#CCCCCC",
	fillOpacity: 0.7
  };
}
// ------------------------------------------------------------------------------------------------
var giBlueASCatIcon = new L.icon({
	iconUrl: 'blue-dot.png',
	iconSize: [20, 20],
	iconAnchor: [10, 20],
	popupAnchor: [10, 20]
});
// ------------------------------------------------------------------------------------------------
function AirSpaceStyle(feature) {
	return {
		weight: 2,
		opacity: 1
	};
}
// ------------------------------------------------------------------------------------------------
function onEachClassFeature(feature, layer) {
	if (feature.properties && feature.properties.description) {
		layer.bindPopup(
				feature.properties.name+"<em>"+feature.properties.description+"</em>"
				).bindTooltip(feature.properties.name).openTooltip();
		
		if (layer instanceof L.Marker) {
			layer.setIcon(giBlueASCatIcon);
		}
	}
}
// ------------------------------------------------------------------------------------------------
