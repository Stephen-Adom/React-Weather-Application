import axios from "axios";

async function fetchWeatherForecast(key, latitude, longitude) {
  try {
    return await axios.get(
      `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${key}&units=metric`
    );
  } catch (error) {
    return error;
  }
}

async function fetchCurrentWeather(key, latitude, longitude) {
  try {
    return await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}&units=metric`
    );
  } catch (error) {
    return error;
  }
}

async function fetchCurrentWeatherByCityName(city, key) {
  try {
    return await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`
    );
  } catch (err) {
    return err;
  }
}

async function fetchForecastByCityName(city, key) {
  try {
    return await axios.get(
      `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}&units=metric`
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
