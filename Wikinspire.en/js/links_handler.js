/*******************************************************************************************************	
 	Authors: Hanna Johansson and Johanna Westberg, mostly.
 	Code written by Albin Bergström has been used and modified.
	Date of the file: 2016-04-05

	The file contains functions which handle the links and backlinks for an article.

	This file includes the functions:
	- getLinkSearchString
	- startLinkSearch
	- loadLinksArticles
	- getRelationSentence
	- getRelationWithBacklink
	- getArticleText

	//Har de här två flyttats? 
	- linksPosition
	- sort (sorts TIME_ARTICLES by year, month, day)
********************************************************************************************************/

var LAST_LINK_TITLE = "";
var LINK_RESULTS_RECIEVED = 0;

//This function works similar to the function 'getSearchString'. Used for the related links in the 
//first search of an article. The functions defines which properties to get from the article.	*/
function getLinkSearchString(input_title) {
	if(input_title) {

		input_title = input_title.toLowerCase();

		//Replacement of characters that cannot be used in the actual query.		
		while(input_title.indexOf("ä") != -1 || input_title.indexOf("å") != -1
				|| input_title.indexOf("ö") != -1 || input_title.indexOf(" ") != -1) {
			input_title = input_title.replace("ä", "%C3%A4");
			input_title = input_title.replace("å", "%C3%A5");
			input_title = input_title.replace("ö", "%C3%B6");
			input_title = input_title.replace(" ", "%20");
		}

		//The beginning of the query, tells us to do a query and return the result on json format.
		var start = "/w/api.php?action=query&format=json";
		//The what to search for
		var title = "&titles=" + input_title;
		//Which properties to get. (coordinates, links, revisions, extracts, pageid)
		var properties = "&prop=coordinates" + "%7Cextracts" + "%7Cpageimages" + "&indexpageids=1" /*+ "&exintro=1"*/ + "&explaintext=1"; 			
		//Create final query
		var linkQuery = "http://en.wikipedia.org" + start + title + properties + "&callback=?";
	    return linkQuery;
	}
}

//Creates a new search for the links. 
//The links = links or backlinks.
//At the moment an individual search is preformed for each link, in the future, this should be done 50 links at a time.	
function startLinkSearch(links, color){

	MAIN_SEARCH = false;

	for(var indx = 0; indx < links.length; indx++){
		var query = getLinkSearchString(links[indx]);
		getWikiData(query, color);
	}
	if(MAIN_ARTICLE.time)
		generateTimeDot(MAIN_ARTICLE);
}

