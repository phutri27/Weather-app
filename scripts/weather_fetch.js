import { addData, loadPage, result, loadFromStorage } from "./fetch.js";

let city = JSON.parse(localStorage.getItem('cityName'));
if (!city){
    city = "Hanoi";
}

let val = JSON.parse(localStorage.getItem('val'));

let set;
if (!val){
    set = document.querySelector('.cel').classList.add('special');
}
if (val === 1){
    set = document.querySelector('.fal').classList.add('special');
}
else if (val === 2){
    set = document.querySelector('.cel').classList.add('special');
}

document.querySelector('.fal').addEventListener('click', async (e) =>{
    e.preventDefault();
    val = 1;
    localStorage.setItem('val', JSON.stringify(val));
    await loadPage(city, "us");
    await loadFromStorage();
    weather("mph");
})

document.querySelector('.cel').addEventListener('click', async (e) =>{
    e.preventDefault();
    val = 2;
    localStorage.setItem('val', JSON.stringify(val));
    await loadPage(city, "metric");
    await loadFromStorage();
    weather("kph");
})

document.querySelector('.location-form').addEventListener('submit', async (e) =>{
    e.preventDefault();
    await loadData("metric");
    if (val === 1) {
        await loadData("us");
        document.querySelector('.fal').classList.add('special');
    }
    await loadFromStorage();
    weather("kph");
    if (val === 1) 
        weather("mph");
    document.querySelector('.search-bar').value = '';
})

await loadFromStorage();
weather("kph");

document.querySelectorAll('.btn-primary').forEach((btn) => {
    btn.addEventListener('click', () => {
        document.querySelector('.special')?.classList.remove('special');
        btn.classList.add('special')
    })
})

document.querySelector('.home-button').addEventListener('click', async (e) =>{
    localStorage.clear();
    city = "Hanoi";
    document.querySelector('.special')?.classList.remove('special');
    document.querySelector('.cel').classList.add('special');
    await loadPage("Hanoi", "metric");
    await loadFromStorage();
    weather("kph");
})

async function loadData(unit) {
    try{
        const cityName = document.querySelector('.search-bar').value;
        localStorage.setItem('cityName', JSON.stringify(cityName));
        city = cityName;
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityName}?unitGroup=${unit}&key=57MQZG52RCRF7WEWNVUNFC5U9&contentType=json`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
        })
        const data = await response.json();
        addData(data);
    } catch(error){
        console.log(error);
    }
}

function weather(met){
    let condition = result.currentConditions.icon;
    let icon = '';
    if (condition.toLowerCase().includes("cloudy")){
        icon ='<i class="fa-solid fa-cloud image"></i>';
    }
    else if (condition.toLowerCase().includes("rain")){
        icon = '<i class="fa-solid fa-cloud-rain image"></i>';
    }
    else if(condition.toLowerCase().includes("clear")){
        icon ='<i class="fa-solid fa-sun image"></i>'
    }
    let HTML = `
        <div class="weather-details">
            <div class="weather-overview">
                <div class="city-name">${result.resolvedAddress} - ${result.currentConditions.datetime}</div>
                <div class="image-temp">
                    ${icon}
                    <div class="temperature">
                        ${result.currentConditions.temp}&#176;
                        <p class="conditions">${result.days[0].conditions}</p>
                    </div>
                </div>
            </div>
            <div class="temp-container">
                <div class="temp">
                <p>Min</p>
                <p>${result.days[0].tempmin}&#176;</p>
                </div>
                <div class="temp">
                <p>Max</p>
                <p>${result.days[0].tempmax}&#176;</p>
                </div>
                <div class="temp">
                <p>Real Feel</p>
                <p>${result.currentConditions.feelslike}&#176;</p>
                </div>
            </div>
        </div>
        <div class="chi-so-phu">
        <div class="chi-so">
            <div class="inner-chi-so">
                Sunrise
                <p>${result.currentConditions.sunrise}</p>
            </div>
            <div class="icon-chi-so">&#127748;</div>
        </div>
        <div class="chi-so">
            <div class="inner-chi-so">
                Sunset
                <p>${result.currentConditions.sunset}</p>
            </div>
            <div class="icon-chi-so">&#127748;</div>
        </div>
        <div class="chi-so"><div class="inner-chi-so">
                Humidity
                <p>${result.currentConditions.humidity} %</p>
            </div>
            <div class="icon-chi-so">&#10053;</div></div>
        <div class="chi-so"><div class="inner-chi-so">
                Windspeed
                <p>${result.currentConditions.windspeed} ${met}</p>
            </div>
            <div class="icon-chi-so">&#127788;</div></div>
        <div class="chi-so"><div class="inner-chi-so">
                Pressure
                <p>${result.currentConditions.pressure}</p>
            </div>
            <div class="icon-chi-so">&#127744;</div></div>
        <div class="chi-so"><div class="inner-chi-so">
                UV Index
                <p>${result.currentConditions.uvindex}</p>
            </div>
            <div class="icon-chi-so">&#9728;</div></div>
    </div>
    `
    document.querySelector('.weather-grid').innerHTML = HTML;
}

