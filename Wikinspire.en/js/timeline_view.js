/*******************************************************************************************************
 	Authors: Sara and Sarah

 	Displays a marker for the search placed on a time line. 

 	The file includes the functions:
 	- generateTimeDot
 	- ShowHideTipsy
    - sortDots
    - createTimeListObject
    - updateTimeTexts
    - updateSecondTimeTexts
    - hideArticleList

********************************************************************************************************/

var TIME_DOTS = [];
var TIPSY_IS_SHOWN = false;
var LAST_CLICKED_ID;
var DEFAULT_COLOR = "black", MARKED_COLOR = "white", BORDER_COLOR = "black";
var DOT_RADIUS = 8;
var SECOND_TIMELINE_YPOS = 0.6*window.innerHeight;
var LEFT_BOUND = 0.15*window.innerWidth, RIGHT_BOUND = 0.70*window.innerWidth;
var MIN_YEAR = null, MAX_YEAR = null;
var DISPLAYED_MIN_YEAR = null, DISPLAYED_MAX_YEAR = null;
var BOUNDS_HAS_CHANGED = false;
var MOUSE_OVER_LIST = false;
var DRAGGING_HANDLE = false;
var TEMP_COLOR;
//A list that adds keeps count on how many articles with the same years exist.
var YEAR_COUNTER = [];

