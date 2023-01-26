import React, { useState, useEffect } from 'react';
import axios from 'axios'
import {redirect, useSearchParams} from 'react-router-dom'
import Cookies from "universal-cookie";
import {DiscordToken} from "@shared/discord";

export default (): JSX.Element => {
    let [params, _] = useSearchParams()
    const [user, setUser] = useState(null)
    const [authIsLoading, setAuthIsLoading] = useState<boolean>(false)
    const [identityIsLoading, setIdentityIsLoading] = useState<boolean>(false)

    function handleUserAuthenticated(token: any) {
        //todo: handle if user already exists
        const cookies = new Cookies()

        if (!cookies.get(DiscordToken.Identity))
            cookies.set(DiscordToken.Identity, token.access_token)
        console.log('redirecting')
        redirect('/')
    }

    useEffect(() => {
        setAuthIsLoading(true)
        axios
            .get(`http://localhost:8080/api/auth/discord?code=${params.get('code')}`)
            .then(res => {
                //bad for now
                handleUserAuthenticated(res.data)
                setIdentityIsLoading(true)
                //return axios.get(`http://localhost:8080/api/identity/discord?accessToken=${res.data.access_token}`)
            })
            //.then(res => setUser(res.data))
            .catch(err => console.debug(err))
            .finally(() => {
                setAuthIsLoading(false)
                setIdentityIsLoading(false)
            })
    }, [])

    return (
        <div>
            <Loading isLoading={authIsLoading} message='Authenticating...' />
            <Loading isLoading={identityIsLoading} message='Fetching identity...' />
            <DisplayIdentity user={user} />
        </div>

    )
}

interface LoadingProps {
    isLoading: boolean
    message: string
}

const Loading = ({isLoading, message}: LoadingProps): JSX.Element => {
    if (!isLoading)
        return <></>

    return (
        <p>{message}</p>
    )
}

/*
function exchangeDiscordToken(token: string) {
        axios
            .get(`http://localhost:8080/api/identity?code=${token}`)
            .then(res => {
                setAccessToken(res.data)
            })
            .catch(err => console.debug(err))
    }

    function getDiscordIdentity(access_token: string) {
        axios
            .get(`http://localhost:8080/api/identity?access_token=${access_token}`)
            .then(res => {
                setUser(res.data)

            })
            .catch(err => console.debug(err))
    }
 */

const DisplayIdentity = ({user}: any) => {
    console.log(user)
    if (user == null)
        return <></>

    return (
        <>
            <p>Username: {user.username}</p>
            <p>DiscordId: {user.id}</p>
        </>
    )
}