
/*******************************************************************************************************
 	Authors: Originally Albin Bergström who has written this code.

 	Gets information from Wikipedia and declares different variables for every data that is handled by 
 	the Wikipedia API. The data can be used in the index-file and the different js-files.

 	The file includes the functions:
 	- runProgram
 	- getSearchString
 	- searchWiki
 	- load
 	- getPosition
 	- printArticle
 	- getFirstRows
********************************************************************************************************/
		


/*-----------------------------------------------
		Declare global variables
-----------------------------------------------*/
var main_article;
var coord_articles = [];
var time_articles = [];
var save;
var main_search;

//The function is run when the user press "search"
function runSearch() {		

	//Save user input.
	var usertext = document.getElementById("searchtext").value;

	//Create query from user input.
	var query = getSearchString(usertext);

	//This function is run asynchronously.
	main_search = true;
	searchWiki(query, main_search);
	//HERE you could have some type of loadingscreen that is shown while waiting for a response from the function.
}


/*	The function check if the searchstring is empty and replace spaces with "%20",
	because this is how Wikipedia's API works. The function then adds the searchstring in a query.
	At last the final query is sent to the function 'searchWiki'. */
function getSearchString(input_title) {
	if(input_title) {

		input_title = input_title.replace(" ", "%20");

		//The beginning of the query, tells us to do a query and return the result on json format.
		var start = "/w/api.php?action=query&format=json";
		//The what to search for
		var title = "&titles=" + input_title;

		//Which properties to get. (coordinates, links, revisions, extracts, pageid, pageimages, images(används inte än), categories)
		var properties = "&prop=coordinates%7Clinks%7Crevisions%7Cextracts%7Cpageimages%7Cimages%7Ccategories" + "&indexpageids=1" + "&pllimit=max"; 
		var revisions = "&rvprop=content" + "&exintro=1" + "&explaintext=1";

		//Which lists to get.
		var lists = "&list=backlinks"
		var list_parameters = "&bllimit=max" + "&bltitle=" + input_title;
		//Create final query
		var finalQuery = "http://sv.wikipedia.org" + start + title + properties + revisions + lists + list_parameters + "&callback=?";
	    return finalQuery;
	}
}

//The function takes a final query as input, uses GET (sends a query to the Wikipedia API) 
//A json-object is returned, saved in the variable 'data'.
function searchWiki(query, first){
	$(document).ready(function(){
	    $.ajax({
	        type: "GET",
	        url: query,
	        contentType: "application/json; charset=utf-8",
	        async: true,
	        dataType: "json",
	        success: function (data, textStatus, jqXHR) {

	        	//HERE IS WHAT TO DO IF THE SEARCH WAS SUCCESSFUL
	        	if(main_search){
	        		console.log(data);

	        		//If the result is not a valid article and no redirection proposal is given (see below).
	        		if(data.query.pageids[0] == -1) {
	        			window.alert("The entered search-text did not yield any results.")
	        		
	        		//If the result is not a valid article, the returned object often contains a redirection proposal
	        		//from Wikipedia to a valid article. Use this proposal to do a new search.
	        		} else if(data.query.pages[data.query.pageids[0]].extract == "") {

        				//Create a new query with the proposed redirection from Wikipedia.
						var query = getSearchString(data.query.pages[data.query.pageids[0]].links[0].title);

						//Run search on new title.
						main_search = true;
						searchWiki(query, main_search);

	        		} else {

		        		//Remove all old markers from map.
		        		all_markers = [];
		        		map.removeLayer(markerLayer);
		        		markerLayer = L.mapbox.featureLayer().addTo(map);

		        		//Clears the list with articles that are displayed on the map.
		        		$('#article_list').empty();

		        		handleLinks(load(data).links);	//motsvarar typ article.links (som är en array?)
		        		printArticle(load(data));
		       
		        		//Get first sentence in a paragraph. 
		        		getFirstRow(main_article.first_paragraph);
		        	}

	        	} else {

    				//Handle the related articles, make a new search for each one of them.
	        		printLinks(loadLinks(data));
	        	}
	        },

	        //Error message in console, om ingen sökning gjorts.
	        error: function (errorMessage) {
	        	console.log("Inget sökord ifyllt.");
	        }
	    });
	});
}

