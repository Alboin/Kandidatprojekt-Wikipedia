/*******************************************************************************************************
 	Authors: Sarah and Albin

 	Gets information from Wikipedia and declares different variables for every data that is handled by 
 	the Wikipedia API. The data can be used in the index-file and the different js-files.

 	The file includes the functions:
 	- generateMap
 	- addArticleToMap
 	- chooseNewMainArticle
 	- placeMainMarkerOnTop
 	- hideStartpage
 	- changeModalContent
 	- openMarkerPopup
 	- createMapListObject
 	- createPopupContent
 	- hideArticleListMap
 	
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

	/*var southWest = L.latLng(-85, -175),
	    northEast = L.latLng(120, 175),
	    bounds = L.latLngBounds(southWest, northEast);*/

	//Needed to get access to mapbox.
	L.mapbox.accessToken ='pk.eyJ1Ijoic2FyYWh5ZWFoaCIsImEiOiJjaWx4dGw5M2gwMGc0dW9tNGk1M3JnbWI1In0.Zo28bpcbm5VxdSkJ0qXC8A';

	//Create map, light version and disable attributes. Set start-position and zoom-level.
	map = L.mapbox.map('map', 'mapbox.light', {attributionControl: false, /*maxBounds: bounds,*/ minZoom: 1})
    .setView([30,0], 2).on("click", selectArticleInList);

	//Layer containing all the markers. 
	markerLayer = L.mapbox.featureLayer().addTo(map);
	
}

//Creates a marker on the map for one given article.
function addArticleToMap(article) {

	var temp_color;

	if(MARKER_COLOR == "red") {
		temp_color = '#fb3a13';
	} else if(MARKER_COLOR == "gray") {
		temp_color = '#5F8CAB';
	} else {
		temp_color = '#2B5673';
	}

	if(article.title.length > 16) {
		//Do something with the font-size of the popup title. ".marker-title" could be the right class.
	}


	//If the link is both a link and a backlink give it a special color
	if(article.link_both_ways){
		temp_color = '#f99c08';	//orange
	}

	var popup_content = createPopupContent(article);

	//Create marker
	//The marker gets a button that when clicked calls the function "changeModalContent with the article title as argument."
	var marker = L.marker([article.position[0], article.position[1]], {
    	icon: L.mapbox.marker.icon({
        	'marker-color': temp_color
      	}),
    	title: article.title
    }).bindPopup(popup_content).addTo(markerLayer).on("click", selectArticleInList); //Add marker to "markerLayer", a layer wich is cleared with every new search.

    all_markers.push(marker);

}

function selectArticleInList(e) {
	for(var i = 0; i < all_markers.length; i++) {
		if(e.target.options.title != all_markers[i].options.title)
            //Reset the background color of the list-item connected to the dot, also reset the hover-color.
			$("#map_" + all_markers[i].options.title.replaceAll(" ", "_").replaceAll("(", "_").replaceAll(")", "_").replaceAll("/", "_"))
			.css("background", "rgba(0,0,0,0)").hover(function(){$(this).css("background", "white");}, function(){$(this).css("background", "rgba(0,0,0,0)");});
	}
	if(e.target.options.title) 
        //Change the background color of the list-item connected to the dot, also disable the hover-color.
		$("#map_" + e.target.options.title.replaceAll(" ", "_").replaceAll("(", "_").replaceAll(")", "_").replaceAll("/", "_")).css("background", "#7095a3").unbind('mouseenter mouseleave');
	
}

