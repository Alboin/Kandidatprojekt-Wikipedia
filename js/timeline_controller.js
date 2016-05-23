
/*******************************************************************************************************
 	Authors: Sara Martin

 	This file handle the time-controller, which is the timeline at the bottom of the screen in the
 	timeview. The timeline has handles that the user can use to choose a specific time span.

 	The file includes the function:
 	- addTimeHandler
 	- moveHandles
	- updateHandleText

********************************************************************************************************/
var TIMELINE_START,	TIMELINE_WIDTH, TIMELINE_HEIGHT, TIMELINE_YPOS;

var HANDLE_LEFT, HANDLE_RIGHT, MARKED_TIME, HANDLE_WIDTH;

//All labels below the lower timeline.
var TIMELINE_TEXTS = [];
//All labels below the upper timeline.
var TIMELINE_SECOND_TEXTS = [];
//The two labels that follows the handles on the lower timeline.
var HANDLE_TEXTS = [];
//The two labels that show min and max displayed year.
var BORDER_TEXTS = [];

function addTimeHandler() {

	var svg = d3.selectAll("#svg");

	//Declare size constants for handles and timeline.
	HANDLE_WIDTH = 0.01*window.innerWidth, handle_height = 0.045*window.innerHeight;
	var edge_radius = 0;

	TIMELINE_START = 0.05*window.innerWidth,
	TIMELINE_WIDTH = window.innerWidth - 2*TIMELINE_START,

	TIMELINE_HEIGHT = 0.01*window.innerHeight,
	TIMELINE_YPOS = 0.8*window.innerHeight;


	var timeline_container = svg.append("rect")
		.attr("width", window.innerWidth + 20)
		.attr("height", window.innerHeight)
		.attr("x", -10)
		.attr("y", (TIMELINE_YPOS - (window.innerHeight - TIMELINE_YPOS)/2) + handle_height)
		.attr("style", "fill:rgb(00,37,51);");//stroke:gray;stroke-width:5;");

	//Decides how many labels should be generated below the timeline depending on your screen size.
    var numberOfTimelabels = Math.round(window.innerWidth/150);

    //Generates text-elements below the bottom timeline with the right spacing and positioning.
    for(var i = 0; i <= numberOfTimelabels; i++) {
        TIMELINE_TEXTS[i] = svg.append("text")
            .attr("x", i/numberOfTimelabels*TIMELINE_WIDTH + TIMELINE_START - 16)
            .attr("y", TIMELINE_YPOS + 0.05*window.innerHeight)
            .attr("font-family", '"Roboto", sans-serif')
            .attr("fill", "rgb(255, 255, 255)")//"rgb(70,70,70)")
            .classed("unselectable", true)
            .attr( "fill-opacity", 0 );
    }

    //Generates text-elements below the top timeline with the right spacing and positioning.
    for(var i = 0; i < numberOfTimelabels; i++) {
        TIMELINE_SECOND_TEXTS[i] = svg.append("text")
            .attr("x", (i/numberOfTimelabels)*window.innerWidth + 50)//(RIGHT_BOUND) + LEFT_BOUND - 16)
            .attr("y", SECOND_TIMELINE_YPOS + 0.06*window.innerHeight)
            .attr("font-family", '"Roboto", sans-serif')
            .attr("fill", "rgb(70,70,70)")
            .attr("font-size", 10)
            .classed("unselectable", true)
            .attr( "fill-opacity", 0 );

        var line = TIMELINE_SECOND_TEXTS[i]
        	.append("line")
        	.attr("x1", TIMELINE_SECOND_TEXTS[i].attr("x"))
        	.attr("x2", TIMELINE_SECOND_TEXTS[i].attr("x"))
        	.attr("y1", TIMELINE_SECOND_TEXTS[i].attr("y"))
        	.attr("y2", TIMELINE_SECOND_TEXTS[i].attr("y") + 100);
    }

    //This is the left handle's time-label.
    HANDLE_TEXTS[0] = svg.append("text")
            .attr("x", TIMELINE_START - 16)
            .attr("y", TIMELINE_YPOS - 0.025*window.innerHeight)
            .attr("font-family", '"Roboto", sans-serif')
            .attr("font-weight", "bold")
            .attr("fill", "rgb(255,255,255)")
            .classed("unselectable", true)
            .attr( "fill-opacity", 0 );

    //This is the right handle's time-label.
    HANDLE_TEXTS[1] = svg.append("text")
            .attr("x", TIMELINE_WIDTH + TIMELINE_START - 16)
            .attr("y", TIMELINE_YPOS - 0.025*window.innerHeight)
            .attr("font-family", '"Roboto", sans-serif')
            .attr("font-weight", "bold")
            .attr("fill", "rgb(255,255,255)")
            .classed("unselectable", true)
            .attr( "fill-opacity", 0 );


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
			BOUNDS_HAS_CHANGED = true;
			//Update the timeline.
			sortDots();
			updateSecondTimeTexts();
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
			BOUNDS_HAS_CHANGED = true;
			//Update the timeline.
			sortDots();
			updateSecondTimeTexts();
	});


	//Create timeline.
	var time_line = svg.append('rect')
		.attr('x', TIMELINE_START)
		.attr('width', TIMELINE_WIDTH)
		.attr('y', TIMELINE_YPOS)
		.attr('height', TIMELINE_HEIGHT)
		.attr('rx', edge_radius)
		.style('fill', 'rgb(100,100,100)');

	//A line to show the border of min displayed year.
	/*var bound1 = svg.append('rect')
		.attr("x", LEFT_BOUND)
		.attr("width", 2)
		.attr("y", SECOND_TIMELINE_YPOS/2 - 44)
		.attr("height", SECOND_TIMELINE_YPOS/2 + 44)
		.style("fill", "rgb(200,200,200)");*/

	//Sets the sizes for the inaccessible areas at the left and right of the timeview.
    $("#inaccessible_area_left")
    	.css("width", LEFT_BOUND)
    	.css("height", (TIMELINE_YPOS - (window.innerHeight - TIMELINE_YPOS)/2) + handle_height + 9);
    $("#inaccessible_area_right")
    	.css("width", LEFT_BOUND + 14)
    	.css("height", (TIMELINE_YPOS - (window.innerHeight - TIMELINE_YPOS)/2) + handle_height + 9);



	//A line to show the border of max displayed year.
	/*var bound2 = svg.append('rect')
		.attr("x", RIGHT_BOUND + LEFT_BOUND)
		.attr("width", 2)
		.attr("y", SECOND_TIMELINE_YPOS/2 - 44)
		.attr("height", SECOND_TIMELINE_YPOS/2 + 44)
		.style("fill", "rgb(200,200,200)");*/
		
	//Left text to the lines that were implementet just above.
	BORDER_TEXTS[0] = svg.append("text")
		.attr("x", LEFT_BOUND - 3)
		.attr("y", SECOND_TIMELINE_YPOS/2 + 32)
		.attr("font-family", '"Roboto", sans-serif')
		.attr("font-weight", "bold")
        .attr("fill", "rgb(180,180,180)")
        .attr("font-size", 35)
        .classed("unselectable", true)
        .attr("transform", "rotate(270," + (LEFT_BOUND - 3) + "," + SECOND_TIMELINE_YPOS/2 + ")");

	//Right text to the lines that were implementet just above.
	BORDER_TEXTS[1] = svg.append("text")
		.attr("x", LEFT_BOUND + RIGHT_BOUND)
		.attr("y", SECOND_TIMELINE_YPOS/2)
		.attr("font-family", '"Roboto", sans-serif')
		.attr("font-weight", "bold")
        .attr("fill", "rgb(180,180,180)")
        .attr("font-size", 35)
        .classed("unselectable", true)
        .attr("transform", "rotate(270," + (LEFT_BOUND-3+RIGHT_BOUND) + "," + SECOND_TIMELINE_YPOS/2 + ")");

	//Create marked section of timeline.
	MARKED_TIME = svg.append('rect')
		.attr('x', TIMELINE_START)
		.attr('width', TIMELINE_WIDTH)
		.attr('y', TIMELINE_YPOS)
		.attr('height', TIMELINE_HEIGHT)
		.style('fill', 'rgb(255,255,255)');

	//Create left handle.
	HANDLE_LEFT = svg.append('rect')
		.attr('x', TIMELINE_START - HANDLE_WIDTH/2)
		.attr('width', HANDLE_WIDTH)
		.attr('y', TIMELINE_YPOS + TIMELINE_HEIGHT/2 - handle_height/2)
		.attr('height', handle_height)
		.attr('rx', edge_radius)
		.attr("id", "left_time_handle")
		.style('fill', 'rgb(249, 156, 8)')
		.attr("stroke", "rgb(249, 156, 8)")
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
		.style('fill', 'rgb(249, 156, 8)')
		.attr("stroke", "rgb(249, 156, 8)")
        .attr("stroke-width", "1")
		.call(drag_HANDLE_RIGHT);

 
 	//Draw the line following the mouse and the second timeline.
    var line = svg.append("line")
        .attr("y1", SECOND_TIMELINE_YPOS)
        .attr("y2", SECOND_TIMELINE_YPOS + 0.06*window.innerHeight)
        .attr("stroke", "gray");

    //Add the time-label connected with above line.
    var mouse_text = svg.append("text")
        .attr("y", SECOND_TIMELINE_YPOS + 0.09*window.innerHeight)
        .attr("font-family", '"Roboto", sans-serif')
        .attr("font-weight", "bold")
        .classed("unselectable", true)
        .attr( "fill-opacity", 0 )
        .text("1234");

    //This controls the movement of the line and time-label and changes the text in the label to the correct year.
	$("#svg").bind('mousemove', function (e) {
		if (e.pageY > window.innerHeight*0.8 || e.pageY < 74) {
			line.attr("stroke-opacity", 0);
			mouse_text.attr("fill-opacity", 0);
		} else {
			var year = Math.round(((e.pageX - LEFT_BOUND)/(RIGHT_BOUND))*(DISPLAYED_MAX_YEAR-DISPLAYED_MIN_YEAR) + DISPLAYED_MIN_YEAR);
			if(year != 0)
				mouse_text.attr("fill-opacity", 1).attr("x", e.pageX - 16).text(String(year));
			line.attr("x1", e.pageX).attr("x2", e.pageX).attr("stroke-opacity", 1);
		}
	});             


}

