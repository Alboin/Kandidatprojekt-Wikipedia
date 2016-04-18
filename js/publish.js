/*-----------------------------------------------
	Printa ut massa info! :) 
-----------------------------------------------*/
function printArticle(article) {

	/*-----------------------------------------------
			For the modal popup 
	-----------------------------------------------*/
	
	document.getElementById("artikel_titel").innerHTML = article.title;								//Title
	document.getElementById("artikel_text").innerHTML = article.first_paragraph;					//Article
	document.getElementById("artikel_bild").innerHTML = "<img src='" + article.image_source + "'>";	//Thumbnailmage
	
	//Categories
	//document.getElementById("artikel_kategori").innerHTML = article.categories;

	/*-----------------------------------------------
			Gets information about the article 
	-----------------------------------------------*/
	document.getElementById("artikelinfo").innerHTML = "<b>Artikeltitel:</b> " + article.title
	+ "<br><b>Artikel-Id: </b>" + article.id +"<br><br><b>Första paragrafen i artikeln: </b><br>" + article.first_paragraph + "<br><br>";
	
	//Check if the article has a position. 
	if(article.position[0]) {

		//document.getElementById("koordinater").innerHTML +=  "<b>Artikelns koordinater: </b>" + article.position;
		addArticleToMap(article.position, article.title);
		createListObject(article.title);

	}


	if(article.time[0]) {
		document.getElementById("tidsinfo").innerHTML += "<b>Artikelns start och sluttid </b>" + article.time + "<br><br>";
	}

}