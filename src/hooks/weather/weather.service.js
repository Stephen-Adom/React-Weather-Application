import axios from "axios";

const API_KEY = "10bed4197273fcac06edd44b97833408";

async function fetchWeatherForecast(latitude, longitude) {
  try {
    return await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
  } catch (error) {
    return error;
  }
}

async function fetchCurrentWeather(latitude, longitude) {
  try {
    return await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
  } catch (error) {
    return error;
  }
}

async function fetchCurrentWeatherByCityName(city) {
  try {
    return await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
  } catch (err) {
    return err;
  }
}

async function fetchForecastByCityName(city) {
  try {
    return await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
  } catch (error) {
    return error;
  }
}

export {
  fetchWeatherForecast,
  fetchCurrentWeather,
  fetchCurrentWeatherByCityName,
  fetchForecastByCityName,
};
