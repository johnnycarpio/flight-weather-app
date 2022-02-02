var userOrigin = document.getElementById("startingpoint");
var userDestination = document.getElementById("destination");
var userDate = document.getElementById("flightdate");
var buttonEl = document.getElementById("btn");

buttonEl.addEventListener("click", function() {
    console.log(userOrigin.value)
    console.log(userDestination.value);
    console.log(userDate.value);
});