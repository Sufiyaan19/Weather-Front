// maps.js - Interactive weather maps using Leaflet and OpenWeatherMap

const API_KEY = 'd0ae0f5fe785606aa75bb00fa60cff8f'; // Replace with your API key
let map;
let currentLayer = null;

document.addEventListener('DOMContentLoaded', function() {
    initMap();

    // Layer change event
    document.querySelectorAll('input[name="layer"]').forEach(radio => {
        radio.addEventListener('change', function() {
            updateMapLayer(this.value);
        });
    });
});

function initMap() {
    // Initialize map centered on a default location
    map = L.map('map').setView([20, 0], 2);

    // Add base tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add initial weather layer
    updateMapLayer('temp_new');

    // Add click event to get weather at clicked location
    map.on('click', function(e) {
        getWeatherAtLocation(e.latlng.lat, e.latlng.lng);
    });
}

function updateMapLayer(layerType) {
    // Remove existing weather layer
    if (currentLayer) {
        map.removeLayer(currentLayer);
    }

    // Add new weather layer
    currentLayer = L.tileLayer(`https://tile.openweathermap.org/map/${layerType}/{z}/{x}/{y}.png?appid=${API_KEY}`, {
        attribution: '© OpenWeatherMap',
        opacity: 0.6
    }).addTo(map);
}

async function getWeatherAtLocation(lat, lng) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        if (data.cod === 200) {
            document.getElementById('current-location').textContent = `${data.name}, ${data.sys.country}`;
            document.getElementById('location-weather').classList.remove('d-none');
            document.getElementById('map-temp').textContent = `${data.main.temp}°C`;
            document.getElementById('map-humidity').textContent = `${data.main.humidity}%`;
            document.getElementById('map-wind').textContent = `${data.wind.speed} m/s`;

            // Add marker at clicked location
            L.marker([lat, lng]).addTo(map)
                .bindPopup(`<b>${data.name}</b><br>Temperature: ${data.main.temp}°C<br>Humidity: ${data.main.humidity}%`)
                .openPopup();
        } else {
            document.getElementById('current-location').textContent = 'Weather data not available for this location';
            document.getElementById('location-weather').classList.add('d-none');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('current-location').textContent = 'Error fetching weather data';
        document.getElementById('location-weather').classList.add('d-none');
    }
}

// Get user's current location and center map
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            map.setView([lat, lng], 10);
            getWeatherAtLocation(lat, lng);
        }, function(error) {
            console.error('Error getting location:', error);
            alert('Unable to get your location. Please allow location access.');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

// Auto-center on user's location on load
window.addEventListener('load', function() {
    setTimeout(getCurrentLocation, 1000); // Delay to ensure map is loaded
});