//Gets data for an article and saves it in 'temp_article'
function load(data) {

	var temp_article = {
		title: "",
		id: -1,
		links: [],
		backlinks: [],
		first_paragraph: "",
		position: [null,null],
		birthplace: "",
		time: [null, null],
		image_source: "",
		categories: "", 
		first_sentence:""

	}
	
	temp_article.id = data.query.pageids[0];						//Save article id
	temp_article.title = data.query.pages[temp_article.id].title;	//Save the title of the article
	temp_article.first_paragraph = data.query.pages[temp_article.id].extract;			//Save first paragraph of the article
	temp_article.image_source = data.query.pages[temp_article.id].thumbnail.source;		//Save small image, source
	//temp_article.image_large = data.query.pages[temp_article.id].thumbnail.source;
	//temp_article.categories = data.query.pages[temp_article.id].categories;//.title;

	//Loop through array of backlinks and add to temp_article.
	for(var indx = 0; indx < data.query.backlinks.length; indx++) {
		//Save titles of the backlinks
		temp_article.backlinks.push(data.query.backlinks[indx].title);
	}

	//Loop through array of links and add to temp_article.
	for(var indx = 0; indx < data.query.pages[temp_article.id].links.length; indx++) {
		//Save titles of the links
		temp_article.links.push(data.query.pages[temp_article.id].links[indx].title);
	}

	//Check if the article has coordinates
	if(data.query.pages[temp_article.id].coordinates) {
		//Save coordinates in 'temp_article.position'
		temp_article.position =
			[data.query.pages[temp_article.id].coordinates[0].lat,	//latitud
			 data.query.pages[temp_article.id].coordinates[0].lon]	//longitud
	}
	
	//Get time mentioned in first paragraph of the article
	temp_article.time = getTime(temp_article.first_paragraph);
	//Get position of birthplace
	temp_article.birthplace = getPosition(data.query.pages[temp_article.id].revisions[0]["*"]);
	//To get the first row in a paragraph. 
	temp_article.first_sentence = getFirstRow(temp_article.first_paragraph);

	//Add article to the array with articles
	main_article = temp_article;

	return temp_article;
}


//Get position of birthplace
function getPosition(revision) {
	
	var birthplace = "";
	var indx = revision.indexOf("f\u00f6delseplats");

	indx = revision.indexOf("[[", indx) + 2;
	birthplace = revision.substring(indx, revision.indexOf("]]",indx));

	return birthplace;
}



function printArticle(article) {

	/*-----------------------------------------------
			For the modal popup 
	-----------------------------------------------*/
	
	document.getElementById("artikel_titel").innerHTML = article.title;								//Title
	document.getElementById("artikel_text").innerHTML = article.first_paragraph;					//Article
	document.getElementById("artikel_bild").innerHTML = "<img src='" + article.image_source + "'>";	//Thumbnailmage
	
	//Categories
	//document.getElementById("artikel_kategori").innerHTML = article.categories;


	/*-----------------------------------------------
			Gets information about the article 
	-----------------------------------------------*/
	document.getElementById("artikelinfo").innerHTML = "<b>Artikeltitel:</b> " + article.title
	+ "<br><b>Artikel-Id: </b>" + article.id +"<br><br><b>Första paragrafen i artikeln: </b><br>" + article.first_paragraph + "<br><br>";
	
	//Check if the article has a position. 
	if(article.position[0]) {

		//document.getElementById("koordinater").innerHTML +=  "<b>Artikelns koordinater: </b>" + article.position;
		addArticleToMap(article.position, article.title);
		createListObject(article.title);

	}


	if(article.time[0]) {
		document.getElementById("tidsinfo").innerHTML += "<b>Artikelns start och sluttid </b>" + article.time + "<br><br>";
	}

	
	document.getElementById("links").innerHTML +=  "<b>länkar i artikeln:</b> ("
	+ article.links.length + " st)<br>";
	for(var indx = 0; indx < article.links.length; indx++) {
		document.getElementById("links").innerHTML += article.links[indx];
		document.getElementById("links").innerHTML += ", ";
	}

	document.getElementById("links").innerHTML +=  "<br><br><b>Artiklar som länkar till denna artikel:</b> ("
	+ article.backlinks.length + " st)<br>";
	for(var indx = 0; indx < article.backlinks.length; indx++) {
		document.getElementById("links").innerHTML += article.backlinks[indx];
		document.getElementById("links").innerHTML += ", ";
	}

	document.getElementById("searchcompleted").innerHTML = "Klicka på de olika tabbarna för mer information om artikeln.";
}



//Print the first sentence in an article.  
function getFirstRow(paragraph){
	
	//Find the position where a dot followed by space is in a string. 
	var n = paragraph.indexOf(". ");
	//Split the string where the position is set. 
	var res = paragraph.slice(0, n);

	//If you want to use the sentence in a javascript-file it's called this:
	var first_sentence = res; 

	return first_sentence;
}





	