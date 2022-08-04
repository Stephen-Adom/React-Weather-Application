import { configureStore } from "@reduxjs/toolkit";
import WeatherReducer from "./weather/weatherSliceReducer";

export default configureStore({
  reducer: {
    weather: WeatherReducer,
  },
});
