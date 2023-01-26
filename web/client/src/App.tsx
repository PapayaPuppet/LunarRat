import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import {InteractionType} from 'discord-interactions'
import {useLoaderData} from "react-router-dom";


//user visits app, app tries to find a token from cookie
//need to redirect user as soon as discord initial token is used

function App() {
  const discordExchangeCode = useLoaderData()

  return (
      <div className="App">
          <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <p></p>
              <p>
                  Year of the Rat.
              </p>
              <button onClick={() => axios.post('/api/test', {
                      type: InteractionType.PING,
                      test: 'fuck'
                  })
                  .then(res => console.debug(res))}
              >Test Ping Discord Bot</button>
              <a href={'https://discord.com/api/oauth2/authorize?client_id=994345551258730617&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fenlist&response_type=code&scope=identify'}>
                  Authenticate with discord
              </a>
        </header>
      </div>
  );
}

export default App;
