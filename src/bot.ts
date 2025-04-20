import { tgBot } from './clients/telegram.client';

try {
  await tgBot.launch();
} catch (err: any) {
  console.log('Failed to launch telegram:', err.message);
}
