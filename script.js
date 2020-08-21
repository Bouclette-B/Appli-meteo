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

const storeFavourite = function () {
    let cityName = $cityName.textContent;
    getFavouriteCitiesArray();
    updatefavouriteCitiesArray(cityName);
}

const deleteFavourite = function() {
    let cityName = $cityName.textContent;
    getFavouriteCitiesArray();
    for (i = 0; i < favouriteCitiesArray.length; i++) {
        if(cityName == favouriteCitiesArray[i]){
            favouriteCitiesArray.splice(i, 1);
            localStorage.setItem('favouriteCities', favouriteCitiesArray);
            addLinkFavourite();
            displayFavouriteButtons();
            break;
        }
    }
}

// Level 2
const fetchWeather = function () {
    let url = 'https://prevision-meteo.ch/services/json/' + city;
    fetch(url)
        .then(response => response.json())
        .then(function (response) {
            let bigIcon = response.current_condition.icon_big;
            let condition = response.current_condition.condition;
            let currentHour = response.current_condition.hour;
            updateWeatherInfo(response, bigIcon, condition);
            getWeatherByHour(response, currentHour);
            getWeatherByDay(response);
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
}

const updatefavouriteCitiesArray = function(cityName) {
    checkfavouriteCitiesArray(cityName);
    localStorage.setItem('favouriteCities', favouriteCitiesArray);
    document.querySelector('.dropdown-menu').innerHTML = "";
    addLinkFavourite();
    displayFavouriteButtons();
}

//Level 3
const updateWeatherInfo = function(response, bigIcon, condition) {
    $cityName.innerHTML = response.city_info.name;
    $currentTemp.innerHTML = response.current_condition.tmp + '°C';
    $bigLogo.innerHTML = `<img src=${bigIcon}>`;
    $condition.innerHTML = condition;
    $citySearch.value = "";
}

const getWeatherByHour = function (response, currentHour) {
    let i = 0;
    let j = 0
    let hourlyDataHour = "";
    compareHours(hourlyDataHour, currentHour);
    $divHours.innerHTML = "";
    for(i, j; j < 24; i++, j++) {
        let forecastDay = 'fcst_day_0';
        if (i == 24){
            i = 0;
            forecastDay = 'fcst_day_1';
        }
        const hour = i + 'H00';
        const icon = response[forecastDay].hourly_data[hour].ICON;
        const hourTemp = response[forecastDay].hourly_data[hour].TMP2m;
        addDivHour(hour, icon, hourTemp);
    }
}

const getWeatherByDay = function (response) {
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
    let cityName = city.toLowerCase();
    let cityIsFavourite = "false"
    let $favouriteLogo = document.querySelector('.favourite-logo');
    getFavouriteCitiesArray();
    for (i = 0; i < favouriteCitiesArray.length; i++) {
        favouriteCitiesArray[i] = favouriteCitiesArray[i].toLowerCase();
        if (cityName == favouriteCitiesArray[i]) {
            $deleteFavouriteButton.style.display = 'block';
            $addFavouriteButton.style.display = 'none';
            $favouriteLogo.style.display = 'block';
            cityIsFavourite = "true"
        }
    } if (cityIsFavourite == "false") {
        $deleteFavouriteButton.style.display = 'none';
        $addFavouriteButton.style.display = 'block';
        $favouriteLogo.style.display = 'none';
    }
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
const getApiCondition = function(apiCondition){
    const appCondition = appConditionForApiCondition[apiCondition];
    return appCondition;
}

const compareHours = function(hourlyDataHour, currentHour) {
    while (hourlyDataHour != currentHour) {
        if (i < 10) {
            hourlyDataHour = '0' + i + ':00';
        } else if (i >= 10) {
            hourlyDataHour = i + ':00';
        }
        i += 1;
    }
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
    clickLinkFavourite();
}

const clickLinkFavourite = function() {
    let favourites = document.querySelectorAll('.dropdown-item');
    for (favourite of favourites){
        favourite.addEventListener('click', fetchWeather);
    }
}

updateWeather();
storeFavourite();
$citySearch.addEventListener('change', updateWeather);
$addFavouriteButton.addEventListener('click', storeFavourite);
$deleteFavouriteButton.addEventListener('click', deleteFavourite);