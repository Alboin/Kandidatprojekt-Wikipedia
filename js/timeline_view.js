/*******************************************************************************************************
 	Authors: Sara and Sarah

 	Displays a marker for the search placed on a time line. 

 	The file includes the functions:
 	- generateTimeDot
 	- ShowHideTipsy


********************************************************************************************************/

//Hela funktionen fungerar som en loop som beror på time.articles.length. 
function generateTimeDot(title, sentence) {
    var body = d3.select("body");
    var div = body.append("div");
    var svg = d3.selectAll("svg");

    //Number of articles. Temporary!
    n = TIME_ARTICLES.length;
	console.log("Antal artiklar med år " + n  + "plus en");
    //Center position (the middle of the timeline)
    center=1200;

    if(n>=0){

	    //Difference in position between the dots.
	    diff = 80*n; 
	    //The number for every dots id.
	    i= diff/80; 
  
 		//Creates all the dots with their own id. 
        //position = "_left"; //creates a part of the id-name.
        svg.append("circle").attr("cx", center - diff)
                            .attr("cy", 100)
                            .attr("r", 10)
                            .attr("id", "dot") //.attr("id", "dot"+ position + i)
                            .attr("fill", 'red' );
		
		 //plotDot(MAIN_ARTICLE.title, MAIN_ARTICLE.first_sentence);


		// The black circle that's supposted to trigger the tipsy has the id "dot"
        $('#dot').attr('rel', 'hide');  // dot starts with the tipsy hidden, therefore rel has the id "hide"
        $('#dot').attr('onclick', 'ShowHideTipsy($(this))'); // When you click on dot the function ShowHideTipsy is called
        $('#dot').attr({
            title: ( '<div class="marker-title">' + title + '</div>' + '<div class="mapboxgl-popup">'+  sentence + '</div>'
                + '</div><a href onclick="changeModalContent(' + "'" + title + "'" +')" data-toggle="modal" data-target="#myModal"> Mer info...</a><p>')    
        }); 

        $(function() {
            $('#dot').tipsy({
                trigger: 'manual', // this makes it possible to change tipsy manually like we want to do
                gravity: 's', // the gravity decides where the tipsy will show (inverse). s=south, n=north, w=west, nw=northwest etc.
                html: true    // makes it possible to have html content in tipsy
            });
        });

        $(document).click(function(){
            $('#dot').tipsy("hide");
            console.log("hide tipsy");
        });

        $('#dot').click(function(e){
            e.stopPropagation();
        });

	}
			//console.log(diffplotDot());

            // // The black circle that's supposted to trigger the tipsy has the id "dot"
            // $('#dot'+ position + i).attr('rel', 'hide');  // dot starts with the tipsy hidden, therefore rel has the id "hide"
            // $('#dot'+ position + i).attr('onclick', 'ShowHideTipsy($(this))'); // When you click on dot the function ShowHideTipsy is called
            // $('#dot'+ position + i).attr({
            //     title: ( '<div class="marker-title">' + title + '</div>' + '<div class="mapboxgl-popup">'+  sentence + '</div>'
            //         + '</div><a href onclick="changeModalContent(' + "'" + title + "'" +')" data-toggle="modal" data-target="#myModal"> Mer info...</a><p>')    
            // }); 

            // $(function() {
            //     $('#dot'+ position + i).tipsy({
            //         trigger: 'manual', // this makes it possible to change tipsy manually like we want to do
            //         gravity: 's', // the gravity decides where the tipsy will show (inverse). s=south, n=north, w=west, nw=northwest etc.
            //         html: true    // makes it possible to have html content in tipsy
            //     });
            // });

            // $(document).click(function(){
            //     $('#dot'+ position + i).tipsy("hide");
            //     console.log("hide tipsy");
            // });

            // $('#dot'+ position + i).click(function(e){
            //     e.stopPropagation();
            // });
        
   
}     

