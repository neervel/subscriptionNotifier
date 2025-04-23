import { tgBot } from './clients/telegram.client';

try {
  await tgBot.launch();
} catch (err: any) {
  log.info('Failed to launch telegram:', err.message);
}
