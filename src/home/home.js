import { Component } from "react";
import Clock from "react-live-clock";
import FiveDayForecast from "../components/five-day-forecast/five-day-forecast";
import { connect } from "react-redux";
import { format } from "date-fns";
import { fetchWeatherForecast } from "../hooks/weather/weather.service";
import { fetchForecastList } from "../hooks/weather/weatherSliceReducer";

import "./home.css";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      forecasts: [],
    };

    this.BASEKey = process.env.REACT_APP_API_KEY;
  }

  componentDidMount = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      if (position) {
        this.getFutureForecast(
          position.coords.latitude,
          position.coords.longitude
        );
      }
    });
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.weather.foreacastList !== this.props.weather.foreacastList) {
      if (this.props.weather.foreacastList.length) {
        this.setState({
          forecasts: this.props.weather["foreacastList"],
        });
        this.groupForecast();
      }
    }
  };

  groupForecast() {
    if (this.state.forecasts.length) {
      const filtered_list = this.state.forecasts.reduce(
        (acc, currentValue, index) => {
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
        },
        []
      );

      console.log(filtered_list);
    }
  }

  getFutureForecast(latitude, longitude) {
    fetchWeatherForecast(this.BASEKey, latitude, longitude)
      .then((response) => {
        if (response.status === 200) {
          this.props.fetchForecastList(response.data.list);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getGreeting = () => {
    let time = new Date().getHours();

    if ((time > 0 || time === 0) && time < 12) {
      return "Morning";
    } else if ((time > 12 || time === 12) && (time < 18 || time === 18)) {
      return "Afternoon";
    } else {
      return "Evening";
    }
  };

  render() {
    return (
      <div id="main">
        <div className="main-content-header">
          <div className="date-info">
            <h2 className="display-3">
              <Clock format={"HH:mm A"} ticking={true} timezone={"GMT+0"} />
            </h2>
            <span className="d-block font-weight-bold">
              {format(new Date(), "eeee, MM MMMM yyyy")}
            </span>
          </div>
        </div>

        <section className="greeting-section">
          <span className="d-block mr-2">
            {this.getGreeting() === "Evening" ? (
              <i className="fas fa-moon"></i>
            ) : (
              <i className="fas fa-sun"></i>
            )}
          </span>
          <h4>Good {this.getGreeting()}, Asif!</h4>
        </section>

        <FiveDayForecast></FiveDayForecast>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    weather: state.weather,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchForecastList: (forecast) => {
      dispatch(fetchForecastList(forecast));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
