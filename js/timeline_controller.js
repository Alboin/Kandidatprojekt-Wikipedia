
/*******************************************************************************************************
 	Authors: Sara Martin

 	This file handle the time-controller, which is the timeline at the bottom of the screen in the
 	timeview. The timeline has handles that the user can use to choose a specific time span.

 	The file includes the function:
 	- moveHandles
********************************************************************************************************/
var TIMELINE_START,	TIMELINE_WIDTH, TIMELINE_HEIGHT, TIMELINE_YPOS;

var HANDLE_LEFT, HANDLE_RIGHT, MARKED_TIME;

function addTimeHandler() {

	var svg = d3.selectAll("#svg");

	//Declare size constants for handles and timeline.
	var handle_width = 0.01*window.innerWidth, handle_height = 0.045*window.innerHeight;
	var edge_radius = 3;

	TIMELINE_START = 0.05*window.innerWidth,
	TIMELINE_WIDTH = window.innerWidth - 2*TIMELINE_START,
	TIMELINE_HEIGHT = 0.03*window.innerHeight,
	TIMELINE_YPOS = 0.8*window.innerHeight;

	// Define the div for the tooltip
    var div1 = d3.select("body").append("div1")   
        .attr("class", "tooltip")               
        .style("opacity", 0);

    var div2 = d3.select("body").append("div2")   
        .attr("class", "tooltip")               
        .style("opacity", 0);


	//Drag-functionality for left handle.
	var drag_HANDLE_LEFT = d3.behavior.drag()
		.on('dragstart', function() {
			//This is used to prevent other animations to interrupt with the update of the timeline.
			DRAGGING_HANDLE = true;
		})
		.on('drag', function() {

			HANDLE_LEFT.attr('x', (d3.event.x - handle_width/2));
			if(d3.event.x < TIMELINE_START)
				HANDLE_LEFT.attr('x', (TIMELINE_START - handle_width/2));
			if(d3.event.x > parseInt(HANDLE_RIGHT.attr('x')) - handle_width/2)
				HANDLE_LEFT.attr('x', parseInt(HANDLE_RIGHT.attr('x')) - handle_width);
			MARKED_TIME
				.attr('x', parseInt(HANDLE_LEFT.attr('x')) + handle_width/2)
				.attr('width', parseInt(HANDLE_RIGHT.attr('x')) - parseInt(HANDLE_LEFT.attr('x')));

			//Update the border variable.
			DISPLAYED_MIN_YEAR = ((HANDLE_LEFT.attr("x") - handle_width/2 - TIMELINE_START)/TIMELINE_WIDTH)*(MAX_YEAR-MIN_YEAR) + MIN_YEAR;

		})
		.on('dragend', function() {
			//Update the timeline.
			sortDots();
	});

	//Drag-functionality for right handle.
	var drag_HANDLE_RIGHT = d3.behavior.drag()
		.on('dragstart', function() {
			//This is used to prevent other animations to interrupt with the update of the timeline.
			DRAGGING_HANDLE = true;
		})
		.on('drag', function() {

			HANDLE_RIGHT.attr('x', (d3.event.x - handle_width/2));
			if(d3.event.x > TIMELINE_WIDTH + TIMELINE_START)
				HANDLE_RIGHT.attr('x', (TIMELINE_WIDTH + TIMELINE_START - handle_width/2));
			if(d3.event.x < parseInt(HANDLE_LEFT.attr('x')) + 1.5 * handle_width)
				HANDLE_RIGHT.attr('x', parseInt(HANDLE_LEFT.attr('x')) + handle_width);
			MARKED_TIME.attr('width', parseInt(HANDLE_RIGHT.attr('x')) - parseInt(MARKED_TIME.attr('x')));

			//Update the border variable.
			DISPLAYED_MAX_YEAR = ((HANDLE_RIGHT.attr("x") - 0 + (handle_width/2) - TIMELINE_START)/TIMELINE_WIDTH)*(MAX_YEAR-MIN_YEAR) + MIN_YEAR;

		})
		.on('dragend', function() {
			//Update the timeline.
			sortDots();
	});


	//Create timeline.
	var time_line = svg.append('rect')
		.attr('x', TIMELINE_START)
		.attr('width', TIMELINE_WIDTH)
		.attr('y', TIMELINE_YPOS)
		.attr('height', TIMELINE_HEIGHT)
		.attr('rx', edge_radius)
		.style('fill', 'rgb(100,100,100)');

	//Create marked section of timeline.
	MARKED_TIME = svg.append('rect')
		.attr('x', TIMELINE_START)
		.attr('width', TIMELINE_WIDTH)
		.attr('y', TIMELINE_YPOS)
		.attr('height', TIMELINE_HEIGHT)
		.style('fill', 'rgb(150,150,150)');

	//Create left handle.
	HANDLE_LEFT = svg.append('rect')
		.attr('x', TIMELINE_START - handle_width/2)
		.attr('width', handle_width)
		.attr('y', TIMELINE_YPOS + TIMELINE_HEIGHT/2 - handle_height/2)
		.attr('height', handle_height)
		.attr('rx', edge_radius)
		.attr("id", "left_time_handle")
		.style('fill', 'rgb(200,200,200)')
		.call(drag_HANDLE_LEFT);

	//Create right handle.
	HANDLE_RIGHT = svg.append('rect')
		.attr('x', TIMELINE_START + TIMELINE_WIDTH - handle_width/2)
		.attr('width', handle_width)
		.attr('y', TIMELINE_YPOS + TIMELINE_HEIGHT/2 - handle_height/2)
		.attr('height', handle_height)
		.attr('rx', edge_radius)
		.attr("id", "right_time_handle")
		.style('fill', 'rgb(200,200,200)')
		.call(drag_HANDLE_RIGHT);



		/*HANDLE_LEFT.on("mouseover", function(d) {  
            div1.transition()        
                .duration(50)      
                .style("opacity", .8);      
            div1 .html(DISPLAYED_MIN_YEAR)  
                .style("left", (d3.event.pageX) + "px")     
                .style("top", (d3.event.pageY - 28) + "px");    
            })

		HANDLE_RIGHT.on("mouseover", function(d) {  
            div2.transition()        
                .duration(50)      
                .style("opacity", .8);      
            div2 .html(DISPLAYED_MAX_YEAR)  
                .style("left", (d3.event.pageX) + "px")     
                .style("top", (d3.event.pageY - 28) + "px");    
            })*/

}

//Function to animate handle movement.
function moveHandles(left_pos, right_pos) {
	if(left_pos > right_pos) {
		console.log("Left pos was bigger than right pos.");
		return;
	}
	HANDLE_LEFT.transition().duration(2000).attr('x', left_pos);
	HANDLE_RIGHT.transition().duration(2000).attr('x', right_pos);
	MARKED_TIME.transition().duration(2000).attr('x', left_pos).attr('width', right_pos-left_pos);
}



