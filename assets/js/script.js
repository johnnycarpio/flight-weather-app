var userInputEl = document.getElementById("input");
var userDate = document.getElementById("flightdate");
var buttonEl = document.getElementById("btn");
var covidInfoEl = document.getElementById("covid-container")
var apiKey = "dbcad625cbmsh212b0e604919c31p12a3ffjsnba3ceac3d041";

//Selects Flight Data card
var flightInfo = document.querySelector("#flight_info");

var flightHandler = function (event) {
  event.preventDefault();
  var code = userInputEl.value.trim();

  if (code) {
    userInputEl.value = "";
    userInputEl.classList.remove("is-danger")
    covidInfoEl.classList.remove("hide")

  } else {
    userInputEl.placeholder = "";
    userInputEl.classList.remove("is-info")
    userInputEl.classList.add("is-danger")
  }

  getFlightInfo(code);
};

var getFlightInfo = function (code, dateLocal) {
  var apiUrl = `https://aerodatabox.p.rapidapi.com/flights/number/${code}`;

  fetch(apiUrl, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "aerodatabox.p.rapidapi.com",
      "x-rapidapi-key": apiKey,
    },
  }).then(function (response) {
    if (response.ok) {
      console.log(response);
      response.json().then(function (data) {
        getWeatherInfo(data[0].arrival.airport.municipalityName);
        getState(data[0].arrival.airport.iata);
        displayFlightData(data);
      });
    }
  });
};

var getState = function (state) {
  var apiUrl = `https://airport-info.p.rapidapi.com/airport?iata=${state}`;

  fetch(apiUrl, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "airport-info.p.rapidapi.com",
      "x-rapidapi-key": apiKey,
    },
  })
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (stateData) {
          getCovidData(stateData.state);
        });
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

var getCovidData = function (stateName) {
  var apiUrl = `https://covid-19-statistics.p.rapidapi.com/reports?region_province=${stateName}&iso=USA&region_name=US`;

  fetch(apiUrl, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "covid-19-statistics.p.rapidapi.com",
      "x-rapidapi-key": apiKey,
    },
  })
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (covidData) {
          displayCovidData(covidData);
        });
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

var displayCovidData = function (covidData) {
  console.log(covidData);
  confirmedCases = covidData.data[0].confirmed;
  activeCases = covidData.data[0].confirmed_diff;
  deathNumber = covidData.data[0].deaths;
  deathDiff = covidData.data[0].deaths_diff;
  stateName = covidData.data[0].region.province;

  document.querySelector("#state-name").textContent = stateName;
  document.querySelector("#total-cases").textContent = confirmedCases;
  document.querySelector("#cases-diff").textContent = `Reported today`;
  document.querySelector("#new-cases").textContent = activeCases;
  document.querySelector("#new-cases-date").textContent = "Reported Today";
  document.querySelector("#deaths").textContent = deathNumber;
  document.querySelector(
    "#deaths-diff"
  ).textContent = `Reported Today + ${deathDiff}`;
};

var getWeatherInfo = function (city) {
  var weatherUrl = `https://visual-crossing-weather.p.rapidapi.com/forecast?aggregateHours=24&location=${city}&contentType=json&unitGroup=us&shortColumnNames=0`;

  fetch(weatherUrl, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "visual-crossing-weather.p.rapidapi.com",
      "x-rapidapi-key": apiKey,
    },
  }).then(function (response) {
    if (response.ok) {
      console.log(response);
      response.json().then(function (data) {
        displayWeatherData(data);
      });
    }
  });
};

function displayFlightData(data) {
  var flightStatus = data[0].status;
  var cityNameDep = data[0].departure.airport.municipalityName;
  var iataDepName = data[0].departure.airport.iata;
  var departureTime = data[0].departure.scheduledTimeLocal;
  var cityNameArr = data[0].arrival.airport.municipalityName;
  var iataNameArr = data[0].arrival.airport.iata;
  var planeModel = data[0].aircraft.model;
  var flightStatus = data[0].status;
  var timeFormat = departureTime.split(" ");
  var formattedTime = new Date(timeFormat[0]).toLocaleDateString();
  var hour = timeFormat[1];
  formattedHour = hour.split("-");

  var statusListEl = document.getElementById("status-list");
  document.getElementById("date").textContent = formattedTime;
  var cityNameEl = document.createElement("li");
  cityNameEl.classList.add("subtitle", "is-4", "has-text-centered");
  cityNameEl.id = "flight-cities";
  statusListEl.appendChild(cityNameEl);
  cityNameEl.innerHTML = `<i class="fa-solid fa-plane-departure"></i>${cityNameDep}(${iataDepName}) <i class="fa-solid fa-arrow-alt-circle-right"></i> <i class="fa-solid fa-plane-arrival"></i>${cityNameArr}(${iataNameArr})`;
  document.getElementById("time").textContent = `Time - ${formattedHour[0]}`;
  document.getElementById(
    "status"
  ).textContent = `Live status - ${flightStatus}`;
  document.getElementById("aircraft").textContent = `Aircraft - ${planeModel}`;
}

function displayWeatherData(data) {
    
    // console.log(Object.keys(data.locations));

    const cityName = Object.keys(data.locations)[0];
    console.log(cityName);

    console.log(data.locations[cityName].currentConditions.temp);

    var temp = data.locations[cityName].currentConditions.temp;
    var conditionIcon = data.locations[cityName].currentConditions.icon;
    var humidity = data.locations[cityName].currentConditions.humidity;
    var precip = data.locations[cityName].currentConditions.precip;
    var visibility = data.locations[cityName].currentConditions.visibility;
    var windSpeed = data.locations[cityName].currentConditions.wspd;

    document.getElementById("temperature").textContent = temp + " Celcius";
    document.getElementById("tempIcon").textContent = conditionIcon;
    document.getElementById("humidity").textContent = "Humidity: " + humidity + "%";
    document.getElementById("precip").textContent = "Chance of Rain: " + precip + "%";
    document.getElementById("visibility").textContent = "Visbility: " + visibility;
    document.getElementById("wspd").textContent = "Wind Speed: " + windSpeed;

}

buttonEl.addEventListener("click", flightHandler);
