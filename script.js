const $currentTemp = document.querySelector('.current-temp');
const $citySearch = document.querySelector('.city-search');
const $cityName = document.querySelector('.city-name');
const $condition = document.querySelector('.condition');
const $bigLogo = document.querySelector('.big-logo');
const $body = document.querySelector('body');

let city ="Toulon" ;
let condition =""
const updateBackground = function (){
    if(condition == 'Ensoleillé'){
        $body.style.backgroundImage = 'url(assets/bg_bluesky.webp)';
    } else if (condition == 'Développement nuageux' || condition == 'Ciel voilé' || condition == 'Eclaircies' || condition == 'Faiblement nuageux'){
        $body.style.backgroundImage = 'url(assets/bg_cloudy_bluesky.jpg)';
    } else if (condition == 'Fortement nuageux') {
        $body.style.backgroundImage = 'url(assets/bg_cloudy.jpg)';
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
        condition = response.current_condition.condition
        $condition.innerHTML = condition;
        $citySearch.value = "";
        updateBackground();
    })
    .catch(function () {
        alert('Choisis une vraie ville patate');
    })
    
}

$citySearch.addEventListener('change', updateWeather);

updateWeather();
