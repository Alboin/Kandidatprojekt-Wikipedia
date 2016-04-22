
/*******************************************************************************************************
 	Authors: Albin Bergström

 	This file contain the function which is run when the user press "search", or the Enter-button.
 	The function starts the searchprocess for the data for an article.

 	The file includes the function:
 	- pressSearchButton
********************************************************************************************************/

//The function is run when the user press "search"
function pressSearchButton() {		

	//Save user input.
	var usertext = document.getElementById("searchtext").value;

	//Create query from user input.
	var query = getSearchString(usertext);

	//This function is run asynchronously.
	MAIN_SEARCH = true;
	HAS_RUN_EXTRA_SEARCH = false;

	getWikiData(query, "red");
	//HERE you could have some type of loadMainArticleingscreen that is shown while waiting for a response from the function.
}