var userOrigin = document.getElementById("startingpoint");
var userDestination = document.getElementById("destination");
var userDate = document.getElementById("flightdate");
var buttonEl = document.getElementById("btn");
var apiKey = "dbcad625cbmsh212b0e604919c31p12a3ffjsnba3ceac3d041";

var flightHandler = function (event) {
    event.preventDefault();
    var code = userOrigin.value.trim();

    if (code) {
        userOrigin.value = "";
    } else {
        userOrigin.placeholder = "YOU MUST ENTER AIRPORT";
    }

    var dateLocal = userDate.value;
    userDate.value = "";

    getFlightInfo(code, dateLocal);

};

var getFlightInfo = function (code, dateLocal) {


    var apiUrl = `https://aerodatabox.p.rapidapi.com/flights/number/${code}/${dateLocal}`

    fetch(apiUrl, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "aerodatabox.p.rapidapi.com",
            "x-rapidapi-key": "dbcad625cbmsh212b0e604919c31p12a3ffjsnba3ceac3d041"
        }
    }).then(function (response) {
        if (response.ok) {
            console.log(response);
            response.json().then(function (data) {
                console.log(data);
            });
        }
    })


};




    buttonEl.addEventListener("click", flightHandler);