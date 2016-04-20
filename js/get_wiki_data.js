//The function takes a final query as input, uses GET (sends a query to the Wikipedia API) 
//A json-object is returned, saved in the variable 'data'.
function getWikiData(query, first){
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

	        		marker_color = "red";
	        		console.log(data)

	        		//If the result is not a valid article and no redirection proposal is given (see below).
	        		if(data.query.pageids[0] == -1) {
	        				window.alert("The entered search-text did not yield any results.");
	        		
	        		//If the result is not a valid article, the returned object often contains a redirection proposal
	        		//from Wikipedia to a valid article. Use this proposal to do a new search.
	        		} else if(data.query.pages[data.query.pageids[0]].extract == "") {

        				//Create a new query with the proposed redirection from Wikipedia.
						var query = getSearchString(data.query.pages[data.query.pageids[0]].links[0].title);

						//Run search on new title.
						MAIN_SEARCH = true;
						getWikiData(query, MAIN_SEARCH);

					//If a valid article is recieved:	
	        		} else {

		        		//Remove all old markers from map.
		        		all_markers = [];
		        		map.removeLayer(markerLayer);
		        		markerLayer = L.mapbox.featureLayer().addTo(map);

		        		//Clears the list with articles that are displayed on the map.
		        		$('#article_list').empty();

		        		MAIN_ARTICLE = loadMainArticle(data);

		        		//Run searches on the links and backlinks asynchronously.
		        		startLinkSearch(MAIN_ARTICLE.links, "gray");
		        		startLinkSearch(MAIN_ARTICLE.backlinks, "black");
		        		
		        		printModalContent(MAIN_ARTICLE);

		        		generateTimeDot(MAIN_ARTICLE.title, MAIN_ARTICLE.first_sentence);
		        		
		        	}

	        	} //END if(MAIN_SEARCH)

	        	//If the search if to be performed for the links from an article.
	        	else {

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