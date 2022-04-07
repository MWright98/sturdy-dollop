//variable declarations for elements and api Key
var apiKey = '99072ede3746b0b3efde9c724195f6dd';
var cityInputEl = document.getElementById('city-search');
var submitButton = document.getElementById('submitBtn');
var cityNameEl = document.getElementById('city-name');
var tempEl = document.getElementById('temp');
var windEl = document.getElementById('wind');
var humidityEl = document.getElementById('humidity');
var uvEl = document.getElementById('uv');
var fiveDayContainerEl = document.getElementById("five-day-container");
var inputWrapperEl = document.querySelector(".input-wrapper")

//Get todays date and format
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = '(' + mm + '/' + dd + '/' + yyyy + ')';

//function to get the name of the city and add to search history
var getCityName = function () {
    var city = cityInputEl.value.trim();
    console.log("City is " + city);
    getCoords(city);

    //add searched city to search history

}

//function to get latitude and longitude of searched city
var getCoords = function (city) {

    var apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=5&appid=' + apiKey

    fetch(apiUrl).then(function (response) {

        if (response.ok) {
            response.json()

                .then(function (data) {
                    try {
                        var lat = data[0].lat;
                        var long = data[0].lon;
                        console.log(lat);
                        console.log(long);
                        cityNameEl.textContent = data[0].name + " " + today;
                        getCurrentWeather(lat, long);
                        var prevSearch = document.createElement("button")
                        prevSearch.textContent = data[0].name;
                        prevSearch.classList = "cityBtn btn btn-secondary d-block m-2"
                        inputWrapperEl.append(prevSearch);
                    }
                    //Catches errors for invalid city and prompts the user to try again
                    catch {
                        alert("No weather data found, please try again.")
                    }
                });


        }
    });

};



//function to get current weather and 5 day forecast
var getCurrentWeather = function (lat, long) {
    var currentWeatherUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + long + '&exclude=minutely,hourly&appid=' + apiKey + '&units=imperial';
    fetch(currentWeatherUrl).then(function (response) {
        if (response.ok) {
            response.json()
                .then(function (weatherData) {
                    console.log(weatherData)

                    //Display Current Weather
                    tempEl.textContent = "Temp: " + weatherData.current.temp + " °F"
                    windEl.textContent = "Wind: " + weatherData.current.wind_speed + " MPH"
                    humidityEl.textContent = "Humidity: " + weatherData.current.humidity + " %"
                    iconEl = document.createElement('div')
                    iconEl.innerHTML = "<img src=http://openweathermap.org/img/wn/" + weatherData.current.weather[0].icon + "@2x.png>"
                    cityNameEl.append(iconEl);

                    uvEl.innerHTML = ('<p>  UV Index: ' + '<span>' + weatherData.current.uvi + '</span>' + '</p>');
                    var spanEl = document.querySelector("span");

                    //Conditional statement to highlight uv index based on severity
                    if (weatherData.current.uvi <= 2) {
                        spanEl.classList = "favorable";
                    }
                    else if (2 < weatherData.current.uvi <= 5) {
                        spanEl.classList = "moderate";
                    }
                    else {
                        spanEl.classList = "severe"
                    }

                    //Remove Previous 5 day forecast
                    removeDayCards();

                    //Loop to generate 5 day forecast cards and append to page
                    for (i = 0; i < 5; i++) {
                        //Create Five Day Forecast
                        var dayEl = document.createElement("div");
                        dayEl.classList = "five-day-card col-2 d-block m-2"
                        var cardDate = document.createElement('h4')
                        var cardIcon = document.createElement('div')
                        var cardTemp = document.createElement('p')
                        var cardWind = document.createElement('p')
                        var cardHum = document.createElement('p')

                        //Set dates in the future for 5 day forecast
                        var cardDay = new Date();
                        var dd = String(cardDay.getDate() + i + 1).padStart(2, '0');
                        var mm = String(cardDay.getMonth() + 1).padStart(2, '0'); //January is 0!
                        var yyyy = cardDay.getFullYear();
                        cardDay = '(' + mm + '/' + dd + '/' + yyyy + ')';

                        //set content of 5 day forecast
                        cardDate.textContent = cardDay;
                        cardIcon.innerHTML = "<img src=http://openweathermap.org/img/wn/" + weatherData.daily[i].weather[0].icon + "@2x.png>"
                        cardTemp.textContent = "Temp: " + weatherData.daily[i].temp.day + " °F";
                        cardWind.textContent = "Wind: " + weatherData.daily[i].wind_speed + " MPH";
                        cardHum.textContent = "Humidity: " + weatherData.daily[i].humidity + " %";

                        //Append 5 day forecast cards to the page
                        dayEl.append(cardDate, cardIcon, cardTemp, cardWind, cardHum)
                        fiveDayContainerEl.append(dayEl);
                    }
                });
        }
    });
};

//Function to handle the clicking of a previously searched city
var cityButtonListener = function () {
    if (document.body.addEventListener) {
        document.body.addEventListener('click', cityButtonHandler, false);
    }
    else {
        document.body.attachEvent('onclick', cityButtonHandler);//for IE
    }

    function cityButtonHandler(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        if (target.className.match(/cityBtn/)) {
            console.log(event.target.textContent)
            cityNameEl.textContent = (event.target.textContent + today);
            getCoords(event.target.textContent)

        }
    }
}

//function to remove previous 5 day forecast
var removeDayCards = function () {
    while (fiveDayContainerEl.firstChild) {
        fiveDayContainerEl.removeChild(fiveDayContainerEl.firstChild);
    }
}



cityButtonListener();
submitButton.addEventListener('click', getCityName);