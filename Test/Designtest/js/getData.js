
		//Här ligger en "eventlistener" som är kopplad till sök-knappen med id:t "search".
		//När knappen trycks in kör funktionen som heter "getSearchString".
		document.getElementById("search").addEventListener("click", getSearchString);

		//Funktionen hämtar texten från textrutan, kollar att det inte är tomt, byter ut mellanslag
		//mot "%20" (för att wikipedia vill det) och lägger sedan in den i en hårdkodad query.
		//Till sist skickas den färdiga query:n till funktionen "searchWiki".
		function getSearchString() {
			var usertext = document.getElementById("searchtext").value;
			if(usertext) {
				usertext = usertext.replace(" ", "%20");
				var query1 = "/w/api.php?action=query&list=backlinks&format=json&bltitle=";
				var query2 = "&bllimit=100000";
				var finalQuery = "http://en.wikipedia.org" + query1 + usertext + query2 + "&callback=?";
			    searchWiki(finalQuery);
			}
		}

		//Exempel på queries:
		//var query = "/w/api.php?action=parse&format=json&prop=text&section=0&page=Jimi_Hendrix";
		//var query = "/w/api.php?action=query&list=search&format=json&srsearch=mamma%20mia&srprop=snippet&titles=Main%20Page";
		
		//Funktionen tar en färdig query som input, kör en GET vad nu det innebär, får ett json-objekt som svar, lagrad i variabeln
		//"data". Om försöket till att kontakta wikipedia lyckas körs funktionen "print()".
		function searchWiki(query){
			$(document).ready(function(){
			    $.ajax({
			        type: "GET",
			        url: query,
			        contentType: "application/json; charset=utf-8",
			        async: false,
			        dataType: "json",
			        success: function (data, textStatus, jqXHR) {
			            print(data);
			        },
			        error: function (errorMessage) {
			        	console.log("Något gick fel.");
			        }
			    });
			});
		}

		//Skriver ut en viss bit av json-objektet i text-delen "hejsan".
		function print(data) {
			console.log(data);
			document.getElementById("resultat").innerHTML = "";
			for(var indx = 0; indx < data.query.backlinks.length; indx++) {
				document.getElementById("resultat").innerHTML += data.query.backlinks[indx].title;
				document.getElementById("resultat").innerHTML += "<br><br>";
			}
		}
