import React, { useState } from 'react';
import axios from 'axios'
import {useSearchParams} from 'react-router-dom'

export default (): JSX.Element => {
    const [accessToken, setAccessToken] = useState<any>(null)
    const [user, setUser] = useState<any>(null)
    let [searchParams, setSearchParams] = useSearchParams();

    console.log(accessToken)

    function exchangeDiscordToken(token: string) {
        axios
            .get(`http://localhost:8080/api/authenticate?code=${token}`)
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

    return (
        <div>
            <button onClick={() => exchangeDiscordToken(searchParams.get('code') ?? '')}>
                Auth
            </button>
            {
                accessToken ?
                    <button onClick={() => getDiscordIdentity(accessToken.access_token)}>Get Identity</button>
                    : <p>No access_token exists</p>
            }
            <div>
                <DisplayIdentity user={user} />
            </div>
        </div>

    )
}

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