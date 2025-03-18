export default {
  name: 'gallery',
  title: 'Galleri',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Tittel',
      type: 'string',
      description: 'Gi galleriet en tittel. Dette vil vises på forsiden.',
      validation: (Rule) => Rule.required().max(100),
    },
    {
      name: 'mainImage',
      title: 'Hovedbilde',
      type: 'image',
      description: 'Velg et hovedbilde for galleriet. Dette vises i oversikten.',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'mainImageCaption',
      title: 'Bildetekst for hovedbilde',
      type: 'string',
      description: 'Legg til en bildetekst for hovedbildet (valgfritt).',
      validation: (Rule) => Rule.max(200),
    },
    {
      name: 'images',
      title: 'Bilder',
      type: 'array',
      description:
        'Legg til bilder i galleriet. Du kan også legge til en beskrivelse for hvert bilde.',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {
              name: 'caption',
              title: 'Bildetekst',
              type: 'string',
              description:
                'Legg til en kort bildetekst (valgfritt). Dette kan for eksempel være en beskrivelse av bildet.',
              options: {isHighlighted: true},
            },
          ],
        },
      ],
      validation: (Rule) => Rule.max(20), // Begrensning på 20 bilder per galleri
    },
    {
      name: 'createdAt',
      title: 'Opprettet',
      type: 'datetime',
      description: 'Dato og tid for når galleriet ble opprettet.',
      initialValue: () => new Date().toISOString(),
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
    },
    prepare({title, media}) {
      return {
        title,
        media,
      }
    },
  },
}
