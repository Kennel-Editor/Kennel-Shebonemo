// pageStats - import to index to remove dev work
import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'pageStats',
  title: 'Page Stats',
  type: 'document',
  fields: [
    defineField({name: 'page', type: 'string', title: 'Page slug'}),

    defineField({name: 'sessionsTotal', type: 'number', title: 'Sessions total'}),
    defineField({name: 'sessionsToday', type: 'number', title: 'Sessions today'}),
    defineField({name: 'sessionsTodayDate', type: 'string', title: 'Today (Oslo, YYYY-MM-DD)'}),
    defineField({name: 'uniquesTotal', type: 'number', title: 'Unique visitors (anonym)'}),

    defineField({
      name: 'uniqueHashes',
      type: 'array',
      title: 'Hashes (intern)',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),

    defineField({
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
    }),

    defineField({
      name: 'days',
      title: 'Per day (raw)',
      type: 'object',
      fields: [
        {
          name: 'dummy',
          type: 'string',
          hidden: true,
        },
      ],
    }),
  ],

  preview: {
    select: {title: 'page', total: 'sessionsTotal'},
    prepare({title, total = 0}) {
      return {title: title || '(side)', subtitle: `Totalt på denne siden: ${total}`}
    },
  },
})
