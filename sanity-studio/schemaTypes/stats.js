export default {
  name: 'pageStats',
  title: 'Page Stats',
  type: 'document',
  fields: [
    {name: 'page', type: 'string', title: 'Page slug'},
    {name: 'sessionsTotal', type: 'number', title: 'Sessions total'},
    {name: 'sessionsToday', type: 'number', title: 'Sessions today'},
    {name: 'sessionsTodayDate', type: 'string', title: 'Today (Oslo, YYYY-MM-DD)'},
    {name: 'uniquesTotal', type: 'number', title: 'Unique visitors (anonym)'},
    {
      name: 'uniqueHashes',
      type: 'array',
      title: 'Hashes (intern)',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    },
    {
      name: 'sessions',
      type: 'array',
      title: 'Active sessions (30min)',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'hash', type: 'string', title: 'hash'},
            {name: 'lastSeen', type: 'number', title: 'lastSeen (ms)'},
          ],
        },
      ],
    },
  ],
}
