
/*******************************************************************************************************
 	Authors: Sara Martin

 	This file handle the time-controller, which is the timeline at the bottom of the screen in the
 	timeview. The timeline has handles that the user can use to choose a specific time span.

 	The file includes the function:
 	- moveHandles
********************************************************************************************************/

	var svg = d3.selectAll("svg");
	
	//Declare size constants for handles and timeline.
	var handle_width = 0.01*window.innerWidth, handle_height = 0.045*window.innerHeight;
	var edge_radius = 3;
	var timeline_start = 0.05*window.innerWidth,
		timeline_width = window.innerWidth - 2*timeline_start,
		timeline_height = 0.03*window.innerHeight,
		timeline_ypos = 0.9*window.innerHeight;

	//Drag-functionality for left handle.
	var drag_handle_left = d3.behavior.drag()
		.on('dragstart', function() {
			console.log("Start drag");
		})
		.on('drag', function() {
			handle_left.attr('x', (d3.event.x - handle_width/2));
			if(d3.event.x < timeline_start)
				handle_left.attr('x', (timeline_start - handle_width/2));
			if(d3.event.x > parseInt(handle_right.attr('x')) - handle_width/2)
				handle_left.attr('x', parseInt(handle_right.attr('x')) - handle_width);
			marked_time
				.attr('x', parseInt(handle_left.attr('x')) + handle_width/2)
				.attr('width', parseInt(handle_right.attr('x')) - parseInt(handle_left.attr('x')));
		})
		.on('dragend', function() {
			console.log("End drag");
	});

	//Drag-functionality for right handle.
	var drag_handle_right = d3.behavior.drag()
		.on('dragstart', function() {
			console.log("Start drag");
		})
		.on('drag', function() {
			handle_right.attr('x', (d3.event.x - handle_width/2));
			if(d3.event.x > timeline_width + timeline_start)
				handle_right.attr('x', (timeline_width + timeline_start - handle_width/2));
			if(d3.event.x < parseInt(handle_left.attr('x')) + 1.5 * handle_width)
				handle_right.attr('x', parseInt(handle_left.attr('x')) + handle_width);
			marked_time.attr('width', parseInt(handle_right.attr('x')) - parseInt(marked_time.attr('x')));
		})
		.on('dragend', function() {
			console.log("End drag");
	});


	//Create timeline.
	var time_line = svg.append('rect')
		.attr('x', timeline_start)
		.attr('width', timeline_width)
		.attr('y', timeline_ypos)
		.attr('height', timeline_height)
		.attr('rx', edge_radius)
		.style('fill', 'rgb(100,100,100)');

	//Create marked section of timeline.
	var marked_time = svg.append('rect')
		.attr('x', timeline_start)
		.attr('width', timeline_width)
		.attr('y', timeline_ypos)
		.attr('height', timeline_height)
		.style('fill', 'rgb(150,150,150)');

	//Create left handle.
	var handle_left = svg.append('rect')
		.attr('x', timeline_start - handle_width/2)
		.attr('width', handle_width)
		.attr('y', timeline_ypos + timeline_height/2 - handle_height/2)
		.attr('height', handle_height)
		.attr('rx', edge_radius)
		.style('fill', 'rgb(200,200,200)')
		.call(drag_handle_left);

	//Create right handle.
	var handle_right = svg.append('rect')
		.attr('x', timeline_start + timeline_width - handle_width/2)
		.attr('width', handle_width)
		.attr('y', timeline_ypos + timeline_height/2 - handle_height/2)
		.attr('height', handle_height)
		.attr('rx', edge_radius)
		.style('fill', 'rgb(200,200,200)')
		.call(drag_handle_right);

	//Function to animate handle movement.
	function moveHandles(left_pos, right_pos) {
		if(left_pos > right_pos) {
			console.log("Left pos was bigger than right pos.");
			return;
		}
		handle_left.transition().duration(2000).attr('x', left_pos);
		handle_right.transition().duration(2000).attr('x', right_pos);
		marked_time.transition().duration(2000).attr('x', left_pos).attr('width', right_pos-left_pos);
	}

	moveHandles(300, 400);

