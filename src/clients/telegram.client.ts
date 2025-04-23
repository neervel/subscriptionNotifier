import { Telegraf } from 'telegraf';
import { telegramConfig } from '../config/telegram.config';
import { message } from 'telegraf/filters';
import { subscriptionInterface } from '../types/notion.interface';
import { getNextSubscriptions, getTodaySubscriptions } from './notion.client';
import { generateMessage } from '../utils/generateMessage';
import { log } from '../utils/log';

export const tgBot = new Telegraf(telegramConfig.botToken);

tgBot.command('today', async (ctx) => {
  log.info(`Get command 'today' from ${JSON.stringify(ctx.message.from)}`);

  const subscriptions: subscriptionInterface[] = await getTodaySubscriptions();

  if (!subscriptions.length) {
    await ctx.reply('Сегодня нет оплаты за подписки');
  } else {
    const message = generateMessage(subscriptions, true);

    await ctx.reply(message);
  }
});

tgBot.command('tomorrow', async (ctx) => {
  log.info(`Get command 'tomorrow' from ${JSON.stringify(ctx.message.from)}`);

  const subscriptions: subscriptionInterface[] = await getNextSubscriptions();

  if (!subscriptions.length) {
    await ctx.reply('Завтра нет оплат за подписки :)');
  } else {
    const message = generateMessage(subscriptions);

    await ctx.reply(message);
  }
});

tgBot.on(message('text'), async (ctx) => {
  if (ctx.message.text.startsWith('/')) return;

  log.info(`Get message ${JSON.stringify(ctx.message)} from ${JSON.stringify(ctx.message.from)}`);

  const name = ctx.message?.from?.first_name || 'незнакомец';

  await ctx.reply(`Привет, ${name}! Я пока не умею отвечать на сообщения 😢`);
});

const sendMessage = async (chatId: number, messageText: string) => {
  await tgBot.telegram.sendMessage(chatId, messageText)
    .then(() => {
      log.info(`Message ${messageText} sent to chat ${chatId}`);
    })
    .catch((err: any) => {
      log.error(err, 'Error while sending message');
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
    log.info(`${chatsCount} message${chatsCount > 1 ? 's': ''} sent`);
  });
};
