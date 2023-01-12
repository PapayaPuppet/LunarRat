import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import {InteractionType} from 'discord-interactions'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Year of the Rat.
        </p>
          <button onClick={() => axios.post('/api/test', {
              type: InteractionType.PING,
              test: 'fuck'
          })
              .then(res => console.debug(res))}
          >Test Ping Discord Bot</button>
      </header>
    </div>
  );
}

export default App;
