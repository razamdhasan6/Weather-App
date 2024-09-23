const apiKey = 'f5adca86a7f032018f003bf488da9aad';

// Group DOM elements for easier management
const elements = {
    input: document.querySelector('input'),
    button: document.querySelector('button'),
    city: document.querySelector('.city-name'),
    date: document.querySelector('.date'),
    windEl: document.querySelector('.wind'),
    windSpeed: document.querySelector('#wind'),
    img: document.querySelector('.img'),
    temp: document.querySelector('.temp'),
    humidity: document.querySelector('#humidity'),
    visibility: document.querySelector('#cloud'),
    loading: document.querySelector('.loading'),
    cityInfo: document.querySelector('.city-info')
};

const showError = () => {
    elements.cityInfo.innerHTML = 'City not found. Please enter a valid city name.';
    elements.cityInfo.classList.add('error-message');
};

// Fetch weather data from the API
const fetchWeatherData = async (cityName) => {
    toggleLoading(true); // Show loading message

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`
        );

        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        updateAppUi(data); // Update the UI with fetched data
    } catch (error) {
            showError('City not found. Please enter a valid city name.');
        
    } finally {
        toggleLoading(false); // Hide loading message
    }
};

// Update UI with weather data
const updateAppUi = (data) => {
    try {
        const cityName = data.name.replace(/ā/g, "a");
        elements.city.textContent = cityName;
        elements.temp.textContent = `${Math.round(data.main.temp)}°`;
        elements.humidity.textContent = `${data.main.humidity}% Humidity`;
        elements.img.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        elements.windSpeed.textContent = `${data.wind.speed} km/h Wind`;
        elements.visibility.textContent = `${data.visibility / 1000} km Visibility`;
        elements.windEl.textContent = data.weather[0].main;
        elements.date.textContent = new Date().toDateString();
    } catch (error) {
        showError('Could not fetch weather data. Please try again later.');
    }
};

// Show or hide loading message
const toggleLoading = (isLoading) => {
    if (isLoading) {
        elements.loading.style.display = 'block';
    } else {
        elements.loading.style.display = 'none';
    }
};

// Event listeners
elements.button.addEventListener('click', () => {
    const cityName = elements.input.value.trim();

    // Check if the input is a number or random text (non-alphabetic characters)
    if (!cityName || !isNaN(cityName) || !/^[a-zA-Z\s]+$/.test(cityName)) {
        showError();
        return;
    }

    fetchWeatherData(cityName);
    elements.input.value = '';
});

window.addEventListener('load', () => {
    fetchWeatherData('bahadurganj');
});