//Works similar as the function 'load'.
//Gets data for every article/link. 
//If the article is a place/has coordinates it is saved in the variable'COORD_ARTICLES'.
function loadLinksArticles(data) {

	var temp_article = {
		title: "",
		id: -1,
		entirearticle: "",
		first_paragraph: "",
		first_sentence: "",
		image_source: "",
		position: [null,null],
		time: [[null, null, null], [null, null, null]],
		birthplace: "",
		relation_sentence: "",
		second_relation_sentence: "",
		link_both_ways: false,
		is_backlink: false
	}

	if(MARKER_COLOR == "gray")
		temp_article.is_backlink = true;

	temp_article.id = data.query.pageids[0]; 									//Save article id
	temp_article.title = data.query.pages[temp_article.id].title; 				//Save article title

	//The search may not be completed since it is not entirely sure that the result for the last link searched for arrive last.
	if(LINK_RESULTS_RECIEVED > (MAIN_ARTICLE.backlinks.length + MAIN_ARTICLE.links.length)*0.97) {
		//$("#loading_gif").remove();
		//$("#header_row").append("<i class='fa fa-check-circle' aria-hidden='true' id='loading_done_checkbox'></i>");
		SEARCH_IS_ACTIVE = false;
		console.log("Search completed.")
	}

	//Remove discussions and users from the articles. These often contain a ":" in their title.
	if(temp_article.title.indexOf(":") > 0){
		return;
	}

	temp_article.entirearticle = data.query.pages[temp_article.id].extract;		//Save entire article
	//temp_article.first_paragraph = data.query.pages[temp_article.id].extract; 	//Save first paragraph (Det var såhär innan)
	
	//Save article image link, if it exist.
	if(data.query.pages[temp_article.id].thumbnail) {
		temp_article.image_source = data.query.pages[temp_article.id].thumbnail.source;		

		//Format the image source link so that it gives a full image and not a thumbnail.
		temp_article.image_source = temp_article.image_source.replace("/thumb", "");
		var indx = indexOfBackwards(temp_article.image_source.length, temp_article.image_source, "/");
		temp_article.image_source = temp_article.image_source.substring(0, indx);
	}


	/*--------------------------------------------------------------------
		Bool to check if the article already exists in time_articles,
		if so it means that the article is both a link and a backlink
	----------------------------------------------------------------------*/	 	
	for( var i=0; i < TIME_ARTICLES.length; i++){
		if (TIME_ARTICLES[i].title == temp_article.title){
			temp_article.link_both_ways = true;	
			break;
		}						
	}

	/*-----------------------------------------------
	 	Check if the article has coordinates
	-----------------------------------------------*/

	//If the article has coordinates, save coordinates in 'position'
	if(data.query.pages[temp_article.id].coordinates) {

		//Loop through the array to see if the article is already in the array, if so --> break and set boolean to true
		for( var i=0; i < COORD_ARTICLES.length; i++){
			if (COORD_ARTICLES[i].title == temp_article.title){
				coord_article_exist = true;
				temp_article.link_both_ways = true;	//if the link already exists it means that it is both a link and a backlink
				break;
			}						
		}

		getArticleText(temp_article);

		//Save the article's coordinates in the variable 'position'
		temp_article.position =
			[data.query.pages[temp_article.id].coordinates[0].lat,
			 data.query.pages[temp_article.id].coordinates[0].lon]
	
		//Add the article to the array
		COORD_ARTICLES.push(temp_article);

		//Send information about the article to the map. 
		addArticleToMap(temp_article);

		//If the article is only a link or a backlink (not both), createMapListObject
		if(!temp_article.link_both_ways){
			//Create a title on the list
			createMapListObject(temp_article.title);
		}
	}

	if(temp_article.first_sentence.length < 1) 
		getArticleText(temp_article);



	/*-----------------------------------------------
	 		Check if the article has a year
	-----------------------------------------------*/
	//If the article has a year, save the article in TIME_ARTICLES
	if(temp_article.time[0] && temp_article.time[0][2])
	{
		var time_article_exist = false;

		if(TIME_ARTICLES.length > 0) {

			for(var i = 0; i < TIME_ARTICLES.length; i++) {
				if(TIME_DOTS[0].id == MAIN_ARTICLE.id) {
					TIME_DOTS[0].attr("dot_color", "#fb3a13").attr("dot_border_color", "#fb6142");
					d3.select("#dot" + MAIN_ARTICLE.id).attr("dot_color", "#fb3a13").attr("dot_border_color", "#fb6142").attr("fill", "#ff0000");
					var k = i+1;
				} else {
					var k = i;
				}
				if(TIME_ARTICLES[i].id == temp_article.id) {
					TIME_ARTICLES[i] = temp_article;
					TIME_DOTS[k].attr("dot_color", "#F99C08").attr("dot_border_color", "#faaf39");
					d3.select("#" + TIME_DOTS[i].id).attr("dot_color", "#F99C08").attr("dot_border_color", "#faaf39").attr("fill", "#2E8A2F");
					time_article_exist = true;
					break;
				}
			}
		}
		if(!time_article_exist) {
			TIME_ARTICLES.push(temp_article);
			if(temp_article.time)
				generateTimeDot(temp_article);
		}
		
		//Sort the array time_articles
		/*TIME_ARTICLES.sort(
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
		)*/
	}

	//Return array of articles which have coordinates or time
	return [COORD_ARTICLES, TIME_ARTICLES];

}


/*-------------------------------------------------------------------------------
 		Handle the relations between an article and the links in it 
--------------------------------------------------------------------------------*/
//Get the sentence where the link is mentioned in the main article.
function getRelationSentence(temp_article){

	var relation_sentence = "";
	
	//Find the position where the link's title is mentioned in the main article.
	var linkIndex = MAIN_ARTICLE.entirearticle.indexOf(temp_article.title);

	//Find the index for the title "Se även" in the main article.
	//Links after this title will be ignored, since these are only listed, not mentioned in sentences.
	var endOfArticleIndex = MAIN_ARTICLE.entirearticle.indexOf("See also");

	//If the link's index is greater than 0 and smaller than the index for "Se även" it means
	//that the link is mentioned within the text and the related sentence can be used.
	if(linkIndex > 0 && linkIndex < endOfArticleIndex)
	{
		//Find the index for the first full stop (".") AFTER the link's title.
		var stopIndex = MAIN_ARTICLE.entirearticle.indexOf(".", linkIndex) + 1;
		if(stopIndex > MAIN_ARTICLE.entirearticle.indexOf("==", linkIndex))
			stopIndex = MAIN_ARTICLE.entirearticle.indexOf("==", linkIndex);

		//Find the index for the full stop (".") BEFORE the link's title.
		//Or, if the link is mentioned in the first sentence after a title, find the index for "="
		var startIndexFullstop = indexOfBackwards(linkIndex, MAIN_ARTICLE.entirearticle, ".")+1;
		var startIndexEqualsign = indexOfBackwards(linkIndex, MAIN_ARTICLE.entirearticle, "=")+1;

		//Check if the sign before the sentence is "." or "=".
		if (startIndexFullstop > startIndexEqualsign)
		{
			//Create a string for the complete sentence in which the link is mentioned, from start to stop.
			var relation_sentence = MAIN_ARTICLE.entirearticle.substring(startIndexFullstop, stopIndex);
		}
		else 
		{
			//Create a string for the complete sentence in which the link is mentioned, from start to stop.
			var relation_sentence = MAIN_ARTICLE.entirearticle.substring(startIndexEqualsign, stopIndex);
		}

	}
	return relation_sentence;
}



