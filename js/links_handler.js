/*******************************************************************************************************	
 	Authors: Hanna Johansson and Johanna Westberg, mostly.
 	Code written by Albin Bergström has been used and modified.
	Date of the file: 2016-04-05

	The file contains functions which handle the links and backlinks for an article.

	This file includes the functions:
	- getLinkSearchString
	- startLinkSearch
	- linksPosition
	- loadLinksArticles
********************************************************************************************************/


//This function works similar to the function 'getSearchString'. Used for the related links in the 
//first search of an article. The functions defines which properties to get from the article.	*/
function getLinkSearchString(input_title) {
	if(input_title) {
		input_title = input_title.replace(" ", "%20");

		//The beginning of the query, tells us to do a query and return the result on json format.
		var start = "/w/api.php?action=query&format=json";
		//The what to search for
		var title = "&titles=" + input_title;
		//Which properties to get. (coordinates, links, revisions, extracts, pageid)
		var properties = "&prop=coordinates" + "%7Cextracts" + "%7Cpageimages" + "&indexpageids=1" + "&exintro=1" + "&explaintext=1"; 			
		//Create final query
		var linkQuery = "http://sv.wikipedia.org" + start + title + properties + "&callback=?";
	    return linkQuery;
	}
}

//Creates a new search for the links. 
//The function handles at most 50 links/articles at the time.	
function startLinkSearch(links, color){
	MAIN_SEARCH = false;

	marker_color = color;

	for(var indx = 0; indx < links.length; indx++){
		var query = getLinkSearchString(links[indx]);
		getWikiData(query, MAIN_SEARCH);
	}

	//ska sättas till true igen, ifall användaren klickar på en av länkarna?
	//MAIN_SEARCH = true;
}

//Works similar as the function 'load'.
//Gets data for every article/link. 
//If the article is a place/has coordinates it is saved in the variable'COORD_ARTICLES'.
function loadLinksArticles(data) {

	var temp_article = {
		title: "",
		id: -1,
		first_paragraph: "",
		first_sentence: "",
		image_source: "",
		position: [null,null],
		time: [[null, null, null], [null, null, null]],
		birthplace: "",
	}

	temp_article.id = data.query.pageids[0]; 									//Save article id
	temp_article.title = data.query.pages[temp_article.id].title; 				//Save article title
	temp_article.first_paragraph = data.query.pages[temp_article.id].extract; 	//Save first paragraph

	if(temp_article.first_paragraph != "")
		temp_article.first_sentence = getFirstSentence(temp_article.first_paragraph);	//Take the first sentence from the related article. 
	
	temp_article.time = getArticleTime(temp_article.first_paragraph);					//Get time mentioned in first paragraph of the article

	if(data.query.pages[temp_article.id].thumbnail)
		temp_article.image_source = data.query.pages[temp_article.id].thumbnail.source;		//Save small image, source


	/*--------------------------------------------------------------------
		Bool to check if the article already exists in coord_articles
		+ Bool to check if the article already exists in time_articles
	----------------------------------------------------------------------*/	 	
	//Boolean to check if an article already exists in the array 'coord_articles' or not
	var coord_article_exist = false	
	var time_article_exist = false;
	
	//Lopp through the array to see if the article is already in the array, if so --> break and set boolean to true
	for( var i=0; i < COORD_ARTICLES.length; i++){
		if (COORD_ARTICLES[i].title == temp_article.title){
			coord_article_exist = true;
			break;
		}						
	}

	for( var i=0; i < TIME_ARTICLES.length; i++){
		if (TIME_ARTICLES[i].title == temp_article.title){
			time_article_exist = true;
			break;
		}						
	}

/*-----------------------------------------------
 	Check if the article has coordinates
-----------------------------------------------*/

	//If the article has coordinates, save coordinates in 'position'
	if(data.query.pages[temp_article.id].coordinates) {
		temp_article.position =
			[data.query.pages[temp_article.id].coordinates[0].lat,
			 data.query.pages[temp_article.id].coordinates[0].lon]
		
		//If the article does not exist in the array, push it into the array
		if(!coord_article_exist){
			COORD_ARTICLES.push(temp_article);

			//Send information about the article to the map. 
			addArticleToMap(temp_article.position, temp_article.title, temp_article.first_sentence);

			//Create a title on the list
			createMapListObject(temp_article.title);
		}
	}


/*-----------------------------------------------
 		Check if the article has a year
-----------------------------------------------*/
	//If the article has a year, save the article in TIME_ARTICLES
	if(temp_article.time[0])
	{
		//If the article does not exist in the array, push it into the array
		if(!time_article_exist){
			TIME_ARTICLES.push(temp_article);
		}

		//Sort the array time_articles
		TIME_ARTICLES.sort(
			function(a, b)
			{
				//If the two articles do not have the same year -> sort them by year
				if(a.time[0][2] != b.time[0][2])
					return (a.time[0][2]) - (b.time[0][2]);	

				//Else if the articles have the same year, but different months -> sort by month
				else if (a.time[0][2] == b.time[0][2] && a.time[0][1] != b.time[0][1])
					return (a.time[0][1]) - (b.time[0][1]);

				//Else (same year, same month, different day) -> sort by day
				else
					return (a.time[0][0]) - (b.time[0][0]);	
			}
		)
	}


	//CONSOLE LOG -> REMOVE LATER
	for( var i=0; i < TIME_ARTICLES.length; i++){
		console.log(TIME_ARTICLES[i].time[0]); 					
	}
	console.log("hej");


	//Return array of articles which have coordinates or time
	return [COORD_ARTICLES, TIME_ARTICLES];

}


	