import AdminLinkField from '../components/AdminLinkField.jsx'
import GlobalTotalField from '../components/GlobalTotalField.jsx'

export default {
  name: 'visitorStats',
  title: 'besøkstall',
  type: 'document',
  fields: [
    {
      name: 'adminLink',
      title: 'Admin panel (besøksteller)',
      type: 'url',
      initialValue: 'https://shebonemo.no/admin',
      components: {field: AdminLinkField},
    },
    {
      name: 'globalTotalVisits',
      title: 'Besøk totalt (hele nettsiden)',
      type: 'string',

      components: {field: GlobalTotalField},
      description: 'Summeres fra alle pageStats-dokumenter',
    },
  ],
  preview: {
    select: {adminLink: 'adminLink'},
    prepare({adminLink}) {
      return {title: 'Besøkstall', subtitle: adminLink || 'Ikke satt'}
    },
  },
}
