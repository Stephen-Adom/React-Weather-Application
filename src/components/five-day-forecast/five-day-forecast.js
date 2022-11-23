import "./forecast.css";
import { Skeleton } from "primereact/skeleton";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import ForecastChart from "../forecastChart";
import { format } from "date-fns";

function FiveDayForecast() {
  // let dispatch = useDispatch();
  const [filteredForecast, setFilteredForecast] = useState([]);
  let forecast = useSelector((state) => state.weather.foreacastList);

  useEffect(() => {
    if (forecast.length) {
      buildForecast(forecast);
    }

    function buildForecast(forecast) {
      const filtered = forecast.reduce((acc, currentValue, index) => {
        if (index === 0) {
          acc.push(currentValue);
        }

        if (acc.length) {
          if (
            format(new Date(acc[acc.length - 1].dt_txt), "dd") !==
            format(new Date(currentValue.dt_txt), "dd")
          ) {
            console.log("not equal");
            acc.push(currentValue);
          }
        }

        return acc;
      }, []);

      setFilteredForecast(filtered);
    }
  }, [forecast]);

  function formatDate(date) {
    return format(new Date(date), "eee");
  }

  let forecastHtml = filteredForecast.length ? (
    filteredForecast.map((filtered) => {
      return (
        <div className="col" key={filtered.dt}>
          <div className="card card-custom day-forecast-card">
            <div className="card-body">
              <span className="d-block">
                <img
                  src={
                    "https://openweathermap.org/img/w/" +
                    filtered.weather[0].icon +
                    ".png"
                  }
                  width="100%"
                  alt=""
                />
              </span>
              <h6>{formatDate(filtered.dt_txt)}</h6>
              <span className="d-block">
                {filtered.main.feels_like} <span>&deg;</span>{" "}
              </span>
            </div>
          </div>
        </div>
      );
    })
  ) : (
    <div className="row">
      <div className="col">
        <Skeleton width="100%" height="16rem" borderRadius="16px"></Skeleton>
      </div>
      <div className="col">
        <Skeleton width="100%" height="16rem" borderRadius="16px"></Skeleton>
      </div>
      <div className="col">
        <Skeleton width="100%" height="16rem" borderRadius="16px"></Skeleton>
      </div>
      <div className="col">
        <Skeleton width="100%" height="16rem" borderRadius="16px"></Skeleton>
      </div>
      <div className="col">
        <Skeleton width="100%" height="16rem" borderRadius="16px"></Skeleton>
      </div>
    </div>
  );

  return (
    <section className="five-day-forecast">
      <div className="row">{forecastHtml}</div>

      <ForecastChart filteredForecast={filteredForecast}></ForecastChart>
    </section>
  );
}

export default FiveDayForecast;
