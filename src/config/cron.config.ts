import ev from 'env-var';

export const cronConfig = {
  checkNextSubscriptions: ev.get('CRON_CHECK_NEXT_SUBSCRIPTIONS').default('0 12 * * *').asString(),
  updateSubscriptions: ev.get('CRON_UPDATE_SUBSCRIPTIONS').default('0 18 * * *').asString(),
}
