import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const WEATHER_API_KEY = "6edca1d1f70215d0ec7bada0040985f3";
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather?";

async function getWeatherData(location = "Seattle,US") {
  const response = await fetch(
    WEATHER_API_URL + `q=${location}&appid=${WEATHER_API_KEY}`,
    { mode: "cors" }
  );

  return await response.json();
}

// convert kelvin to fahrenheit since weather API returns kelvin
// °F =(K - 273.15)* 1.8000 + 32.00
const kelvinToFahrenheit = kelvin => {
  return (kelvin - 273.15) * 1.8 + 32.0;
};

//========================================
//             UI Components            ==
//========================================

function WeatherPane(props) {
  const weatherIconSrc = `http://openweathermap.org/img/wn/${props.weatherIcon}@2x.png`;
  return (
    <div id="currentWeather">
      <h1>Current weather for {props.location}:</h1>
      <h2>The current temperature is: {props.temperature}°F</h2>
      <h2>It is currently {props.weather}</h2>
      <img src={weatherIconSrc} alt="icon for current weather conditions"></img>
    </div>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: "Seattle,US",
      formData: { location: "Seattle,US" }
    };

    getWeatherData(this.state.location).then(result => {
      this.setState({
        temperature: kelvinToFahrenheit(result.main.temp).toFixed(1),
        weather: result.weather[0].description,
        weatherIcon: result.weather[0].icon
      });
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState(
      { location: this.state.formData.location },

      function() {
        getWeatherData(this.state.location).then(result => {
          this.setState({
            temperature: kelvinToFahrenheit(result.main.temp).toFixed(1),
            weather: result.weather[0].description,
            weatherIcon: result.weather[0].icon
          });
        });
      }
    );
  }

  handleChange(e) {
    this.setState({ formData: { location: e.target.value } });
  }

  render() {
    return (
      <div id="weatherMain">
        <WeatherPane
          location={this.state.location}
          temperature={this.state.temperature}
          weather={this.state.weather}
          weatherIcon={this.state.weatherIcon}
        />
        <div id="locationForm">
          <form onSubmit={e => this.handleSubmit(e)}>
            <label>
              Location:
              <input
                type="text"
                name="location"
                value={this.state.formData.location}
                onChange={e => this.handleChange(e)}
              />
            </label>
            <input type="submit" value="Submit" />
          </form>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
