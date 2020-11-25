import tabJoursEnOrdre from './Utilitaire/gestionTemps.js';


const CLEFAPI = '2b44f3357184e9431a5e6eb5addc1488';
let resultatsAPI;
const temps = document.querySelector('.temps');
const temperature = document.querySelector('.temperature');
const localisation = document.querySelector('.localisation');
const heure = document.querySelectorAll('.heure-nom-prevision');
const tempPourH = document.querySelectorAll('.heure-prevision-valeur');
const joursDiv = document.querySelectorAll('.jour-prevision-nom');
const tempJourDiv = document.querySelectorAll('.jour-prevision-temps');
const imgIcone = document.querySelector('.logo-meteo');
const chargementContainer = document.querySelector('.overlay-icone-chargement');

if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        let long = position.coords.longitude;
        let lat = position.coords.latitude;
        AppelApi(long, lat);
    }, () => {
        alert(`Votre navigateur ne peut pas accéder à cette application`);
    })
}

function AppelApi(long, lat){
    fetch(`https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=metric&lang=fr&appid=${CLEFAPI}`)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            console.log(data);
            resultatsAPI = data;

            temps.innerText = `${resultatsAPI.current.weather[0].description}`;
            temperature.innerText = `${Math.trunc(resultatsAPI.current.temp)}°`;
            localisation.innerText = resultatsAPI.timezone;

            // les heures, par tranche de trois, avec leur température

            let heureActuelle = new Date().getHours();

            for(let i = 0; i < heure.length; i++){
                let heureIncr = heureActuelle + i *3;
                if(heureIncr > 24){
                    heure[i].innerText = `${heureIncr -24} h`
                }else if(heureIncr === 24){
                    heure[i].innerText = "00h";
                }else {
                    heure[i].innerText = `${heureIncr} h`;
                }
                
            }

            // temp pour 3 heure
            for(let j = 0; j < tempPourH.length; j++ ){
                tempPourH[j].innerText = `${Math.trunc(resultatsAPI.hourly[j * 3].temp)}°`
            }

            //3 premières lettres
            for(let k = 0; k < tabJoursEnOrdre.length; k++){
                joursDiv[k].innerText = tabJoursEnOrdre[k].slice(0,3);
            }

            //Prevision par jour
            for(let m = 0; m < 7 ; m++){
                tempJourDiv[m].innerText = `${Math.trunc(resultatsAPI.daily[m + 1].temp.day)}°`;
            }

            //Icone image
            if(heureActuelle >= 6 && heureActuelle <= 21){
                imgIcone.src = `ressources/jour/${resultatsAPI.current.weather[0].icon}.svg`;
            }else {
                imgIcone.src = `ressources/nuit/${resultatsAPI.current.weather[0].icon}.svg`;
            }


            chargementContainer.classList.add('disparition');
        })
}

