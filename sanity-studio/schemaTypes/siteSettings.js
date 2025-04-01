export default {
  name: 'siteSettings',
  title: 'Admin farger',
  type: 'document',
  fields: [
    {
      name: 'themeName',
      title: 'Navn på tema',
      type: 'string',
      validation: (Rule) => Rule.required().error('Tema må ha et navn'),
    },
    {
      name: 'isActive',
      title: 'Aktivt tema',
      type: 'boolean',
      initialValue: false,
      description:
        'Når du aktiverer dette temaet, deaktiveres eventuelle andre. Kun ett tema kan være aktivt om gangen.',
    },
    {
      name: 'headerImage',
      title: 'Headerbilde for tema',
      type: 'image',
      description: 'Vises øverst på siden. Hvis tomt, brukes standard bilde.',
      options: {hotspot: true},
    },
    {
      name: 'accentColor',
      title: 'Aksentfarge (f.eks. menyer og h1)',
      type: 'color',
      description:
        'Brukes for hamburger-meny, overskrifter (h1) og hover-effekter. Må ha god kontrast mot tekst og bakgrunn.',
      options: {disableAlpha: true},
    },
    {
      name: 'primaryColor',
      title: 'Primærfarge (h2 og undertekster)',
      type: 'color',
      description:
        'Brukes på h2 og annen viktig tekst. Skal være støttende, men synlig.',
      options: {disableAlpha: true},
    },
    {
      name: 'textColor',
      title: 'Tekstfarge',
      type: 'color',
      description:
        'Fargen for vanlig brødtekst. Bør være mørk for lesbarhet på lys bakgrunn.',
      options: {disableAlpha: true},
    },
    {
      name: 'secondaryColor',
      title: 'Sekundær farge',
      type: 'color',
      description:
        'Brukes på svakere text - burde være noe lik primary eller text, men svakere',
      options: {disableAlpha: true},
    },
    {
      name: 'titleColor',
      title: 'Farge for ekstra overskrifter',
      type: 'color',
      description: 'Kan brukes som sekundær overskriftstil.',
      options: {disableAlpha: true},
    },
    {
      name: 'backgroundColor',
      title: 'Bakgrunnsfarge',
      type: 'color',
      description:
        'Hovedbakgrunn for nettsiden. Bør være lys hvis tekst er mørk.',
      options: {disableAlpha: true},
    },
   
  ],

  preview: {
    select: {
      title: 'themeName',
      media: 'headerImage',
      active: 'isActive',
    },
    prepare({title, media, active}) {
      return {
        title: `${title}${active ? ' ✅' : ''}`,
        media,
      }
    },
  },
}
