
//Allt det här låg i article.js förut, Hanna och Johanna har använt Albins kod och modifierat den.
// 2016-04-05

		
		//Funktionen kollar att söksträngen inte är tom, byter ut mellanslag
		//mot "%20" (för att wikipedia vill det) och lägger sedan in den i en hårdkodad query.
		//Till sist skickas den färdiga query:n till funktionen "searchWiki".

		//ANVÄNDS FÖR LÄNKARNA, typ en kopia av getSearchString
		//Modifierad version. Denna används för de relaterade länkarna i den första sökningen.
		function getLinkSearch(input_title) {
			if(input_title) {
				input_title = input_title.replace(" ", "%20");

				//The beginning of the query, tells us to do a query and return the result on json format.
				var start = "/w/api.php?action=query&format=json";
				//The what to search for
				var title = "&titles=" + input_title;
				//Which properties to get. (coordinates, links, revisions, extracts, pageid)
				var properties = "&prop=coordinates" + "&indexpageids=1"; 			
				//Create final query
				var linkQuery = "http://sv.wikipedia.org" + start + title + properties + "&callback=?";
			    return linkQuery;
			}
		}

		//Här testar vi att hantera länkar, skapa nya sökningar av länkarna
		//Skicka en sökning av 50 länkar åt gången
		function handleLinks(links){
			first_time = false;

			for(var indx = 0; indx < links.length; indx++){
				var query = getLinkSearch(links[indx]);
				searchWiki(query, first_time);
			}

			//ska sättas till true igen, ifall användaren klickar på en av länkarna?
			//first_time = true;
		} 

		//Checkar om varje länk har en position, dvs. om den är en plats
		//Om länken/artikeln är en plats, spara den.
		function linksPosition(links){

			for(var indx = 0; indx < links.length; indx++){
				if(article.position != ""){
					document.getElementById("platser").innerHTML += article.title;
				}
			}
		}

		//ANVÄNDS FÖR LÄNKARNA, typ en kopia av printArticle
		function printLinks(linksarray) {
			
			var titles = [];
			
			//Loopa igenom arrayen för att skriva ut titlarna på alla länkar som har koordinater/platsangivelser
			for(var indx = 0; indx < linksarray.length; indx++){
				//document.getElementById("länkar").innerHTML = "<b>Artikeltitel:</b> " + linksarray[indx].title + "<br><br>";
				titles.push(" " + linksarray[indx].title );
			}

			document.getElementById("länkar").innerHTML = titles;

			document.getElementById("länkar").innerHTML += "<br><br>" + "Antal länkar med koordinater:</b> " + linksarray.length;
		}


		//ANVÄNDS FÖR LÄNKARNA, typ en kopia av 'load'
		function loadLinks(data) {

			var temp_article = {
				title: "",
				id: -1,
				//first_paragraph: "",
				position: [null,null],
				birthplace: "",
			}

			temp_article.id = data.query.pageids[0];
			temp_article.title = data.query.pages[temp_article.id].title;
			//temp_article.first_paragraph = data.query.pages[temp_article.id].extract;

			all_articles.push(temp_article);

			if(data.query.pages[temp_article.id].coordinates) {
				temp_article.position =
					[data.query.pages[temp_article.id].coordinates[0].lat,
					 data.query.pages[temp_article.id].coordinates[0].lon]

				coord_articles.push(temp_article);
			} 
			else {
				temp_article.position = [null,null];
			}

			return coord_articles;
		}



	