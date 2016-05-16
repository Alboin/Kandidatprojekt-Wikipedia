/*******************************************************************************************************
 	Authors: Sara och Sarah 

	This file controls the different pages and how to switch between them. 
	It is based on app.js but uses code from a template. 
	
 	The file is written with angular.js. 

********************************************************************************************************/
(function(){

	//'article' is an object that could have different attributes, such as 'title' and 'coord'.	
	//At the moment the object does not have any attributes. 
	var article = {}; 

	var app = angular.module('wikiSearch', [
	  'ngRoute'
	]);

	app.config(['$routeProvider', function ($routeProvider) {
	  $routeProvider
	    // Homes
	   // .when("/", {templateUrl: "pages/home.html", controller: "pageCtrl"})
	   // .when("/", {templateUrl: "index_test.html", controller: "pageCtrl"})
	    // Pages
	    .when("/map", {templateUrl: "pages/mapview.html", controller: "pageCtrl"})
	    .when("/time", {templateUrl: "pages/timeview.html", controller: "pageCtrl"})
	    .when("/index2", {templateUrl: "index2_test.html", controller: "pageCtrl"})
	    // else 404
	    .otherwise("/404", {templateUrl: "pages/404.html", controller: "pageCtrl"});
	}]);

	//This controller controls the "pages" in the application 
	app.controller('pageCtrl', function(){
	});

})(); 