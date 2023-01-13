import express, {Express, Request, Response} from 'express'
import axios from 'axios'
import {InteractionResponseType, InteractionType} from "discord-interactions"
import path from "path"
import cors from 'cors'
import {VerifyDiscordRequest} from "./utils"
import {handleUserCommand} from "./commands"
require('dotenv').config()

const queryString = require('querystring')
const app: Express = express()
const router = express.Router()

const PORT = process.env.PORT || 8080

//app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY || '')}))
//required to fetch static build files
app.use(express.static(path.resolve(__dirname, 'client/build')))
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

app.get('/api/authenticate', (req: Request, res: Response) => {
    const userOAuth2Code = req.query.code;
    res.setHeader('Access-Control-Allow-Origin', '*')

    const axiosData = queryString.stringify({
        'client_id': process.env.CLIENT_ID,
        'client_secret': process.env.DISCORD_SECRET_TOKEN,
        'grant_type': 'authorization_code',
        'code': userOAuth2Code,
        'redirect_uri': 'http://localhost:3000/enlist'
    })

    console.log(axiosData)

    const axiosHeader = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    axios
        .post('https://discord.com/api/oauth2/token', axiosData,{
            headers: axiosHeader
        })
        .then(discordRes => {
            console.log(discordRes.data)
           res.json(discordRes.data)
        })
        .catch(err => {
            res.status(401)
            res.send(err.response.data)
        })


})

app.get('/api/identity', (req: Request, res: Response) => {
    axios
        .get('https://discord.com/api/users/@me', {
        headers: {
            Authorization: `Bearer ${req.query.access_token}`
        }
        })
        .then(discordRes => {
            res.json(discordRes.data)
        })
        .catch(err => {
            res.status(401)
            res.send(err.response.data)
        })
})

/*
app.get('*', (req: Request, res: Response) => {
    res.set('Content-Type', 'text/html')
    return res.sendFile(path.resolve(__dirname, '../../client/build', 'index.html'))
})*/

app.listen(PORT, () => {
    console.log('Listening on port', PORT)

})

