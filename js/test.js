console.log('hej');

// Add your code below this line!
var xhr = new XMLHttpRequest();
xhr.open("GET", "https://en.wikipedia.org/w/api.php", false);
xhr.send();

// Add your code above this line!

console.log(xhr.status);
var status = xhr.status;
console.log(xhr.statusText);

document.getElementById("status_API").innerHTML = status + xhr.statusText;