//Function to animate handle movement.
function moveHandles(left_pos, right_pos) {
	/*if(left_pos > right_pos) {
		console.log("Left pos was bigger than right pos.");
		return;
	}*/
	var temp_left = parseInt(HANDLE_LEFT.attr("x"));
	var temp_right = parseInt(HANDLE_RIGHT.attr("x"));

	if(left_pos || left_pos == 0) {
		temp_left = left_pos*TIMELINE_WIDTH + TIMELINE_START - HANDLE_WIDTH/2;
		HANDLE_LEFT.transition().duration(1000).attr('x', temp_left);
	}
	if(right_pos) {
		temp_right = right_pos*TIMELINE_WIDTH + TIMELINE_START - HANDLE_WIDTH/2;
		HANDLE_RIGHT.transition().duration(1000).attr('x', temp_right);
	}

	MARKED_TIME.transition().duration(1000).attr('x', temp_left + 2).attr('width', temp_right - temp_left - 2);

	BOUNDS_HAS_CHANGED = false;

	HANDLE_TEXTS[0].text(Math.round(DISPLAYED_MIN_YEAR)).transition().duration(1000).attr("x", temp_left - 10);
	HANDLE_TEXTS[1].text(Math.round(DISPLAYED_MAX_YEAR)).transition().duration(1000).attr("x", temp_right - 10);

}

