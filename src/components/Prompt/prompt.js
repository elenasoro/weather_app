import React from 'react';

class Prompt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.isDisplayed,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState){
    if (prevState.visible !== nextProps.isDisplayed) {
      return {
        visible: nextProps.isDisplayed
      }
   } 
   return null
  }

  handleClick = (e) => {
    this.props.updateService(e.target.innerHTML)
  }

  returnPrompt = () => {
    if(this.state.visible && !localStorage.getItem('service')) {
      return (
        <div className='service_prompt'>
          <p>Please select weather service: </p>
          <button disabled={!localStorage.getItem('latitude')} onClick={this.handleClick}>OpenUV</button>
          <button disabled={!localStorage.getItem('latitude')} onClick={this.handleClick}>WeatherBIT</button>
        </div>
      )
    }
  }

  render() {
    return (
      <React.Fragment>
      {this.returnPrompt()}
      </React.Fragment>
    ) 
  }
} 

export default Prompt;