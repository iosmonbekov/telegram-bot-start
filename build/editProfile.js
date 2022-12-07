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
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
class EditProfile {
    constructor(bot, chatId) {
        this.bot = bot;
        this.chatId = chatId;
        if (!database_1.DB[this.chatId])
            database_1.DB[this.chatId] = { chatId };
        this.user = database_1.DB[this.chatId];
    }
    setAge() {
        return __awaiter(this, void 0, void 0, function* () {
            const prompt = yield this.bot.sendMessage(this.chatId, 'What is your age?');
            this.bot.onReplyToMessage(this.chatId, prompt.message_id, (text) => {
                this.user.age = Number(text);
            });
        });
    }
}
