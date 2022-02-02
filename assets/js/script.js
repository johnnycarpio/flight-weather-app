var userOrigin = document.getElementById("startingpoint");
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
                // console.log(data[0].arrival.airport.municipalityName);
                getWeatherInfo(data[0].arrival.airport.municipalityName);
            });
        }
    })
};

var getWeatherInfo = function (city) {

    var weatherUrl = `https://visual-crossing-weather.p.rapidapi.com/forecast?aggregateHours=24&location=${city}&contentType=json&unitGroup=us&shortColumnNames=0`

    fetch(weatherUrl, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "visual-crossing-weather.p.rapidapi.com",
            "x-rapidapi-key": "9d427ea0fbmshcb3ba7924b120dep185351jsnaca44db42a6f"
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