
<script>
var s = Snap(400,400);
var circleX = 150, circleY = 150, circleRadius = 100;
var bigCircle = s.circle(circleX, circleY, circleRadius);
var L1 = s.path("M "+circleX+" "+circleY +"L 0 0").attr({stroke: "blue"});
// By default its black, lets change its attributes
bigCircle.attr({
    fill: "#bada55",
    stroke: "#000",
    strokeWidth: 5
});
var c1 = s.circle(0,0,10).attr({ fill: "red" });

function OnMouseMove(evt) {
    L1.attr({ d: "M "+circleX+" "+circleY +"L "+evt.clientX+" "+evt.clientY });
    var totalLength = L1.getTotalLength();
    if (totalLength < circleRadius) {
        c1.attr({ cx: evt.clientX , cy: evt.clientY });
    } else {
        var PAL = L1.getPointAtLength(circleRadius);
        c1.attr({ cx: PAL.x , cy: PAL.y });
    }
}
document.onmousemove = OnMouseMove;

</script>