function chooseNewMainArticle(title) {

	if(!SEARCH_IS_ACTIVE) {

		//Create query from user input.
		var query = getSearchString(title);

		document.getElementById("searchtext").value = title;

		//This function is run asynchronously.
		MAIN_SEARCH = true;
		HAS_RUN_EXTRA_SEARCH = false;

		getWikiData(query, "red");

	} else {
		console.log("Search is still active...");
		//Show the message below the search-box for a brief moment.
		$("#search_not_complete_message").fadeIn( 500, function() {
			$("#search_not_complete_message").fadeOut(3000);
  		});
	}

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
	var found_article = false;

	//Loop through all articles and search for a matching title.
	for(var indx = 0; indx < COORD_ARTICLES.length; indx++) {
		if(COORD_ARTICLES[indx].title == title) {
			temp_article = COORD_ARTICLES[indx];
			found_article = true;
			break;
		}
	}
	if(!found_article) {
		//Loop through all articles and search for a matching title.
		for(var indx = 0; indx < TIME_ARTICLES.length; indx++) {
			if(TIME_ARTICLES[indx].title == title) {
				temp_article = TIME_ARTICLES[indx];
				break;
			}
		}
	}

	if(!temp_article)
		temp_article = MAIN_ARTICLE;

	//Change Modal title
	document.getElementById("artikel_titel").innerHTML = title;
	//Change title size depending on its length.
	if(temp_article.title.length > 18){
		$("#artikel_titel").css("font-size","30px");
	}
	else if (temp_article.title.length < 10){
		$("#artikel_titel").css("font-size","50px");
	}
	else {
		$("#artikel_titel").css("font-size","40px");
	}
	//Change Modal text
	document.getElementById("artikel_text").innerHTML = temp_article.first_paragraph;
	//document.getElementById("artikel_text").innerHTML += '<br><a onclick="getFullText(' + "'" + title + "'" + ')"> Read full article </a>';
	
	//Change Modal thumbnail
	//Check if an image exist
	if(temp_article.image_source != "") {
		document.getElementById("artikel_bild").innerHTML = "<img id='modalImage' src='" + temp_article.image_source + "'>";
	//If there is no image, remove the 
	 } else {
	 	document.getElementById("artikel_bild").innerHTML = "";
	 }

	 var wiki_link = "https://sv.wikipedia.org/wiki/" + temp_article.title.replaceAll(" ", "_");
	 $("#wikipedia_link").attr("href", wiki_link);

}

//TO BE IMPLEMENTED SOON
/*function getFullText(title) {
	if(title != MAIN_ARTICLE.title) {
		var temp_article;
		//Loop through all articles and search for a matching title.
		for(var indx = 0; indx < COORD_ARTICLES.length; indx++) {
			if(COORD_ARTICLES[indx].title == title) {
				temp_article = COORD_ARTICLES[indx];
				break;
			}
		}
	} else {
		temp_article = MAIN_ARTICLE;
	}
	document.getElementById("artikel_text").innerHTML = temp_article.entirearticle;
}*/

//Is run from the article list on the right side of the screen. When a list-item is clicked this 
//function opens the popup for the marker associated with the same article as the list-item.
function openMarkerPopup(title) {

	//Loop through all markers on the map and if one with the same title exist, open that one's popup.
	for(var i = 0; i < all_markers.length; i++) {

        //Reset the background color of the list-item connected to the dot, also reset the hover-color.
		$("#map_" + all_markers[i].options.title.replaceAll(" ", "_").replaceAll("(", "_").replaceAll(")", "_").replaceAll("/", "_"))
			.css("background", "rgba(0,0,0,0)").hover(function(){$(this).css("background", "white");}, function(){$(this).css("background", "rgba(0,0,0,0)");});

		//Find the starting and ending index of the article title
		var start_of_title = (all_markers[i]._popup._content).indexOf('>');
		var end_of_title = (all_markers[i]._popup._content).indexOf('<', start_of_title);

		//Extract the title from the marker and compare it to 'title'.
		if(all_markers[i]._popup._content.substring(start_of_title+1, end_of_title) == title) {
			all_markers[i].openPopup();
		}
	}

	//Change background color for the list-item that is connected with the selected marker.
	$("#map_" + title.replaceAll(" ", "_").replaceAll("(", "_").replaceAll(")", "_").replaceAll("/", "_")).css("background", "#7095a3").unbind('mouseenter mouseleave');
}

//Creates a new entry on the list with displayed articles.
function createMapListObject(title) {

	//Function used internally to insert the new list element in alphabetic order.
	function sortAlpha(a, b) {
		return a.innerHTML.toLowerCase() > b.innerHTML.toLowerCase() ? 1 : -1;  
	}

	//Select the whole list.
	var ul = document.getElementById("article_list");


    if(!$(ul).find('li:contains("map_' + title.replaceAll(" ", "_").replaceAll("(", "_").replaceAll(")", "_").replaceAll("/", "_") + '")')[0]) {

		//Create new list entry.
	  	var newLi = document.createElement("li");
	  	newLi.appendChild(document.createTextNode(title));
	  	newLi.setAttribute("id", "map_" + title.replaceAll(" ", "_").replaceAll("(", "_").replaceAll(")", "_").replaceAll("/", "_"));
	  	newLi.setAttribute("onclick", "openMarkerPopup(" + "'" + title + "'" + ")");

	  	//Insert new list entry with help of sorting fuction "sortAlpha".
	  	$('li', ul).add(newLi).sort(sortAlpha).appendTo(ul);
	}
}

