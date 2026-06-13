import { useEffect, useState } from "react";
import "./App.css";
function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("history");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  async function fetchWeather(cityName) {
    setLoading(true);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=metric`,
    );
    const data = await response.json();
    if (data.cod === "404") {
      setError("City not found");
      setWeather(null);
    } else {
      setWeather(data);
      setError("");
      setHistory((prev) => [
        cityName,
        ...prev.filter((item) => item !== cityName),
      ]);
    }
    setLoading(false);
  }

  async function handleSearch() {
    if (city.trim() === "") {
      return;
    }
    fetchWeather(city);
    setCity("");
  }

  return (
    <div className="app">
      <h1>Weather App</h1>

      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />

      <button onClick={handleSearch}>Search</button>

      {loading && <p>Loading...</p>}
      {weather && (
        <div className="weather-card">
          <h2>{weather.name}</h2>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather icon"
          />
          <p>🌡 Temperature: {weather.main.temp}</p>
          <p>Feels Like: {weather.main.feels_like}°C</p>
          <p>💧 Humidity: {weather.main.humidity}</p>
          <p>Wind Speed: {weather.wind.speed}m/s</p>
          <p>🌥 Condition: {weather.weather[0].description}</p>
        </div>
      )}
      {error && <p>{error}</p>}
      {weather && (
        <button
          onClick={() => {
            setWeather(null);
            setError("");
            setCity("");
          }}
        >
          Clear Weather
        </button>
      )}
      {history.length > 0 && (
        <button onClick={() => setHistory([])}>Clear History</button>
      )}
      {history.length > 0 && (
        <>
          <h3>Recent Searches</h3>

          <ul>
            {history.map((item, index) => (
              <li
                key={index}
                onClick={() => {
                  setCity(item);
                  fetchWeather(item);
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