//Hela funktionen fungerar som en loop som beror på time.articles.length. 
function generateTimeDot(article) {
    
    //To prevent any articles without id to be entered, since this would mess with the dot-id as well.
    if(!article.id || article.id == "" || !article.time || !article.time[0] || !article.time[0][2])
        return;

    var body = d3.select("body");
    var div = body.append("div");
    var svg = d3.selectAll("svg");

    //Sets some starting values for the first article.
    if(!MIN_YEAR) {
        MIN_YEAR = article.time[0][2];
        MAX_YEAR = MIN_YEAR + 1;
        DISPLAYED_MIN_YEAR = MIN_YEAR;
        DISPLAYED_MAX_YEAR = MIN_YEAR + 1;
        BOUNDS_HAS_CHANGED = true;
    }
    if(MIN_YEAR == MAX_YEAR - 1)
        MIN_YEAR = MIN_YEAR - 1;

    //If the article year is smaller than MIN_YEAR or bigger than MAX_YEAR, change the global variables.
    if(article.time[0][2] < MIN_YEAR) {
        MIN_YEAR = article.time[0][2];
        DISPLAYED_MIN_YEAR = MIN_YEAR;
        BOUNDS_HAS_CHANGED = true;
    } else if (article.time[0][2] > MAX_YEAR) {
        MAX_YEAR = article.time[0][2];
        DISPLAYED_MAX_YEAR = MAX_YEAR;
        BOUNDS_HAS_CHANGED = true;
    }

    //Variable to log how many articles with the same years exist.
    var same_year = {
        title: article.title,
        year: article.time[0][2],
        count: 1
    }
    var exist = false;
    //Distance to shift the dot in y, depending on how many other articles with the same year exist.
    var y_pos_shift = 0;

    //Loop through all earlier added years and see if the current article exist.
    for(var i = 0; i < YEAR_COUNTER.length; i++) {
        //If it exist, increment the counter and update the y_pos_shift.
        if(YEAR_COUNTER[i].year == article.time[0][2]) {
            y_pos_shift = YEAR_COUNTER[i].count * 25;
            YEAR_COUNTER[i].count++;
            exist = true;
            break;
        }
    }

    //If it didn't already exist, add it to the list.
    if(!exist)
        YEAR_COUNTER.push(same_year);

    //Where the content in the pop ups are set.
    var popup_content = createPopupContent(article);

    var dot_position = Math.random()*window.innerWidth;//(article.time[0][2] - MIN_YEAR) / (MAX_YEAR - MIN_YEAR) * RIGHT_BOUND + LEFT_BOUND;

    var dot_color, dot_border_color;
    if(article.title == MAIN_ARTICLE.title) {
        dot_color = '#fb3a13';
        dot_border_color = '#fb6142';
    } else if(article.link_both_ways) {
        dot_color = '#f99c08'; 
        dot_border_color = '#f9a520';
    } else if(article.is_backlink) {
        dot_color = '#5F8CAB';
        dot_border_color = '#7ea3bb';
    } else {
        dot_color = '#2B5673'
        dot_border_color = '#55778f';
    }

    var temp = Math.random() * window.innerHeight;
	//Creates all the dots with their own id. 
    var dot = svg.append("circle")
        .attr("cx", dot_position)
        .attr("cy", temp)
        .attr("final_y", SECOND_TIMELINE_YPOS - y_pos_shift)
        .attr("r", 0)
        .attr("id", "dot" + article.id)
        .classed("time_dot_class", true)
        .attr("start_year", article.time[0][2]) 
        .attr("article_title", article.title.replaceAll(" ", "_").replaceAll("(", "_").replaceAll(")", "_").replaceAll("/", "_"))
        .attr("dot_not_moved_yet", true)
        .attr("dot_color", dot_color)
        .attr("dot_border_color", dot_border_color)
        .attr("fill", dot_color)
        .attr('onclick', 'ShowHideTipsy('+"'"+ article.id +"'"+')') // When you click on dot the function ShowHideTipsy is called
        .attr({
            title: ( popup_content ),
            dot_id: article.id     
        });

    //Add tipsy to dot.
    $('#dot' + article.id).tipsy({
        trigger: 'manual', // this makes it possible to change tipsy manually like we want to do
        gravity: 's', // the gravity decides where the tipsy will show (inverse). s=south, n=north, w=west, nw=northwest etc.
        html: true,    // makes it possible to have html content in tipsy
        fade: true
    });

    // Define the div for the tooltip
    var div = d3.select("body").append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);

    //Makes the color change on the dot when hovering, also adds the tooltip.
    dot.on("mouseover", function(d) {  
            TEMP_COLOR = this.style.fill;
            this.style.fill = MARKED_COLOR;    
            div.transition()        
                .duration(50)      
                .style("opacity", .9);      
            div .html(article.title + "<br>" + article.time[0][2])  
                .style("left", (d3.event.pageX - 45) + "px")     
                .style("top", (d3.event.pageY - 45) + "px");    
            })                  
        .on("mouseout", function(d) {  
            this.style.fill = TEMP_COLOR;     
            div.transition()        
                .duration(200)      
                .style("opacity", 0);   
        });

    //If the user clicks anywhere else on the screen the tipsy will dissapear and the dot get unmarked.
    $("#lower_row").click(function(){
        //Don't start animating when a animation caused by the handles is going on.
        if(DRAGGING_HANDLE) {
            $('#dot' + article.id).tipsy("hide");
            //Reset the background color of the list-item connected to the dot, also reset the hover-color.
            $("#" + article.title.replaceAll(" ", "_").replaceAll("(", "_").replaceAll(")", "_").replaceAll("/", "_")).css("background", "#ddd")
                .hover(function(){$(this).css("background", "white");}, function(){$(this).css("background", "#ddd");});
        //Close the tipsy only if the mouse is not over the article list.
        } else if(!MOUSE_OVER_LIST) {
            $('#dot' + article.id).tipsy("hide");
            //Reset the background color of the list-item connected to the dot, also reset the hover-color.
            $("#" + article.title.replaceAll(" ", "_").replaceAll("(", "_").replaceAll(")", "_").replaceAll("/", "_")).css("background", "#ddd")
                .hover(function(){$(this).css("background", "white");}, function(){$(this).css("background", "#ddd");});
            //This is to make sure that all dots are their right size.
            var dot = d3.select("#dot" + article.id);
            if(dot.attr("cx") > 0 && dot.attr("cx") < window.innerWidth) {
                dot.transition()
                    .attr("r", DOT_RADIUS)
                    .attr("fill", dot.attr("dot_color") )
                    .attr("stroke", dot.attr("dot_border_color"))
                    .attr("stroke-width", 2);
            }
            if(TIPSY_IS_SHOWN)
                TIPSY_IS_SHOWN = false;
        }
        
        /*d3.select("#dot" + MAIN_ARTICLE.id).transition()
            .attr("r", DOT_RADIUS)
            .attr("fill", "#ff0000" )
            .attr("stroke", "#ff8888")
            .attr("stroke-width", 2);*/

    });


    //Needed for some reason? Sara Martin maybe you could explain?
    $('#dot' + article.id).click(function(e){
        e.stopPropagation();
    });

    TIME_DOTS.push(dot);
    
    createTimeListObject(article);

    sortDots();

    updateTimeTexts();

    updateSecondTimeTexts();

    updateHandleText();

}

