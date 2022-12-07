import TelegramBot from "node-telegram-bot-api"

export interface Database {
    [key: number]: Data
}

export interface Data {
    message: TelegramBot.Message
    todos: Todo[]
}

export interface Todo {
    id: number
    text: string
    state: boolean
}