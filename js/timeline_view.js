/*******************************************************************************************************
 	Authors: Sara and Sarah

 	Displays a marker for the search placed on a time line. 

 	The file includes the functions:
 	- generateTimeDot
 	- ShowHideTipsy
    - sortDots
    - createTimeListObject

********************************************************************************************************/

var TIME_DOTS = [];
var TIPSY_IS_SHOWN = false;
var LAST_CLICKED_ID;
var DEFAULT_COLOR = "black", MARKED_COLOR = "gray", BORDER_COLOR = "gray";
var LEFT_BOUND = 0.15*window.innerWidth, RIGHT_BOUND = 0.55*window.innerWidth;
var MIN_YEAR = null, MAX_YEAR = null;
var MOUSE_OVER_LIST = false;

//Hela funktionen fungerar som en loop som beror på time.articles.length. 
function generateTimeDot(article) {
    var body = d3.select("body");
    var div = body.append("div");
    var svg = d3.selectAll("svg");

    //Sets some starting values for the first article.
    if(!MIN_YEAR) {
        MIN_YEAR = article.time[0][2];
        MAX_YEAR = MIN_YEAR + 1;
    }

    //If the article year is smaller than MIN_YEAR or bigger than MAX_YEAR, change the global variables.
    if(article.time[0][2] < MIN_YEAR) {
        MIN_YEAR = article.time[0][2];
    } else if (article.time[0][2] > MAX_YEAR) {
        MAX_YEAR = article.time[0][2];
    }

    var popup_content = '<div class="marker-title">' + article.title + '</div>' + '<div class="mapboxgl-popup">'+  article.first_sentence + '</div>'
                + '<a href onclick="changeModalContent(' + "'" + article.title + "'" +')" data-toggle="modal" data-target="#myModal"> Mer info...</a>';
    popup_content += '<br><br><a id="newMainArticle" onclick="chooseNewMainArticle(' + "'" + article.title + "'" +')"> Sök på "' + article.title + '" </a>';

    var dot_position = (article.time[0][2] - MIN_YEAR) / (MAX_YEAR - MIN_YEAR) * RIGHT_BOUND + LEFT_BOUND;

		//Creates all the dots with their own id. 
    var dot = svg.append("circle")
        .attr("cx", dot_position)
        .attr("cy", 300)
        .attr("r", 0)
        .attr("id", "dot" + article.id)
        .attr("start_year", article.time[0][2]) 
        .attr("fill", DEFAULT_COLOR )
        .attr('onclick', 'ShowHideTipsy('+"'"+ article.id +"'"+')') // When you click on dot the function ShowHideTipsy is called
        .attr({
            title: ( popup_content ),
            dot_id: article.id     
        });

    //Perform the animation when a dot is added.
    dot.transition().duration(1000).attr("r", 10).attr("stroke", BORDER_COLOR).attr("stroke-width", "2");


    //Add tipsy to dot.
    $('#dot' + article.id).tipsy({
        trigger: 'manual', // this makes it possible to change tipsy manually like we want to do
        gravity: 's', // the gravity decides where the tipsy will show (inverse). s=south, n=north, w=west, nw=northwest etc.
        html: true,    // makes it possible to have html content in tipsy
        fade: true
    });

    //Makes the color change on the dot when hovering. 
    d3.selectAll('circle')
      .on('mouseover', function() {
        this.style.fill = MARKED_COLOR;
      })
      .on('mouseleave', function() {
         this.style.fill = DEFAULT_COLOR;
      });


    //If the user clicks anywhere else on the screen the tipsy will dissapear and the dot get unmarked.
    $("#lower_row").click(function(){
        if(!MOUSE_OVER_LIST) {
            $('#dot' + article.id).tipsy("hide");
            d3.select("#dot" + article.id).transition().attr("r", 10).attr("fill", DEFAULT_COLOR );
        }
    });

    //Needed for some reason? Sara Martin maybe you could explain?
    $('#dot' + article.id).click(function(e){
        e.stopPropagation();

    });

    TIME_DOTS.push(dot);
    
    createTimeListObject(article);

    sortDots();


}

// Tipsy = the popup associated with the dot.
// This function is called when you click on any circle.
function ShowHideTipsy(id){

    id = "dot" + id;

    //Loop through all time-articles and hide their Tipsy.
    for(var i = 0; i < TIME_DOTS.length; i++) 
    {
        if(id != TIME_DOTS[i].attr("id")) {
            $("#" + TIME_DOTS[i].attr("id")).tipsy("hide");
            d3.select("#" + TIME_DOTS[i].attr("id")).transition().attr("r", 10).attr("fill", DEFAULT_COLOR );
        }
    }


    //Decide if the tipsy should be hidden or shown.
    if(TIPSY_IS_SHOWN && LAST_CLICKED_ID == id) {
        $('#' + id).tipsy("hide");
        d3.select("#" + id).transition().attr("r", 10).attr("fill", DEFAULT_COLOR );
        TIPSY_IS_SHOWN = false;
    } else {
        $('#' + id).tipsy("show");
        d3.select("#" + id).transition().attr("r", 16).attr("fill", MARKED_COLOR );
        console.log(d3.select("#" + id).attr("start_year"))
        TIPSY_IS_SHOWN = true;
    }

    LAST_CLICKED_ID = id;
   
   return false;

}

//Sorts the dots in chronological order. Is run every time a new dot is added.
function sortDots() {

    //Loop through all the dots and update their position.
    for(var i = 0; i < TIME_DOTS.length; i++) {

        var temp_dot = d3.select("#" + TIME_DOTS[i].attr("id"));

        var dot_position = (temp_dot.attr("start_year") - MIN_YEAR) / (MAX_YEAR - MIN_YEAR) * RIGHT_BOUND + LEFT_BOUND;

        temp_dot.transition()
            .attr("r", 10)
            .attr("stroke", BORDER_COLOR)
            .attr("stroke-width", "2")
            .transition().duration(1000)
            .attr("cx", dot_position)
            .attr("fill", DEFAULT_COLOR );
    }

}

//Creates a new entry on the list with displayed articles.
function createTimeListObject(article) {

    //Function used internally to insert the new list element in alphabetic order.
    function sortAlpha(a, b) {
        return a.innerHTML.toLowerCase() > b.innerHTML.toLowerCase() ? 1 : -1;  
    }

    //Select the whole list.
    var ul = document.getElementById("article_list_time");

    //Create new list entry.
    var newLi = document.createElement("li");
    newLi.appendChild(document.createTextNode(article.title));
    newLi.setAttribute("id", article.title);
    newLi.setAttribute("onclick", "ShowHideTipsy('" + article.id + "')");

    //Insert new list entry with help of sorting fuction "sortAlpha".
    $('li', ul).add(newLi).sort(sortAlpha).appendTo(ul);

}
