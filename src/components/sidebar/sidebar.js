import { useEffect, useState, useRef } from "react";
import {
  fetchCurrentWeather,
  fetchCurrentWeatherByCityName,
  fetchForecastByCityName,
} from "../../hooks/weather/weather.service";
import {
  fetchWeather,
  fetchForecastList,
} from "../../hooks/weather/weatherSliceReducer";
import { useDispatch, useSelector } from "react-redux";
import { format, formatDistanceToNow } from "date-fns";
import "./sidebar.css";
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  map,
  filter,
} from "rxjs";
import { Toast } from "primereact/toast";

function Sidebar() {
  let dispatch = useDispatch();
  let weatherInfo = useSelector((state) => {
    if (state.weather.weatherInfo) {
      return state.weather.weatherInfo;
    }
  });
  const [location, setLocation] = useState(null);
  const [searchValue, setSearchValue] = useState(new BehaviorSubject(""));
  const [loading, setLoading] = useState(false);

  const toast = useRef(null);

  useEffect(() => {
    // GET USER CURRENT LOCATION
    function getCurrentLocation() {
      navigator.geolocation.getCurrentPosition((position) => {
        position = {
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        };

        setLocation(position);
      });
    }

    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (location) {
      // FETCH WEATHER FORECAST
      function getWeatherInfo(location) {
        fetchCurrentWeather(location.latitude, location.longitude).then(
          (response) => {
            if (response.status === 200) {
              console.log(response["data"]);
              dispatch(fetchWeather(response.data));
            }
          }
        );
      }

      getWeatherInfo(location);
    }
    // console.log(location, "location");
  }, [dispatch, location]);

  useEffect(() => {
    searchValue
      .pipe(
        map((s) => s.trim()),
        distinctUntilChanged(),
        filter((s) => s.length >= 2),
        debounceTime(1000)
      )
      .subscribe((city) => {
        setLoading(true);
        fetchCurrentWeatherByCityName(city)
          .then((response) => {
            setLoading(false);
            dispatch(fetchWeather(response.data));
            return fetchForecastByCityName(city);
          })
          .then((forecastResponse) => {
            setLoading(false);
            if (forecastResponse.status === 200) {
              console.log(forecastResponse, "forecast");
              dispatch(fetchForecastList(forecastResponse.data.list));
            } else {
              toast.current.show({
                severity: "error",
                summary: "Weather Search",
                detail: forecastResponse["response"]["data"]["message"],
                life: 3000,
              });
            }
          })
          .catch((error) => {
            toast.current.show({
              severity: "error",
              summary: "Weather Search",
              detail: error["response"]["data"]["message"],
              life: 3000,
            });
            setLoading(false);
            console.log(error);
          });
      });
  }, [dispatch, searchValue]);

  // CONVERT TIME TO USER TIMEZONE
  function convertTime(unixTime, offset) {
    return new Date((unixTime + offset) * 1000);
  }

  // FORMAT TIME
  function formatDaySysTime(date) {
    return format(convertTime(date, weatherInfo.timezone), "HH:mm aa");
  }

  function formatTimeDistanceNow(date) {
    return formatDistanceToNow(convertTime(date, weatherInfo.timezone), {
      includeSeconds: true,
      addSuffix: false,
    });
  }

  let SunriseSunsetInfo = weatherInfo ? (
    <section className="current-weather-summary">
      <div className="row">
        <div className="col-12">
          <div className="card card-custom weather-info-card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <span className="d-block mr-4">
                  <i className="fas fa-sun"></i>
                </span>
                <div>
                  <span className="info-name">Sunrise</span>
                  <h4 className="info-value">
                    {formatDaySysTime(weatherInfo.sys.sunrise)}
                  </h4>
                </div>
              </div>
              <span style={{ color: "#3896bd", fontWeight: 600 }}>
                {formatTimeDistanceNow(weatherInfo.sys.sunrise)}
              </span>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="card card-custom weather-info-card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <span className="d-block mr-4">
                  <i className="fas fa-moon"></i>
                </span>
                <div>
                  <span className="info-name">Sunset</span>
                  <h4 className="info-value">
                    {formatDaySysTime(weatherInfo.sys.sunset)}
                  </h4>
                </div>
              </div>
              <span style={{ color: "#3896bd", fontWeight: 600 }}>
                {formatTimeDistanceNow(weatherInfo.sys.sunset)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  ) : null;

  let CurrentWeatherInfo = weatherInfo ? (
    <div className="current-location-weather-info">
      <div className="card card-custom current-location-weather-card">
        <span className="cityName">
          <i className="flaticon2-location mr-1"></i> {weatherInfo.name}
        </span>
        <div className="card-body">
          <span className="d-block weather-icon">
            <img
              src={
                "https://openweathermap.org/img/w/" +
                weatherInfo.weather[0].icon +
                ".png"
              }
              alt=""
            />
          </span>
          <h5 className="mt-3 text-white">
            {format(new Date(), "eeee, MM MMMM")}
          </h5>
          <h1 className="display-3 mt-1 font-weight-bold text-white">
            {weatherInfo.main.feels_like} <span>&deg;</span>
          </h1>

          <div className="mt-4 sub-info">
            <div className="d-flex align-items-center justify-content-between text-white mb-3">
              <span className="d-block mr-2">
                <i className="fas fa-wind"></i>
              </span>
              <span className="d-block"> Wind</span>
              <span className="vertical-height"></span>
              <span className="d-block">{weatherInfo.wind.speed} m/s</span>
            </div>

            <div className="d-flex align-items-center justify-content-between text-white">
              <span className="d-block mr-2">
                <i className="flaticon2-drop"></i>
              </span>
              <span className="d-block"> Humidity</span>
              <span className="vertical-height"></span>
              <span className="d-block">{weatherInfo.main.humidity} %</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  function handleSearch(event) {
    if (searchValue) {
      searchValue.next(event.target.value);
    }
  }

  return (
    <div id="mySidenav" className="sidenav">
      <Toast ref={toast} />
      <div className="d-flex align-items-center justify-content-between">
        <div
          className={
            loading
              ? "input-icon spinner spinner-primary spinner-left"
              : "input-icon"
          }
        >
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            onChange={handleSearch}
          />
          {loading ? null : (
            <span>
              <i
                className="flaticon2-search-1 icon-md"
                style={{ fontSize: "23px" }}
              ></i>
            </span>
          )}
        </div>

        <div className="d-flex align-items-center">
          <span className="d-block mr-4">
            <i className="fas fa-bell" style={{ fontSize: "23px" }}></i>
          </span>
          <div className="symbol symbol-30 symbol-lg-40 symbol-circle mr-3">
            <img
              alt="Pic"
              src={require("../../assets/images/users/100_10.jpg")}
            />
          </div>
        </div>
      </div>

      <section className="sideInfo">
        {CurrentWeatherInfo}
        {SunriseSunsetInfo}
      </section>
    </div>
  );
}

export default Sidebar;
