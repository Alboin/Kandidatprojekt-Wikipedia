function generateTimeCircle(title, sentence) {

	var body = d3.select("body");
	var div = body.append("div");
	var svg = d3.selectAll("svg");

	svg.append("circle").attr("width", 50).attr("height", 100).attr("cx", 100).attr("cy", 55).attr("r", 10).attr("id", "svart");

	// The black circle that's supposted to trigger the tipsy has the id "svart"
	$('#svart').attr('rel', 'hide');	// svart starts with the tipsy hidden, therefore rel has the id "hide"
	$('#svart').attr('onclick', 'ShowHideTipsy($(this))'); // When you click on svart the function ShowHideTipsy is called
	$('#svart').attr({
		title: ( '<div class="marker-title">' + title + '</div>' + '<div class="mapboxgl-popup">'+  sentence + '</div>')	
	}); //
		
	// Here all the attributes for svart's tipsy is set 
	$(function() {
	    $('#svart').tipsy({
	    	trigger: 'manual', 
	    	gravity: 's',
	    	html: true
	    });
	});

}

// This function is called when you click on the black circle with id "svart"
function ShowHideTipsy(ele){
	
	// If the tipsy has the attribute rel = show, hide it! 
    if($(ele).attr("rel") == "show") 
    { 
        
       $(ele).tipsy("hide"); 
       $(ele).attr('rel','hide');
       console.log($(ele).attr('rel'));
         
    }

    // If the tipsy is hidden, show it!
    else
    { 
        $(ele).tipsy("show");
        $(ele).attr('rel','show');
        console.log($(ele).attr('rel'));
    } 
    
    return false;
}