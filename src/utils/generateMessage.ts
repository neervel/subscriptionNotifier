import { subscriptionInterface } from '../types/notion.interface';
import { replaceThousands } from './replaceThousands';

const makePluralForm = (word: string, count: number, one: string, more: string): string => {
  return `${count} ${word}${count > 1 ? more : one}`
}

const countTotalAmount = (subscriptions: subscriptionInterface[]): string => {
  const total = subscriptions.reduce((amount, currentValue) => amount + currentValue.price, 0);
  return replaceThousands(total);
}

export const generateMessage = (subscriptions: subscriptionInterface[], today = false): string =>
  `${today ? 'Сегодня' : 'Завтра'} спишется ${countTotalAmount(subscriptions)} по ${
    makePluralForm('подписк', subscriptions.length, 'е', 'ам')
  }:\n
${subscriptions.map((sub: subscriptionInterface) =>
    ` • ${sub.title} (${sub.owner}) - ${replaceThousands(sub.price)}`
  ).join('\n')}`;
