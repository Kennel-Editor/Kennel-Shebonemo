export default {
  name: 'siteInfo',
  title: 'Sideinformasjon',
  type: 'document',
  fields: [
    {
      name: 'pageTitle',
      title: 'tittel for nettsiden',
      type: 'string',
      description: 'Navnet på nettsiden',
    },
    {
      name: 'headerImage',
      title: 'hoved bilde for nettsiden',
      type: 'image',
      description: 'bildet som vises på toppen av nettsiden.',
    },
    {
      name: 'introText',
      title: 'Introduksjonstekst',
      type: 'text',
      description: 'Kort introduksjon til startsiden.',
    },
    {
      name: 'introImage',
      title: 'Introduksjonsbilde',
      description: 'introduksjons bilde til startsiden.',
      type: 'image',
      options: {hotspot: true},
    },
    {
      name: 'aboutTitle1',
      title: 'Om oss - Tittel 1',
      type: 'string',
      description: 'Overskrift for første del av Om oss.',
    },
    {
      name: 'aboutText1',
      title: 'Om oss - Tekst 1',
      type: 'text',
      description: 'Første avsnitt av Om oss-seksjonen.',
    },
    {
      name: 'aboutTitle2',
      title: 'Om oss - Tittel 2',
      type: 'string',
      description: 'Overskrift for andre del av Om oss.',
    },
    {
      name: 'aboutText2',
      title: 'Om oss - Tekst 2',
      type: 'text',
      description: 'Andre avsnitt av Om oss-seksjonen.',
    },
    {
      name: 'aboutTitle3',
      title: 'Om oss - Tittel 3',
      type: 'string',
      description: 'Overskrift for tredje del av Om oss.',
    },
    {
      name: 'aboutText3',
      title: 'Om oss - Tekst 3',
      type: 'text',
      description: 'Tredje avsnitt av Om oss-seksjonen.',
    },
    {
      name: 'aboutImage',
      title: 'Om oss - Bilde',
      type: 'image',
      description: 'Bilde relatert til Om oss-seksjonen.',
      options: {hotspot: true},
    },
    {
      name: 'name',
      title: 'Navn',
      type: 'string',
      description: 'Firmaets eller personens Navn.',
    },
    {
      name: 'address',
      title: 'Adresse',
      type: 'string',
      description: 'Firmaets eller personens adresse.',
    },
    {
      name: 'phoneNumber',
      title: 'Telefonnummer',
      type: 'string',
      description: 'Kontakttelefonnummer.',
    },
    {
      name: 'email',
      title: 'E-post',
      type: 'string',
      description: 'E-postadresse for kontakt.',
      validation: (Rule) => Rule.email().warning('Skriv inn en gyldig e-post.'),
    },
    {
      name: 'contactImage',
      title: 'Bilde under kontakt informasjon',
      type: 'image',
      description: 'Bilde under kontakt informasjon.',
      options: {hotspot: true},
    },
    {
      name: 'extraInfo',
      title: 'Ekstra kontaktinformasjon',
      type: 'text',
      description: 'Ekstra informasjon som sosiale medier eller åpningstider.',
    },
  ],

  preview: {
    select: {
      title: 'name',
      media: 'headerImage',
    },
    prepare(selection) {
      const {title, media} = selection
      return {
        title: title || 'Ingen kennelnavn definert',
        media: media,
      }
    },
  },
}
