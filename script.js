const $currentTemp = document.querySelector('.current-temp');
const $citySearch = document.querySelector('.city-search');
const $cityName = document.querySelector('.city-name');
const $condition = document.querySelector('.condition');
const $bigLogo = document.querySelector('.big-logo');
const $body = document.querySelector('body');
const $divHours = document.querySelector('.col-hours');
const $addFavouriteButton = document.querySelector('.btn-add-favourite');
const $deleteFavouriteButton = document.querySelector('.btn-delete-favourite');
const appConditionForApiCondition = {
    'Ensoleillé': 'sunny',
    'Ciel voilé': 'cloudy',
    'Faiblement nuageux': 'cloudy',
    'Eclaircies': 'cloudy',
    'Stratus se dissipant': 'cloudy',
    'Fortement nuageux': 'veryCloudy',
    'Développement nuageux': 'veryCloudy',
    'Stratus': 'veryCloudy',
    'Nuit claire' : 'night',
    'Nuit bien dégagée': 'night',
    'Nuit légèrement voilée': 'cloudyNight',
    'Nuit claire et stratus': 'cloudyNight',
    'Nuit nuageuse': 'cloudyNight',
    'Nuit avec développement nuageux': 'cloudyNight',
    'Averses de pluie faible': 'smallRain',
    'Pluie faible': 'smallRain',
    'Averses de pluie modérée': 'rain',
    'Averses de pluie forte': 'rain',
    'Couvert avec averses': 'rain',
    'Pluie forte': 'rain',
    'Pluie modérée': 'rain',
    'Faiblement orageux': 'thunder',
    'Orage modéré': 'thunder',
    'Fortement orageux': 'thunder',
    'Nuit faiblement orageuse': 'thunderNight',
    'Averses de neige faible': 'snow',
    'Neige faible': 'snow',
    'Neige modérée': 'snow',
    'Neige forte': 'snow',
    'Pluie et neige mêlée faible': 'snow',
    'Pluie et neige mêlée modérée': 'snow',
    'Pluie et neige mêlée forte': 'snow',
    'Nuit avec averses de neige faible': 'snowNight',
    'Brouillard': 'foggy',
} 
let city = "Angers";
let favouriteCitiesArray = [];

//Level 1
const updateWeather = function () {
    if ($citySearch.value != "") {
        city = $citySearch.value;
    }
    fetchWeather();
}

const addCityToFavourites = function () {
    let cityName = $cityName.textContent;
    getFavouriteCitiesArray();
    checkfavouriteCitiesArray(cityName);
    updatefavouriteCitiesArray(cityName);
}

const removeCityFromFavourites = function() {
    getFavouriteCitiesArray();
    removeCity();
}

// Level 2
const fetchWeather = function () {
    let url = 'https://prevision-meteo.ch/services/json/' + city;
    fetch(url)
        .then(response => response.json())
        .then(function (response) {
            let condition = response.current_condition.condition;
            updateWeatherInfo(response, condition);
            showWeatherByHour(response);
            showWeatherByDay(response);
            updateBackground(condition);
            displayFavouriteButtons();
        })
        .catch(function () {
            alert('Choisis une vraie ville patate');
        })
}

const getFavouriteCitiesArray = function() {
    if (localStorage.length != 0) {
        favouriteCities = localStorage.getItem('favouriteCities')
        if (favouriteCities == "") {
            favouriteCitiesArray = [];
        } else {
            favouriteCitiesArray = favouriteCities.split(',');
        }
    }
    return favouriteCitiesArray;
}

const updatefavouriteCitiesArray = function() {
    document.querySelector('.dropdown-menu').innerHTML = "";
    localStorage.setItem('favouriteCities', favouriteCitiesArray);
    addLinkFavourite();
    displayFavouriteButtons();
}

const removeCity = function() {
    let cityName = $cityName.textContent;
    for (i = 0; i < favouriteCitiesArray.length; i++) {
        if(cityName == favouriteCitiesArray[i]){
            favouriteCitiesArray.splice(i, 1);
            updatefavouriteCitiesArray();
            break;
        }
    }
}

//Level 3
const updateWeatherInfo = function(response, condition) {
    let bigIcon = response.current_condition.icon_big;
    $cityName.innerHTML = response.city_info.name;
    $currentTemp.innerHTML = response.current_condition.tmp + '°C';
    $bigLogo.innerHTML = `<img src=${bigIcon}>`;
    $condition.innerHTML = condition;
    $citySearch.value = "";
}

const showWeatherByHour = function (response) {
    let currentHour = response.current_condition.hour;
    let hourKey =  getHourKey(currentHour);
    $divHours.innerHTML = "";
    getWeatherByHour(hourKey, response);
}