// Tipsy = the popup associated with the dot.
// This function is called when you click on any circle.
function ShowHideTipsy(id){

    id = "dot" + id;

    var article_year = parseInt($("#" + id).attr("start_year"));

    if(article_year < DISPLAYED_MIN_YEAR) {
        DISPLAYED_MIN_YEAR = Math.round(DISPLAYED_MAX_YEAR - (DISPLAYED_MAX_YEAR - article_year)*2);
        if(DISPLAYED_MIN_YEAR < MIN_YEAR)
            DISPLAYED_MIN_YEAR = MIN_YEAR;
        moveHandles((DISPLAYED_MIN_YEAR-MIN_YEAR)/MIN_YEAR, null);
        BOUNDS_HAS_CHANGED = true;
        sortDots();
        setTimeout(openTipsy, 1500);
    }
    else if(article_year > DISPLAYED_MAX_YEAR) {
        DISPLAYED_MAX_YEAR = Math.round(DISPLAYED_MIN_YEAR + (article_year - DISPLAYED_MIN_YEAR)*2);
         if(DISPLAYED_MAX_YEAR > MAX_YEAR)
            DISPLAYED_MAX_YEAR = MAX_YEAR;
        moveHandles(null, DISPLAYED_MAX_YEAR/MAX_YEAR);
        BOUNDS_HAS_CHANGED = true;
        sortDots();
        setTimeout(openTipsy, 1500);
    } else {
        openTipsy();
    }

    function openTipsy() {

        var title;

        //Loop through all time-articles and hide their Tipsy.
        for(var i = 0; i < TIME_DOTS.length; i++) 
        {
            if(id != TIME_DOTS[i].attr("id")) {

                $("#" + TIME_DOTS[i].attr("id")).tipsy("hide");
                
                var dot = d3.select("#" + TIME_DOTS[i].attr("id"));
                
                dot.transition().attr("r", DOT_RADIUS).attr("fill", dot.attr("dot_color"));
               
                //Reset the background color of the list-item connected to the dot, also reset the hover-color.
                $("#" + TIME_DOTS[i].attr("article_title")).css("background", "#ddd")
                    .hover(function(){$(this).css("background", "white");}, function(){$(this).css("background", "#ddd");});
           
            } else {
                title = TIME_DOTS[i].attr("article_title");
            }
        }


        //Decide if the tipsy should be hidden or shown.
        if(TIPSY_IS_SHOWN && LAST_CLICKED_ID && LAST_CLICKED_ID == id) {
           
            $('#' + id).tipsy("hide");
            
            //Reset the background color of the list-item connected to the dot, also reset the hover-color.
            $("#" + title).css("background", "#ddd")
                .hover(function(){$(this).css("background", "white");}, function(){$(this).css("background", "#ddd");});
           
            var dot = d3.select("#" + id);
            
            dot.transition().attr("r", DOT_RADIUS).attr("fill", dot.attr("dot_color"));
            
            TIPSY_IS_SHOWN = false;
        } else {
           
            $('#' + id).tipsy("show");
            
            //Change the background color of the list-item connected to the dot, also disable the hover-color.
            $("#" + title).css("background", "#7095a3").unbind('mouseenter mouseleave');
           
            d3.select("#" + id).attr("fill", MARKED_COLOR ).transition().attr("r", 16);
           
            TIPSY_IS_SHOWN = true;
        }

        LAST_CLICKED_ID = id;
       
       return false;
    }

}

//Sorts the dots in chronological order. Is run every time a new dot is added.
function sortDots() {

    //d3.select("#dot" + MAIN_ARTICLE.id).attr("fill", "#ff0000");

    //Loop through all the dots and update their position.
    for(var i = 0; i < TIME_DOTS.length; i++) {

        var temp_dot = d3.select("#" + TIME_DOTS[i].attr("id"));

        if(BOUNDS_HAS_CHANGED || temp_dot.attr("dot_not_moved_yet") == "true") {

            var dot_position = ((temp_dot.attr("start_year") - DISPLAYED_MIN_YEAR) / (DISPLAYED_MAX_YEAR - DISPLAYED_MIN_YEAR)) * RIGHT_BOUND + LEFT_BOUND;

            //Moves the dot, also animates it upon creation.
            temp_dot.transition()
                .attr("r", DOT_RADIUS)
                .attr("stroke", temp_dot.attr("dot_border_color"))
                .attr("stroke-width", "2")
                .transition().duration(1000)
                .attr("cx", dot_position)
                .attr("cy", temp_dot.attr("final_y"))
                .attr("fill", temp_dot.attr("dot_color")  );

            temp_dot.attr("fill", temp_dot.attr("dot_color"));
            temp_dot.attr("dot_not_moved_yet", false);
        }

    }
    BOUNDS_HAS_CHANGED = false;

    //Reset the variable, but with a delay, to let the loop finish.
    if(DRAGGING_HANDLE)
        setTimeout(function(){DRAGGING_HANDLE = false;}, 100);

    BORDER_TEXTS[0].text(String(Math.round(DISPLAYED_MIN_YEAR)));
    BORDER_TEXTS[1].text(String(Math.round(DISPLAYED_MAX_YEAR)));

}

