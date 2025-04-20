import ev from 'env-var';

export const notionConfig = {
  authToken: ev.get('NOTION_API_TOKEN').required().asString(),
  dbId: ev.get('NOTION_DB_ID').required().asString(),
  updateSubscriptions: ev.get('UPDATE_SUBSCRIPTIONS').default('false').asBool(),
}
