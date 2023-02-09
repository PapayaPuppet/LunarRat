import axios from 'axios'
import fs from 'fs'
import {RESTGetAPIGatewayResult} from 'discord-api-types/v10'
import { Server } from 'socket.io'
require('dotenv').config()

const baseURL: string = 'https://discord.com/api/v10'
const configRoute = './config.json'
const WSSURLKey: string = 'wssURL'

let WSSURL: string | null = null

//may be able to get rid of the file, as caching implies a new URL is required on app-restart
//'url/gateway/bot' should be considered only if the bot becomes rather large.
function setGatewayURLAsync(): Promise<void> {
    return new Promise((resolve, reject) => {
        axios
            .get<RESTGetAPIGatewayResult>(`${baseURL}/gateway`)
            .then(res => { 
                WSSURL = res.data.url

                //if it exists, read and modify, else create
                if (fs.existsSync(configRoute))
                {
                    const data = JSON.parse(fs.readFileSync(configRoute, 'utf8'))
                    data[WSSURLKey] = WSSURL
                    
                    fs.writeFileSync(configRoute, JSON.stringify(data))
                }
                else {
                    fs.writeFileSync(configRoute, `{ "${WSSURLKey}": "${WSSURL}"}`)
                }

                resolve() 
            })
            .catch(err => {/*log*/ reject() })
    })
}

export function getGatewayURLAsync(): Promise<string> {
    return new Promise((resolve, reject) => {
        //check if we already have it in memory
        if (WSSURL)
            resolve(WSSURL)

        //check if we have it stored
        const dataString: string = fs.readFileSync(configRoute, 'utf8')
        if (JSON.parse(dataString)[WSSURLKey])
            resolve(JSON.parse(dataString)[WSSURLKey])

        //else reach out to discord and try to set it.
        setGatewayURLAsync()
            .then(res => { 
                if (WSSURL)
                    resolve(WSSURL)

                reject()
             })
             .catch(err => { reject() })
    
      reject()
    })
}
