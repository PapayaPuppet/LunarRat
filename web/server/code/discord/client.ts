import path from 'path'
import fs from 'fs'
import {Client, GatewayIntentBits, Collection, Events, CommandInteraction} from 'discord.js'


interface DiscordClient extends Client {
    commands?: Collection<string, any>
}

const client: DiscordClient = new Client({ intents: [GatewayIntentBits.Guilds] })
client.commands = new Collection()

const commandsDirectoryPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsDirectoryPath).filter(file => file.endsWith('.ts'))

for (const file of commandFiles) {
    const filePath = path.join(commandsDirectoryPath, file)
    const command = require(filePath)

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command)
    }
    else {
        console.warn(`[WARN] The command at ${filePath} is missing required property 'data' and/or 'execute'.`)
    }
}


client.on(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user?.tag || '[Unknown User]'}.`)
})

client.on(Events.InteractionCreate, async interaction => {
    const interactionClient = interaction.client as DiscordClient

    if (!interaction.isChatInputCommand()) return

    if (interaction.commandName === 'ping')
        await interaction.reply('Pong!')

    if (interactionClient.commands) {
        const command = interactionClient.commands.get(interaction.commandName)

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`)
            return
        }

        try {
            await command.execute(interaction)
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
})

export default client