import { Telegraf } from 'telegraf';
import { telegramConfig } from '../config/telegram.config';
import { message } from 'telegraf/filters';
import { subscriptionInterface } from '../types/notion.interface';
import { getNextSubscriptions, getTodaySubscriptions } from './notion.client';
import { generateMessage } from '../utils/generateMessage';

export const tgBot = new Telegraf(telegramConfig.botToken);

tgBot.command('today', async (ctx) => {
  console.log(`Get command 'today' from ${JSON.stringify(ctx.message.from)}`);

  const subscriptions: subscriptionInterface[] = await getTodaySubscriptions();

  if (!subscriptions.length) {
    await ctx.reply('Сегодня нет оплаты за подписки');
  } else {
    const message = generateMessage(subscriptions, true);

    await ctx.reply(message);
  }
});

tgBot.command('tomorrow', async (ctx) => {
  console.log(`Get command 'tomorrow' from ${JSON.stringify(ctx.message.from)}`);

  const subscriptions: subscriptionInterface[] = await getNextSubscriptions();

  if (!subscriptions.length) {
    await ctx.reply('Завтра нет оплаты за подписки');
  } else {
    const message = generateMessage(subscriptions);

    await ctx.reply(message);
  }
});

tgBot.on(message('text'), async (ctx) => {
  if (ctx.message.text.startsWith('/')) return;

  console.log(`Get message '${ctx.message.text}' from ${JSON.stringify(ctx.message.from)}`);

  const name = ctx.message?.from?.first_name || 'незнакомец';

  await ctx.reply(`Привет, ${name}! Я пока не умею отвечать на сообщения 😢`);
});

const sendMessage = async (chatId: number, messageText: string) => {
  await tgBot.telegram.sendMessage(chatId, messageText)
    .then(() => {
      console.log(`Message ${messageText} sent to chat ${chatId}`);
    })
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
};
