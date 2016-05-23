
/*******************************************************************************************************
 	Authors: Originally Albin Bergström who has written this code.

 	Gets information from Wikipedia and declares different variables for every data that is handled by 
 	the Wikipedia API. The data can be used in the index-file and the different js-files.

 	The file includes the functions:
 	- getSearchString
 	- getRandomSearchString
 	- getRandomTitle
 	- loadMainArticle
 	- getPositionBirthplace
 	- getFirstSentence
 	- getArticleTime
 	- getMonth
 	- getYear
 	- printModalContent
 	- indexOfBackwards
********************************************************************************************************/

/*-----------------------------------------------
		Declare global variables
-----------------------------------------------*/
var MAIN_ARTICLE;  //Contains the main article
var COORD_ARTICLES = []; //Contains all articles with coordinates.
var TIME_ARTICLES = []; //Contains all articles with a time.
var OLD_MAIN_ARTICLES = [];
//var save;  - is this even used?
var MAIN_SEARCH = false; //A boolean used to separate main search and link search.
		

/*	The function check if the searchstring is empty and replace spaces with "%20",
	because this is how Wikipedia's API works. The function then adds the searchstring in a query.
	At last the final query is sent to the function 'getWikiData'. */
function getSearchString(input_title) {

	if(input_title) {

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

		//Which properties to get. (coordinates, links, revisions, extracts, pageid, pageimages, images(används inte än), categories)
		var properties = "&prop=coordinates%7Clinks%7Crevisions%7Cextracts%7Cpageimages" + "&indexpageids=1" + "&pllimit=max"; 
		var revisions = "&rvprop=content" /* +"&exintro=1"*/ + "&explaintext=1";

		//Which lists to get.
		var lists = "&list=backlinks"
		var list_parameters = "&bllimit=max" + "&bltitle=" + input_title;
		//Create final query
		var finalQuery = "http://sv.wikipedia.org" + start + title + properties + revisions + lists + list_parameters + "&callback=?";
	    return finalQuery;
	}
}

//When pressing the random button a random article will get generated. 
function getRandomSearchString() {

	//Uses this link to get a random article. 
	//https://sv.wikipedia.org/w/api.php?action=query&format=json&list=random&rnnamespace=0&rnlimit=1
	
	//The beginning of the query, tells us to do a query and return the result on json format.
	var start = "/w/api.php?action=query&format=json";

	//var random = "&generator=random&grnnamespace=0";
	var random = "&list=random&rnnamespace=0&rnlimit=1";

	//Create final query
	var finalRandomQuery = "http://sv.wikipedia.org" + start + random + "&callback=?";
	console.log(finalRandomQuery);

    return finalRandomQuery;	
}

//Gets the title from the random article. 
function getRandomTitle(data) {

	var random_article = {
		title: "",
		id: -1,
	}

	random_article.id = data.query.random[0].id;
	random_article.title = data.query.random[0].title;	

	console.log(random_article);

	//Make a new search with the random title. 
	pressSearchButton(random_article.title); 

	return random_article;
}


//Gets data for an article and saves it in 'temp_article'
function loadMainArticle(data) {

	var temp_article = {
		title: "",
		id: -1,
		links: [],
		backlinks: [],
		entirearticle: "",
		first_paragraph: "",
		position: [null,null],
		birthplace: "",
		time: [[null, null, null], [null, null, null]],
		image_source: "",
		first_sentence:"",
		year: null,
	}


	
	temp_article.id = data.query.pageids[0];											//Save article id
	temp_article.title = data.query.pages[temp_article.id].title;						//Save the title of the article
	temp_article.entirearticle = data.query.pages[temp_article.id].extract;				//Save the content of the entire article
	
	//Save article image link, if it exist.
	if(data.query.pages[temp_article.id].thumbnail) {
		temp_article.image_source = data.query.pages[temp_article.id].thumbnail.source;
	
		//Format the image source link so that it gives a full image and not a thumbnail.
		temp_article.image_source = temp_article.image_source.replace("/thumb", "");
		var indx = indexOfBackwards(temp_article.image_source.length, temp_article.image_source, "/");
		temp_article.image_source = temp_article.image_source.substring(0, indx);	
	}

	//Take out the first paragraph from the entire article
	temp_article.first_paragraph = temp_article.entirearticle.substring(0, temp_article.entirearticle.indexOf("=="));
	//console.log(temp_article.entirearticle);

	//Save first sentence of the article
	temp_article.first_sentence = getFirstSentence(temp_article.first_paragraph); 			
	
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
	temp_article.time = getArticleTime(temp_article.first_paragraph);
	//Get position of birthplace
	temp_article.birthplace = getPositionBirthplace(data.query.pages[temp_article.id].revisions[0]["*"]);

	//Add article to the array with articles
	MAIN_ARTICLE = temp_article;

		document.getElementById("middle_row").innerHTML =  "" + MAIN_ARTICLE.title;	

	//Get the year. 
	//temp_article.year=getYear(temp_article.time);
	temp_article.time = getArticleTime(temp_article.first_paragraph);

	if(temp_article.time[0])
		TIME_ARTICLES.push(temp_article);

	//Check if the article has a position. 
	if(temp_article.position[0]) {

		addArticleToMap(temp_article);
		createMapListObject(temp_article.title);
		placeMainMarkerOnTop();

	}

	return temp_article;
}


