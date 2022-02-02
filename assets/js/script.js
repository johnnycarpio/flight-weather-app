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
            "x-rapidapi-key": apiKey
        }
    }).then(function (response) {
        if (response.ok) {
            console.log(response);
            response.json().then(function (data) {
                console.log(data);
                getState(data[0].arrival.airport.iata);
            });
        }
    })
};

// TODO: Read about promise chaining

var getState = function (state) {
    var apiUrl = `https://airport-info.p.rapidapi.com/airport?iata=${state}`;

    fetch(apiUrl, {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "airport-info.p.rapidapi.com",
		"x-rapidapi-key": apiKey
	}
})
.then(function (response) {
	if (response.ok) {
        console.log(response);
        response.json().then (function (stateData) {
            console.log(stateData);
            getCovidData(stateData.state);
        })
    }
})
.catch(err => {
	console.error(err);
});
}



var getCovidData = function (stateName) {
    
    var apiUrl = `https://covid-19-statistics.p.rapidapi.com/reports?region_province=${stateName}&iso=USA&region_name=US`

    fetch(apiUrl, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "covid-19-statistics.p.rapidapi.com",
            "x-rapidapi-key": apiKey
        }
    })
    .then( function (response) {
        if (response.ok) {
            console.log(response);
            response.json().then (function (covidData) {
                console.log(covidData);
            })
        }
        
    })
    .catch(err => {
        console.error(err);
    });

};






buttonEl.addEventListener("click", flightHandler);