/*******************************************************************************************************	
 	Authors: Hanna Johansson and Johanna Westberg, mostly.
 	Code written by Albin Bergström has been used and modified.
	Date of the file: 2016-04-05

	The file contains functions which handle the links and backlinks for an article.

	This file includes the functions:
	- getLinkSearch
	- handleLinks
	- linksPosition
	- loadLinks
	- printLinks
********************************************************************************************************/


//This function works similar to the function 'getSearchString'. Used for the related links in the 
//first search of an article. The functions defines which properties to get from the article.	*/
function getLinkSearch(input_title) {
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
function handleLinks(links, color){
	main_search = false;

	marker_color = color;

	for(var indx = 0; indx < links.length; indx++){
		var query = getLinkSearch(links[indx]);
		searchWiki(query, main_search);
	}

	//ska sättas till true igen, ifall användaren klickar på en av länkarna?
	//main_search = true;
} 

//Checks if every link has a position, e.g. if it is a place.
//If the link is a place, save the title under the id "places"
function linksPosition(links){
	for(var indx = 0; indx < links.length; indx++){
		if(article.position != ""){
			document.getElementById("places").innerHTML += article.title;
		}
	}
}


//Works similar to 'printArticle'. Prints out information about the links/articles.
function printLinks(linksarray) {

	var titles = [];
	var linksCoord = [];
	
	//Loop through the array to print all links that have coordinates
	for(var indx = 0; indx < linksarray.length; indx++){
		//document.getElementById("links").innerHTML = "<b>Artikeltitel:</b> " + linksarray[indx].title + "<br><br>";
		titles.push(" " + linksarray[indx].title );
		linksCoord.push(" " + linksarray[indx].position);
	}

	document.getElementById("links").innerHTML = titles;

	//If the coordinates to the related articles should be printed, use this line.
	//document.getElementById("links").innerHTML += "<br><br>" + linksCoord;

	document.getElementById("links").innerHTML += "<br><br>" + "Antal länkar med koordinater:</b> " + linksarray.length;
}

//Works similar as the function 'load'.
//Gets data for every article/link. 
//If the article is a place/has coordinates it is saved in the variable'coord_articles'.
function loadLinks(data) {

	var temp_article = {
		title: "",
		id: -1,
		first_paragraph: "",
		first_sentence: "",
		image_source: "",
		position: [null,null],
		birthplace: "",
	}

	temp_article.id = data.query.pageids[0]; //Save article id
	temp_article.title = data.query.pages[temp_article.id].title; //Save article title
	temp_article.first_paragraph = data.query.pages[temp_article.id].extract; //Save first paragraph

	if(data.query.pages[temp_article.id].thumbnail.source)
		temp_article.image_source = data.query.pages[temp_article.id].thumbnail.source;		//Save small image, source

	//If the article has coordinates, save coordinates in 'position'
	if(data.query.pages[temp_article.id].coordinates) {
		temp_article.position =
			[data.query.pages[temp_article.id].coordinates[0].lat,
			 data.query.pages[temp_article.id].coordinates[0].lon]
		
		//Boolean to check if an article already exists in the array 'coord_articles' or not
		var article_exist = false;	
		//Lopp through the array to see if the article is already in the array, if so --> break and set boolean to true
		for( var i=0; i < coord_articles.length; i++){
			if (coord_articles[i].title == temp_article.title){
				article_exist = true;
				break;
			}						
		}

		//Take the first sentence from the related article. 
		temp_article.first_sentence = getFirstRow(temp_article.first_paragraph);
		
		//Send information about the article to the map. 
		addArticleToMap(temp_article.position, temp_article.title, temp_article.first_sentence);

		createListObject(temp_article.title);

		//If the article does not exist in the array, push it into the array
		if(!article_exist){
			coord_articles.push(temp_article);
		}
	}

	//If the article has a year, save the article in time_articles
	if(temp_article.time[0][2])
	{
		time_articles.push(temp_article);
		console.log(temp_article.title);
	}

	//Return array of articles which have coordinates
	return [coord_articles, time_articles];
}


	