function plotDot(title, sentence){

console.log("Popup");
            // The black circle that's supposted to trigger the tipsy has the id "dot"
            $('#dot').attr('rel', 'hide');  // dot starts with the tipsy hidden, therefore rel has the id "hide"
            $('#dot').attr('onclick', 'ShowHideTipsy($(this))'); // When you click on dot the function ShowHideTipsy is called
            $('#dot').attr({
                title: ( '<div class="marker-title">' + title + '</div>' + '<div class="mapboxgl-popup">'+  sentence + '</div>'
                    + '</div><a href onclick="changeModalContent(' + "'" + title + "'" +')" data-toggle="modal" data-target="#myModal"> Mer info...</a><p>')    
            }); 

            $(function() {
                $('#dot').tipsy({
                    trigger: 'manual', // this makes it possible to change tipsy manually like we want to do
                    gravity: 's', // the gravity decides where the tipsy will show (inverse). s=south, n=north, w=west, nw=northwest etc.
                    html: true    // makes it possible to have html content in tipsy
                });
            });

            $(document).click(function(){
                $('#dot').tipsy("hide");
                console.log("hide tipsy");
            });

            $('#dot').click(function(e){
                e.stopPropagation();
            });

}


// function generateTimeDot(title, sentence) {
//     var body = d3.select("body");
//     var div = body.append("div");
//     var svg = d3.selectAll("svg");

//     //Number of articles. Temporary!
//     n = TIME_ARTICLES.length;
//     console.log("Antal artiklar med år " + n);
// 	//n=3;
   
//     //Check if even or odd. 
//     odd_or_even = n%2;
//     //Center position (the middle of the timeline)
//     center=650;
//     //Difference in position between the dots.
//     diff = 80; 
//     //The first position if even number of articles. 
//     first_diff = diff/2;
//     //When it's even we want to know how many there should be on each side. 
//     m=n/2; 

//     //If it is even
//     if(odd_or_even==0){

//         //console.log("jämn");
//         i=1;

//         //Plot dots to the left of the center 
//         for(i; i<=m; i++){
            
//             //First dot to the left. 
//             position = "_left"; //creates a part of the id-name.
//             svg.append("circle").attr("cx", center - first_diff)
//                                 .attr("cy", 300)
//                                 .attr("r", 10)
//                                 .attr("id", "dot"+ position + i )
//                                 .attr("fill", 'red' );
            
//             //console.log("vänster");

//             //The rest of the dots to the left. 
//             for(i=2; i<=m; i++){

//                 diff=(80*i)-80; //Borde skrivas finare. 
    
//                 svg.append("circle").attr("cx", center - first_diff - diff).attr("cy", 300)
//                                     .attr("r", 10)
//                                     .attr("id", "dot"+ position + i )
//                                     .attr("fill", 'green' );
//             }

            
//         }

//         //Plot dots to the right of the center.
//         for(i=m+1; i<=n; i++){
            
//             //First dot to the right. 
//             position = "_right";  //creates a part of the id-name.
//             svg.append("circle").attr("cx", center + first_diff)
//                                 .attr("cy", 300)
//                                 .attr("r", 10)
//                                 .attr("id", "dot" + position + i );
            
//             //console.log("höger");

//             //Plots the rest of the dots to the right. 
//             for(i=m+2; i<=n; i++){
            
//                 diff= (80*i)-4*80; //Borde skrivas finare.

//                 svg.append("circle").attr("cx", center + first_diff + diff)
//                                     .attr("cy", 300)
//                                     .attr("r", 10)
//                                     .attr("id", "dot" + position + i )
//                                     .attr("fill", 'blue' );
//             }
//         }     
//     }
//     else{
        
//         //console.log("udda");

//         //To get the center position without a decimal. 
//         m=m+0.5;
//        // console.log("The center of " + n + " is " + m ); 
//         i=0;

//         for(i; i<=n; i++){
             
//             //Plot the dots to the left of the center.
//             if(i<m){
  
//                 position = "_left";  //creates a part of the id-name.
//                 diff= (80*i);
             
//                 svg.append("circle").attr("cx", center-diff)
//                                     .attr("cy", 300)
//                                     .attr("r", 10)
//                                     .attr("id", "dot" + position + i)
//                                     .attr("fill", 'red' );

