import { sendMessageToAllChats, tgBot } from './clients/telegram.client';
import { getSubscriptionsByDay } from './clients/notion.client';
import { subscriptionInterface } from './types/notion.interface';
import { generateMessage } from './utils/generateMessage';

try {
  await tgBot.launch();
} catch (err: any) {
  console.log('Failed to launch telegram:', err.message);
}

process.once('SIGINT', () => tgBot.stop('SIGINT'));
process.once('SIGTERM', () => tgBot.stop('SIGTERM'));
