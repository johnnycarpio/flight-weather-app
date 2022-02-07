var userInputEl = document.getElementById("input");
var userDate = document.getElementById("flightdate");
var buttonEl = document.getElementById("btn");
var apiKey = "dbcad625cbmsh212b0e604919c31p12a3ffjsnba3ceac3d041";

//Selects Flight Data card
var flightInfo = document.querySelector("#flight_info");

var flightHandler = function (event) {
  event.preventDefault();
  var code = userInputEl.value.trim();

  if (code) {
    userInputEl.value = "";
  } else {
    userInputEl.placeholder = "YOU MUST ENTER AIRPORT";
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
        console.log(data);
        getState(data[0].arrival.airport.iata);
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

  var statusListEl = document.getElementById("status-list");
  document.getElementById("date").textContent = formattedTime;
  var cityNameEl = document.createElement("li");
  cityNameEl.classList.add("subtitle", "is-4", "has-text-centered");
  cityNameEl.id = "flight-cities";
//   var iconDepEl = document.createElement("i");
//   iconDepEl.classList.add("fa-solid", "fa-plane-departure");
//   var iconArrowEl = document.createElement("i");
//   iconArrowEl.classList.add("fa-solid", "fa-arrow-alt-circle-right");
//   var iconArrEl = document.createElement("i");
//   iconArrEl.classList.add("fa-solid", "fa-plane-arrival");
  

  statusListEl.appendChild(cityNameEl);
  cityNameEl.innerHTML = "<i class='fa-solid fa-plane-departure'></i>";
  cityNameEl.textContent = `${cityNameDep}(${iataDepName})`;
//   cityNameEl.appendChild('<i class="fa-solid fa-arrow-alt-circle-right"></i>');
//   cityNameEl.appendChild('<i class="fa-solid fa-plane-arrival"></i>');
  cityNameEl.textContent += `${cityNameArr}(${iataNameArr})`;
  cityNameEl.innerHTML = `<i class="fa-solid fa-plane-departure"></i>${cityNameDep}(${iataDepName}) <i class="fa-solid fa-arrow-alt-circle-right"></i> <i class="fa-solid fa-plane-arrival"></i>${cityNameArr}(${iataNameArr})`
}

buttonEl.addEventListener("click", flightHandler);
