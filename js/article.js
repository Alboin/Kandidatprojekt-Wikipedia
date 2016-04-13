
/*******************************************************************************************************
 	Hämtar information från Wikipedia och deklarerar olika variabler för varje data som hämtats från APIt.
 	Datan kan användas i index och de olika js-filerna. 
 	Det var Albin som ursprungligen skrev denna kod.

********************************************************************************************************/
		


/*-----------------------------------------------
		Declare global variables
-----------------------------------------------*/
var main_article;
var coord_articles = [];
var time_articles = [];
var save;
var main_search;


		//Funktionen som körs när man trycker på "search"
		function runSearch() {		

			//Save user input.
			var usertext = document.getElementById("searchtext").value;

			//Create query from user input.
			var query = getSearchString(usertext);

			//Denna funktion körs asynkront.
			main_search = true;
			searchWiki(query, main_search);
			//Det betyder att HÄR, efter funktionen skulle man kunna ha någon slags loadingscreen, som visas medans vi väntar på ett svar från funktionen.
		}

		
		//Funktionen kollar att söksträngen inte är tom, byter ut mellanslag
		//mot "%20" (för att wikipedia vill det) och lägger sedan in den i en hårdkodad query.
		//Till sist skickas den färdiga query:n till funktionen "searchWiki".
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

		//Funktionen tar en färdig query som input, kör en GET vad nu det innebär, får ett json-objekt som svar, 
		//lagrad i variabeln "data".
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

			        		generateTimeCircle(all_articles[0].title, all_articles[0].first_sentence);

			        	}
			        	else{

			        		//Hantera de relaterade länkarna, gör en ny sökning för varje relaterad länk.
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

		//Hämtar datainformation om en artikel och sparar i 'temp_article'
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



/*-----------------------------------------------
			Printa ut massa info! :) 
-----------------------------------------------*/
		function printArticle(article) {

			/*-----------------------------------------------
					For the modal popup 
			-----------------------------------------------*/
			//Title
			document.getElementById("artikel_titel").innerHTML = article.title;
			//Article
			document.getElementById("artikel_text").innerHTML = article.first_paragraph;
			//Thumbnailmage
			document.getElementById("artikel_bild").innerHTML = "<img src='" + article.image_source + "'>";
			//Categories
			//document.getElementById("artikel_kategori").innerHTML = article.categories;

			//console.log(article.categories);
		

			/*-----------------------------------------------
					Tar ut information om artikeln 
			-----------------------------------------------*/
			document.getElementById("artikelinfo").innerHTML = "<b>Artikeltitel:</b> " + article.title
			+ "<br><b>Artikel-Id: </b>" + article.id +"<br><br><b>Första paragrafen i artikeln: </b><br>" + article.first_paragraph + "<br><br>";
			
			//Kolla om det finns en position förknippad med artikeln eller inte.
			if(article.position[0]) {

				//document.getElementById("koordinater").innerHTML +=  "<b>Artikelns koordinater: </b>" + article.position;
				addArticleToMap(article.position, article.title);
				createListObject(article.title);

			}


			if(article.time[0]) {
				document.getElementById("tidsinfo").innerHTML += "<b>Artikelns start och sluttid </b>" + article.time + "<br><br>";
			}

			
			document.getElementById("länkar").innerHTML +=  "<b>Länkar i artikeln:</b> ("
			+ article.links.length + " st)<br>";
			for(var indx = 0; indx < article.links.length; indx++) {
				document.getElementById("länkar").innerHTML += article.links[indx];
				document.getElementById("länkar").innerHTML += ", ";
			}

			document.getElementById("länkar").innerHTML +=  "<br><br><b>Artiklar som länkar till denna artikel:</b> ("
			+ article.backlinks.length + " st)<br>";
			for(var indx = 0; indx < article.backlinks.length; indx++) {
				document.getElementById("länkar").innerHTML += article.backlinks[indx];
				document.getElementById("länkar").innerHTML += ", ";
			}

			document.getElementById("sökgenomförd").innerHTML = "Klicka på de olika tabbarna för mer information om artikeln.";
		}



		//Print the first sentence in an article.  
		function getFirstRow(paragraph){
			
			//Find the position where a dot followed by space is in a string. 
    		var n = paragraph.indexOf(". ");
    		//Split the string where the position is set. 
    		var res = paragraph.slice(0, n+1);

			//If you want to use the sentence in a javascript-file it's called this:
    		var first_sentence = res; 

			return first_sentence;
		}







	