// Hanna och Johanna har skrivit den här filen från början. Den är skriven med angular.js.


(function(){
	
	//article är ett objekt som skulle kunna ha olika attribut, så som 'title' och 'coord'.	
	//Just nu har den inga attribut, men eventuellt skulle vi kunna ha det framöver?
	var article = {}; 

	var app = angular.module('wikiSearch', []);

	//Den här controllern kontrollerar artiklarna.
	app.controller('ArticleController', function(){
		this.product = article;
	});

	//Den här controllern kontrollerar "sidorna" i webbapplikationen
	app.controller('PageController', function(){
		this.page = 4;

		this.setPage = function(setPage){
			this.page = setPage;
		};

		this.isSet = function(isSet){
			return this.page === isSet;
		};
	});

})(); 



/*
(function(){

	var article = { 
		title: 'Sverige', 
		coord: 63.16,
		found: true };
	var app = angular.module('wikiSearch', []);

	app.controller('ArticleController', function(){
		this.products = articles;
	});

	// det här kan behövas senare för att undersöka info om en artikel
	var articles = [
		{ title: 'Sverige', coord: 63.16, found: true},
		{ title: 'Gustav Vasa', coord: 1500, found: true }
	];
})(); */