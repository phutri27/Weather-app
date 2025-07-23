export function addData(data){
    localStorage.setItem('data', JSON.stringify(data));
}

export async function loadPage(city, unit) {
    try{
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=${unit}&key=57MQZG52RCRF7WEWNVUNFC5U9&contentType=json`, {
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

export let result;

await loadFromStorage();

export async function loadFromStorage(){
    result = JSON.parse(localStorage.getItem('data'));
    if (!result){
        await loadPage("Hanoi", "metric");
        result = JSON.parse(localStorage.getItem('data'));
    }
}