//Get position of birthplace
function getPositionBirthplace(revision) {
	
	var birthplace = "";
	//Look for the word "födelseplats" in text and save its index in text.
	var indx = revision.indexOf("f\u00f6delseplats");

	//Start from revision[indx] and search for "[[", save its index.
	indx = revision.indexOf("[[", indx) + 2;
	birthplace = revision.substring(indx, revision.indexOf("]]",indx));

	return birthplace;
}


//Print the first sentence in an article.  
function getFirstSentence(paragraph){
	if(paragraph) { 

		//Replace any line-breaks with a space, otherwise the first "." will not be found.
		paragraph = paragraph.replace(/(\r\n|\n|\r)/gm, " ");

		//Find the position where a dot followed by space is in a string. 
		var n = paragraph.indexOf(". ");
		
		//If the first paragraph only is one sentence long, search for "." instead.
		if(n < 0)
			n = paragraph.indexOf(".");

		//Split the string where the position is set. 
		var res = paragraph.slice(0, n+1);

		//If you want to use the sentence in a javascript-file it's called this:
		var first_sentence = res; 
		
		return first_sentence;
	} else {
		return "";
	}
}

//This function checks if any dates are mentioned in the article
//It returns time, which consists of [date, month, year]
function getArticleTime(text) {

	//Temporary variables
	var month = null;
	var year = null;
	var temp_time = [null,null,null]; // [date, month, year]
	var word = "";
	var previous_word_was_month = false;

	//Variable to return
	var time = [];

	if(text) {
		//Prepare text.
		text = text.replace(/[-–&\/\\#,+()$~%.'":*?<>{}]/g, ' ');
		text = text.toLowerCase();

		for(var indx = 0; indx < text.length; indx++) {
			//If current char is " ", we have a word.
			if(text[indx] == " ") {
				
				//Check if word is a number, if it is, convert it to an integer and save in "date".
				if(!isNaN(word) && !(word == "")) {
					//If the number is less than 3 digits it is probably a date.
					if(word.length < 3) {
						temp_time[0] = parseInt(word);
						//all_dates.push(parseInt(word));

					//If it is longer than 2 digits and the previous word was a month it is probably a year.
					} else if (temp_time[0] != null && previous_word_was_month) {
						temp_time[2] = parseInt(word);

						getYear(temp_time[2]);
					} 
				//If the word is not a number, check if it is a date.
				} else {
					month = getMonth(word);
					if(month > -1) {
						temp_time[1] = month;
						previous_word_was_month = true;
					} else {
						previous_word_was_month = false;
					}
				}

				//If all slots in "temp_time" is filled, save the point of time and clear the variable.
				if(temp_time[2] != null) {
					time.push(temp_time);
					if(time.length > 1)
						return time;
					temp_time = [null,null,null];
				}

				//Clear word
				word = "";

			} else {
				//Append current char to word.
				word += text[indx];
			
			}
		}
	}
	return time;
}


//Convert the string for a month to an integer instead (months 1-12) 
function getMonth(word) {
	var result = -1;
	result = word.localeCompare("januari");
	if(result == 0)
		return 1; 
	result = word.localeCompare("februari");
	if(result == 0)
		return 2; 
	result = word.localeCompare("mars");
	if(result == 0)
		return 3; 
	result = word.localeCompare("april");
	if(result == 0)
		return 4; 
	result = word.localeCompare("maj");
	if(result == 0)
		return 5; 
	result = word.localeCompare("juni");
	if(result == 0)
		return 6; 
	result = word.localeCompare("juli");
	if(result == 0)
		return 7; 
	result = word.localeCompare("augusti");
	if(result == 0)
		return 8; 
	result = word.localeCompare("september");
	if(result == 0)
		return 9; 
	result = word.localeCompare("oktober");
	if(result == 0)
		return 10; 
	result = word.localeCompare("november");
	if(result == 0)
		return 11; 
	result = word.localeCompare("december");
	if(result == 0)
		return 12;
	//Return -1 if it is not a month.
	return -1;
}

//Get the year in an article. 
function getYear(date){

	//console.log(date);
	//Takes the first year in the article. 
	year = date[0]; 
	return year; 
}

function printModalContent(article) {

	/*-----------------------------------------------
			Text for the modal popup 
	-----------------------------------------------*/
	
	if(article.title.length > 18){
		$("#artikel_titel").css("font-size","30px");
	}
	else if (article.title.length < 10){
		
		$("#artikel_titel").css("font-size","50px");
	}
	else {
		$("#artikel_titel").css("font-size","40px");
	}
	document.getElementById("artikel_titel").innerHTML = article.title;								//Title
	document.getElementById("artikel_text").innerHTML = article.first_paragraph;					//Article
	if(article.image_source != "")
		document.getElementById("artikel_bild").innerHTML = "<img id='modalImage' src='" + article.image_source + "'>";	//Thumbnailmage

	/*-----------------------------------------------
			Gets information about the article 
	-----------------------------------------------*/
	document.getElementById("artikelinfo").innerHTML = "<b>Artikeltitel:</b> " + article.title
	+ "<br><b>Artikel-Id: </b>" + article.id +"<br><br><b>Första paragrafen i artikeln: </b><br>" + article.first_paragraph + "<br><br>";

}

//Function that returns index of "character" in "string", moving backwards from the given index "startIndx".
function indexOfBackwards(startIndx, string, character) {
	
	for(var i = startIndx; i > 0; i--) {
		if(string[i] == character)
			return i;
	}
	return -1;
}








	