function updateHandleText() {

	//Update the border variables.
	DISPLAYED_MIN_YEAR = Math.round(((HANDLE_LEFT.attr("x") - 0 + HANDLE_WIDTH/2 - TIMELINE_START)/TIMELINE_WIDTH)*(MAX_YEAR-MIN_YEAR) + MIN_YEAR);
	DISPLAYED_MAX_YEAR = Math.round(((HANDLE_RIGHT.attr("x") - 0 + (HANDLE_WIDTH/2) - TIMELINE_START)/TIMELINE_WIDTH)*(MAX_YEAR-MIN_YEAR) + MIN_YEAR);

	if(HANDLE_TEXTS[0].attr("fill-opacity") < 0.5) {
		HANDLE_TEXTS[0].text(String(DISPLAYED_MIN_YEAR)).attr("x", HANDLE_LEFT.attr("x") - 10).transition().duration(1000).attr( "fill-opacity", 1 );
		HANDLE_TEXTS[1].text(String(DISPLAYED_MAX_YEAR)).attr("x", HANDLE_RIGHT.attr("x") - 10).transition().duration(1000).attr( "fill-opacity", 1 );
	} else {
		HANDLE_TEXTS[0].text(String(DISPLAYED_MIN_YEAR)).attr("x", HANDLE_LEFT.attr("x") - 10);
		HANDLE_TEXTS[1].text(String(DISPLAYED_MAX_YEAR)).attr("x", HANDLE_RIGHT.attr("x") - 10);
	}
}





