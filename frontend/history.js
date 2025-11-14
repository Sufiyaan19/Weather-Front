// history.js - Weather history functionality

document.addEventListener('DOMContentLoaded', function() {
    loadUserCities();
    setDefaultDates();

    document.getElementById('load-history').addEventListener('click', loadHistory);
    document.getElementById('export-csv').addEventListener('click', exportToCSV);
});

function setDefaultDates() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // Default to last 30 days

    document.getElementById('start-date').value = startDate.toISOString().split('T')[0];
    document.getElementById('end-date').value = endDate.toISOString().split('T')[0];
}

function loadUserCities() {
    // In a real app, this would fetch from database
    // For demo, we'll use localStorage to simulate
    const cities = JSON.parse(localStorage.getItem('searchedCities') || '[]');
    const citySelect = document.getElementById('city-select');

    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });
}

async function loadHistory() {
    const city = document.getElementById('city-select').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    if (!city || !startDate || !endDate) {
        alert('Please select a city and date range.');
        return;
    }

    const loading = document.getElementById('history-loading');
    loading.classList.remove('d-none');

    try {
        // In a real app, this would fetch from your database
        // For demo, we'll generate mock historical data
        const historyData = await fetchHistoricalData(city, startDate, endDate);
        displayHistory(historyData);
        updateCharts(historyData);
        document.getElementById('export-csv').classList.remove('d-none');
    } catch (error) {
        console.error('Error loading history:', error);
        alert('Error loading historical data.');
    } finally {
        loading.classList.add('d-none');
    }
}

async function fetchHistoricalData(city, startDate, endDate) {
    // Mock data generation - in real app, this would be an API call to your backend
    const data = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        // Generate realistic weather data
        const baseTemp = 20 + Math.sin(d.getMonth() * Math.PI / 6) * 10; // Seasonal variation
        const temp = baseTemp + (Math.random() - 0.5) * 10; // Daily variation
        const humidity = 40 + Math.random() * 40;
        const windSpeed = 1 + Math.random() * 5;

        data.push({
            date: d.toISOString().split('T')[0],
            time: '12:00',
            temperature: Math.round(temp * 10) / 10,
            humidity: Math.round(humidity),
            windSpeed: Math.round(windSpeed * 10) / 10,
            weather: getRandomWeather()
        });
    }

    return data;
}

function getRandomWeather() {
    const weathers = ['Clear', 'Clouds', 'Rain', 'Snow', 'Thunderstorm', 'Drizzle', 'Mist'];
    return weathers[Math.floor(Math.random() * weathers.length)];
}

function displayHistory(data) {
    const tbody = document.getElementById('history-body');
    tbody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.date}</td>
            <td>${item.time}</td>
            <td>${item.temperature}°C</td>
            <td>${item.humidity}%</td>
            <td>${item.windSpeed} m/s</td>
            <td>${item.weather}</td>
        `;
        tbody.appendChild(row);
    });
}

let tempChart, humidityChart;

function updateCharts(data) {
    const labels = data.map(item => item.date);
    const temps = data.map(item => item.temperature);
    const humidities = data.map(item => item.humidity);

    // Temperature Chart
    const tempCtx = document.getElementById('tempChart').getContext('2d');
    if (tempChart) tempChart.destroy();
    tempChart = new Chart(tempCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temps,
                borderColor: '#ff6b6b',
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: 'white' } }
            },
            scales: {
                x: { ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.2)' } },
                y: { ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.2)' } }
            }
        }
    });

    // Humidity Chart
    const humidityCtx = document.getElementById('humidityChart').getContext('2d');
    if (humidityChart) humidityChart.destroy();
    humidityChart = new Chart(humidityCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Humidity (%)',
                data: humidities,
                borderColor: '#4ecdc4',
                backgroundColor: 'rgba(78, 205, 196, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: 'white' } }
            },
            scales: {
                x: { ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.2)' } },
                y: { ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.2)' } }
            }
        }
    });
}

function exportToCSV() {
    const table = document.getElementById('history-table');
    let csv = [];

    // Get headers
    const headers = [];
    table.querySelectorAll('thead th').forEach(th => headers.push(th.textContent));
    csv.push(headers.join(','));

    // Get data
    table.querySelectorAll('tbody tr').forEach(tr => {
        const row = [];
        tr.querySelectorAll('td').forEach(td => row.push(td.textContent));
        csv.push(row.join(','));
    });

    // Download CSV
    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'weather_history.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}
