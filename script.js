const $currentTemp = document.querySelector('.current-temp');
const $city = document.querySelector('.city');
let city = 'toulon';
let url = 'https://prevision-meteo.ch/services/json/' + city;

function updateMeteo(){
fetch(url)
.then(response => response.json())
.then(function(response) {
    $city.value = response.city_info.name;
    $currentTemp.innerHTML = response.current_condition.tmp +'°C';
})
.catch(function () {
    alert('Erreur');
})
}





// currentTemp.then(function (response) {
//     currentTemp = JSON.parse(response);
//     return currentTemp;
// })
// .then(function () {
//     $currentTemp.innerHTML = currentTemp.current_condition.tmp;
// })