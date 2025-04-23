import { tgBot } from './clients/telegram.client';
import { log } from './utils/log';

try {
  await tgBot.launch();
} catch (err: any) {
  log.info('Failed to launch telegram:', err.message);
}
