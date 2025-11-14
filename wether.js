const srhbtn = document.getElementById("search");
const input = document.getElementById("input");
const secch = document.getElementById("location");
const zoom = document.getElementsByClassName("zoom");
const zoom2 = document.getElementById("zoom2");

// Card 1 
const temp = document.getElementById("temp");
const latitude = document.getElementById("latitude");
const longitude = document.getElementById("longitude");
const humidity = document.getElementById("humidity");

// Card 2 
const Country = document.getElementById("Country");
const region = document.getElementById("region");
const timezone = document.getElementById("timezone");
const localtime = document.getElementById("localtime");

// Card 3 
const wind_speed = document.getElementById("wind_speed");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");
const wind_degree = document.getElementById("wind_degree");

// Recently searched section
const recentSearchContainer = document.querySelector(".mb-3 .row");

async function fetchWeather(city) {
  const apikey = "ca5aa191f103e2b304a7a742b881de3e";  

  const url = `https://api.weatherstack.com/current?access_key=${apikey}&query=${city}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
  

    // getting details form api
    secch.innerHTML = data.location.name;
    Country.innerHTML = `Country : ${data.location.country}`;
    const regionParts = data.location.region.split(" ").slice(0, 3).join(" ");
    region.innerHTML = `Region : ${regionParts}`;
    timezone.innerHTML = `Timezone : ${data.location.timezone_id}`;
    localtime.innerHTML = `Localtime : ${data.location.localtime}`;

    
    temp.innerHTML = `Temp : ${data.current.temperature}°C`;
    latitude.innerHTML = `Latitude : ${data.location.lat}`;
    longitude.innerHTML = `Longitude : ${data.location.lon}`;
    humidity.innerHTML = `Humidity : ${data.current.humidity}%`;

   
    wind_speed.innerHTML = `Wind Speed : ${data.current.wind_speed} km/h`;
    pressure.innerHTML = `Pressure : ${data.current.pressure}`;
    visibility.innerHTML = `Visibility : ${data.current.visibility} miles`;
    wind_degree.innerHTML = `Wind Degree : ${data.current.wind_degree}°`;

    // Save and display recent searches
    saveRecentSearch(regionParts, data.current.temperature, data.current.humidity);
    displayRecentSearches();
  } catch (error) {
    console.error("Error fetching weather:", error);
    secch.innerHTML = "Error loading data";
    temp.innerHTML = "Error loading data";
    wind_speed.innerHTML = "Error loading data";
  }
}

srhbtn.addEventListener("click", (e) => {
  e.preventDefault();
  const city = input.value;

  // for adding preloader 
  Country.innerHTML = `<img src="load.svg" alt="loading..." width="30">`;
  region.innerHTML = `<img src="load.svg" alt="loading..." width="30">`;
  timezone.innerHTML = `<img src="load.svg" alt="loading..." width="30">`;
  localtime.innerHTML = `<img src="load.svg" alt="loading..." width="30">`;

  temp.innerHTML = `<img src="load.svg" alt="loading..." width="30">`;
  latitude.innerHTML = `<img src="load.svg" alt="loading..." width="30">`;
  longitude.innerHTML = `<img src="load.svg" alt="loading..." width="30">`;
  humidity.innerHTML = `<img src="load.svg" alt="loading..." width="30">`;

  wind_speed.innerHTML = `<img src="load.svg" alt="loading..." width="30">`;
  pressure.innerHTML = `<img src="load.svg" alt="loading..." width="30">`;
  visibility.innerHTML = `<img src="load.svg" alt="loading..." width="30">`;
  wind_degree.innerHTML = `<img src="load.svg" alt="loading..." width="30">`;

  fetchWeather(city);
});

// Zoom effects for 1st ,3rd card 
for (let i of zoom) {
  i.addEventListener("mouseover", () => {
    i.style.width = "19rem";
  });
  i.addEventListener("mouseout", () => {
    i.style.width = "18rem";
  });
}
// Zoom effects for 2nd card 
zoom2.addEventListener("mouseover", () => {
  zoom2.style.width = "22rem";
});
zoom2.addEventListener("mouseout", () => {
  zoom2.style.width = "21rem";
});

// clear local storage
function clr() {
  localStorage.clear();
}

// Save recent searches to localStorage
function saveRecentSearch(region, temp, humidity) {
  let recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];

  // Prevent duplicate entries
  if (!recentSearches.some(search => search.region === region)) {
    recentSearches.unshift({ region, temp, humidity });
    // Keep only the last 5 searches
    if (recentSearches.length > 5) {
      recentSearches.pop();
    }
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }
}

// Display recent searches
function displayRecentSearches() {
  const recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
  recentSearchContainer.innerHTML = `
    <div class="col">Sr no.</div>
    <div class="col">Region</div>
    <div class="col">Temp</div>
    <div class="col">Humidity</div>
  `;
  recentSearches.forEach((search, index) => {
    const row = document.createElement("div");
    row.classList.add("row");
    row.innerHTML = `
      <div class="col">${index + 1}</div>
      <div class="col">${search.region}</div>
      <div class="col">${search.temp}°C</div>
      <div class="col">${search.humidity}%</div>
    `;
    recentSearchContainer.appendChild(row);
  });
}


displayRecentSearches();
