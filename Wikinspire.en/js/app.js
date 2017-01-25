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
		this.page = 1;
		changeClockImage();


		this.setPage = function(setPage){
			this.page = setPage;
		};

		this.isSet = function(isSet){
			return this.page === isSet;
		};
	});

})(); 
