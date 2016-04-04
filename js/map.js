function generateMap(coordinate) {
	L.mapbox.accessToken ='pk.eyJ1Ijoic2FyYWh5ZWFoaCIsImEiOiJjaWx4dGw5M2gwMGc0dW9tNGk1M3JnbWI1In0.Zo28bpcbm5VxdSkJ0qXC8A';

	var map = L.mapbox.map('map', 'mapbox.light')
    .setView([coordinate[0], coordinate[1]], 9);
}