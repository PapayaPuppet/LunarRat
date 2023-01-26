import express, {Express, Request, Response} from 'express'
import axios from 'axios'
import {InteractionResponseType, InteractionType} from "discord-interactions"
import path from "path"
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import {handleUserCommand} from "./commands"
import {getDiscordAccessToken, getDiscordUser} from "./OAuth/discord";
import {APIUser, RESTPostOAuth2AccessTokenResult, RESTPostOAuth2AccessTokenURLEncodedData} from "discord-api-types/v10";
import {randomUUID} from "crypto";
require('dotenv').config()

const queryString = require('querystring')
const app: Express = express()
const router = express.Router()

const PORT = process.env.PORT || 8080

//app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY || '')}))
//required to fetch static build files
app.use(express.static(path.resolve(__dirname, 'client/build')))
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: false
}))

app.post('api/interactions'), async function (req: Request, res: Response) {
    const { type, id, data }: { type: InteractionType, id: string, data: any } = req.body

    if (type === InteractionType.PING)
        return res.send({ type: InteractionResponseType.PONG })

    if (type === InteractionType.APPLICATION_COMMAND)
        handleUserCommand(data.name)
}

app.post('api/test'), async function (req: Request, res: Response) {
    console.log(req.body)
    return res
}

const authenticateCorsOptions = {
    origin: 'http://localhost:3000',
}


app.get('/api/auth/discord', (req: Request, res: Response) => {
    const userOAuth2Code = req.query.code;
    res.setHeader('Access-Control-Allow-Origin', '*')

    const axiosData: RESTPostOAuth2AccessTokenURLEncodedData = {
        'client_id': process.env.CLIENT_ID as string,
        'client_secret': process.env.DISCORD_SECRET_TOKEN as string,
        'grant_type': 'authorization_code',
        'code': userOAuth2Code as string,
        'redirect_uri': 'http://localhost:3000/enlist'
    }

    console.log(axiosData)

    getDiscordAccessToken(userOAuth2Code as string, axiosData)
        .then(data => {
            res.status(200)
            res.json(data)
        })
        .catch(err => {
            res.status(401)
            res.json(err)
        })
})

app.get('/api/identity/discord', (req: Request, res: Response) => {
    const identityAccessToken = req.query.accessToken;
    res.setHeader('Access-Control-Allow-Origin', '*')

    axios
        .get('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${identityAccessToken}`
            }
        })
        .then(discordRes => {
            res.status(200)
            res.json(discordRes.data)
        })
        .catch(err => {
            res.status(401)
            res.json(err.response.data)
        })
})

app.post('/api/identity', async (req: Request, res: Response) => {
    const token: RESTPostOAuth2AccessTokenResult = req.body;
    res.setHeader('Access-Control-Allow-Origin', '*')

    console.log(token)
    const prisma = new PrismaClient()

    let user: APIUser | void = await axios
        .get<APIUser>('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${token.access_token}`
            }
        })
        .then(discordRes => {
            return discordRes.data
        })
        .catch(err => {
            res.status(401)
            res.json(err.response.data)
        })

    if (user) {
        user = user as APIUser

        let userGuid: string = randomUUID()
        let now: Date = new Date()
        let expiration: Date = new Date()
        expiration.setSeconds(now.getSeconds() + token.expires_in)


        await prisma.user.create({
            data: {
                Name: user.username,
                DiscordId: user.id,
                Locale: user.locale as string,
                DiscordToken: {
                    create: {
                        AccessToken: token.access_token,
                        RefreshToken: token.refresh_token,
                        Scope: token.scope,
                        TokenType: 0,
                        GeneratedAt: now,
                        ExpiresAt: expiration
                    }
                }
            }
        })
    }
    else {
        res.status(500)
        res.json('Unknown error.')
    }

    res.status(201)
})

app.get('/api/identity', async (req: Request, res: Response) => {
    const accessToken: string = req.query.accessToken as string;
    res.setHeader('Access-Control-Allow-Origin', '*')

    //first try from database
    const prisma = new PrismaClient()

    const user = await prisma.user.findFirst({
        where: {
            DiscordToken: {
                some: {
                    AccessToken: accessToken as string
                }
            }
        }
    })

    console.log('user', user)

    if (!user) {
        res.status(404)
        res.json({
            create: true
        })
    }

    res.status(200)
    res.json(user)
})

app.listen(PORT, () => {
    console.log('Listening on port', PORT)

})

