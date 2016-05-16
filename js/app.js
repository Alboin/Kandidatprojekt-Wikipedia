/*******************************************************************************************************
 	Authors: Hanna and Johanna 

	This file controls the different pages and how to switch between them.
	
 	The file is written with angular.js. 

********************************************************************************************************/


(function(){
	
	//'article' is an object that could have different attributes, such as 'title' and 'coord'.	
	//At the moment the object does not have any attributes. 
	var article = {}; 

	var app = angular.module('wikiSearch', []);

	//This controller controls the articles. 
	// app.controller('ArticleController', function(){
	// 	this.product = article;
	// });

	//This controller controls the "pages" in the application 
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




/* ------------------------------------------------
	An example of how an object could look like,
	if every article would be "hard coded"
------------------------------------------------- */
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