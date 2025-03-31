export default {
  name: 'dog',
  title: 'Hunder',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Navn',
      type: 'string',
    },
    {
      name: 'nickname',
      title: 'Kallenavn',
      type: 'string',
    },
    {
      name: 'breed',
      title: 'Rase',
      type: 'string',
    },
    {
      name: 'color',
      title: 'Farge',
      type: 'string',
    },
    {
      name: 'gender',
      title: 'Kjønn',
      type: 'string',
      options: {
        list: [
          {title: 'Hann', value: 'male'},
          {title: 'Tispe', value: 'female'},
        ],
      },
    },
    {
      name: 'dogType',
      title: 'Hunde type',
      type: 'string',
      options: {
        list: [
          {title: 'Nåværende hund', value: 'current'},
          {title: 'Avlshund', value: 'breeding'},
          {title: 'Tidligere hund', value: 'deceased'},
        ],
      },
    },
    {
      name: 'dateOfBirth',
      title: 'Fødselsdato',
      type: 'date',
      options: {
        dateFormat: 'DD.MM.YYYY',
      },
      description: 'Velg dato for fødsel.',
    },

    {
      name: 'dateOfDeath',
      title: 'Døds dato',
      type: 'date',
      options: {
        dateFormat: 'DD.MM.YYYY',
      },
      hidden: ({document}) => document?.dogType !== 'deceased',
    },
    {
      name: 'title',
      title: 'Titler',
      type: 'string',
    },
    {
      name: 'registrationNumber',
      title: 'Registrerings Nummer',
      type: 'string',
    },
    {
      name: 'healthResults',
      title: 'Helse Resultater og info',
      type: 'array',
      description: 'titel = AD, HD, Høyde etc. Resultater = 0, A, 69cm osv ',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Tittel',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Resultater',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      name: 'image',
      title: 'Bilde av hund',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'pedigree',
      title: 'Stamtavle',
      type: 'image',
      description: 'Pedigree-bilde av hunden (stamtavle).',
    },
    {
      name: 'gallery',
      title: 'Galleri bilder',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      validation: (Rule) => Rule.max(5).warning('Maks 5 bilder i galleriet'),
    },
    {
      name: 'description',
      title: 'Beskrivelse av hund (ekstra)',
      type: 'text',
    },
    {
      name: 'breedingNotes',
      title: 'kull informasjon',
      type: 'text',
      options: {},
      description: 'informasjon om tidligere valpekull - Hentes automatisk om hunden er registrert på valpekull',
    },

    {
      name: 'breedingDogsInfo',
      title: 'Avlshund informasjon',
      type: 'text',
      description: 'informasjon om avlshund - havner i en text boks',
      options: {},
      hidden: ({document}) => document?.dogType !== 'breeding',
    },
  ],

  preview: {
    select: {
      title: 'nickname',
      subtitle: 'breed',
      media: 'image',
    },
    prepare({title, subtitle, media}) {
      return {
        title: title || 'Uten navn',
        subtitle: subtitle || 'Ingen rase spesifisert',
        media: media || undefined,
      }
    },
  },
}
