import React from 'react';
import logo from './logo.svg';
import './App.css';
import Prompt from '../src/components/Prompt/prompt'
import CurrentLocation from '../src/components/CurrentLocation/currentLocation'
import Weather from '../src/components/Weather/weather'

function App() {
  return (
    <div className="App">
      <Weather />
    </div>
  );
}

export default App;
