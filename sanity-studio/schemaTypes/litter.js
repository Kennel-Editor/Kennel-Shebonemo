import ParentImageInput from '../components/ParentImageInput'

const legacyInfoField = {
  name: 'info',
  title: 'Tidligere registrerte opplysninger',
  type: 'text',
  readOnly: true,
  hidden: ({value}) => !value,
  description:
    'Bevart tekst fra eldre kull. Kontroller at alle detaljer, inkludert datoer, er tatt vare på før eventuell senere opprydding. Nye opplysninger registreres i feltene over.',
}

export default {
  name: 'litter',
  title: 'Kull',
  type: 'document',
  fields: [
    {
      name: 'mother',
      title: 'Mor',
      type: 'object',
      components: {input: ParentImageInput},
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
          hidden: ({parent}) => parent?.isOwned === true,
        },

        {
          name: 'imageSelectionVersion',
          type: 'number',
          hidden: true,
        },
        {
          name: 'overrideImageButton',
          title: 'Bruk eget bilde for dette kullet',
          type: 'boolean',
          description: 'Standardbildet hentes fra valgt hund. Mor skal se mot høyre. Eldre bildevalg beholdes til du endrer denne bryteren.',
          hidden: ({parent}) => !parent?.dogReference?._ref && !parent?.overrideImage?.asset,
        },
        {
          name: 'overrideImage',
          title: 'Eget bilde for kullet',
          type: 'image',
          options: {hotspot: true},
          description: 'Mor skal se mot høyre. Et eksisterende bilde beholdes også når bryteren slås av.',
          hidden: ({parent}) => parent?.imageSelectionVersion === 1
            ? parent?.overrideImageButton !== true
            : !parent?.overrideImage?.asset && parent?.overrideImageButton !== true,
        },
        {
          name: 'image',
          title: 'Bilde (manuell hund / eldre lagret bilde)',
          type: 'image',
          options: {hotspot: true},
          readOnly: ({parent}) => Boolean(parent?.dogReference?._ref || parent?.overrideImage?.asset || parent?.overrideImageButton === true),
          description: 'Mor skal se mot høyre. For valgt hund brukes «Eget bilde for kullet» til nye bildevalg. Eldre bilder beholdes her uten å endre nettsiden.',
          hidden: ({parent}) => parent?.dogReference?._ref || parent?.overrideImage?.asset || parent?.overrideImageButton === true
            ? !parent?.image?.asset
            : false,
        },

        {
          name: 'healthResults',
          title: 'Helse Resultater',
          type: 'array',
          hidden: ({parent}) => parent?.isOwned === true,
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
          name: 'extraInfoList',
          title: 'Tilleggsopplysninger (om vår hund)',
          type: 'array',
          hidden: ({parent}) => parent?.isOwned === false,
          description: 'Ekstra info som høyde, eier, utstilling etc.',
          of: [
            {
              type: 'object',
              fields: [
                {name: 'title', title: 'Tittel', type: 'string'},
                {name: 'description', title: 'Beskrivelse', type: 'text'},
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
        legacyInfoField,
      ],
    },
    {
      name: 'father',
      title: 'Far',
      type: 'object',
      components: {input: ParentImageInput},
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
          hidden: ({parent}) => parent?.isOwned === true,
        },

        {
          name: 'imageSelectionVersion',
          type: 'number',
          hidden: true,
        },
        {
          name: 'overrideImageButton',
          title: 'Bruk eget bilde for dette kullet',
          type: 'boolean',
          description: 'Standardbildet hentes fra valgt hund. Far skal se mot venstre. Eldre bildevalg beholdes til du endrer denne bryteren.',
          hidden: ({parent}) => !parent?.dogReference?._ref && !parent?.overrideImage?.asset,
        },
        {
          name: 'overrideImage',
          title: 'Eget bilde for kullet',
          type: 'image',
          options: {hotspot: true},
          description: 'Far skal se mot venstre. Et eksisterende bilde beholdes også når bryteren slås av.',
          hidden: ({parent}) => parent?.imageSelectionVersion === 1
            ? parent?.overrideImageButton !== true
            : !parent?.overrideImage?.asset && parent?.overrideImageButton !== true,
        },
        {
          name: 'image',
          title: 'Bilde (manuell hund / eldre lagret bilde)',
          type: 'image',
          options: {hotspot: true},
          readOnly: ({parent}) => Boolean(parent?.dogReference?._ref || parent?.overrideImage?.asset || parent?.overrideImageButton === true),
          description: 'Far skal se mot venstre. For valgt hund brukes «Eget bilde for kullet» til nye bildevalg. Eldre bilder beholdes her uten å endre nettsiden.',
          hidden: ({parent}) => parent?.dogReference?._ref || parent?.overrideImage?.asset || parent?.overrideImageButton === true
            ? !parent?.image?.asset
            : false,
        },

        {
          name: 'healthResults',
          title: 'Helse Resultater',
          type: 'array',
          description: 'informasjon og resultater for helserelaterte tester, som AD, HD etc.',
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
        legacyInfoField,
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
                'Gi galleriet en passende tittel, f.eks. "Uke 1, uke2 osv (maks 15 gallerier)".',
            },
            {
              name: 'description',
              title: 'Tekst under Galleri',
              type: 'text',
            },
            {
              name: 'images',
              title: 'Bilder',
              type: 'array',
              of: [{type: 'image', options: {hotspot: true}}],
              validation: (Rule) => Rule.max(20).error('Maks 20 bilder per galleri'),
              description: 'Legg til bilder fra valpens utvikling. Maks 20 bilder pr galleri',
            },

            {
              name: 'videos',
              title: 'Videoer',
              type: 'array',
              of: [{type: 'file', options: {accept: 'video/*'}}],
              validation: (Rule) => Rule.max(3).error('Maks 3 videoer per galleri'),
              description: 'Legg til opptil 3 videoer fra mobil eller PC.',
            },
            {
              name: 'video',
              title: 'Tidligere video (bevart sikkerhetskopi)',
              type: 'file',
              hidden: true,
              readOnly: true,
            },
          ],
        },
      ],
      validation: (Rule) => Rule.max(15).error('Maks 15 gallerier'),
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
      motherNickname: 'mother.nickname',
      motherName: 'mother.name',
      motherReferenceNickname: 'mother.dogReference.nickname',
      motherReferenceName: 'mother.dogReference.name',
      fatherNickname: 'father.nickname',
      fatherName: 'father.name',
      fatherReferenceNickname: 'father.dogReference.nickname',
      fatherReferenceName: 'father.dogReference.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const {title, media} = selection
      const mother = selection.motherReferenceNickname || selection.motherReferenceName || selection.motherNickname || selection.motherName
      const father = selection.fatherReferenceNickname || selection.fatherReferenceName || selection.fatherNickname || selection.fatherName
      const formattedDateOfBirth = title
        ? new Date(title).toLocaleDateString('no-NO')
        : 'Ingen dato oppgitt'

      return {
        title: formattedDateOfBirth,
        subtitle: `${mother || 'Ingen mor oppgitt'} |  ${father || 'Ingen far oppgitt'}`,
        media: media || 'no-image-icon',
      }
    },
  },
}
