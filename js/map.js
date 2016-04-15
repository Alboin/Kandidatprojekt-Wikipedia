/*******************************************************************************************************
 
	Filen innehåller funktioner som hanterar kartan. 
	Det är främst Albin och Sarah som har koll på denna fil :)

********************************************************************************************************/


//Global variables
var map;
var myLayer;


//This function will be run once the page has loaded.
function generateMap() {

	//Set map width and height so that it fills the screen.
	document.getElementById("map").style.width = window.innerWidth + "px";
	document.getElementById("map").style.height = window.innerHeight + "px";

	//Needed to get access to mapbox.
	L.mapbox.accessToken ='pk.eyJ1Ijoic2FyYWh5ZWFoaCIsImEiOiJjaWx4dGw5M2gwMGc0dW9tNGk1M3JnbWI1In0.Zo28bpcbm5VxdSkJ0qXC8A';

	//Create map, light version and disable attributes. Set start-position and zoom-level.
	map = L.mapbox.map('map', 'mapbox.light', {attributionControl: false})
    .setView([0,0], 2);

    //Create D3 overlay
    //var svg = d3.select(map.getPanes().overlayPane).append("svg");
    //var g = svg.append("g").attr("class", "leaflet-zoom-hide");

    //Create circle in D3 and display on map.
    //var circle = svg.append("circle").attr("cx", 25).attr("cy", 25).attr("r", 20).attr("id", "svart").style("fill", "green");


	//Lagren för kartan med en popup. 
	myLayer = L.mapbox.featureLayer().addTo(map);

}

function addArticleToMap(coordinate, title, sentence) {

	//Add marker at article coordinates
	/*myLayer.setGeoJSON([{
	        type: 'Feature',
	        geometry: {
	            type: 'Point',
	            coordinates: [coordinate[1], coordinate[0]]
	        },
	        properties: {
	            title: title,
	            description: '<button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#myModal">Modal</button>',
	            'marker-id': 'marker-1',
	           // 'marker-color': '#f86767'

	        }
	    }
	]);*/


	//Den med rätt popup...
	var marker = L.marker([coordinate[0], coordinate[1]], {
    	  icon: L.mapbox.marker.icon({
        	 'marker-color': '#000000'
      })
    })
    .bindPopup('<div class="marker-title">' + title + '</div>' +'<a href data-toggle="modal" data-target="#myModal">Läs mer...</a>')
    .addTo(map);


	//Infobox to the right on the map
	var info = document.getElementById('info');

	// Iterate through each feature layer item, build a
	// marker menu item and enable a click event that pans to + opens
	// a marker that's associated to the marker item.
	myLayer.eachLayer(function(marker) {
		var link = info.appendChild(document.createElement('a'));
		link.className = 'item';
		link.href = '#';

		// Populate content from each markers object.
		link.innerHTML = marker.feature.properties.title + '<br /><small>' + marker.feature.properties.description + '</small>';
		
		link.onclick = function() {
		
			if (/active/.test(this.className)) {
			    this.className = this.className.replace(/active/, '').replace(/\s\s*$/, '');
			} 

			else {
			    var siblings = info.getElementsByTagName('a');
			    
			    for (var i = 0; i < siblings.length; i++) {
			    	siblings[i].className = siblings[i].className.replace(/active/, '').replace(/\s\s*$/, '');
			    };

			    this.className += ' active';
			    // When a menu item is clicked, animate the map to center
			    // its associated marker and open its popup.
			    map.panTo(marker.getLatLng());
			    marker.openPopup();
			    }
		    
		    return false;
		  };
	});
}

function hideStartpage() {
	$("#upper_row").slideToggle("slow");
}
