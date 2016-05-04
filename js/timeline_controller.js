
/*******************************************************************************************************
 	Authors: Sara Martin

 	This file handle the time-controller, which is the timeline at the bottom of the screen in the
 	timeview. The timeline has handles that the user can use to choose a specific time span.

 	The file includes the function:
 	- moveHandles
********************************************************************************************************/
var TIMELINE_START,	TIMELINE_WIDTH, TIMELINE_HEIGHT, TIMELINE_YPOS;

var HANDLE_LEFT, HANDLE_RIGHT, MARKED_TIME, HANDLE_WIDTH;

var TIMELINE_TEXTS = [];
var HANDLE_TEXTS = [];

function addTimeHandler() {

	var svg = d3.selectAll("#svg");

	//Declare size constants for handles and timeline.
	HANDLE_WIDTH = 0.01*window.innerWidth, handle_height = 0.045*window.innerHeight;
	var edge_radius = 3;

	TIMELINE_START = 0.05*window.innerWidth,
	TIMELINE_WIDTH = window.innerWidth - 2*TIMELINE_START,
	TIMELINE_HEIGHT = 0.03*window.innerHeight,
	TIMELINE_YPOS = 0.8*window.innerHeight;

	//Decides how many labels should be generated below the timeline depending on your screen size.
    var numberOfTimelabels = Math.round(window.innerWidth/150);

    //Generates text-elements below the timeline with the right spacing and positioning.
    for(var i = 0; i <= numberOfTimelabels; i++) {
        TIMELINE_TEXTS[i] = svg.append("text")
            .attr("x", i/numberOfTimelabels*TIMELINE_WIDTH + TIMELINE_START - 16)
            .attr("y", TIMELINE_YPOS + 0.06*window.innerHeight)
            .attr("font-family", '"Roboto", sans-serif')
            .attr("fill", "rgb(70,70,70)");
    }

    //This is the left handle's time-label.
    HANDLE_TEXTS[0] = svg.append("text")
            .attr("x", TIMELINE_START - 16)
            .attr("y", TIMELINE_YPOS - 0.02*window.innerHeight)
            .attr("font-family", '"Roboto", sans-serif')
            .attr("font-weight", "bold");

    //This is the right handle's time-label.
    HANDLE_TEXTS[1] = svg.append("text")
            .attr("x", TIMELINE_WIDTH + TIMELINE_START - 16)
            .attr("y", TIMELINE_YPOS - 0.02*window.innerHeight)
            .attr("font-family", '"Roboto", sans-serif')
            .attr("font-weight", "bold");


	//Drag-functionality for left handle.
	var drag_HANDLE_LEFT = d3.behavior.drag()
		.on('dragstart', function() {
			//This is used to prevent other animations to interrupt with the update of the timeline.
			DRAGGING_HANDLE = true;
		})
		.on('drag', function() {

			HANDLE_LEFT.attr('x', (d3.event.x - HANDLE_WIDTH/2));
			if(d3.event.x < TIMELINE_START)
				HANDLE_LEFT.attr('x', (TIMELINE_START - HANDLE_WIDTH/2));
			if(d3.event.x > parseInt(HANDLE_RIGHT.attr('x')) - HANDLE_WIDTH/2)
				HANDLE_LEFT.attr('x', parseInt(HANDLE_RIGHT.attr('x')) - HANDLE_WIDTH);
			MARKED_TIME
				.attr('x', parseInt(HANDLE_LEFT.attr('x')) + HANDLE_WIDTH/2)
				.attr('width', parseInt(HANDLE_RIGHT.attr('x')) - parseInt(HANDLE_LEFT.attr('x')));

			updateHandleText();

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

			HANDLE_RIGHT.attr('x', (d3.event.x - HANDLE_WIDTH/2));
			if(d3.event.x > TIMELINE_WIDTH + TIMELINE_START)
				HANDLE_RIGHT.attr('x', (TIMELINE_WIDTH + TIMELINE_START - HANDLE_WIDTH/2));
			if(d3.event.x < parseInt(HANDLE_LEFT.attr('x')) + 1.5 * HANDLE_WIDTH)
				HANDLE_RIGHT.attr('x', parseInt(HANDLE_LEFT.attr('x')) + HANDLE_WIDTH);
			MARKED_TIME.attr('width', parseInt(HANDLE_RIGHT.attr('x')) - parseInt(MARKED_TIME.attr('x')));
			
			updateHandleText();

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
		.attr('x', TIMELINE_START - HANDLE_WIDTH/2)
		.attr('width', HANDLE_WIDTH)
		.attr('y', TIMELINE_YPOS + TIMELINE_HEIGHT/2 - handle_height/2)
		.attr('height', handle_height)
		.attr('rx', edge_radius)
		.attr("id", "left_time_handle")
		.style('fill', 'rgb(200,200,200)')
		.attr("stroke", "rgb(100,100,100)")
        .attr("stroke-width", "1")
		.call(drag_HANDLE_LEFT);

	//Create right handle.
	HANDLE_RIGHT = svg.append('rect')
		.attr('x', TIMELINE_START + TIMELINE_WIDTH - HANDLE_WIDTH/2)
		.attr('width', HANDLE_WIDTH)
		.attr('y', TIMELINE_YPOS + TIMELINE_HEIGHT/2 - handle_height/2)
		.attr('height', handle_height)
		.attr('rx', edge_radius)
		.attr("id", "right_time_handle")
		.style('fill', 'rgb(200,200,200)')
		.attr("stroke", "rgb(100,100,100)")
        .attr("stroke-width", "1")
		.call(drag_HANDLE_RIGHT);

}

//Function to animate handle movement.
function moveHandles(left_pos, right_pos) {
	if(left_pos > right_pos) {
		console.log("Left pos was bigger than right pos.");
		return;
	}
	var temp_left = left_pos*TIMELINE_WIDTH + TIMELINE_START - HANDLE_WIDTH/2
	var temp_right = right_pos*TIMELINE_WIDTH + TIMELINE_START - HANDLE_WIDTH/2

	HANDLE_LEFT.transition().duration(2000).attr('x', temp_left);
	HANDLE_RIGHT.transition().duration(2000).attr('x', temp_right);
	MARKED_TIME.transition().duration(2000).attr('x', temp_left).attr('width', temp_right - temp_left);

	HANDLE_TEXTS[0].text("");
	HANDLE_TEXTS[1].text("");

}

function updateHandleText() {

	//Update the border variables.
	DISPLAYED_MIN_YEAR = Math.round(((HANDLE_LEFT.attr("x") - 0 + HANDLE_WIDTH/2 - TIMELINE_START)/TIMELINE_WIDTH)*(MAX_YEAR-MIN_YEAR) + MIN_YEAR);
	DISPLAYED_MAX_YEAR = Math.round(((HANDLE_RIGHT.attr("x") - 0 + (HANDLE_WIDTH/2) - TIMELINE_START)/TIMELINE_WIDTH)*(MAX_YEAR-MIN_YEAR) + MIN_YEAR);

	HANDLE_TEXTS[0].text(String(DISPLAYED_MIN_YEAR)).attr("x", HANDLE_LEFT.attr("x") - 10);
	HANDLE_TEXTS[1].text(String(DISPLAYED_MAX_YEAR)).attr("x", HANDLE_RIGHT.attr("x") - 10);
}



