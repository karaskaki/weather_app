import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeatherData, fetchAirPollutionData } from "./slice/weatherSlice";
import Navbar from "./components/navbar";
import { iconsData } from "./assets/icons/icons";

const App = () => {
  const dispatch = useDispatch();
  const { city, weatherData, airPollutionData, loading, error } = useSelector(
    (state) => state.weather
  );

  console.log(weatherData);

  useEffect(() => {
    dispatch(fetchWeatherData(city));
  }, [city, dispatch]);

  useEffect(() => {
    if (weatherData && weatherData.coord) {
      const { lat, lon } = weatherData.coord;
      dispatch(fetchAirPollutionData({ latitude: lat, longitude: lon }));
    }
  }, [dispatch, weatherData]);

  const currentWeather = weatherData
    ? weatherData.weather[0].main.toLowerCase()
    : "";
  const weatherIcon = currentWeather
    ? iconsData[currentWeather]
    : `https://openweathermap.org/img/wn/50d@2x.png`;

  const airQuality = airPollutionData?.data?.current?.pollution || null;

  const getWindDirection = (deg) => {
    if (deg >= 337.5 || deg < 22.5) return "NORTH";
    if (deg >= 22.5 && deg < 67.5) return "NORTH-EAST";
    if (deg >= 67.5 && deg < 112.5) return "EAST";
    if (deg >= 112.5 && deg < 157.5) return "SOUTH-EAST";
    if (deg >= 157.5 && deg < 202.5) return "SOUTH";
    if (deg >= 202.5 && deg < 247.5) return "SOUTH-WEST";
    if (deg >= 247.5 && deg < 292.5) return "WEST";
    if (deg >= 292.5 && deg < 337.5) return "NORTH-WEST";
    return "N/A";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white p-4">
      <Navbar />
      {loading ? (
        <p className="mt-6 text-lg font-semibold animate-pulse">
          Loading weather data...
        </p>
      ) : error ? (
        <p className="mt-6 text-lg font-semibold text-red-500">{error}</p>
      ) : weatherData ? (
        <div className="mt-6 bg-white shadow-2xl rounded-2xl p-6 w-96 text-center text-gray-900">
          <h1 className="text-3xl font-extrabold">{weatherData.name}</h1>
          <div className="flex flex-col items-center">
            <img
              src={weatherIcon}
              alt="Weather Icon"
              className="w-20 h-20 mt-3 transition-transform transform hover:scale-110"
            />
            <p className="text-lg font-semibold capitalize">
              {weatherData.weather[0].description}
            </p>
            <p className="text-4xl font-bold mt-2">{weatherData.main.temp}°C</p>
            <div className="mt-3 p-2 bg-gray-100 rounded-lg shadow-md w-full">
              <p className="text-sm mt-1 text-gray-800">
                <strong>Humidity:</strong> {weatherData.main.humidity}%
              </p>
              <p className="text-sm mt-1 text-gray-800">
                <strong>Wind Speed:</strong> {weatherData.wind.speed} m/s
              </p>
              <p className="text-sm mt-1 text-gray-800">
                <strong>Wind Direction:</strong>{" "}
                {getWindDirection(weatherData.wind.deg)}
              </p>
            </div>
          </div>

          {airQuality ? (
            <div
              className={`mt-6 p-4 rounded-lg shadow-inner ${
                airQuality.aqius <= 50
                  ? "bg-green-200"
                  : airQuality.aqius <= 100
                  ? "bg-yellow-200"
                  : "bg-red-200"
              }`}
            >
              <h2 className="text-lg font-bold text-gray-700">
                Air Quality Index (AQI)
              </h2>
              <p className="text-xl font-semibold text-gray-800">
                AQI:{" "}
                <span
                  className={`font-bold ${
                    airQuality.aqius <= 50
                      ? "text-green-600"
                      : airQuality.aqius <= 100
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {airQuality.aqius}
                </span>
              </p>
              <p className="text-sm text-gray-700">
                PM2.5: {airQuality.pm25} µg/m³ | PM10: {airQuality.pm10} µg/m³
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-700">
              Loading air quality data...
            </p>
          )}
        </div>
      ) : (
        <p className="mt-6 text-lg font-semibold">
          Enter a city to get weather details
        </p>
      )}
    </div>
  );
};

export default App;
