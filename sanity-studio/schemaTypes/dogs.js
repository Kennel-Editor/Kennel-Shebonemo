export default {
  name: 'dog',
  title: 'Hunder',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'nickname',
      title: 'Nickname',
      type: 'string',
    },
    {
      name: 'breed',
      title: 'Breed',
      type: 'string',
    },
    {
      name: 'color',
      title: 'Color',
      type: 'string',
    },
    {
      name: 'gender',
      title: 'Gender',
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
      title: 'Dog Type',
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
      title: 'Date of Birth',
      type: 'date',
      options: {
        dateFormat: 'DD.MM.YYYY',
      },
      description: 'Velg dato for fødsel.',
    },

    {
      name: 'dateOfDeath',
      title: 'Date of Death',
      type: 'date',
      options: {
        dateFormat: 'DD.MM.YYYY',
      },
      hidden: ({document}) => document?.dogType !== 'deceased',
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'registrationNumber',
      title: 'Registration Number',
      type: 'string',
    },
    {
      name: 'healthResults',
      title: 'Helse Resultater',
      type: 'array',
      description: 'titel = AD, HD etc. Resultater = 0, A osv ',
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
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'pedigree',
      title: 'Pedigree',
      type: 'image',
      description: 'Pedigree-bilde av hunden (stamtavle).',
    },
    {
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      validation: (Rule) => Rule.max(5).warning('Maks 5 bilder i galleriet'),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'breedingNotes',
      title: 'kull informasjon',
      type: 'text',
      options: {},
      description: 'informasjon om tidligere valpekull',
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
