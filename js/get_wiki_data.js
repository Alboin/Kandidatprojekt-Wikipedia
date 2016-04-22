
/*******************************************************************************************************
 	Authors: Mostly Albin Bergström

 	The final query is used to GET data from Wikipedia, a json-object is returned.

 	The file includes the function:
 	- getWikiData
 	- makeFirstLettersCapital
********************************************************************************************************/
//Variable that controls how many extra search-attempts should be performed.
var HAS_RUN_EXTRA_SEARCH = false;

//The function takes a final query as input, uses GET (sends a query to the Wikipedia API) 
//A json-object is returned, saved in the variable 'data'.
function getWikiData(query, article_color){
	$(document).ready(function(){
	    $.ajax({
	        type: "GET",
	        url: query,
	        contentType: "application/json; charset=utf-8",
	        async: true,
	        dataType: "json",
	        success: function (data, textStatus, jqXHR) {

	        	//HERE IS WHAT TO DO IF THE SEARCH WAS SUCCESSFUL

	        	//If the search is to be performed for a main article, eg not links.
	        	if(MAIN_SEARCH) { 

	        		//console.log(data);

	        		MARKER_COLOR = article_color;

	        		//If the result is not a valid article and no redirection proposal is given (see below).
	        		if(data.query.pageids[0] == -1) {

	        			//Test if the search was done with a search-word containing any upper case letters. If it was, performs
	        			//a new search but with only lower case letters. If the the search was done with only lower case letters perform
	        			//the search with upper case letters in the beginning of each new word.
	        			var article_title = data.query.pages[data.query.pageids[0]].title;
	        			if(article_title.indexOf(" ") != -1) {
	        				//If searchstring is lowercase.
	        				if(article_title[article_title.indexOf(" ") + 1] == article_title[article_title.indexOf(" ") + 1].toLowerCase()) {
	        					//Run new search.
	        					var query = getSearchString(makeFirstLettersCapital(article_title));
	        					MAIN_SEARCH = true;
	        					getWikiData(query, "red");
	        				//If both lower- and uppercase has been tried.
	        				} else if(HAS_RUN_EXTRA_SEARCH) {
	        					window.alert("The entered search-text did not yield any results.");
	        				//If searchstring is uppercase.
	        				} else {
	        					//Run new search.
	        					var query = getSearchString(article_title.toLowerCase());
	        					MAIN_SEARCH = true;
	        					getWikiData(query, "red");
	        				}
	        				HAS_RUN_EXTRA_SEARCH = true;

	        			} else {
	        				window.alert("The entered search-text did not yield any results.");
	        			}
	        		
	        		//If the result is not a valid article, the returned object often contains a redirection proposal
	        		//from Wikipedia to a valid article. Use this proposal to do a new search.
	        		} else if(data.query.pages[data.query.pageids[0]].extract == "") {

        				//Create a new query with the proposed redirection from Wikipedia.
						var query = getSearchString(data.query.pages[data.query.pageids[0]].links[0].title);

						//Run search on new title.
						MAIN_SEARCH = true;
						getWikiData(query, "red");

					//If a valid article is recieved:	
	        		} else {

		        		//Remove all old markers from map.
		        		all_markers = [];
		        		map.removeLayer(markerLayer);
		        		markerLayer = L.mapbox.featureLayer().addTo(map);

		        		//Clears the list with articles that are displayed on the map.
		        		$('#article_list').empty();

		        		MAIN_ARTICLE = loadMainArticle(data);

		        		//Empty old links from arrays:
		        		COORD_ARTICLES = [];
		        		TIME_ARTICLES = [];

		        		//Run searches on the links and backlinks asynchronously.
		        		startLinkSearch(MAIN_ARTICLE.links, "black");
		        		startLinkSearch(MAIN_ARTICLE.backlinks, "gray");
		        		
		        		printModalContent(MAIN_ARTICLE);

		        		generateTimeDot(MAIN_ARTICLE.title, MAIN_ARTICLE.first_sentence);
		        		
		        	}

	        	} //END if(MAIN_SEARCH)

	        	//If the search if to be performed for the links from an article.
	        	else {

	        		MARKER_COLOR = article_color;
	        		//Loads all links and puts them in global arrays COORD_ARTICLES and TIME_ARTICLES.
	        		loadLinksArticles(data);

	        	} //END else
	        },

	        //Error message in console, if no search was done.
	        error: function (errorMessage) {
	        	console.log("Inget sökord ifyllt.");
	        }
	    });
	});
}

//Gives the string a capital letter in the start of every word, for a better search-result.
function makeFirstLettersCapital(text) {
	for(var i = 1; i < text.length; i++) {
		if(text[i-1] == " " && i < text.length-1) {
			text = text.slice(0,i) + text[i].toUpperCase() + text.slice(i+1,text.length);
		} else if(text[i-1] == " ") {
			text = text.slice(0,i) + text[i].toUpperCase();
		}
	}
	return text;
}