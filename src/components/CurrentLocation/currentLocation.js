import React from 'react';
const API_KEY = 'AIzaSyC4m5FfMQFFqm_WYCUEL7VOy9CpP_qj2pY';


class CurrentLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
      city: null,
      error: ''
    };
  }

  componentDidMount(){
    if(!localStorage.getItem('latitude'))
    this.findCoordinates()
  }

  static getDerivedStateFromProps(nextProps, prevState){
    if (prevState.latitude !== nextProps.latitude) {
      return {
        latitude: null,
      }
   } 
   return null
  }
  
  componentDidUpdate(){
    if(!localStorage.getItem('latitude')){
      this.findCoordinates()
    }
    if(!localStorage.getItem('city') && !this.state.error && localStorage.getItem('latitude')){
      this.findCity()
    }
  }

  findCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({ 
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
         });
        this.props.updateLocation(position.coords.latitude, position.coords.longitude)
      }
    )
  }

  findCity = () => {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.state.latitude},${this.state.longitude}&key=${API_KEY}`)
      .then(function(response) {
        return response.json();
     })
      .then(json => {
        if(json.error_message){
          this.setState({
            error: json.error_message
          })
        } else {
          this.setState({
            city: json.results[0].address_components[3].short_name
          })
          localStorage.setItem('city', json.results[0].address_components[3].short_name)
        }
      })
  }

  returnLocation = () => {
    const latitude = localStorage.getItem('latitude')
    const longitude = localStorage.getItem('longitude')
    const city = localStorage.getItem('city')

    if(this.props.latitude || localStorage.getItem('latitude')) {
      return (
        <div>
          <p>You current position is: {latitude ? latitude : this.props.latitude} {longitude ? longitude: this.props.longitude}</p>
          {city ? <p className="city_paragraph">City: <span className="city">{city}</span></p> : null}
        </div>
      )
    } else {
      return <p>Loading...</p>
    }
  }

  render() {
    return (
      <React.Fragment>
      {this.returnLocation()}
      </React.Fragment>
    ) 
  }
} 

export default CurrentLocation;