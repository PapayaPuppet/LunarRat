import express, {Express, Request, Response} from 'express'
import {InteractionResponseType, InteractionType} from "discord-interactions"
import path from "path"
import {VerifyDiscordRequest} from "./utils"
import {handleUserCommand} from "./commands"

const app: Express = express()

const PORT = process.env.PORT || 3001

app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY || '')}))
//required to fetch static build files
app.use(express.static(path.resolve(__dirname, '../../client/build')))

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

app.get('*', (req: Request, res: Response) => {
    res.set('Content-Type', 'text/html')
    return res.sendFile(path.resolve(__dirname, '../../client/build', 'index.html'))
})

app.listen(PORT, () => {
    console.log('Listening on port', PORT)

})

