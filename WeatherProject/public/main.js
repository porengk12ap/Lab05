const form = document.querySelector("#weatherForm");
const cityInput = document.querySelector("#cityInput");
const statusEl = document.querySelector("#status");
const cityNameEl = document.querySelector("#cityName");
const tempEl = document.querySelector("#temp");
const descEl = document.querySelector("#desc");
const iconEl = document.querySelector("#icon");
const aqiEl = document.querySelector("#aqi");
const pm25El = document.querySelector("#pm25");
const pm10El = document.querySelector("#pm10");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const city = cityInput.value.trim() || "London";
  statusEl.textContent = "Loading...";

  try {
    const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
    const data = await res.json();

    cityNameEl.textContent = data.city;
    tempEl.textContent = data.temp;
    descEl.textContent = data.desc;
    iconEl.src = data.iconUrl;

    aqiEl.textContent = data.aqi;
    pm25El.textContent = data.pm25;
    pm10El.textContent = data.pm10;

    statusEl.textContent = "";
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Error fetching weather";
  }
});
