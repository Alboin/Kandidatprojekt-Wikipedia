
/*******************************************************************************************************
 	Allt det här låg i head i index.html förut, det var Albin som ursprungligen skrev denna kod.
	Funktionen 'printArticle' har modifierats något.

********************************************************************************************************/
		

		var all_articles = [];
		var coord_articles = [];
		var save;
		var first_time;

		//Funktionen som körs när man trycker på "search"
		function runProgram() {		

			var usertext = document.getElementById("searchtext").value;

			var query = getSearchString(usertext);
			//Denna funktion körs asynkront.
			first_time = true;
			searchWiki(query, first_time);
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

		//Funktionen tar en färdig query som input, kör en GET vad nu det innebär, får ett json-objekt som svar, lagrad i variabeln
		//"data".
		function searchWiki(query, first){
			$(document).ready(function(){
			    $.ajax({
			        type: "GET",
			        url: query,
			        contentType: "application/json; charset=utf-8",
			        async: true,
			        dataType: "json",
			        success: function (data, textStatus, jqXHR) {
			        	console.log(data);

			        	if(first){
			        		handleLinks(load(data).links);	//motsvarar typ article.links (som är en array?)
			        		all_articles = [];
			        		printArticle(load(data));

			        		console.log(all_articles[0]);
			       
			        		//Get first sentence in a paragraph. 
			        		getFirstRow(all_articles[0].first_paragraph);

			        		addArticleToMap(all_articles[0].position, all_articles[0].title);

			        	}
			        	else{
			        		//printArticle(load(data));
			        		printLinks(loadLinks(data));

			        	}

			        	//Här bestäms vad som ska göras med resultatet.
			        	//printArticle(load(data));
			        },
			        error: function (errorMessage) {
			        	console.log("Inget sökord ifyllt.");
			        }
			    });
			});
		}

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

			for(var indx = 0; indx < data.query.backlinks.length; indx++) {
				temp_article.backlinks.push(data.query.backlinks[indx].title);
			}
			temp_article.id = data.query.pageids[0];
			temp_article.title = data.query.pages[temp_article.id].title;
			temp_article.first_paragraph = data.query.pages[temp_article.id].extract;
			temp_article.image_source = data.query.pages[temp_article.id].thumbnail.source;
			//temp_article.image_large = data.query.pages[temp_article.id].thumbnail.source;
			//temp_article.categories = data.query.pages[temp_article.id].categories;//.title;

			for(var indx = 0; indx < data.query.pages[temp_article.id].links.length; indx++) {

				temp_article.links.push(data.query.pages[temp_article.id].links[indx].title);
			}

			if(data.query.pages[temp_article.id].coordinates) {
				temp_article.position =
					[data.query.pages[temp_article.id].coordinates[0].lat,
					 data.query.pages[temp_article.id].coordinates[0].lon]
			} else {
				temp_article.position = [null,null];
			}
			

			temp_article.time = getTime(temp_article.first_paragraph);
			temp_article.birthplace = getPosition(data.query.pages[temp_article.id].revisions[0]["*"]);
			//To get the first row in a paragraph. 
			temp_article.first_sentence=getFirstRow(temp_article.first_paragraph);

			console.log(temp_article);

			all_articles.push(temp_article);

			return temp_article;
		}


/*-----------------------------------------------
			Printa ut massa info! :) 
-----------------------------------------------*/
		function printArticle(article) {
			
			//For the modal popup 

			//Title
			document.getElementById("artikel_titel").innerHTML = article.title;
			//Article
			document.getElementById("artikel_text").innerHTML = article.first_paragraph;
			//Thumbnailmage
			document.getElementById("artikel_bild").innerHTML = "<img src='" + article.image_source + "'>";
			//Categories
			//document.getElementById("artikel_kategori").innerHTML = article.categories;

			//console.log(article.categories);
		

			document.getElementById("artikelinfo").innerHTML = "<b>Artikeltitel:</b> " + article.title
			+ "<br><b>Artikel-Id: </b>" + article.id +"<br><br><b>Första paragrafen i artikeln: </b><br>" + article.first_paragraph + "<br><br>";
			
			//Kolla om det finns en position förknippad med artikeln eller inte.
			if(article.position[0]) {

				//document.getElementById("koordinater").innerHTML +=  "<b>Artikelns koordinater: </b>" + article.position;
				addArticleToMap(article.position, article.title);

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
    		var res = paragraph.slice(0, n);

			//If you want to use the sentence in a javascript-file it's called this:
    		var first_sentence = res; 

			return first_sentence;
		}







	