const $currentTemp = document.querySelector('.current-temp');
const $citySearch = document.querySelector('.city-search');
const $cityName = document.querySelector('.city-name');
const $condition = document.querySelector('.condition');
const $bigLogo = document.querySelector('.big-logo');
const $body = document.querySelector('body');

let currentHour = "";
let city ="Toulon";
let condition ="";
let hourIcon = "";
let hourTemp = "";
let hour ="";


const updateBackground = function (){
    if(condition == 'Ensoleillé'){
        $body.style.backgroundImage = 'url(assets/bg_bluesky.webp)';
    } else if (condition == 'Développement nuageux' || condition == 'Ciel voilé' || condition == 'Eclaircies' || condition == 'Faiblement nuageux'){
        $body.style.backgroundImage = 'url(assets/bg_cloudy_bluesky.jpg)';
    } else if (condition == 'Fortement nuageux') {
        $body.style.backgroundImage = 'url(assets/bg_cloudy.jpg)';
    }
}

// const updateDiv = function ($div){
//     if ($div != "") {
//         $div.parentNode.removeChilde($div);
//     }
// }

const addDiv = function() {
    const $div = document.createElement('div');
        $div.className = 'weather-by-hour';
        $div.innerHTML = '<p>' + hour + '</p>' + '<p> <img src="' + hourIcon + '"> </p>' + '<p>' + hourTemp + ' °C</p>';
        document.querySelector('.col-hours').appendChild($div);
    }

const getWeatherbyHour = function(response) {
    let i = 0;
    let iHour ="";
    while (iHour != currentHour) {
        if (i < 10) {
            iHour = '0' + i + ':00';
        }else if (i >= 10) {
            iHour = i + ':00';
        }
        i += 1;
    }
    while (i <= 23) {
        hour = i +'H00';
        hourIcon = response.fcst_day_0.hourly_data[hour].ICON;
        hourTemp = response.fcst_day_0.hourly_data[hour].TMP2m;
        addDiv();
        i +=1;
    }
}

const updateWeather = function () {
    if($citySearch.value != "") {
        city = $citySearch.value
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
