import logger from 'pino';

export const log = logger({
  transport: {
    target: 'pino-pretty'
  }
});
