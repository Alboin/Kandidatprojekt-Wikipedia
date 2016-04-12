function generateMap(coordinate, title) {
	L.mapbox.accessToken ='pk.eyJ1Ijoic2FyYWh5ZWFoaCIsImEiOiJjaWx4dGw5M2gwMGc0dW9tNGk1M3JnbWI1In0.Zo28bpcbm5VxdSkJ0qXC8A';

	var map = L.mapbox.map('map', 'mapbox.light')
    .setView([coordinate[0], coordinate[1]], 9);

	//Lagren för kartan med en popup. 
	var myLayer = L.mapbox.featureLayer().addTo(map);

	myLayer.setGeoJSON([{
	        type: 'Feature',
	        geometry: {
	            type: 'Point',
	            coordinates: [coordinate[1]+0.2, coordinate[0]]
	        },
	        properties: {
	            title: title,
	            description: 'This marker has a description',
	            'marker-id': 'marker-1',
	           // 'marker-color': '#f86767'

	        }
	    },
	    {
	        type: 'Feature',
	        geometry: {
	            type: 'Point',
	            coordinates: [coordinate[1], coordinate[0]+0.2]
	        },
	        properties: {
	            title: 'En artikel bredvid ' + title,
	            description: 'So does this one!',
	            'marker-id': 'marker-2',
	            'marker-color': '#f86767'
	        }
	    }
	]);


	//Den med rätt popup...
	var marker = L.marker([coordinate[0], coordinate[1]], {
      icon: L.mapbox.marker.icon({
        'marker-color': '#9c89cc',
         'description': 'This marker has a description'
      })
    })
    //.bindPopup('<button class="trigger">Say hi</button>')
    .bindPopup('<button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#myModal">Modal</button>')
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

