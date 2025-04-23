import { subscriptionInterface } from './types/notion.interface';
import { getNextSubscriptions, updateSubscriptions } from './clients/notion.client';
import { generateMessage } from './utils/generateMessage';
import { sendMessageToAllChats } from './clients/telegram.client';
import cron from 'node-cron'
import { notionConfig } from './config/notion.config';
import { cronConfig } from './config/cron.config';
import { log } from './utils/log';

cron.schedule(cronConfig.checkNextSubscriptions, async () => {
  log.info('Start checking next subscriptions job...');

  try {
    const subscriptions: subscriptionInterface[] = await getNextSubscriptions();
    if (!subscriptions.length) {
      return;
    }

    const message = generateMessage(subscriptions);
    await sendMessageToAllChats('👋 ' + message);
  } catch (err: any) {
    log.error(err, 'Error occurred while trying to get next subscriptions');
  }
});

cron.schedule(cronConfig.updateSubscriptions, async () => {
  log.info('Start updating subscriptions...');

  try {
    if (notionConfig.updateSubscriptions) {
      await updateSubscriptions();
    } else {
      log.warn('Updating disabled');
    }
  } catch (err: any) {
    log.error(err, 'Error occurred while trying to get next subscriptions');
  }
});
