//The function is run when the user press "search"
function pressSearchButton() {		

	//Save user input.
	var usertext = document.getElementById("searchtext").value;

	//Create query from user input.
	var query = getSearchString(usertext);

	//This function is run asynchronously.
	MAIN_SEARCH = true;
	getWikiData(query, MAIN_SEARCH);
	//HERE you could have some type of loadMainArticleingscreen that is shown while waiting for a response from the function.
}