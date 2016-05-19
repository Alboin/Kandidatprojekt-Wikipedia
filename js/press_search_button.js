
/*******************************************************************************************************
 	Authors: Albin Bergström mostly + Sara Martin a little bit

 	This file contain the function which is run when the user press "search", or the Enter-button.
 	The function starts the searchprocess for the data for an article.

 	The file includes the function:
 	- pressSearchButton
 	- previousSearch
********************************************************************************************************/

//The function is run when the user press "search"
function pressSearchButton() {		

	if(!SEARCH_IS_ACTIVE) {

		//Save user input.
		var usertext = document.getElementById("searchtext").value;
		//Create query from user input.
		var query = getSearchString(usertext);

		//This function is run asynchronously.
		MAIN_SEARCH = true;
		HAS_RUN_EXTRA_SEARCH = false;

		getWikiData(query, "red");

	} else {
		console.log("Search is still active...")
		//Show the message below the search-box for a brief moment.
		$("#search_not_complete_message").fadeIn( 500, function() {
			$("#search_not_complete_message").fadeOut(3000);
  		});
	}

	window.history.replaceState( {} , 'newsearch', window.location.pathname + "?SearchResult=" + usertext);

	//HERE you could have some type of loadMainArticleingscreen that is shown while waiting for a response from the function.
}



function previousSearch(txt)
{
	var usertext = txt;
	//Create query from user input.
	var query = getSearchString(usertext);

	//This function is run asynchronously.
	MAIN_SEARCH = true;
	HAS_RUN_EXTRA_SEARCH = false;

	getWikiData(query, "red");
}
/*
function getSearchText()
{
	console.log(usertext);
	document.getElementById("new_searchtext").value = "Sökning: " + usertext;
}
*/
