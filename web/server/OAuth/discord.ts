import axios from 'axios'
import {stringify} from "querystring";
import {APIUser, RESTPostOAuth2AccessTokenResult} from "discord-api-types/v10";
import {Request, Response} from "express";
import {verifyKey} from "discord-interactions";

//needs to handle expired tokens, possible discord server errors, etc
//we need to be able to have a user re-authenticate with discord
export function getDiscordAccessToken(
    code: string,
    config: any,
    callback?: ((tokenResult: RESTPostOAuth2AccessTokenResult) => void) | undefined
): Promise<void> {
    return new Promise((resolve, reject) => {

        const axiosHeader = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }

        axios
            .post('https://discord.com/api/oauth2/token', stringify(config),{
                headers: axiosHeader
            })
            .then(discordRes => {
                if (callback)
                    callback(discordRes.data)

                resolve(discordRes.data)
            })
            .catch(err => {
                console.error(err.response.data)
                reject(err.response.data)
            })
    })
}

function setDiscordToken() {
    return new Promise((resolve, reject) => {
        const insertFormat: string = ''



    })
}

export function getDiscordUser(accessToken: string): Promise<APIUser> {
    return new Promise((resolve, reject) => {
        axios
            .get('https://discord.com/api/users/@me', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            .then(discordRes => {
                resolve(discordRes.data)
            })
            .catch(err => {
                reject(err.response.data)
            })

    })
}

export function VerifyDiscordRequest(clientKey: string):
    (req: Request, res: Response, buf: Buffer, encoding: string) => void
{
    return (req: Request, res: Response, buf: Buffer, encoding: string) => {
        const signature: string = req.get('X-Signature-Ed25519') || ''
        const timestamp: string = req.get('X-Signature-Timestamp') || ''

        const isValidRequest = verifyKey(buf, signature, timestamp, clientKey)
        if (!isValidRequest)
        {
            res.status(401).send('Bad Request Signature')
            throw new Error('Bad Request Signature')
        }
    }
}