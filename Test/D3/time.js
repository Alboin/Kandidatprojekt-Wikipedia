	function run() {


	d3.select("body").append("p").text("New paragraph!");

	var body = d3.select("body");
	var div = body.append("div");
	var svg = d3.selectAll("svg");
	
	div.html("Hello, world!");

	svg.transition().duration(1000).attr("x",300);

	d3.selectAll("p").style("color", "white");

	d3.selectAll("p").transition().delay(750).duration(5000).style("color", "rgb(255,0,0)");

	d3.selectAll('circle')
	  .on('mouseover', function() {
	    this.style.fill = 'yellow';
	  })
	  .on('mouseleave', function() {
	    this.style.fill = 'rgba(0, 255, 0, 0.5)';
	  });


	d3.select('circle').transition().duration(3000).attr("cx", 1000).transition().attr("cy", 10);
	
	svg.append("circle").attr("cx", 1000).attr("cy", 55).attr("r", 10).attr("id", "svart");

	//Skapa ett nytt svg-objekt, inklusive ytan den ritas ut på.
	d3.select("body").append("svg").attr("width", 50).attr("height", 50).append("circle").attr("cx", 25).attr("cy", 25).attr("r", 25).style("fill", "purple");
/*
	d3.selectAll('circle').on('click', function(){
		this.style.fill = 'rgba(0,0,255,0.5)';
		console.log("hejs");
		console.log(this.cx); //Returnerar prickens slutgiltiga värde.
		console.log(this.cy);
	});
*/
	d3.select("#green").on('click', function(){
		d3.select("#blue").transition().duration(2000).attr("cx","25").attr("cy","25").attr("r", "50");
	})

	//Logga mousemove
	var x = 0;
	svg.on('mousemove', function () {
	   x = d3.mouse(this)[0];         
	});
	console.log(x);

// TESTAR MASSA TIPSY HÄR
// The black circle that's supposted to trigger the tipsy has the id "svart"
	$('#svart').attr('rel', 'hide');	// svart starts with the tipsy hidden, therefore rel has the id "hide"
	$('#svart').attr('onclick', 'ShowHideTipsy($(this))'); // When you click on svart the function ShowHideTipsy is called
	$('#svart').attr('original-title', 'Hello'); // in the tipsy the text "Hello" is shown


// Here all the attributes for svart's tipsy is set 
$(function() {
    $('#svart').tipsy({
    	trigger: 'manual', 
    	gravity: 's',
    	html: true
    	});
	});

// This function is called when you click on the black circle with id "svart"
function ShowHideTipsy(ele)
{
   // if the tipsy has the attribute rel = show, hide it! 
    if($(ele).attr("rel") == "show") 
    { 
        
        $(ele).tipsy("hide"); 
       $(ele).attr('rel','hide');
       console.log($(ele).attr('rel'));
         
    }
    // if the tipsy is hidden, show it!
    else
    { 
        $(ele).tipsy("show");
        $(ele).attr('rel','show');
        console.log($(ele).attr('rel'));
    } 
    return false;
}

	var x = 0, y = 0;

	var zoom = d3.behavior.zoom()
    .x(x)
    .y(y)
    .scaleExtent([1, 10])
    .on("zoom", zoomed);

    function zoomed() {
    	console.log("testa123")
	  //svg.select("#svart").attr("r", String(x));
	}
	 //d3.select("divven").transition().
	

	d3.selectAll("p").style("color", function() {
  		return "hsl(" + Math.random() * 360 + ",100%,50%)";
	});


}