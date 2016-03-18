
(function(){
		
	var article = { 
		title: 'Sverige', 
		coord: 63.16,
		found: true }; 

	var app = angular.module('wikiSearch', []);

	app.controller('ArticleController', function(){
		this.product = article;
	});

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