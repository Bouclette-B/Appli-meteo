const $currentTemp = document.querySelector('.current-temp');
const $citySearch = document.querySelector('.city-search');
const $cityName = document.querySelector('.city-name');
const $condition = document.querySelector('.condition');
const $bigLogo = document.querySelector('.big-logo');
const $body = document.querySelector('body');
const $divHours = document.querySelector('.col-hours');

let currentHour = "";
let city = "Angers";
let condition = "";
let icon = "";
let hourTemp = "";
let hour = "";
let day = "";
let tempMin = "";
let tempMax = "";
let cityArray = [];

const updateBackground = function () {
    switch (condition) {
        case 'Ensoleillé':
            $body.style.backgroundImage = 'url(assets/bg_bluesky.jpg)';
            break;
        case 'Ciel voilé':
        case 'Faiblement nuageux':
        case 'Eclaircies':
        case 'Stratus se dissipant':
            $body.style.backgroundImage = 'url(assets/bg_cloudy_bluesky.jpg)';
            break;
        case 'Fortement nuageux':
        case 'Développement nuageux':
        case 'Stratus':
            $body.style.backgroundImage = 'url(assets/bg_cloudy.jpg)';
            break;
        case 'Nuit claire':
        case 'Nuit bien dégagée':
            $body.style.backgroundImage = 'url(assets/bg_cloudless_night.jpg)';
            break;
        case 'Nuit légèrement voilée':
        case 'Nuit claire et stratus':
        case 'Nuit nuageuse':
        case 'Nuit avec développement nuageux':
            $body.style.backgroundImage = 'url(assets/bg_cloudy_night.jpg)';
            break;
        case 'Averses de pluie faible':
        case 'Pluie faible':
            $body.style.backgroundImage = 'url(assets/bg_small_rain.jpg)';
            break;
        case 'Averses de pluie modérée':
        case 'Averses de pluie forte':
        case 'Couvert avec averses':
        case 'Pluie forte':
        case 'Pluie modérée':
            $body.style.backgroundImage = 'url(assets/bg_rain.jpg)';
            break;
        case 'Faiblement orageux':
        case 'Orage modéré':
        case 'Fortement orageux':
            $body.style.backgroundImage = 'url(assets/bg_thunder_daylight.jpg)';
            break;
        case 'Nuit faiblement orageuse':
            $body.style.backgroundImage = 'url(assets/bg_thunder_night.jpg)';
            break;
        case 'Averses de neige faible':
        case 'Neige faible':
        case 'Neige modérée':
        case 'Neige forte':
        case 'Pluie et neige mêlée faible':
        case 'Pluie et neige mêlée modérée':
        case 'Pluie et neige mêlée forte':
            $body.style.backgroundImage = 'url(assets/bg_snow_day.jpg)';
            break;
        case 'Nuit avec averses de neige faible':
            $body.style.backgroundImage = 'url(assets/bg_snow_night.jpg)';
            break;
        case 'Brouillard':
            $body.style.backgroundImage = 'url(assets/bg_fog.jpg)';
            break;
        default:
            $body.style.backgroundImage = 'url(assets/bg_bluesky.jpg)';
            break;
    }
}

// fonctions pour créer éléments HTML
const addDivHour = function () {
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

const addLinkFavourite = function () {
    document.querySelector('.dropdown-menu').innerHTML=""
    favouriteCities = localStorage.getItem('favouriteCities');
    cityArray = favouriteCities.split(',');
    for (i = 0; i < cityArray.length; i++) {
        if (cityArray[i] != 0) {
            const $link = document.createElement('a');
            $link.className = 'dropdown-item';
            $link.href = '#';
            $link.onclick = function (event) {
                city = event.target.textContent;
                main()
            };
            $link.innerHTML = cityArray[i];
            document.querySelector('.dropdown-menu').appendChild($link);
        }
    }
}

const displayFavouriteButtons = function () {
    let cityName = city.toLowerCase();
    let cityIsFavourite = "false"
    let $deletFavouriteBtn = document.querySelector('.btn-delete-favourite');
    let $addFavouriteBtn = document.querySelector('.btn-add-favourite');
    let $favouriteLogo = document.querySelector('.favourite-logo');
    favouriteCities = localStorage.getItem('favouriteCities')
    cityArray = favouriteCities.split(',');
    for (i = 0; i < cityArray.length; i++) {
        cityArray[i] = cityArray[i].toLowerCase();
        if (cityName == cityArray[i]) {
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
const getWeatherByHour = function (response) {
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
    for (i, j; i < 24; i++, j++) {
        hour = i + 'H00';
        icon = response.fcst_day_0.hourly_data[hour].ICON;
        hourTemp = response.fcst_day_0.hourly_data[hour].TMP2m;
        addDivHour();
    }
    i = 0;
    for (i, j; j < 24; i++, j++) {
        hour = i + 'H00';
        icon = response.fcst_day_1.hourly_data[hour].ICON;
        hourTemp = response.fcst_day_1.hourly_data[hour].TMP2m;
        addDivHour();
    }
}

const storeFavourite = function () {
    let cityName = $cityName.textContent;
    if (localStorage.length != 0) {
        favouriteCities = localStorage.getItem('favouriteCities')
        if (favouriteCities == "") {
            favouriteCities = [];
        } else {
            cityArray = favouriteCities.split(',');
        }
    }
    for (i = 0; i < cityArray.length; i++) {
        if (cityName == cityArray[i]) {
            cityName = false;
            alert('Cette ville est déjà dans vos favoris !');
        }
    }
    if (cityName != false) {
        cityArray.push(cityName);
    }
    localStorage.setItem('favouriteCities', cityArray);
    document.querySelector('.dropdown-menu').innerHTML = "";
    addLinkFavourite();
    displayFavouriteButtons();
}

const deleteFavourite = function() {
    let cityName = $cityName.textContent;
    favouriteCities = localStorage.getItem('favouriteCities');
    cityArray = favouriteCities.split(',');
    for (i = 0; i < cityArray.length; i++) {
        if(cityName == cityArray[i]){
            cityArray.pop(cityArray[i]);
            localStorage.setItem('favouriteCities', cityArray);
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
    main();
}

const main = function () {
    let url = 'https://prevision-meteo.ch/services/json/' + city;
    fetch(url)
        .then(response => response.json())
        .then(function (response) {
            $cityName.innerHTML = response.city_info.name;
            $currentTemp.innerHTML = response.current_condition.tmp + '°C';
            let bigLogoSrc = response.current_condition.icon_big;
            $bigLogo.innerHTML = `<img src=${bigLogoSrc}>`;
            condition = response.current_condition.condition;
            currentHour = response.current_condition.hour;
            $condition.innerHTML = condition;
            $citySearch.value = "";
            getWeatherByHour(response);
            getWeatherByDay(response);
            updateBackground();
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

