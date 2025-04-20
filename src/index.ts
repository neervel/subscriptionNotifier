import { subscriptionInterface } from './types/notion.interface';
import { getNextSubscriptions, updateTodaySubscriptions } from './clients/notion.client';
import { generateMessage } from './utils/generateMessage';
import { sendMessageToAllChats } from './clients/telegram.client';
import cron from 'node-cron'
import { notionConfig } from './config/notion.config';

cron.schedule('0 12 * * *', async () => {
  console.log('Start cron job...');

  try {
    const subscriptions: subscriptionInterface[] = await getNextSubscriptions();
    if (!subscriptions.length) {
      return;
    }

    const message = generateMessage(subscriptions);
    await sendMessageToAllChats('👋 ' + message);

    if (notionConfig.updateSubscriptions) {
      await updateTodaySubscriptions();
    }
  } catch (err: any) {
    console.log('Error occurred while trying to get next subscriptions:', err.message);
  }
});
