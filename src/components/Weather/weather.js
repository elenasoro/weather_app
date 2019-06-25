import React from 'react';
import Prompt from '../Prompt/prompt'
import CurrentLocation from '../CurrentLocation/currentLocation'

const OPEN_UV_KEY = '8d5b1d5245f078eb7e220c75ed55a251';
const WEATHER_BIT_KEY = 'dcdde3415e7344b895838afe36f8e198';

class Weather extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
      selectDisplayed: true,
      selectedService: null,
      UV: ''
    };
  }

  componentDidMount(){
    if(localStorage.getItem('saveTime')){
      this.checkExpiration()
    }
  }

  componentDidUpdate(){
    if(!this.state.UV){
      this.requestWeather()
    }
  }

  returnWeather = () => {
    const UV = localStorage.getItem('UV')
    if (UV) {
      return (
        <div>
          <p className="uv_index_paragraph">UV index is: <span className="uv_index">{UV}</span></p>
        </div>
      )
    }
  }

  updateLocation = (latitude, longitude) => {
    const now = new Date();
    this.setState({ 
      latitude,
      longitude,
      selectDisplayed: true,
     });
    localStorage.setItem('latitude', this.state.latitude);
    localStorage.setItem('longitude', this.state.longitude);
    localStorage.setItem('saveTime', now.getTime());
  }

  updateService = service => {
    this.setState({
      selectedService: service,
      selectDisplayed: false
    })
    localStorage.setItem('service', service)
  }

  requestWeather = () => {
    if(this.state.selectedService) {
      if(this.state.selectedService === 'WeatherBIT'){
        if(this.state.latitude){
          fetch(`https://api.weatherbit.io/v2.0/current?&lat=${this.state.latitude}&lon=${this.state.longitude}&key=${WEATHER_BIT_KEY}`)
            .then(function(response) {
              return response.json();
            })
            .then(json => {
              localStorage.setItem('UV', json.data[0].uv)
              this.setState({
                UV: json.data[0].uv
              })
            })     
        } else if (localStorage.getItem('latitude')) {
          fetch(`https://api.weatherbit.io/v2.0/current?&lat=${localStorage.getItem('latitude')}&lon=${localStorage.getItem('longitude')}&key=${WEATHER_BIT_KEY}`)
            .then(function(response) {
              return response.json();
            })
            .then(json => {
              localStorage.setItem('UV', json.data[0].uv)
              this.setState({
                UV: json.data[0].uv
              })
            })  
        }
      } else {
        if(this.state.latitude){
          fetch(`https://api.openuv.io/api/v1/uv?lat=${this.state.latitude}&lng=${this.state.longitude}`, {
            headers: {
              'x-access-token': OPEN_UV_KEY
            }
          })
          .then(function(response) {
            return response.json();
          })
          .then(json => {
            localStorage.setItem('UV', json.result.uv)
            this.setState({
              UV: json.result.uv
            })
          })
        } else if (localStorage.getItem('latitude')) {
          fetch(`https://api.openuv.io/api/v1/uv?lat=${localStorage.getItem('latitude')}&lng=${localStorage.getItem('longitude')}`, {
            headers: {
              'x-access-token': OPEN_UV_KEY
            }
          })
          .then(function(response) {
            return response.json();
          })
          .then(json => {
            localStorage.setItem('UV', json.result.uv)
            this.setState({
              UV: json.result.uv
            })
          })
        }   
      }
    }
  }

  checkExpiration = () => {
    const currentTime = new Date();
    const timeWhenStorageWasSaved = localStorage.getItem('saveTime');

    if(((currentTime.getTime() - timeWhenStorageWasSaved)/1000/60) >= 120){ // clear local storage after 2 hours
      localStorage.clear()
      this.setState({
        latitude: null,
        longitude: null,
        selectDisplayed: true,
        selectedService: null,
        UV: ''
      })
    } 
  }

  render() {
    return (
      <React.Fragment>
        <h1>Hi! Welcome to this smart app that will define UV index in your current position</h1>
        <CurrentLocation 
        latitude={this.state.latitude}
        longitude={this.state.longitude}
        updateLocation={this.updateLocation}/>
        <Prompt 
        updateService={this.updateService}
        isDisplayed={this.state.selectDisplayed}/>
        {this.returnWeather()}
      </React.Fragment>
    ) 
  }
} 

export default Weather;