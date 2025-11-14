// forecast.js - Handles 7-day forecast functionality

const API_KEY = 'd0ae0f5fe785606aa75bb00fa60cff8f'; // Replace with your API key
let tempChart;

document.getElementById('forecast-search').addEventListener('click', (e) => {
    e.preventDefault();
    const city = document.getElementById('forecast-city').value.trim();
    if (city) {
        fetchForecast(city);
    }
});

async function fetchForecast(city) {
    const loading = document.getElementById('forecast-loading');
    const container = document.getElementById('forecast-container');

    loading.classList.remove('d-none');
    container.classList.add('d-none');

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        if (data.cod === '200') {
            displayForecast(data);
            displayHourly(data);
            updateChart(data);
        } else {
            alert('City not found. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching forecast:', error);
        alert('Error fetching forecast data.');
    } finally {
        loading.classList.add('d-none');
        container.classList.remove('d-none');
    }
}

function displayForecast(data) {
    const container = document.getElementById('forecast-container');
    container.innerHTML = '';

    // Group by date
    const dailyData = {};
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyData[date]) {
            dailyData[date] = [];
        }
        dailyData[date].push(item);
    });

    Object.keys(dailyData).slice(0, 7).forEach(date => {
        const dayData = dailyData[date];
        const avgTemp = dayData.reduce((sum, item) => sum + item.main.temp, 0) / dayData.length;
        const weather = dayData[0].weather[0];

        const card = document.createElement('div');
        card.className = 'col-md-3 mb-4';
        card.innerHTML = `
            <div class="card border-white rounded-4 zoom" style="background: linear-gradient(to top, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.7) 50%); transition: ease-in-out 0.3s;">
                <div class="card-body text-white text-center">
                    <h6 class="card-title">${date}</h6>
                    <img src="https://openweathermap.org/img/wn/${weather.icon}@2x.png" alt="${weather.description}" class="mb-2">
                    <p class="mb-1">${weather.description}</p>
                    <p class="mb-1"><strong>${avgTemp.toFixed(1)}°C</strong></p>
                    <p class="mb-0">Humidity: ${dayData[0].main.humidity}%</p>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function displayHourly(data) {
    const container = document.getElementById('hourly-container');
    container.innerHTML = '';

    // Show next 24 hours
    data.list.slice(0, 8).forEach(item => {
        const time = new Date(item.dt * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const temp = item.main.temp;
        const weather = item.weather[0];

        const hourDiv = document.createElement('div');
        hourDiv.className = 'text-center me-3';
        hourDiv.innerHTML = `
            <div class="p-2 border rounded text-white" style="min-width: 100px; background: rgba(255,255,255,0.1);">
                <small>${time}</small>
                <br>
                <img src="https://openweathermap.org/img/wn/${weather.icon}.png" alt="${weather.description}" style="width: 40px;">
                <br>
                <strong>${temp.toFixed(0)}°C</strong>
            </div>
        `;
        container.appendChild(hourDiv);
    });
}

function updateChart(data) {
    const ctx = document.getElementById('tempChart').getContext('2d');

    if (tempChart) {
        tempChart.destroy();
    }

    const labels = [];
    const temps = [];

    // Get one reading per day for 7 days
    for (let i = 0; i < 7; i++) {
        const item = data.list[i * 8]; // Every 24 hours (8 * 3-hour intervals)
        if (item) {
            labels.push(new Date(item.dt * 1000).toLocaleDateString([], {weekday: 'short'}));
            temps.push(item.main.temp);
        }
    }

    tempChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temps,
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255,255,255,0.2)'
                    }
                },
                y: {
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255,255,255,0.2)'
                    }
                }
            }
        }
    });
}

// Load default forecast on page load (optional)
window.addEventListener('load', () => {
    // fetchForecast('London'); // Uncomment to load default
});
