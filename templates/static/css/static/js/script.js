document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('search-btn');
    const cityInput = document.getElementById('city-input');
    const weatherCard = document.querySelector('.weather-card');
    const errorMessage = document.getElementById('error-message');
    
    searchBtn.addEventListener('click', getWeather);
    cityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            getWeather();
        }
    });
    
    function getWeather() {
        const city = cityInput.value.trim();
        if (!city) {
            showError('Please enter a city name');
            return;
        }
        
        fetch('/get_weather', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `city=${encodeURIComponent(city)}`
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            showError(error.error || 'Failed to fetch weather data');
            console.error('Error:', error);
        });
    }
    
    function displayWeather(data) {
        console.log("Received data:", data);  // Add this line
        
        // Update location
        if (data.city && data.country) {
            document.getElementById('location').textContent = `${data.city}, ${data.country}`;
        } else {
            console.error("Missing location data:", data);
        }
        
        // Update temperature
        if (data.temp !== undefined) {
            document.getElementById('temperature').textContent = data.temp;
            document.getElementById('feels-like').textContent = `${data.feels_like}°C`;
        } else {
            console.error("Missing temperature data:", data);
        }
        
        // Continue with other fields...
        // Add similar checks for humidity, wind, pressure
    }
    // Replace your displayWeather function with this temporarily
function displayWeather(data) {
    console.log("Full data received:", data);
    
    // Manual test - hardcode some values
    document.getElementById('temperature').textContent = "25";
    document.getElementById('feels-like').textContent = "27°C";
    document.getElementById('humidity').textContent = "65%";
    document.getElementById('wind').textContent = "5 m/s";
    document.getElementById('pressure').textContent = "1012 hPa";
    
    document.querySelector('.weather-card').classList.remove('hidden');
}
        
        // Update weather icon with animation
        const iconElement = document.getElementById('weather-icon');
        iconElement.innerHTML = '';
        
        const iconCode = data.icon;
        let iconClass;
        
        // Map OpenWeatherMap icons to Font Awesome icons with animations
        if (iconCode.includes('01')) {
            iconClass = 'fas fa-sun pulse'; // Clear sky
        } else if (iconCode.includes('02')) {
            iconClass = 'fas fa-cloud-sun spin-slow'; // Few clouds
        } else if (iconCode.includes('03') || iconCode.includes('04')) {
            iconClass = 'fas fa-cloud float'; // Scattered/broken clouds
        } else if (iconCode.includes('09') || iconCode.includes('10')) {
            iconClass = 'fas fa-cloud-rain bounce'; // Rain
        } else if (iconCode.includes('11')) {
            iconClass = 'fas fa-bolt shake'; // Thunderstorm
        } else if (iconCode.includes('13')) {
            iconClass = 'fas fa-snowflake spin'; // Snow
        } else if (iconCode.includes('50')) {
            iconClass = 'fas fa-smog fade-in-out'; // Mist
        } else {
            iconClass = 'fas fa-cloud'; // Default
        }
        
        const icon = document.createElement('i');
        icon.className = iconClass;
        iconElement.appendChild(icon);
        
        // Change background based on weather
        changeBackground(iconCode);
        
        // Show weather card
        weatherCard.classList.remove('hidden');
        weatherCard.classList.add('visible');
        hideError();
    }
    
    function changeBackground(iconCode) {
        const weatherCard = document.querySelector('.weather-card');
        
        if (iconCode.includes('01')) {
            // Clear sky
            weatherCard.style.background = 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)';
        } else if (iconCode.includes('02')) {
            // Few clouds
            weatherCard.style.background = 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)';
        } else if (iconCode.includes('03') || iconCode.includes('04')) {
            // Clouds
            weatherCard.style.background = 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)';
        } else if (iconCode.includes('09') || iconCode.includes('10')) {
            // Rain
            weatherCard.style.background = 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)';
        } else if (iconCode.includes('11')) {
            // Thunderstorm
            weatherCard.style.background = 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)';
        } else if (iconCode.includes('13')) {
            // Snow
            weatherCard.style.background = 'linear-gradient(135deg, #e6dada 0%, #274046 100%)';
        } else if (iconCode.includes('50')) {
            // Mist
            weatherCard.style.background = 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)';
        }
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
        weatherCard.classList.remove('visible');
        weatherCard.classList.add('hidden');
    }
    
    function hideError() {
        errorMessage.classList.remove('show');
    }
});

// Additional CSS animations
const style = document.createElement('style');
style.textContent = `
    .pulse {
        animation: pulse 2s infinite;
    }
    
    .spin-slow {
        animation: spin 10s linear infinite;
    }
    
    .float {
        animation: float 6s ease-in-out infinite;
    }
    
    .bounce {
        animation: bounce 2s infinite;
    }
    
    .shake {
        animation: shake 0.5s infinite;
    }
    
    .spin {
        animation: spin 5s linear infinite;
    }
    
    .fade-in-out {
        animation: fadeInOut 3s ease-in-out infinite;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    @keyframes spin {
        100% { transform: rotate(360deg); }
    }
    
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
    
    @keyframes shake {
        0% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        50% { transform: translateX(5px); }
        75% { transform: translateX(-5px); }
        100% { transform: translateX(0); }
    }
    
    @keyframes fadeInOut {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
    }
`;
document.head.appendChild(style);