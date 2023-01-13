import { verifyKey} from "discord-interactions"
import {Request, Response} from "express"

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