//Creates a new entry on the list with displayed articles.
function createTimeListObject(article) {

    //Function used internally to insert the new list element in alphabetic order.
    function sortAlpha(a, b) {
        return a.innerHTML.toLowerCase() > b.innerHTML.toLowerCase() ? 1 : -1;  
    }


    //Select the whole list.
    var ul = document.getElementById("article_list_time");

    if(!$(ul).find('li:contains("' + article.title + '")')[0]) {

        //Create new list entry.
        var newLi = document.createElement("li");
        newLi.appendChild(document.createTextNode(article.title));
        newLi.setAttribute("id", article.title.replaceAll(" ", "_").replaceAll("(", "_").replaceAll(")", "_").replaceAll("/", "_"));
        newLi.setAttribute("onclick", "ShowHideTipsy('" + article.id + "')");

        //Insert new list entry with help of sorting fuction "sortAlpha".
        $('li', ul).add(newLi).sort(sortAlpha).appendTo(ul);
    }
}

//Updates the labels below the interactive time-line with the right years.
function updateTimeTexts() {
    for(var i = 0; i < TIMELINE_TEXTS.length; i++) {
        if(i == 0) {
            //A special case for the very first time-label.
            TIMELINE_TEXTS[i].text(String(MIN_YEAR)).transition().duration(1000).attr( "fill-opacity", 1 );  

        } else if (i == TIMELINE_TEXTS.length - 1) {
            //A special case for the very last time-label.
            TIMELINE_TEXTS[i].text(String(Math.round(MAX_YEAR))).transition().duration(1000).attr( "fill-opacity", 1 );

        } else if (MAX_YEAR - MIN_YEAR < 10) {
            //If the shown articles span less than 10 years hide the text-labels placed in the middle of the timeline.
            TIMELINE_TEXTS[i].transition().attr( "fill-opacity", 0 );

        } else {
            //Calculate year depending on text position.
            var year = Math.round(((TIMELINE_TEXTS[i].attr("x") - 0 + 16 - TIMELINE_START)/TIMELINE_WIDTH)*(MAX_YEAR-MIN_YEAR) + MIN_YEAR); 
            //Uppdate the year.               
            TIMELINE_TEXTS[i].text(String(year)).transition().duration(1000).attr( "fill-opacity", 1 );
        }
    }
}

//Updates the labels below the interactive time-line with the right years.
function updateSecondTimeTexts() {

    for(var i = 0; i < TIMELINE_SECOND_TEXTS.length; i++) {

        //Calculate year depending on text position.
        var year = Math.round(((TIMELINE_SECOND_TEXTS[i].attr("x") - LEFT_BOUND + 11)/(RIGHT_BOUND))*(DISPLAYED_MAX_YEAR-DISPLAYED_MIN_YEAR) + DISPLAYED_MIN_YEAR); 
        //Uppdate the year.
        TIMELINE_SECOND_TEXTS[i].text(String(year)).transition().duration(1000).attr( "fill-opacity", 1 );//.transition().duration(1000).attr("x", year_pos);
    }
}

//Toggles the article-list from being shown or hidden.
function hideArticleList() {
    $("#article_list_time").slideToggle();

    if($("#article_list_arrow_time").css("transform").substring(0,8) == "matrix(1"
        || $("#article_list_arrow_time").css("transform") == "none") {
       $("#article_list_arrow_time").css({"transform": "rotate(180deg)"});
    } else {
       $("#article_list_arrow_time").css({"transform": "rotate(0deg)"});
    }

}

//Add the actual timeline.
$(document).ready(function() {
    var line = d3.selectAll("#svg").append("line")
    .attr("x1", 0)
    .attr("x2", window.innerWidth)
    .attr("y1", SECOND_TIMELINE_YPOS)
    .attr("y2", SECOND_TIMELINE_YPOS)
    .attr("stroke", "black")
    .attr("stroke-width", 2);
});

