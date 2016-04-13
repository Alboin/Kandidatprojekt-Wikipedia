/*******************************************************************************************************
 
	Filen innehåller funktioner som hanterar kartan. 
	Det är främst Albin och Sarah som har koll på denna fil :)

********************************************************************************************************/


//Global variables
var map;
var markerLayer;
var all_markers = [];


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


	//Layer containing all the markers. 
	markerLayer = L.mapbox.featureLayer().addTo(map);

}

function addArticleToMap(coordinate, title) {

	//Create marker
	//The marker gets a button that when clicked calls the function "changeModalContent with the article title as argument."
	var marker = L.marker([coordinate[0], coordinate[1]], {
    	icon: L.mapbox.marker.icon({
        	'marker-color': '#000000'
      	}),
    	title: title
    })
    .bindPopup('<p>' + title + '</p><button onclick="changeModalContent(' + "'" + title + "'" +')" type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#myModal">Mer info...</button><p>')
    .addTo(markerLayer); //Add marker to "markerLayer", a layer wich is cleared with every new search.

    all_markers.push(marker);

}

function hideStartpage() {
	$("#upper_row").slideToggle("slow");
}

//A function that changes the content of Modal depending on wich article to display.
function changeModalContent(title) {

	var temp_article;

	//Loop through all articles and search for a matching title.
	for(var indx = 0; indx < coord_articles.length; indx++) {
		if(coord_articles[indx].title == title) {
			temp_article = coord_articles[indx];
			break;
		}
	}

	//Change Modal title
	document.getElementById("artikel_titel").innerHTML = title;
	//Change Modal text
	document.getElementById("artikel_text").innerHTML = temp_article.first_paragraph;
	//Change Modal thumbnail
	document.getElementById("artikel_bild").innerHTML = "<img src='" + temp_article.image_source + "'>";

}

function chooseMarker(title) {

	//Loop through all markers on the map and if one with the same title exist, open that one's popup.
	for(var i = 0; i < all_markers.length; i++) {

		//Find the starting and ending index of the article title
		var start_of_title = (all_markers[i]._popup._content).indexOf('>');
		var end_of_title = (all_markers[i]._popup._content).indexOf('<', start_of_title);

		//Extract the title from the marker and compare it to 'title'.
		if(all_markers[i]._popup._content.substring(start_of_title+1, end_of_title) == title) {
			all_markers[i].openPopup();
		}
	}
}

//Creates a new entry on the list with displayed articles.
function createListObject(title) {

	var ul = document.getElementById("article_list");
	//Create new list entry.
  	var li = document.createElement("li");
  	li.appendChild(document.createTextNode(title));
  	li.setAttribute("id", title);
  	li.setAttribute("onclick", "chooseMarker(" + "'" + title + "'" + ")");
  	ul.appendChild(li);
}