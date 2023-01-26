import {createBrowserRouter, redirect} from "react-router-dom";
import React from "react";
import Cookies from 'universal-cookie'

import App from "../App";
import Authentication from "../Authentication";
import { DiscordToken} from "@shared/discord";

export default createBrowserRouter([
    {
        path: '/',
        loader: () => {
            const cookies = new Cookies()
            const discordAuthToken = cookies.get(DiscordToken.Identity)

            cookies.set('testCookie', 'Test Cookie Value')

            console.log(discordAuthToken)
            console.log(cookies.get('testCookie'))

            if (!discordAuthToken)
                return redirect('https://discord.com/api/oauth2/authorize?client_id=994345551258730617&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fenlist&response_type=code&scope=identify')

            return discordAuthToken
        },
        element: <App />
    },
    {
        path: '/enlist',
        element: <Authentication />
    }
])