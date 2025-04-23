import { tgBot } from './clients/telegram.client';
import { log } from './utils/log';

try {
  await tgBot.launch();
} catch (err: any) {
  log.error(err, 'Failed to launch telegram');
}
