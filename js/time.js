function generateTimeCircle(title, sentence) {

	var body = d3.select("body").append('svg').attr('width', '100%').attr('height', '100%');
	var div = body.append("div");
	var svg = d3.selectAll("svg");

	svg.append("circle").attr("width", 50).attr("height", 100).attr("cx", 100).attr("cy", 55).attr("r", 10).attr("id", "dot");

	// The black circle that's supposted to trigger the tipsy has the id "dot"
	$('#dot').attr('rel', 'hide');	// dot starts with the tipsy hidden, therefore rel has the id "hide"
    $('#dot').attr('onclick', 'ShowHideTipsy($(this))'); // When you click on dot the function ShowHideTipsy is called
	$('#dot').attr({
		title: ( '<div class="marker-title">' + title + '</div>' + '<div class="mapboxgl-popup">'+  sentence + '</div>')	
	}); 
		
	// Here all the attributes for dot's tipsy is set 
	$(function() {
	    $('#dot').tipsy({
	    	trigger: 'manual', // this makes it possible to change tipsy manually like we want to do
	    	gravity: 's', // the gravity decides where the tipsy will show (inverse). s=south, n=north, w=west, nw=northwest etc.
	    	html: true    // makes it possible to have html content in tipsy
	    });
	});

    $(document).click(function(){
        $("#dot").tipsy("hide");
        console.log("hide tipsy");
    });

    $("#dot").click(function(e){
        e.stopPropagation();
    });

}

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