// 	            // The black circle that's supposted to trigger the tipsy has the id "dot"
// 	            $('#dot'+ position + i).attr('rel', 'hide');  // dot starts with the tipsy hidden, therefore rel has the id "hide"
// 	            $('#dot'+ position + i).attr('onclick', 'ShowHideTipsy($(this))'); // When you click on dot the function ShowHideTipsy is called
// 	            $('#dot'+ position + i).attr({
// 	                title: ( '<div class="marker-title">' + title + '</div>' + '<div class="mapboxgl-popup">'+  sentence + '</div>'
// 	                    + '</div><a href onclick="changeModalContent(' + "'" + title + "'" +')" data-toggle="modal" data-target="#myModal"> Mer info...</a><p>')    
// 	            }); 

// 	            $(function() {
// 	                $('#dot'+ position + i).tipsy({
// 	                    trigger: 'manual', // this makes it possible to change tipsy manually like we want to do
// 	                    gravity: 's', // the gravity decides where the tipsy will show (inverse). s=south, n=north, w=west, nw=northwest etc.
// 	                    html: true    // makes it possible to have html content in tipsy
// 	                });
// 	            });

// 	            $(document).click(function(){
// 	                $('#dot'+ position + i).tipsy("hide");
// 	                console.log("hide tipsy");
// 	            });

// 	            $('#dot'+ position + i).click(function(e){
// 	                e.stopPropagation();
// 	            });



//             }
//             //Plot the dots to the right of the center.
//             if(i>m){

//                // console.log("i " +i);
//                 position = "_right";
//                 diff= (80*i)-240;
//                // console.log(diff);
//                 svg.append("circle").attr("cx", center + diff)
//                                     .attr("cy", 300)
//                                     .attr("r", 10)
//                                     .attr("id", "dot" + position + i)
//                                     .attr("fill", 'green' );
//             } 
//             //Plot the dot in center position.
//             else{

//                 //Center
//                 position = "_center";  //creates a part of the id-name.
            
//                 svg.append("circle").attr("cx", center)
//                                     .attr("cy", 300)
//                                     .attr("r", 10)
//                                     .attr("id", "dot" + position + i);
//                 //console.log("i " +i);
//             }
//         }
//     }
// }


// function generateTimeDot(title, sentence) {

// 	var body = d3.select("body");
// 	var div = body.append("div");
// 	var svg = d3.selectAll("svg");

// 	//Make a circle placed on position (cx,cy) with radius r.
// 	svg.append("circle").attr("cx", 500).attr("cy", 300).attr("r", 10).attr("id", "dot");

// 	// The black circle that's supposted to trigger the tipsy has the id "dot"
// 	$('#dot').attr('status', 'hide');	
// 	// dot starts with the tipsy hidden, therefore status has the id "hide"
//     $('#dot').attr('onclick', 'ShowHideTipsy($(this))'); 
//     // When you click on dot the function ShowHideTipsy is called
// 	$('#dot').attr({
// 		title: ( '<div class="marker-title">' + title + '</div>' + '<div class="mapboxgl-popup">'+  sentence + '</div>'
// 			+ '</div><a href onclick="changeModalContent(' + "'" + title + "'" +')" data-toggle="modal" data-target="#myModal"> Mer info...</a><p>')	
// 	}); 
		
// 	// Here all the attributes for dot's tipsy is set 
// 	$(function() {
// 	    $('#dot').tipsy({
// 	    	trigger: 'manual', // this makes it possible to change tipsy manually like we want to do
// 	    	gravity: 's', // the gravity decides where the tipsy will show (inverse). s=south, n=north, w=west, nw=northwest etc.
// 	    	html: true    // makes it possible to have html content in tipsy
// 	    });
// 	});

//     $(document).click(function(){
//        	$("#dot").tipsy("hide");
//     });

//     $("#dot").click(function(e){
//         e.stopPropagation();
//     });

// }


// Tipsy = the popup associated with the dot.
// This function is called when you click on the black circle with id "dot"
function ShowHideTipsy(ele){
	
	// If the tipsy has the attribute rel = show, hide it! 
    if($(ele).attr("rel") == "show") 
    { 
       $(ele).tipsy("hide"); 
       $(ele).attr('rel','hide');  
       console.log("hide tipsy"); 
    }

    // If the tipsy is hidden, show it!
    else
    { 
        $(ele).tipsy("show");
        $(ele).attr('rel','show');
        console.log("show tipsy");
    } 
    
   
    return false;



}