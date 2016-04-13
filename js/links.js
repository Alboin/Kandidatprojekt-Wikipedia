/*******************************************************************************************************
 	Allt det här låg i article.js förut, Hanna och Johanna har använt Albins kod och modifierat den.
	Datum när filen skapades: 2016-04-05

	Filen innehåller funktioner som hanterar länkarna i en artikel (links). 
	Den ska helst hantera 'backlinks' sen också.

********************************************************************************************************/

	
		//Funktionen kollar att söksträngen inte är tom, byter ut mellanslag
		//mot "%20" (för att wikipedia vill det) och lägger sedan in den i en hårdkodad query.
		//Till sist skickas den färdiga query:n till funktionen "searchWiki".

		//Typ en kopia av getSearchString. Används för de relaterade länkarna i den första sökningen.
		//Här väljer man vilka 'properties' som hämtas från en viss artikel.
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
			///w/api.php?action=query&format=json&prop=extracts%7Ccoordinates&titles=Banana&exintro=1&explaintext=1
		}

		//Skapar nya sökningar av länkarna.
		//Skicka en sökning av 50 länkar åt gången
		function handleLinks(links){
			main_search = false;

			for(var indx = 0; indx < links.length; indx++){
				var query = getLinkSearch(links[indx]);
				searchWiki(query, main_search);
			}

			//ska sättas till true igen, ifall användaren klickar på en av länkarna?
			//main_search = true;
		} 

		//Checkar om varje länk har en position, dvs. om den är en plats
		//Om länken/artikeln är en plats, spara titeln under id "platser".
		function linksPosition(links){

			for(var indx = 0; indx < links.length; indx++){
				if(article.position != ""){
					document.getElementById("platser").innerHTML += article.title;
				}
			}
		}

		//Typ en kopia av printArticle
		//Skriver ut information om länkarna.
		function printLinks(linksarray) {
			
			var titles = [];
			var linksCoord = [];
			
			//Loopa igenom arrayen för att skriva ut titlarna på alla länkar som har koordinater/platsangivelser
			for(var indx = 0; indx < linksarray.length; indx++){
				//document.getElementById("länkar").innerHTML = "<b>Artikeltitel:</b> " + linksarray[indx].title + "<br><br>";
				titles.push(" " + linksarray[indx].title );
				linksCoord.push(" " + linksarray[indx].position);
			}

			document.getElementById("länkar").innerHTML = titles;

			//Om man vill skriva ut de relaterade länkarnas koordinater använd nedanstående rad.
			//document.getElementById("länkar").innerHTML += "<br><br>" + linksCoord;

			document.getElementById("länkar").innerHTML += "<br><br>" + "Antal länkar med koordinater:</b> " + linksarray.length;
		}


		//Typ en kopia av 'load'.
		//Hämtar data för varje artikel/länk. Om artikeln är en plats/har koordinater sparas den i 'coord_articles'.
		function loadLinks(data) {

			var temp_article = {
				title: "",
				id: -1,
				first_paragraph: "",
				image_source: "",
				position: [null,null],
				birthplace: "",
			}

			temp_article.id = data.query.pageids[0]; //Save article id
			temp_article.title = data.query.pages[temp_article.id].title; //Save article title
			temp_article.first_paragraph = data.query.pages[temp_article.id].extract; //Save first paragraph
			temp_article.image_source = data.query.pages[temp_article.id].thumbnail.source;		//Save small image, source

			//If the article has coordinates, save coordinates in 'position'
			if(data.query.pages[temp_article.id].coordinates) {
				temp_article.position =
					[data.query.pages[temp_article.id].coordinates[0].lat,
					 data.query.pages[temp_article.id].coordinates[0].lon]

				coord_articles.push(temp_article);
				addArticleToMap(temp_article.position, temp_article.title);
			}

			//Return array of articles which have coordinates
			return coord_articles;
		}



	