
//Generate the map when the page has loaded.
$(document).ready(generateMap());
$(document).ready(addTimeHandler());
$(document).ready(console.log("Document is ready!"));

//Set the height of the scroll-list with displayed articles to 65% or the screen height.
$('#article_list').css('max-height', window.innerHeight * 0.65 + 'px');
$('#article_list_time').css('max-height', window.innerHeight * 0.65 + 'px');

//Prevent the article to become "unmarked" when the user clicks somewhere in the article list.
$("#article_list_container_time")
    .mouseenter(function(){
        MOUSE_OVER_LIST = true;
    }).mouseleave(function(){
        MOUSE_OVER_LIST = false;});

//Hide the article list in time-view by default.
 $("#article_list_time").slideToggle();
