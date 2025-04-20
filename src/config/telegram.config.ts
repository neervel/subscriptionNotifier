import ev from 'env-var';

export const telegramConfig = {
  botToken: ev.get('TG_BOT_API_TOKEN').required().asString(),
  chats: ev.get('TG_CHAT_IDS').required().asArray(),
}
