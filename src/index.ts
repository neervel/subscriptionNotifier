import { subscriptionInterface } from './types/notion.interface';
import { getNextSubscriptions, notionClient, updateTodaySubscriptions } from './clients/notion.client';
import { generateMessage } from './utils/generateMessage';
import { sendMessageToAllChats } from './clients/telegram.client';
import cron from 'node-cron'
import { notionConfig } from './config/notion.config';

cron.schedule('* * * * *', async () => {
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

const subscriptions = await notionClient.databases.query({
  database_id: notionConfig.dbId,
  filter: {
    and: [
      {
        property: 'Дата',
        date: {
          after: '2025-04-01',
          before: '2025-04-21',
        },
      },
      {
        property: 'Категория',
        select: {
          equals: 'Подписки',
        },
      },
    ],
  },
})
  .then((res: any) => res.results.map((row: any) => {
    return {
      date: row.properties['Дата'].date.start,
      title: row.properties['Название'].title[0].text.content,
      owner: row.properties['Виновник'].select.name,
      price: row.properties['Стоимость'].number,
    }
  }))
  .catch((err: any) => {
    console.log('[getNextSubscriptions]', err);
    throw err;
  });

console.log(subscriptions);
