
/*-----------------------------------------------
			Skriver ut text till HTML-format
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
