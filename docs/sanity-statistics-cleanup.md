# Opprydding etter Sanity-telleren

## Utført i kode

Som i Shirkus beholdes dokumenttypen `visitorStats` med én skrivebeskyttet lenke
til `https://shebonemo.no/admin`. Dermed finner brukeren «Besøkstall» samme sted
i Studio. Komponenten har standardlenke også om et eksisterende dokument mangler verdi.

Den gamle `globalTotalVisits`-visningen og tilhørende `GlobalTotalField.jsx` er
fjernet. Det uregistrerte `pageStats.js`-skjemaet er fjernet. Gammel `.babelrc`
henviste til den ikke-eksporterte pakken `sanity/babel` og blokkerte Studio-lint;
den er fjernet, som i Shirkus. Standardoppsettet håndterer JSX uten denne filen.
Ingen innholdstyper, miljøvariabler eller data i Sanity er endret.

De fem gamle Netlify-endepunktene beholdes med HTTP 410. De er aktive sperrer
mot gammel klientkode, ikke ubrukte telleimplementasjoner. Historikk-JSON og
testenes sammenligningsfil beholdes også.

## Skrivebeskyttet kontroll 6. november 2026

- Prosjekt: `l6081rg7`, datasett: `production`.
- Attributtbruk: 1 581 / 2 000, omtrent 79 %.
- 19 dokumenter av typen `pageStats`, med 238 ulike dato-nøkler.
- Under `days` fant kontrollen 1 186 ulike kombinasjoner av sti og datatype.
  Dette er en lokal opptelling, ikke en garanti for nøyaktig reduksjon i Sanity-kvoten.
- Siste registrerte dag var 6. november 2026. Kodepakken på `shebonemo.no` inneholdt
  fortsatt `countVisit` og ikke den nye PostHog-registreringen ved kontrollen.
- Ett `visitorStats`-dokument har både `adminLink` og det gamle feltet
  `globalTotalVisits` lagret. Dokumentet og lenken skal beholdes.
- `stats.global` var ikke blant dokumentene ved denne kontrollen.

Sikkerhetskopi av de 19 statistikkdokumentene og lenkedokumentet er lagret og
kontrollert som NDJSON her:

`.netlify/sanity-backups/visit-stats-2026-11-06T10-10-50-925Z.ndjson`

Filen er Git-ignorert og inneholder originale statistikkdata med lagrede
besøksidentifikatorer. Den skal ikke legges i kildekode, publiseres eller serveres.
Ta en kopi til egnet sikker lagring før den lokale mappen eventuelt ryddes bort.
Sikkerhetskopien erstatter ikke adminens eksisterende 486/353-snapshot.

## Konkret forslag til senere dataopprydding — ikke utført

Først må migreringen publiseres slik at den gamle telleren ikke gjenoppretter
slettede statistikkdokumenter. Kontroller deretter listen og ta en ny backup ved
behov. Sletting krever uttrykkelig godkjenning; tidligere beskjed var å ikke
slette Sanity-data.

Etter godkjenning kan følgende 19 `pageStats`-dokumenter slettes, med kontroll av
type og revisjon rett før sletting:

```text
stats.about
stats.contact
stats.dogs
stats.dogs__53c02fca-1398-4162-b426-b5f25b9ec7a0
stats.dogs__65c7f3fa-7041-4276-b3aa-ac7ccf3ce296
stats.dogs__a3a1d3db-fd01-4d6d-8af9-a5462235e269
stats.dogs__b65c68af-18ae-4dff-8106-468868feeecd
stats.dogs__e1379a96-ce2a-41a7-bc33-d5f19ba09ce6
stats.gallery
stats.gallery__0baee561-62dd-4387-a069-9fe578c3507c
stats.gallery__0deb065d-78ff-4dec-81e9-6af98ab42de2
stats.gallery__3a6de487-af06-487b-ae4d-0c6d8b1790d4
stats.gallery__e66ead0d-15d8-4c7c-ae3c-4cfa734acbfc
stats.home
stats.kontakt
stats.litters
stats.litters__04440d0f-3ffc-4765-bc6f-a0a7fb0b2402
stats.litters__28697f17-91ab-4f6c-8575-1483ee9acca8
stats.litters__ac6c3335-d24d-4148-a428-9e867540434e
```

På lenkedokumentet `b66bd869-e88e-4adb-a9ad-13e79464d830` kan bare det gamle
feltet `globalTotalVisits` fjernes. `adminLink`, dokumentet og dokumenttypen
`visitorStats` skal beholdes. Inntil feltet er fjernet fra data, kan Studio vise
en melding om et ukjent gammelt felt; det skal ikke brukes til ny registrering.

Å fjerne skjemaer alene frigjør ikke attributter. Sanity teller stier med faktisk
innhold, og en sti forsvinner først når den ikke finnes i noen dokumenter lenger.
Kvoten må måles på nytt etter eventuell dataopprydding.

Kilde: [Sanitys dokumentasjon om attributtgrensen](https://www.sanity.io/docs/content-lake/attribute-limit).

## Kontroller

- `npm.cmd run build --prefix sanity-studio -- --yes`: bestod.
  Bygget varslet eksisterende avvik mellom lokal Sanity/Studio-runtime og
  styled-components-versjonskrav. Ingen avhengigheter eller auto-update-innstillinger ble endret.
- Studio-lint av lenkekomponenten og skjemaet: 0 feil, 1 advarsel om eksisterende
  manglende prop-validering i lenkekomponenten.
- `node --test tests/*.test.mjs`: alle 30 tester bestod.
- Planens 19 dokument-ID-er er maskinelt kontrollert mot sikkerhetskopien.
- Sikkerhetskopien er kontrollert med `git check-ignore`; den tas ikke med i Git.
- Ingen automatisk statistikklesing fra Sanity gjenstår i Studio-koden.
- Ingen dokumenter eller felt er slettet fra Sanity; attributtbruken er ikke redusert ennå.
- Ingen commit, push, Studio-deploy eller nettsted-deploy er utført i denne oppryddingen.
