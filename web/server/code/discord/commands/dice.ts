import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'

//arbitrary for now
const maxNumberOfDice = 50
const maxNumberOfSides = 1000000

enum DiceParseType {
    NumberOfDice = 0,
    NumberOfSides = 1,
    Modifier = 2,
    Reason = 3
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Rolls standard dice plus a modifier.')
        .addStringOption(option => 
            option
                .setName('input')
                .setDescription('Roll dice of form ([x]d[y] + [z] [message]).')
                .setRequired(true)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        const input = interaction.options.getString('input') || ""

        if (input === "")
            interaction.reply('Invalid syntax.')

        let numberOfDiceString = ""
        let numberOfSidesString = ""
        let modifierString = ""
        let reasonString = ""

        let whiteSpaceEncountered = false

//2d10+ 16 message
//2d20  + 17 !message
//2d20message - invalid?
//2d20 message - valid

//we could write a regex to check validity first and then remove invalid cases...

        let parseType = DiceParseType.NumberOfDice
        for (let char of input) {
            //process # of dice
            if (parseType == DiceParseType.NumberOfDice) {
                if (!Number.isNaN(parseInt(char))){
                    numberOfDiceString += char
                }
                else if (char === 'd') {
                    parseType = DiceParseType.NumberOfSides
                }
                else { //not 'd' and NaN
                    interaction.reply('Invalid syntax.')
                    return
                }
            }
            else if (parseType === DiceParseType.NumberOfSides) {
                if (!Number.isNaN(parseInt(char))) {
                    numberOfSidesString += char
                }
                else if (char === '+') {
                    parseType = DiceParseType.Modifier
                }
                else if (char === ' ') {
                    whiteSpaceEncountered = true
                } //NaN, not whitespace, and not '+'
                else {
                    if (!whiteSpaceEncountered) {
                        interaction.reply('Invalid syntax.') 
                        return
                    }
                    //jump ahead, no modifier assumed to be provided
                    parseType = DiceParseType.Reason
                }
            }
            else if (parseType === DiceParseType.Modifier) {
                if (!Number.isNaN(parseInt(char))) {
                    modifierString += char
                }
                else if (modifierString !== '' && char === ' ') {
                    parseType = DiceParseType.Reason
                }
                else {
                    interaction.reply('Invalid syntax')
                    return
                }
            }
            else if (parseType === DiceParseType.Reason) {
                reasonString += char
            }
        }

        console.log('Num dice - ', numberOfDiceString)
        console.log('Sides on die - ', numberOfSidesString)
        console.log('Modifier - ', modifierString)
        console.log(reasonString)

        const numberOfDice = numberOfDiceString === '' ? 1 : parseInt(numberOfDiceString)
        const modifier = modifierString === '' ? 0 : parseInt(modifierString)
        const numberOfSides = parseInt(numberOfSidesString)

        if (numberOfDice > maxNumberOfDice) {
            interaction.reply(`Please roll less fewer than ${maxNumberOfDice} dice.`)
            return
        }
        if (numberOfSides > maxNumberOfSides) {
            interaction.reply(`Please roll die with fewer than ${maxNumberOfSides} sides.`)
            return
        }

        const standardDiceRollForm = `${numberOfDice}d${numberOfSides}${modifier !== 0 ? ` + ${modifier}` : ''}`
        
        let total = 0
        let rollsString = '['
        for (let index = 1; index <= numberOfDice; index++) {
            const rollResult = Math.floor(Math.random() * (numberOfSides - 1) + 1)
            total += rollResult
            rollsString += rollsString === '[' ? rollResult : `, ${rollResult}`
        }
        rollsString += ']'
        
        let formattedReply = `<@${interaction.user.id}> rolled ${standardDiceRollForm}\nRoll: \`${rollsString}\`\nResult: \`${total + modifier}\``
        if (reasonString.trim() !== '')
            formattedReply += `\nReason: \`${reasonString}\``

        console.log(formattedReply)
        interaction.reply(formattedReply)
    } 
}

//using delimiters is great and all but I can feel a loop may be better rather than constant iterations and messy long declarations
/*
        const diceDelimiterIndex = input.indexOf('d')
        const modifierDelimiterIndex = input.indexOf('+')

        //mandatory, first delimiter must come before second if second exists
        if (diceDelimiterIndex == -1 || (modifierDelimiterIndex !== -1 && modifierDelimiterIndex < diceDelimiterIndex))
            interaction.reply('Invalid syntax.')

        const numberOfDice = parseInt( input.substring(0, diceDelimiterIndex).trim() )
        const numberOfSidesStr = parseInt( input.substring(diceDelimiterIndex + 1, modifierDelimiterIndex === -1 ? input.length : modifierDelimiterIndex).trim() )
        const modifierStr = modifierDelimiterIndex !== -1 ? parseInt( input.substring(modifierDelimiterIndex + 1).trim() ) : 0

        if (numberOfDice )

        let index = 0
        for (index; index <= numberOfDice; index++)*/