import { subscriptionInterface } from './types/notion.interface';
import {
  getNextSubscriptions,
  updateTodaySubscriptions,
} from './clients/notion.client';
import { generateMessage } from './utils/generateMessage';
import { sendMessageToAllChats } from './clients/telegram.client';


try {
  const subscriptions: subscriptionInterface[] = await getNextSubscriptions();
  const message = generateMessage(subscriptions);

  if (message) {
    await sendMessageToAllChats(message);
  }

  await updateTodaySubscriptions();
} catch (err: any) {
  console.log('Error occurred while trying to get next subscriptions:', err.message);
}
