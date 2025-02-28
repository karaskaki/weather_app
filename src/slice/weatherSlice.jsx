import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const apiKey = "295e4c0fcef8f20695d991a5197a54d9";
const airQualityApiKey = "73b0804d-2c61-459f-866b-ae3b2e9c1877";

export const fetchWeatherData = createAsyncThunk(
  "weather/fetchWeather",
  async (city, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      );
      const data = await response.json();
      if (data.cod !== 200) throw new Error(data.message);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchWeatherByLocation = createAsyncThunk(
  "weather/fetchWeatherByLocation",
  async ({ latitude, longitude }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
      );
      const data = await response.json();
      if (data.cod !== 200) throw new Error(data.message);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAirPollutionData = createAsyncThunk(
  "weather/fetchAirPollutionData",
  async ({ latitude, longitude }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://api.airvisual.com/v2/nearest_city?lat=${latitude}&lon=${longitude}&key=${airQualityApiKey}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    city: "Delhi",
    input: "",
    weatherData: null,
    airPollutionData: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCity: (state, action) => {
      state.city = action.payload;
    },
    setInput: (state, action) => {
      state.input = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.loading = false;
        state.weatherData = action.payload;
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchWeatherByLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherByLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.weatherData = action.payload;
        state.city = action.payload.name;
      })
      .addCase(fetchWeatherByLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAirPollutionData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAirPollutionData.fulfilled, (state, action) => {
        state.loading = false;
        state.airPollutionData = action.payload;
      })
      .addCase(fetchAirPollutionData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCity, setInput } = weatherSlice.actions;
export default weatherSlice.reducer;