//Function that creates the content for the popup
function createPopupContent (article) {

	var popup_content = "";

	if(cointainsLongWord(article.title)) {
		popup_content += '<div class="marker-title" id="'+article.id+'" style="font-size:15px;">' + article.title + '</div>' + article.first_sentence +
		'<a href onclick="changeModalContent(' + "'" + article.title + "'" +')" data-toggle="modal" data-target="#myModal"> Mer info...</a><br>';
	} else if(article.title.length > 16) {
		popup_content += '<div class="marker-title" id="'+article.id+'" style="font-size:20px;">' + article.title + '</div>' + article.first_sentence +
		'<a href onclick="changeModalContent(' + "'" + article.title + "'" +')" data-toggle="modal" data-target="#myModal"> Mer info...</a><br>';
	} else {
		popup_content = '<div class="marker-title">' + article.title + '</div>' + article.first_sentence +
		'<a href onclick="changeModalContent(' + "'" + article.title + "'" +')" data-toggle="modal" data-target="#myModal"> Mer info...</a><br>';
	}

	//Add article relation to popup (if a relation string exist).
	if(article.relation_sentence && article.relation_sentence != "") 
	{
		//if the article = link + backlink
		if(article.link_both_ways){
			var index = article.relation_sentence.indexOf(article.title);
			var beginning = article.relation_sentence.substring(0, index);
			var marked_word = article.relation_sentence.substring(index, index + article.title.length);
			var end = article.relation_sentence.substring(index + article.title.length, article.relation_sentence.length);

			popup_content += '<br><b>' + article.title + ' nämns i ' + MAIN_ARTICLE.title + 's artikel: </b><br>' 
							+ beginning + '<span id="marked_word">' + marked_word + '</span>' + end + '<br>';

			if(article.second_relation_sentence && article.second_relation_sentence != ""){
				var indx = article.second_relation_sentence.indexOf(MAIN_ARTICLE.title);
				var begin = article.second_relation_sentence.substring(0, indx);
				var marked_title = article.second_relation_sentence.substring(indx, indx + MAIN_ARTICLE.title.length);
				var ending = article.second_relation_sentence.substring(indx + MAIN_ARTICLE.title.length, article.second_relation_sentence.length);	

				popup_content += '<br><b>' + MAIN_ARTICLE.title + ' nämns i ' + article.title + 's artikel: </b><br>' 
						    + begin + '<span id="marked_word">' + marked_title + '</span>' + ending + '<br>';		
			}						
		}
		//if the article = link
		else if(MARKER_COLOR == "black"){	
			var index = article.relation_sentence.indexOf(article.title);
			var beginning = article.relation_sentence.substring(0, index);
			var marked_word = article.relation_sentence.substring(index, index + article.title.length);
			var end = article.relation_sentence.substring(index + article.title.length, article.relation_sentence.length);
			popup_content += '<br><b>' + MAIN_ARTICLE.title + 's relation till ' + article.title + ': </b><br>' + beginning + '<span id="marked_word">' + marked_word + '</span>' + end + '<br>';
		}
		//if the article = backlink
		else if(MARKER_COLOR == "gray"){
			var index = article.relation_sentence.indexOf(MAIN_ARTICLE.title);
			var beginning = article.relation_sentence.substring(0, index);
			var marked_title = article.relation_sentence.substring(index, index + MAIN_ARTICLE.title.length);
			var end = article.relation_sentence.substring(index + MAIN_ARTICLE.title.length, article.relation_sentence.length);			
			popup_content += '<br><b>' + article.title + 's relation till ' + MAIN_ARTICLE.title + ': </b><br>' + beginning + '<span id="marked_word">' + marked_title + '</span>' + end + '<br>';
		}
	}

	popup_content += '<br><a id="newMainArticle" onclick="chooseNewMainArticle(' + "'" + article.title + "'" +')"> Sök på "' + article.title + '" </a>';

	return popup_content;
}

function cointainsLongWord(title) {
	var temp = title + " ";
	var counter = 0;
	while(temp.indexOf(" ") != -1) {
		if(temp.substring(0, temp.indexOf(" ")).length > 20){
			return true;
		}
		temp = temp.substring(temp.indexOf(" ") + 1, temp.length);
		counter++;
		if(counter > 500)
			return;
	}
	return false;
}

function hideArticleListMap() {
    $("#article_list").slideToggle();
    if($("#article_list_arrow_map").css("transform").substring(0,8) == "matrix(1"
        || $("#article_list_arrow_map").css("transform") == "none") {
       $("#article_list_arrow_map").css({"transform": "rotate(180deg)"});
    } else {
       $("#article_list_arrow_map").css({"transform": "rotate(0deg)"});
    }
}

String.prototype.replaceAll = function(target, replacement) {
  return this.split(target).join(replacement);
};