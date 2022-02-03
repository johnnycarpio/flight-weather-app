var userOrigin = document.getElementById("startingpoint");
var userDate = document.getElementById("flightdate");
var buttonEl = document.getElementById("btn");
var apiKey = "dbcad625cbmsh212b0e604919c31p12a3ffjsnba3ceac3d041";

//Selects Flight Data card
var flight_info = document.querySelector('#flight_info');

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
                getWeatherInfo(data[0].arrival.airport.municipalityName);
                getState(data[0].arrival.airport.iata);
                displayFlightData(data);
            });
        }
    })
};

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
                displayCovidData(covidData);
            })
        }
        
    })
    .catch(err => {
        console.error(err);
    });

};

var displayCovidData = function(covidData) {
    confirmedCases = parseInt(covidData.data[0].confirmed);
    activeCases = parseInt(covidData.data[0].active);
    deathNumber = parseInt(covidData.data[0].deaths);

    document.querySelector("#totalCaseNum").textContent = confirmedCases;
    document.querySelector("#activeCaseNum").textContent = activeCases;
    document.querySelector("#deathNum").textContent = deathNumber;
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


function displayFlightData(data) {
    var flight_status = data[0].status;
    var depart_location = data[0].departure.airport.name;
    var depart_time = data[0].departure.scheduledTimeLocal;
    var arrival_location = data[0].arrival.airport.name;
    var plane_type= data[0].aircraft.model;

    //Titles can be used for the data displayed
    //var data_titles = ['Status', 'Departure City', 'Departure Time', 'Arrival City', 'Aircraft'];
    var flight_data = [flight_status, depart_location, depart_time, arrival_location, plane_type];

    for(i=0; i<flight_data.length; i++){
        //Creates a list element for each item in the flight_data array
        var info = document.createElement('li');
        // info.textContent = data_titles[i] + ':' + flight_data[i]; //Can be used to display data with titles

        //Sets the text content to the data returned from the API call
        info.textContent = flight_data[i];
        flight_info.append(info);
    }

}

buttonEl.addEventListener("click", flightHandler);