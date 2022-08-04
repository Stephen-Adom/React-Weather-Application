import { createSlice } from "@reduxjs/toolkit";

export const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    weatherInfo: null,
    foreacastList: [],
  },
  reducers: {
    fetchWeather: (state, action) => {
      state.weatherInfo = action.payload;
    },

    fetchForecastList: (state, action) => {
      state.foreacastList = action.payload;
    },
  },
});

export const { fetchWeather, fetchForecastList } = weatherSlice.actions;
export default weatherSlice.reducer;
