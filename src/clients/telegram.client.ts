import { Telegraf } from 'telegraf';
import { telegramConfig } from '../config/telegram.config';
import { message } from 'telegraf/filters';

export const tgBot = new Telegraf(telegramConfig.botToken);

tgBot.on(message('text'), async (ctx) => {
  const name = ctx.message?.from?.first_name || 'незнакомец';

  await ctx.reply(`Привет, ${name}! Я пока не умею отвечать на сообщения 😢`);
});

const sendMessage = async (chatId: number, messageText: string) => {
  await tgBot.telegram.sendMessage(chatId, messageText)
    .catch((err: any) => {
      console.log(err, 'Error while sending message');
    });
}

export const sendMessageToAllChats = async (messageText: string) => {
  const chatIds = telegramConfig.chats.map(chat => +chat);
  const chatsCount = chatIds.length;

  await Promise.all(
    chatIds.map(async (chatId: number) => {
      await sendMessage(chatId, messageText);
    }),
  ).then(() => {
    console.log(`${chatsCount} message${chatsCount > 1 ? 's': ''} sent`);
  });
}
