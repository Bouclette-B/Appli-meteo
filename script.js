const $currentTemp = document.querySelector('.current-temp');
const $citySearch = document.querySelector('.city-search');
const $cityName = document.querySelector('.city-name');
const $condition = document.querySelector('.condition');
const $bigLogo = document.querySelector('.big-logo');
const $body = document.querySelector('body');
const $divHours = document.querySelector('.col-hours');

let currentHour = "";
let city ="angers";
let condition ="";
let hourIcon = "";
let hourTemp = "";
let hour ="";

const updateBackground = function() {
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

const addDiv = function() {
    const $div = document.createElement('div');
        $div.className = 'weather-by-hour';
        $div.innerHTML = '<p>' + hour + '</p>' + '<p> <img src="' + hourIcon + '"> </p>' + '<p>' + hourTemp + ' °C</p>';
        $divHours.appendChild($div);
    }

const getWeatherbyHour = function(response) {
    let i = 0;
    let j = 0
    let iHour ="";
    while (iHour != currentHour) {
        if (i < 10) {
            iHour = '0' + i + ':00';
        }else if (i >= 10) {
            iHour = i + ':00';
        }
        i += 1;
    }
    $divHours.innerHTML = "";
    while (i < 24) {
        hour = i +'H00';
        hourIcon = response.fcst_day_0.hourly_data[hour].ICON;
        hourTemp = response.fcst_day_0.hourly_data[hour].TMP2m;
        addDiv();
        i +=1;
        j +=1;
    }
    i = 0;
    while (j < 24){
        hour = i +'H00';
        hourIcon = response.fcst_day_1.hourly_data[hour].ICON;
        hourTemp = response.fcst_day_1.hourly_data[hour].TMP2m;
        addDiv();
        i +=1;
        j +=1;
    }
}

const updateWeather = function () {
    if($citySearch.value != "") {
        city = $citySearch.value;
    }
    let url = 'https://prevision-meteo.ch/services/json/' + city;
    fetch(url)
    .then(response => response.json())
    .then(function(response) {
        $cityName.innerHTML = response.city_info.name;
        $currentTemp.innerHTML = response.current_condition.tmp +'°C';
        let bigLogoSrc = response.current_condition.icon_big;
        $bigLogo.innerHTML = '<img src=' + bigLogoSrc +'>';
        condition = response.current_condition.condition;
        currentHour = response.current_condition.hour;
        $condition.innerHTML = condition;
        $citySearch.value = "";
        getWeatherbyHour(response);
        updateBackground();
    })
    .catch(function () {
        alert('Choisis une vraie ville patate');
    })
    
}

$citySearch.addEventListener('change', updateWeather);

updateWeather();
