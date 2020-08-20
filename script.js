const $currentTemp = document.querySelector('.current-temp');
const $citySearch = document.querySelector('.city-search');
const $cityName = document.querySelector('.city-name');
const $condition = document.querySelector('.condition');
const $bigLogo = document.querySelector('.big-logo');
const $body = document.querySelector('body');
const $divHours = document.querySelector('.col-hours');

let city = "Angers";
//let icon = "";
//let hourTemp = "";
//let hour = "";
let day = "";
let tempMin = "";
let tempMax = "";
let FavouriteCityArray = [];

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

const getApiCondition = function(apiCondition){
    const appCondition = appConditionForApiCondition[apiCondition];
    return appCondition;
}

// fonctions pour créer éléments HTML
const addDivHour = function (hour, icon, hourTemp) {
    const $div = document.createElement('div');
    $div.className = 'weather-by-hour';
    $div.innerHTML = `<p>${hour}</p> <p> <img src="${icon}"> </p> <p>${hourTemp}°C</p>`;
    $divHours.appendChild($div);
}

const addDivDay = function () {
    const $div = document.createElement('div');
    $div.className = 'weather-by-day';
    $div.innerHTML = `<p>${day}</p> <p>${tempMin}°C / ${tempMax}°C</p> <p> <img src="${icon}"> </p>`;
    document.querySelector('.day').appendChild($div);
}

const getFavouriteCityArray = function() {
    favouriteCities = localStorage.getItem('favouriteCities');
    FavouriteCityArray = favouriteCities.split(',');
}

const addLinkFavourite = function () {
    document.querySelector('.dropdown-menu').innerHTML=""
    getFavouriteCityArray();
    for (i = 0; i < FavouriteCityArray.length; i++) {
        if (FavouriteCityArray[i] != 0) {
            const $link = document.createElement('a');
            $link.className = 'dropdown-item';
            $link.href = '#';
            $link.onclick = function (event) {
                city = event.target.textContent;
                fetchWeather();
            };
            $link.innerHTML = FavouriteCityArray[i];
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

const displayFavouriteButtons = function () {
    let cityName = city.toLowerCase();
    let cityIsFavourite = "false"
    let $deletFavouriteBtn = document.querySelector('.btn-delete-favourite');
    let $addFavouriteBtn = document.querySelector('.btn-add-favourite');
    let $favouriteLogo = document.querySelector('.favourite-logo');
    getFavouriteCityArray();
    for (i = 0; i < FavouriteCityArray.length; i++) {
        FavouriteCityArray[i] = FavouriteCityArray[i].toLowerCase();
        if (cityName == FavouriteCityArray[i]) {
            $deletFavouriteBtn.style.display = 'block';
            $addFavouriteBtn.style.display = 'none';
            $favouriteLogo.style.display = 'block';
            cityIsFavourite = "true"
        }
    } if (cityIsFavourite == "false") {
        $deletFavouriteBtn.style.display = 'none';
        $addFavouriteBtn.style.display = 'block';
        $favouriteLogo.style.display = 'none';
    }
}

const getWeatherByDay = function (response) {
    document.querySelector('.day').innerHTML = "";
    for (i = 1; i <= 4; i++) {
        let iDay = 'fcst_day_' + i;
        day = response[iDay].day_long;
        tempMin = response[iDay].tmin;
        tempMax = response[iDay].tmax;
        icon = response[iDay].icon;
        addDivDay();
    }
}

const getWeatherByHour = function (response, currentHour) {
    let i = 0;
    let j = 0
    let iHour = "";
    while (iHour != currentHour) {
        if (i < 10) {
            iHour = '0' + i + ':00';
        } else if (i >= 10) {
            iHour = i + ':00';
        }
        i += 1;
    }
    $divHours.innerHTML = "";
    
    /*for (i, j; i < 24; i++, j++) {
        const hour = i + 'H00';
        const icon = response.fcst_day_0.hourly_data[hour].ICON;
        const hourTemp = response.fcst_day_0.hourly_data[hour].TMP2m;
        addDivHour(hour, icon, hourTemp);
    }
    i = 0;
    for (i, j; j < 24; i++, j++) {
        const hour = i + 'H00';
        const icon = response.fcst_day_1.hourly_data[hour].ICON;
        const hourTemp = response.fcst_day_1.hourly_data[hour].TMP2m;
        addDivHour(hour, icon, hourTemp);
    }*/
}

const storeFavourite = function () {
    let cityName = $cityName.textContent;
    if (localStorage.length != 0) {
        favouriteCities = localStorage.getItem('favouriteCities')
        if (favouriteCities == "") {
            FavouriteCityArray = [];
        } else {
            FavouriteCityArray = favouriteCities.split(',');
        }
    }
    for (i = 0; i < FavouriteCityArray.length; i++) {
        if (cityName == FavouriteCityArray[i]) {
            cityName = false;
            alert('Cette ville est déjà dans vos favoris !');
        }
    }
    if (cityName != false) {
        FavouriteCityArray.push(cityName);
    }
    localStorage.setItem('favouriteCities', FavouriteCityArray);
    document.querySelector('.dropdown-menu').innerHTML = "";
    addLinkFavourite();
    displayFavouriteButtons();
}

const deleteFavourite = function() {
    let cityName = $cityName.textContent;
    getFavouriteCityArray();
    for (i = 0; i < FavouriteCityArray.length; i++) {
        if(cityName == FavouriteCityArray[i]){
            FavouriteCityArray.splice(i, 1);
            localStorage.setItem('favouriteCities', FavouriteCityArray);
            addLinkFavourite();
            displayFavouriteButtons();
            break;
        }
    }
}

const updateWeather = function () {
    if ($citySearch.value != "") {
        city = $citySearch.value;
    }
    fetchWeather();
}

const fetchWeather = function () {
    let url = 'https://prevision-meteo.ch/services/json/' + city;
    fetch(url)
        .then(response => response.json())
        .then(function (response) {
            $cityName.innerHTML = response.city_info.name;
            $currentTemp.innerHTML = response.current_condition.tmp + '°C';
            let bigLogoSrc = response.current_condition.icon_big;
            $bigLogo.innerHTML = `<img src=${bigLogoSrc}>`;
            let condition = response.current_condition.condition;
            let currentHour = response.current_condition.hour;
            $condition.innerHTML = condition;
            $citySearch.value = "";
            getWeatherByHour(response, currentHour);
            getWeatherByDay(response);
            let appConditionResult = getApiCondition(condition);
            $body.className = appConditionResult;
            displayFavouriteButtons();
        })
        .catch(function () {
            alert('Choisis une vraie ville patate');
        })
}

$citySearch.addEventListener('change', updateWeather);
document.querySelector('.btn-add-favourite').addEventListener('click', storeFavourite);
document.querySelector('.btn-delete-favourite').addEventListener('click', deleteFavourite);

updateWeather();
storeFavourite();