function generateMap(coordinate) {

	//Accesscode for Mapbox
	mapboxgl.accessToken = 'pk.eyJ1Ijoic2FyYWh5ZWFoaCIsImEiOiJjaWx4dGw5M2gwMGc0dW9tNGk1M3JnbWI1In0.Zo28bpcbm5VxdSkJ0qXC8A';

	//The map starts in this position
	var map = new mapboxgl.Map({
	    container: 'map', // container id
	    style: 'mapbox://styles/mapbox/streets-v8', //stylesheet location
	    center: [coordinate[1], coordinate[0]], // startposition [E, N] (opposite order for coordinates)
	    zoom: 9 // starting zoom
	});

	//Places where there are markers
	var markers = {
	    "type": "FeatureCollection",
	    "features": [{
	        "type": "Feature",
	        "properties": {
	            "description": "<div class=\"marker-title\">Make it Mount Pleasant</div><p><a href=\"http://www.mtpleasantdc.com/makeitmtpleasant\" target=\"_blank\" title=\"Opens in a new window\">Make it Mount Pleasant</a> is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>",
	            "marker-symbol": "marker" //Finns massa att välja på https://www.mapbox.com/maki/
	        },
	        "geometry": {
	            "type": "Point",
	            "coordinates": [coordinate[1], coordinate[0]] //Sveriges koordinater
	        }
	    }, {
		        "type": "Feature",
		        "properties": {
		            "description": "<div class=\"marker-title\">Truckeroo</div><p><a href=\"http://www.truckeroodc.com/www/\" target=\"_blank\">Truckeroo</a> brings dozens of food trucks, live music, and games to half and M Street SE (across from Navy Yard Metro Station) today from 11:00 a.m. to 11:00 p.m.</p>",
		            "marker-symbol": "marker"
		        },
		        "geometry": {
		            "type": "Point",
		            "coordinates": [18.068611, 59.329444] //Stockholm
		        }
		    }]
		};


	map.on('style.load', function () {
	    // Add marker data as a new GeoJSON source.
	    map.addSource("markers", {
	        "type": "geojson",
	        "data": markers
	    });

	    // Add a layer showing the markers.
	    map.addLayer({
	        "id": "markers",
	        "interactive": true,
	        "type": "symbol",
	        "source": "markers",
	        "layout": {
	            "icon-image": "{marker-symbol}-15",
	            "icon-allow-overlap": true
	        }
	    });
	});

	//Popup when clicking on a marker.
	var popup = new mapboxgl.Popup();

	// When a click event occurs near a marker icon, open a popup at the location of
	// the feature, with description HTML from its properties.
	map.on('click', function (e) {
	    map.featuresAt(e.point, {
	        radius: 7.5, // Half the marker size (15px).
	        includeGeometry: true,
	        layer: 'markers'
	    }, function (err, features) {

	        if (err || !features.length) {
	            popup.remove();
	            return;
	        }

	        var feature = features[0];

	        // Populate the popup and set its coordinates
	        // based on the feature found.
	        popup.setLngLat(feature.geometry.coordinates)
	            .setHTML(feature.properties.description)
	            .addTo(map);

	        if (err) throw err;
	        
	        // if there are features within the given radius of the click event,
	        // fly to the location of the click event
	        if (features.length) {
	            // Get coordinates from the symbol and center the map on those coordinates
	            map.flyTo({center: features[0].geometry.coordinates});
	        }
	    });
	});

	// Use the same approach as above to indicate that the symbols are clickable
	// by changing the cursor style to 'pointer'.
	map.on('mousemove', function (e) {
	    map.featuresAt(e.point, {
	        radius: 7.5, // Half the marker size (15px).
	        layer: 'markers'
	    }, function (err, features) {
	        map.getCanvas().style.cursor = (!err && features.length) ? 'pointer' : '';
	    });
	});


	//Zoom buttons etc.
	map.addControl(new mapboxgl.Navigation());

	//Searchfield within the map.
	//map.addControl(new mapboxgl.Geocoder());
}

//When the user want to fly from one place to another. 
function fly() {
		// Fly to a random location by offsetting the point 16, 63
	// by up to 5 degrees.
	map.flyTo({
    	center: [16 + (Math.random() - 0.5) * 10, 63 + (Math.random() - 0.5) * 10]
		});
}