const showWeatherByDay = function (response) {
    document.querySelector('.day').innerHTML = "";
    for (i = 1; i <= 4; i++) {
        let iDay = 'fcst_day_' + i;
        let day = response[iDay].day_long;
        let tempMin = response[iDay].tmin;
        let tempMax = response[iDay].tmax;
        let icon = response[iDay].icon;
        addDivDay(day, tempMin, tempMax, icon);
    }
}

const updateBackground = function(condition) {
    let appConditionResult = getApiCondition(condition);
    $body.className = appConditionResult;
}

const displayFavouriteButtons = function () {
    getFavouriteCitiesArray();
    showOrHideFavouriteElements();
}

const checkfavouriteCitiesArray = function(cityName) {
    for (i = 0; i < favouriteCitiesArray.length; i++) {
        if (cityName == favouriteCitiesArray[i]) {
            cityName = false;
            alert('Cette ville est déjà dans vos favoris !');
        }
    }
    if (cityName != false) {
        favouriteCitiesArray.push(cityName);
    }
}

//Level 4
const getHourKey = function (currentHour) {
    let hourFormat = "";
    let hourKey = 0;
    while (hourFormat != currentHour) {
        if (hourKey < 10) {
            hourFormat = '0' + hourKey + ':00';
        } else if (hourKey >= 10) {
            hourFormat = hourKey + ':00';
        }
        hourKey += 1;
    }
    return hourKey
}

const getWeatherByHour = function(hourKey, response) {
    for(let j = 0; j < 24; hourKey++, j++) {
        let forecastDay = 'fcst_day_0';
        if (hourKey == 24){
            hourKey = 0;
            forecastDay = 'fcst_day_1';
        }
        const hour = hourKey + 'H00';
        const icon = response[forecastDay].hourly_data[hour].ICON;
        const hourTemp = response[forecastDay].hourly_data[hour].TMP2m;
        addDivHour(hour, icon, hourTemp);
    }
}

const getApiCondition = function(apiCondition){
    const appCondition = appConditionForApiCondition[apiCondition];
    return appCondition;
}

const showOrHideFavouriteElements = function (){
    let cityName = city.toLowerCase();
    let $favouriteLogo = document.querySelector('.favourite-logo');
    let cityIsFavourite = showFavouriteElements($favouriteLogo, cityName);
    if (cityIsFavourite == false) {
            hideFavouriteElements($favouriteLogo);
        }
}

const showFavouriteElements = function($favouriteLogo, cityName) {
    for (i = 0; i < favouriteCitiesArray.length; i++) {
        favouriteCitiesArray[i] = favouriteCitiesArray[i].toLowerCase();
        if (cityName == favouriteCitiesArray[i]) {
            $deleteFavouriteButton.style.display = 'block';
            $addFavouriteButton.style.display = 'none';
            $favouriteLogo.style.display = 'block';
            return true;
        } 
    } 
    return false;
}

const hideFavouriteElements = function($favouriteLogo) {
    $deleteFavouriteButton.style.display = 'none';
    $addFavouriteButton.style.display = 'block';
    $favouriteLogo.style.display = 'none';
}

// Functions to create HTML Elements
const addDivHour = function (hour, icon, hourTemp) {
    const $div = document.createElement('div');
    $div.className = 'weather-by-hour';
    $div.innerHTML = `<p>${hour}</p> <p> <img src="${icon}"> </p> <p>${hourTemp}°C</p>`;
    $divHours.appendChild($div);
}

const addDivDay = function (day, tempMin, tempMax, icon) {
    const $div = document.createElement('div');
    $div.className = 'weather-by-day';
    $div.innerHTML = `<p>${day}</p> <p>${tempMin}°C / ${tempMax}°C</p> <p> <img src="${icon}"> </p>`;
    document.querySelector('.day').appendChild($div);
}

const addLinkFavourite = function () {
    document.querySelector('.dropdown-menu').innerHTML=""
    getFavouriteCitiesArray();
    createLinkFavourite();
    addFunctionOnFavouriteLink();
}

const createLinkFavourite = function () {
    for (i = 0; i < favouriteCitiesArray.length; i++) {
        if (favouriteCitiesArray[i] != 0) {
            const $link = document.createElement('a');
            $link.className = 'dropdown-item';
            $link.href = '#';
            $link.onclick = function (event) {
                city = event.target.textContent;
                fetchWeather();
            };
            $link.innerHTML = favouriteCitiesArray[i];
            document.querySelector('.dropdown-menu').appendChild($link);
        }
    }
}

const addFunctionOnFavouriteLink = function() {
    let favourites = document.querySelectorAll('.dropdown-item');
    for (favourite of favourites){
        favourite.addEventListener('click', fetchWeather);
    }
}

updateWeather();
addCityToFavourites();
$citySearch.addEventListener('change', updateWeather);
$addFavouriteButton.addEventListener('click', addCityToFavourites);
$deleteFavouriteButton.addEventListener('click', removeCityFromFavourites);