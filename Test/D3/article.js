
//Allt det här låg i head i index.html förut, det var Albin som ursprungligen skrev denna kod.
//Funktionen 'printArticle' har modifierats något.
		

		var all_articles = [];
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
				//Wich properties to get. (coordinates, links, revisions, extracts, pageid, pageimages, images(används inte än), categories)
				var properties = "&prop=coordinates%7Clinks%7Crevisions%7Cextracts%7Cpageimages%7Cimages%7Ccategories" + "&indexpageids=1" + "&pllimit=max"; 
				var revisions = "&rvprop=content" + "&exintro=1" + "&explaintext=1";

				//Wich lists to get.
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
			        		//handleLinks(load(data).links);	//motsvarar typ article.links (som är en array?)
			        		all_articles = [];
			        		printArticle(load(data));

			        		console.log(all_articles[0]);
			       
			        		//Get first sentence in a paragraph. 
			        		getFirstRow(all_articles[0].first_paragraph);

			        		addArticleToMap(all_articles[0].position, all_articles[0].title);

			        	}
			        	else{
			        		//printArticle(load(data));
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

		//Här testar vi att hantera länkar, skapa nya sökningar av länkarna
		//Skicka en sökning av 50 länkar åt gången
		function handleLinks(links){
			first_time = false;

			for(var indx = 0; indx < links.length; indx++){
				var query = getSearchString(links[indx]);
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
				//image_large: ""

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
			//console.log(temp_article.categories);

			all_articles.push(temp_article);
			return temp_article;
		}


		function getTime(text) {
			//Temporary variables
			var month = null;
			var year = null;
			var temp_time = [null,null,null]; // [date, month, year]
			var word = "";
			var previous_word_was_month = false;

			//Variable to return
			var time = [];

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
			return time;
		}

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

		function getPosition(revision) {
			
			var birthplace = "";
			var indx = revision.indexOf("f\u00f6delseplats");

			indx = revision.indexOf("[[", indx) + 2;
			birthplace = revision.substring(indx, revision.indexOf("]]",indx));

			return birthplace;
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



	