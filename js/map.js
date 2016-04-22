/*******************************************************************************************************
 	Authors: Sarah and Albin

 	Gets information from Wikipedia and declares different variables for every data that is handled by 
 	the Wikipedia API. The data can be used in the index-file and the different js-files.

 	The file includes the functions:
 	- generateMap
 	- addArticleToMap
 	- hideStartpage
 	- changeModalContent
 	- openMarkerPopup
 	- createMapListObject
 	
********************************************************************************************************/


//Global variables
var map;
var markerLayer;
var MARKER_COLOR = "red";
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

//Creates a marker on the map for one given article.
function addArticleToMap(coordinate, title, sentence) {

	var temp_color;

	if(MARKER_COLOR == "red") {
		//console.log("1")
		temp_color = '#ff0000';
	} else if(MARKER_COLOR == "gray") {
		//console.log("2")
		temp_color = '#777777';
	} else {
		//console.log("3")
		temp_color = '#000000';
	}

	var popup_content = '<div class="marker-title">' + title + '</div>' + sentence +
		'<a href onclick="changeModalContent(' + "'" + title + "'" +')" data-toggle="modal" data-target="#myModal"> Mer info...</a><br><br>' + 
		'<a id="newMainArticle" onclick="chooseNewMainArticle(' + "'" + title + "'" +')"> Sök på "' + title + '" </a>';

	//Create marker
	//The marker gets a button that when clicked calls the function "changeModalContent with the article title as argument."
	var marker = L.marker([coordinate[0], coordinate[1]], {
    	icon: L.mapbox.marker.icon({
        	'marker-color': temp_color
      	}),
    	title: title
    }).bindPopup(popup_content).addTo(markerLayer); //Add marker to "markerLayer", a layer wich is cleared with every new search.

    all_markers.push(marker);

}

function chooseNewMainArticle(title) {

	//Create query from user input.
	var query = getSearchString(title);
	console.log(query);

	document.getElementById("searchtext").value = title;

	//This function is run asynchronously.
	MAIN_SEARCH = true;
	HAS_RUN_EXTRA_SEARCH = false;
	getWikiData(query, "red");

}

//Positions the marker associated with the main article on top of all markers.
function placeMainMarkerOnTop() {
	all_markers[0].setZIndexOffset(10000);
}

//TO BE REMOVED
function hideStartpage() {
	//$("#upper_row").slideToggle("slow");
}

//A function that changes the content of Modal depending on wich article to display.
//Is called to in "addArticleToMap()".
function changeModalContent(title) {

	var temp_article;

	//Loop through all articles and search for a matching title.
	for(var indx = 0; indx < COORD_ARTICLES.length; indx++) {
		if(COORD_ARTICLES[indx].title == title) {
			temp_article = COORD_ARTICLES[indx];
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

//Is run from the article list on the right side of the screen. When a list-item is clicked this 
//function opens the popup for the marker associated with the same article as the list-item.
function openMarkerPopup(title) {

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
function createMapListObject(title) {

	//Function used internally to insert the new list element in alphabetic order.
	function sortAlpha(a, b) {
		return a.innerHTML.toLowerCase() > b.innerHTML.toLowerCase() ? 1 : -1;  
	}

	//Select the whole list.
	var ul = document.getElementById("article_list");

	//Create new list entry.
  	var newLi = document.createElement("li");
  	newLi.appendChild(document.createTextNode(title));
  	newLi.setAttribute("id", title);
  	newLi.setAttribute("onclick", "openMarkerPopup(" + "'" + title + "'" + ")");

  	//Insert new list entry with help of sorting fuction "sortAlpha".
  	$('li', 'ul').add(newLi).sort(sortAlpha).appendTo('ul');

}