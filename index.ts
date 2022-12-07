import TelegramBot from "node-telegram-bot-api"
import { Database } from "./types"

const token = "5904011618:AAGMypN7UhMLcaU6s40ZxMMx9c-69c4sOrw"

const bot = new TelegramBot(token, { polling: true })

// Database: 
const DB: any = {}
//

bot.setMyCommands([
    { command: '/myprofile', description: 'Get all todos' },
])

let PROMPT: TelegramBot.Message | null = null

const FUNCIONALITY: {[key: string]: Function} = {
    '/start': async (message: TelegramBot.Message) => {
        const username = message.chat.username
        const chatId = message.chat.id
        await bot.sendMessage(chatId, `Hi ${username}! Welcome to awesome Todo app`)
    },
    '/info': async ({chat}: TelegramBot.Message) => {
        const todos = DB[chat.id].todos
        const EMPTY_MESSAGE = 'Sorry, but you don\'t have any todos yet'
        if (!todos.length) return await bot.sendMessage(chat.id, EMPTY_MESSAGE)

        let todosMessage = `----Todo List----\n`

        for (let i = 0; i < todos.length; i++) {
            const todo = todos[i].state ? `~${todos[i].text}~` : todos[i].text
            const state = todos[i].state ? '\u{2705}' : ''
            todosMessage += `${state} ${i + 1}: ${todo}\n`
        }
        return await bot.sendMessage(chat.id, todosMessage)
    },
    '/new': async ({chat}: TelegramBot.Message) => {
        PROMPT = await bot.sendMessage(chat.id, 'Please enter your todo: ', {reply_markup: { force_reply: true }})

        bot.onReplyToMessage(chat.id, PROMPT.message_id, async ({text}) => {
            if (!text) return
            const id = Date.now()
            const todo = {id, text, state: false}
            DB[chat.id].todos.push(todo)

            return await FUNCIONALITY['/info']({chat})
        })
    },
    '/reset': async ({chat}: TelegramBot.Message) => {
        DB[chat.id].todos = []
        await bot.sendMessage(chat.id, 'All todos were removed')
    }
}

bot.on('message', async (message) => {
    const text = message.text
    const chatId = message.chat.id

    if (!text) return
    if (!DB[chatId]) DB[chatId] = {message, todos: []}
    if (PROMPT) return PROMPT = null

    if (FUNCIONALITY[text]) {
        return FUNCIONALITY[text](message)
    } else {
        return await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/f7e/fba/f7efbacf-9817-4b7e-8e07-dac0cf0430d1/192/21.webp')
    }
})