//Get the sentence where the link is mentioned in the main article.
function getRelationWithBacklink(temp_article) {

	var relation_sentence = "";
	
	//Find the position where the main article's title is mentioned in the link's article.
	var linkIndex = temp_article.entirearticle.indexOf(MAIN_ARTICLE.title);

	//Find the index for the title "Se även" in the link's article.
	//Links after this title will be ignored, since these are only listed, not mentioned in sentences.
	var endOfArticleIndex = temp_article.entirearticle.indexOf("Se även");

	//If the link's index is greater than 0 and smaller than the index for "Se även" it means
	//that the main article is mentioned within the text and the related sentence can be used.
	if(linkIndex > 0 && linkIndex < endOfArticleIndex)
	{
		//Find the index for the first full stop (".") AFTER the link's title.
		var stopIndex = temp_article.entirearticle.indexOf(".", linkIndex) + 1;
		if(stopIndex > MAIN_ARTICLE.entirearticle.indexOf("==", linkIndex))
			stopIndex = MAIN_ARTICLE.entirearticle.indexOf("==", linkIndex);

		//Find the index for the full stop (".") BEFORE the link's title.
		//Or, if the link is mentioned in the first sentence after a title, find the index for "="
		var startIndexFullstop = indexOfBackwards(linkIndex, temp_article.entirearticle, ".")+1;
		var startIndexEqualsign = indexOfBackwards(linkIndex, temp_article.entirearticle, "=")+1;

		//Check if the sign before the sentence is "." or "=".
		if (startIndexFullstop > startIndexEqualsign)
		{
			//Create a string for the complete sentence in which the link is mentioned, from start to stop.
			var relation_sentence = temp_article.entirearticle.substring(startIndexFullstop, stopIndex);
		}
		else 
		{
			//Create a string for the complete sentence in which the link is mentioned, from start to stop.
			var relation_sentence = temp_article.entirearticle.substring(startIndexEqualsign, stopIndex);
		}

	}
	return relation_sentence;
}

/*----------------------------------------------------------------------------------------------------
 	Function that gets the text and information from the entire article, 
	such as first_paragraph, first_sentence, time, relation_sentence and second_relation_sentence
------------------------------------------------------------------------------------------------------*/
function getArticleText(temp_article) {
	
	//If temp_article.entirearticle is not undefined, get first_paragraph, first_sentence and time.
	if(temp_article.entirearticle)
	{
		//If the entire article is longer than just one paragraph
		if(temp_article.entirearticle.indexOf("==") > 0){
			//Save first paragraph
			temp_article.first_paragraph = temp_article.entirearticle.substring(0, temp_article.entirearticle.indexOf("=="));	
		}
		else{
			//Set the first_paragraph to be equal to the entire article.
			temp_article.first_paragraph = temp_article.entirearticle;
		}
		
		temp_article.first_sentence = getFirstSentence(temp_article.first_paragraph);	//Take the first sentence from the related article. 			
		temp_article.time = getArticleTime(temp_article.first_paragraph);		//Get time mentioned in first paragraph of the article

		//If the article is both a link and a backlink
		if(temp_article.link_both_ways){
			//Get the sentence where the link is mentioned in the main article.
			temp_article.relation_sentence = getRelationSentence(temp_article);	

			//Get the sentence where the link is mentioned in the main article.
			temp_article.second_relation_sentence = getRelationWithBacklink(temp_article);	
		}
		//If temp_article is a link, but not a backlink, call the function "getRelationSentence"
		else if(MARKER_COLOR == "black")	{
			//Get the sentence where the link is mentioned in the main article.
			temp_article.relation_sentence = getRelationSentence(temp_article);	
		}
		//If temp_article is a backlink, not a link, call the function "getRelationWithLink"
		else{
			//Get the sentence where the link is mentioned in the main article.
			temp_article.relation_sentence = getRelationWithBacklink(temp_article);	
		}			
	}	
}


	