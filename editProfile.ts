import TelegramBot from "node-telegram-bot-api"
import { DB } from "./database"
import { User } from "./types"

class EditProfile {
    bot: TelegramBot
    chatId: number
    user: User

    constructor(bot: TelegramBot, chatId: number) {
        this.bot = bot
        this.chatId = chatId

        if (!DB[this.chatId]) DB[this.chatId] = {chatId}
        this.user = DB[this.chatId]
    }

    async setAge() {
        const prompt = await this.bot.sendMessage(this.chatId, 'What is your age?')

        this.bot.onReplyToMessage(this.chatId, prompt.message_id, (text) => {
            this.user.age = Number(text)
        })
    }
}