import ev from 'env-var';

export const notionConfig = {
  authToken: ev.get('NOTION_API_TOKEN').required().asString(),
}
