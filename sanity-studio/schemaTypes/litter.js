export default {
  name: 'litter',
  title: 'Kull',
  type: 'document',
  fields: [
    {
      name: 'mother',
      title: 'Mor',
      type: 'object',
      fields: [
        {
          name: 'isOwned',
          title: 'Er mor vår hund?',
          type: 'boolean',
          initialValue: true,
          description: 'Hvis nei, fyll inn informasjon manuelt.',
        },
        {
          name: 'dogReference',
          title: 'Velg vår hund (hvis ja)',
          type: 'reference',
          to: [{type: 'dog'}],
          hidden: ({parent}) => parent?.isOwned === false,
          resolve: async (reference) => {
            if (reference) {
              const dog = await reference.get()
              return {
                name: dog?.name || '',
                nickname: dog?.nickname || '',
                image: dog?.image || null,
                healthResults: dog?.healthResults || [],
                additionalInfo: dog?.additionalInfo || '',
                overrideImageButton:
                  typeof litter?.overrideImageButton === 'boolean'
                    ? dog.overrideImageButton
                    : false,
                overrideImage: litter?.overrideImage || null,
              }
            }
            return {}
          },
        },
        {
          name: 'title',
          title: 'Tittel',
          type: 'string',
          hidden: ({parent}) => parent?.isOwned === true,
          description: 'Hundens offesielle titler',
        },
        {
          name: 'name',
          title: 'Navn',
          type: 'string',
          hidden: ({parent}) => parent?.isOwned === true,
        },
        {
          name: 'nickname',
          title: 'Kallenavn',
          type: 'string',
          hidden: ({parent}) => parent?.isOwned === true,
        },
        {
          name: 'registrationNumber',
          title: 'Registration Number',
          type: 'string',
        },
        {
          name: 'overrideInfo',
          title: 'Skriv inn egen info?',
          type: 'boolean',
          hidden: ({parent}) => parent?.isOwned === false,
        },
        {
          name: 'overrideImageButton',
          title: 'Bruk et annet bilde?',
          type: 'boolean',
          description: 'Mor burde se til høyere.',
          hidden: ({parent}) => parent?.isOwned === false,
        },
        {
          name: 'overrideImage',
          title: 'Bruk et annet bilde',
          type: 'image',
          options: {hotspot: true},
          description: 'Velg et bilde for å overstyre referansebildet.',
          hidden: ({parent}) => !parent?.overrideImageButton,
        },
        {
          name: 'image',
          title: 'Bilde',
          type: 'image',
          options: {hotspot: true},
          description: 'Mor burde se til høyere.',
          hidden: ({parent}) => parent?.isOwned === true && parent?.overrideImageButton !== true,
        },

        {
          name: 'healthResults',
          title: 'Helse Resultater',
          type: 'array',
          description: 'Resultater for helserelaterte tester, som AD, HD etc.',
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
          name: 'additionalInfo',
          title: 'Tilleggsinformasjon',
          type: 'text',
          description: 'Ekstra informasjon som ikke faller under helseresultatene.',
        },
      ],
    },
    {
      name: 'father',
      title: 'Far',
      type: 'object',
      fields: [
        {
          name: 'isOwned',
          title: 'Er far vår hund?',
          type: 'boolean',
          initialValue: true,
          description: 'Hvis nei, fyll inn informasjon manuelt.',
        },
        {
          name: 'dogReference',
          title: 'Velg vår hund (hvis ja)',
          type: 'reference',
          to: [{type: 'dog'}],
          hidden: ({parent}) => parent?.isOwned === false,
          resolve: async (reference) => {
            if (reference) {
              const dog = await reference.get()
              return {
                name: dog?.name || '',
                nickname: dog?.nickname || '',
                image: dog?.image || null,
                healthResults: dog?.healthResults || [],
                additionalInfo: dog?.additionalInfo || '',
                overrideImageButton:
                  typeof litter?.overrideImageButton === 'boolean'
                    ? dog.overrideImageButton
                    : false,
                overrideImage: litter?.overrideImage || null,
              }
            }
            return {}
          },
        },
        {
          name: 'title',
          title: 'Tittel',
          type: 'string',
          hidden: ({parent}) => parent?.isOwned === true,
          description: 'Hundens offesielle titler',
        },
        {
          name: 'name',
          title: 'Navn',
          type: 'string',
          hidden: ({parent}) => parent?.isOwned === true,
        },
        {
          name: 'nickname',
          title: 'Kallenavn',
          type: 'string',
          hidden: ({parent}) => parent?.isOwned === true,
        },
        {
          name: 'registrationNumber',
          title: 'Registration Number',
          type: 'string',
        },
        {
          name: 'overrideInfo',
          title: 'Skriv inn egen info?',
          type: 'boolean',
          hidden: ({parent}) => parent?.isOwned === false,
        },

        {
          name: 'overrideImageButton',
          title: 'Bruk et annet bilde?',
          type: 'boolean',
          description: 'Far burde se til høyere.',
          hidden: ({parent}) => parent?.isOwned === false,
        },
        {
          name: 'overrideImage',
          title: 'Bruk et annet bilde',
          type: 'image',
          options: {hotspot: true},
          description: 'Velg et bilde for å overstyre referansebildet.',
          hidden: ({parent}) => parent?.isOwned === false || parent?.overrideImageButton !== true,
        },
        {
          name: 'image',
          title: 'Bilde',
          type: 'image',
          options: {hotspot: true},
          description: 'Far burde se til høyere.',
          hidden: ({parent}) => parent?.isOwned === true && parent?.overrideImageButton !== true,
        },

        {
          name: 'healthResults',
          title: 'Helse Resultater',
          type: 'array',
          description: 'Resultater for helserelaterte tester, som AD, HD etc.',
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
          name: 'additionalInfo',
          title: 'Tilleggsinformasjon',
          type: 'text',
          description: 'Ekstra informasjon som ikke faller under helseresultatene.',
        },
      ],
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
      name: 'expectedDateOfBirth',
      title: 'Forventet fødselsdato',
      type: 'date',
      options: {
        dateFormat: 'DD.MM.YYYY',
        calendarTodayLabel: 'Forventet dato',
      },
      description: 'Velg forventet dato for fødsel.',
    },
    {
      name: 'puppyDetails',
      title: 'Detaljer om valper',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'gender',
              title: 'Kjønn',
              type: 'string',
              options: {
                list: [
                  {title: 'Hann', value: 'male'},
                  {title: 'Tispe', value: 'female'},
                ],
                validation: (Rule) => Rule.required().error('Kjønn må velges for hver valp'),
              },
            },
            {
              name: 'color',
              title: 'Farge',
              type: 'string',
              options: {
                list: [
                  {title: 'Hvit', value: 'white'},
                  {title: 'Grå', value: 'gray'},
                  {title: 'Sort', value: 'black'},
                  {title: 'Brun', value: 'brown'},
                  {title: 'Aprikos', value: 'apricot'},
                  {title: 'Rød', value: 'red'},
                  {title: 'Brun', value: 'brown'},
                ],
                validation: (Rule) => Rule.required().error('Farge må velges for hver valp'),
              },
            },
            {
              name: 'count',
              title: 'Antall',
              type: 'number',
              description: 'Antall valper av denne typen.',
              validation: (Rule) =>
                Rule.min(1).integer().error('Antall må være et positivt heltall'),
            },
          ],
        },
      ],
    },

    {
      name: 'freeText1',
      title: 'ValpeInfo tekst',
      type: 'text',
    },

    {
      name: 'mainImage',
      title: 'Hovedbilde',
      type: 'image',
      options: {
        hotspot: true,
      },
    },

    {
      name: 'galleries',
      title: 'Gallerier',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Tittel for Galleri',
              type: 'string',
              description:
                'Gi galleriet en passende tittel, f.eks. "Uke 1, uke2 osv (maks 10 gallerier)".',
            },
            {
              name: 'images',
              title: 'Bilder',
              type: 'array',
              of: [{type: 'image', options: {hotspot: true}}],
              validation: (Rule) => Rule.max(8).warning('Maks 8 bilder per galleri'),
              description: 'Legg til bilder fra valpens utvikling. Maks 8 bilder pr galleri',
            },
            {
              name: 'description',
              title: 'Tekst under Galleri',
              type: 'text',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.max(10).warning('Maks 10 gallerier'),
    },

    {
      name: 'freeText2',
      title: 'Fritekst 2',
      type: 'text',
    },
  ],
  preview: {
    select: {
      title: 'dateOfBirth',
      subtitle: 'mother.nickname',
      father: 'father.nickname',
      media: 'mainImage',
    },
    prepare(selection) {
      const {title, subtitle, father, media} = selection
      const formattedDateOfBirth = title
        ? new Date(title).toLocaleDateString('no-NO')
        : 'Ingen dato oppgitt'

      return {
        title: formattedDateOfBirth,
        subtitle: `${subtitle || 'Ingen mor oppgitt'} |  ${father || 'Ingen far oppgitt'}`,
        media: media || 'no-image-icon',
      }
    },
  },
}
