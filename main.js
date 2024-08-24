const input = document.querySelector(".graphic__searcher__input-container__input")
const root = document.querySelector(":root")
const body = document.querySelector("body")
const tempItem = document.querySelector(".graphic__temp")
const sun = document.querySelector(".graphic__sun")

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        fetchData({
            coords: {
                latitude: 0, longitude: 0
            }
        }, e.target.value)
    }
})


const API_KEY = "eb27040e7cc7585ca66e671bda795cf9"

const onLoad = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(fetchData)
    } else {
        console.log("No podemos acceder a su ubicación")
    }
}

const fetchData = (position, city = '') => {
    const { latitude, longitude } = position.coords

    fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&lat=${latitude}&lon=${longitude}&&appid=${API_KEY}`)
        .then(response => response.json())
        .then(data => setWeatherData(data))
}


const setWeatherData = (data) => {
    const formatTime = (timestamp, timezoneOffset) => {
        const localTime = new Date((timestamp + timezoneOffset) * 1000);
        const hours = localTime.getUTCHours();
        const minutes = localTime.getUTCMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;

        return `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
    };

    const formatDate = (date) => {
        const options = { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const date = new Date();
    const weatherData = {
        city_name: `${data.name}, ${data.sys.country}`,
        temp: Math.round(data.main.temp),
        date: formatDate(date),
        temp_min: `${Math.round(data.main.temp_min)}°C`,
        temp_max: `${Math.round(data.main.temp_max)}°C`,
        country: data.sys.country,
        sunrise: formatTime(data.sys.sunrise, data.timezone),
        sunset: formatTime(data.sys.sunset, data.timezone),
        weather: data.weather[0].main,
        seaLevel: data.main.sea_level,
        wind: `${data.wind.speed} km/h`,
        humidity: `${data.main.humidity} %`,
        feels: `${Math.round(data.main.feels_like)} °C`,
        pressure: `${data.main.pressure} hPa`
    };

    if (data.dt > data.sys.sunset) {
        console.log('night')
        body.classList.remove('day')
        body.classList.add('night')
        root.style.setProperty('--font-primary-color-day', '#CECECE')
        sun.style.background = 'linear-gradient(#4E4E4E 0%, #004f4f00 100%)'
    } else {
        console.log('day')
        body.classList.remove('night')
        body.classList.add('day')
        root.style.setProperty('--font-primary-color-day', '#121212')
        sun.style.background = 'linear-gradient(180deg, #F8BE28 0%, rgba(248, 190, 40, 0) 100%)'
    }

    Object.keys(weatherData).forEach(key => {
        document.getElementById(key).textContent = weatherData[key];
    });
};




onLoad()

// Para los Iconos
feather.replace();
