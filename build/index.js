"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const token = "5904011618:AAGMypN7UhMLcaU6s40ZxMMx9c-69c4sOrw";
const bot = new node_telegram_bot_api_1.default(token, { polling: true });
// Database: 
const DB = {};
//
bot.setMyCommands([
    { command: '/myprofile', description: 'Get all todos' },
]);
let PROMPT = null;
const FUNCIONALITY = {
    '/start': (message) => __awaiter(void 0, void 0, void 0, function* () {
        const username = message.chat.username;
        const chatId = message.chat.id;
        yield bot.sendMessage(chatId, `Hi ${username}! Welcome to awesome Todo app`);
    }),
    '/info': ({ chat }) => __awaiter(void 0, void 0, void 0, function* () {
        const todos = DB[chat.id].todos;
        const EMPTY_MESSAGE = 'Sorry, but you don\'t have any todos yet';
        if (!todos.length)
            return yield bot.sendMessage(chat.id, EMPTY_MESSAGE);
        let todosMessage = `----Todo List----\n`;
        for (let i = 0; i < todos.length; i++) {
            const todo = todos[i].state ? `~${todos[i].text}~` : todos[i].text;
            const state = todos[i].state ? '\u{2705}' : '';
            todosMessage += `${state} ${i + 1}: ${todo}\n`;
        }
        return yield bot.sendMessage(chat.id, todosMessage);
    }),
    '/new': ({ chat }) => __awaiter(void 0, void 0, void 0, function* () {
        PROMPT = yield bot.sendMessage(chat.id, 'Please enter your todo: ', { reply_markup: { force_reply: true } });
        bot.onReplyToMessage(chat.id, PROMPT.message_id, ({ text }) => __awaiter(void 0, void 0, void 0, function* () {
            if (!text)
                return;
            const id = Date.now();
            const todo = { id, text, state: false };
            DB[chat.id].todos.push(todo);
            return yield FUNCIONALITY['/info']({ chat });
        }));
    }),
    '/reset': ({ chat }) => __awaiter(void 0, void 0, void 0, function* () {
        DB[chat.id].todos = [];
        yield bot.sendMessage(chat.id, 'All todos were removed');
    })
};
bot.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
    const text = message.text;
    const chatId = message.chat.id;
    if (!text)
        return;
    if (!DB[chatId])
        DB[chatId] = { message, todos: [] };
    if (PROMPT)
        return PROMPT = null;
    if (FUNCIONALITY[text]) {
        return FUNCIONALITY[text](message);
    }
    else {
        return yield bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/f7e/fba/f7efbacf-9817-4b7e-8e07-dac0cf0430d1/192/21.webp');
    }
}));
