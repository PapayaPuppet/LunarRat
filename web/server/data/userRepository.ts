import prisma from './prisma'
import {User,} from "@prisma/client";
import {APIUser, RESTPostOAuth2AccessTokenResult} from "discord-api-types/v10";

export default class UserRepository {

    static get = {
        byDiscordId: (discordId: string): Promise<User | null> => {
            return new Promise((resolve, reject) => {
                prisma.user.findFirst({
                    where: { DiscordId: discordId }
                })
                .then(user => {  resolve(user) })
                .catch(err => { reject(err) })
            })
        },

        byDiscordToken: (accessToken: string): Promise<User | null> => {
            return new Promise((resolve, reject) => {
                prisma.user.findFirst({
                    where: {
                        DiscordToken: {
                            some: { AccessToken: accessToken as string }
                        }
                    }
                })
                .then(user => { resolve(user) })
                .catch(err => { reject(err) })
            })
        }
    }

    static create = (user: APIUser, token: RESTPostOAuth2AccessTokenResult): Promise<void> => {
        return new Promise((resolve, reject) => {
            let now: Date = new Date()
            let expiration: Date = new Date()
            expiration.setSeconds(now.getSeconds() + token.expires_in)

            prisma.user.create({
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
            .then(res => { 
                resolve()
            })
            .catch(err => {
                reject(err)
            })
        })
    }
}