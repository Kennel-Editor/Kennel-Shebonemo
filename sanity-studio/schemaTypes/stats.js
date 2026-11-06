import AdminLinkField from '../components/AdminLinkField.jsx'

export default {
  name: 'visitorStats',
  title: 'Besøkstall',
  type: 'document',
  fields: [
    {
      name: 'adminLink',
      title: 'Åpne besøksstatistikk',
      type: 'url',
      initialValue: 'https://shebonemo.no/admin',
      readOnly: true,
      components: {field: AdminLinkField},
      description: 'Klikk på lenken for å åpne kontrollpanelet med besøkstall.',
    },
  ],
  preview: {
    prepare() {
      return {title: 'Besøkstall', subtitle: 'Åpne kontrollpanelet'}
    },
  },
}
