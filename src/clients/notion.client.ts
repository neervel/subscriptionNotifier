import { Client } from '@notionhq/client';
import { notionConfig } from '../config/notion.config';
import { NOTION_DB_ID } from '../constants';
import dayjs from 'dayjs';
import { subscriptionInterface } from '../types/notion.interface';

const notionClient = new Client({
  auth: notionConfig.authToken,
});

const getSubscriptionsByDay = async (day: string): Promise<subscriptionInterface[]> => {
  const subscriptions = await notionClient.databases.query({
    database_id: NOTION_DB_ID,
    filter: {
      and: [
        {
          property: 'Date',
          date: {
            equals: day,
          },
        },
        {
          property: 'Tags',
          select: {
            equals: 'Подписки',
          },
        },
      ],
    },
  })
    .then((res) => res.results.map((row: any) => {
      console.log(row)
        return {
          date: row.properties.Date.date.start,
          description: row.properties['Описание'].rich_text[0]?.text.content || '',
          title: row.properties.Name.title[0].text.content,
          owner: row.properties['Виновник'].select.name,
          price: row.properties.price.number,
        }
      }))
    .catch((err) => {
      console.log('[getNextSubscriptions]', err);
      throw err;
    });

  return subscriptions || [];
};

const updateSubscriptionDate = async (subscription: subscriptionInterface): Promise<void> => {
  await notionClient.pages.create({
    parent: {
      database_id: NOTION_DB_ID,
    },
    properties: {
      title: {
        title: [{
          text: {
            content: subscription.title,
          },
        }],
      },
      'Описание': {
        rich_text: [{
          text: {
            content: subscription.description,
          },
        }],
      },
      Date: {
        date: {
          start: dayjs(subscription.date).add(1, 'month').format('YYYY-MM-DD'),
        },
      },
      'Виновник': {
        select: {
          name: subscription.owner,
        },
      },
      price: {
        number: subscription.price,
      },
      Tags: {
        select: {
          name: 'Подписки'
        }
      }
    }
  })
};

export const getTodaySubscriptions = async () => {
  const today = dayjs().format('YYYY-MM-DD');
  return getSubscriptionsByDay(today);
};

export const getNextSubscriptions = async () => {
  const nextDay = dayjs().add(1, 'day').format('YYYY-MM-DD');
  return getSubscriptionsByDay(nextDay);
};

export const updateTodaySubscriptions = async () => {
  const subscriptions = await getTodaySubscriptions();

  await Promise.all([
    subscriptions.map(async (subscription) => updateSubscriptionDate(subscription)),
  ]);
};
