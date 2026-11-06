# Bilder og videoer — 6. november 2026

## Gjennomført, ikke publisert

- Vanlig galleri: maks **40 galleribilder**, i tillegg til hovedbildet (brukerens siste avklaring).
- Valpekull: maks 15 ukegallerier, 20 bilder og 3 videoer per ukegalleri.
- Hundegalleri: maks 15 bilder. Alle grenser er valideringsfeil som blokkerer publisering.
- Sanity-bilder leveres med begrenset bredde, `auto=format`, kvalitet 80 og `fit=max`.
  Gallerioversikter og øvrige bildevisninger bruker mindre varianter/lazy loading;
  responsive visninger bruker `srcSet`/`sizes`. Åpnet bilde kan bruke opptil 1920 px.
  Bildeobjekter beholder redaksjonelt utsnitt. Forsidebildet lastes uten lazy loading.
- Videooversikter inneholder knapper uten videofiler. Bare åpnet video får en spiller,
  med `controls`, `playsInline` og `preload=metadata`. Kilden byttes ved navigering,
  og spilleren fjernes ved lukking. MOV merkes ikke lenger feilaktig som MP4.

## Migrering og sikkerhetskopi

`scripts/migrate-gallery-videos.mjs` kjører som standard i lesemodus.
`--apply` er en eksplisitt, skrivebeskyttet-av-revisjon migrering med én transaksjon.
Den forventer nøyaktig ti nye referanser før første gjennomføring og kontrollerer
at de refererte filene finnes. Fullstendige kulldokumenter sikkerhetskopieres og
leses tilbake før skriving. Etterpå sammenlignes dokumentene med forventet resultat.

Migreringen er gjennomført: **10 referanser i 2 kulldokumenter**. Bare `videos`-feltene
og Sanitys revisjon/tidsstempel ble endret. Ingen fil ble lastet opp eller slettet.
Det tredje kulldokumentet hadde ingen videoer og ble ikke endret.

Verifisert lokal sikkerhetskopi (ignorert av Git):
`.netlify/sanity-backups/gallery-videos-before-2026-11-06T11-03-05-103Z.json`.
Behold også en trygg kopi utenfor arbeidsmappen før senere opprydding.

Gamle `video`-felt er beholdt, skjult og skrivebeskyttet i det nye Studio-skjemaet.
Nettsiden bruker `videos` når listen finnes, også når den er tom. Bare dokumenter
uten den nye listen får fallback til `video`. Dette hindrer at slettede listeelementer
dukker opp igjen fra det gamle feltet. Ny kontroll gir null referanser å migrere.
Ikke bruk et gammelt Studio til å redigere videoer etter overgangen: det kjenner bare
det gamle feltet. Ny nettside og nytt Studio må publiseres koordinert senere.

## Kodekundersøkelse — ingen konvertering utført

`scripts/inspect-gallery-video-codecs.mjs` leser MOV/MP4-metadata med HTTP Range.
Rapporten er `.netlify/media-audit/video-codecs.json`. Bare filhoder ble analysert;
filene er ikke dekodet eller endret. `mp4a` er sample-entry-typen for lyd, ikke en
fullstendig identifikasjon av lydprofilen.

| Eksisterende filer | Funn | Anbefalt neste steg |
| --- | --- | --- |
| 7 MOV i kullet `ac6c3335-d24d-4148-a428-9e867540434e` — Dag 6 og Uke 2–7 | `hvc1` (HEVC/H.265), lyd `mp4a` | Lag H.264/AAC MP4-nettversjoner etter godkjenning; kontroller rotasjon, farger/HDR, lyd og varighet |
| 1 MOV i kullet `04440d0f-3ffc-4765-bc6f-a0a7fb0b2402` — Uke 7–8 | `avc1` (H.264), lyd `mp4a` | Undersøk lydprofil og mulighet for remux til MP4 uten ny videokoding |
| 2 MP4 | `avc1` (H.264), lyd `mp4a` | Behold; faktisk avspilling må kontrolleres på målplattformene |

## Automatikk for fremtidige mobilopplastinger — forslag, ikke implementert

Mona skal aldri måtte velge filformat, konvertere eller komprimere selv. En egendrevet
løsning kan beholde dagens opplasting og bruke følgende kjede:

1. Sanity registrerer originalfilen og en vedvarende behandlingsjobb.
2. En signert webhook varsler en bakgrunnsarbeider. En oppsamlingsjobb finner også
   eventuelle varsler som mangler; behandling identifiseres av originalens asset-ID.
3. Arbeideren analyserer **alle** videoer, også MP4 (som også kan inneholde HEVC).
   FFmpeg lager en nettversjon i MP4/H.264, kompatibelt pikselformat og AAC ved lyd,
   med begrenset oppløsning og faststart. Rotasjon og HDR må håndteres eksplisitt.
4. Nettversjonen lastes opp til Sanity som en egen fil og kobles til samme videoelement.
   Originalen beholdes. Oppdatering må tåle samtidige redigeringer og aldri publisere
   andre utkast automatisk. Mona ser «Behandler video» og deretter «Klar».
5. Nettsiden viser bare ferdigbehandlet nettversjon. Feil gir tydelig status og automatisk
   nytt forsøk; original HEVC brukes ikke som skjult fallback på inkompatible nettlesere.

Dette er teknisk gjennomførbart uten en videotjeneste, men er mer enn en liten
frontend-endring. Netlify Background Functions har opptil 15 minutters kjøretid;
native FFmpeg må pakkes med, og jobber må testes for minne/tid på faktiske mobilfiler.
Videoen må hentes fra Sanity av arbeideren, ikke sendes i funksjonens request-body.
Det er ikke dokumentert med en konverteringstest ennå at denne kjøringen er tilstrekkelig.
En egen server/arbeider eller GitHub Actions er alternativer, med egne drifts-/kvotebegrensninger.

Kostnader: FFmpeg krever ingen videotjenesteavgift, men kjøring, midlertidig lagring,
ekstra Sanity-lagring/båndbredde og vedlikehold er ikke nødvendigvis gratis. GitHub
Actions har inkludert bruk avhengig av kontotype; en kvote eller et utgiftstak kan
stanse behandling. Sanity/Netlify-planenes faktiske restkvoter er ikke kontrollert.

Anbefaling: Ikke innfør en egen automatisk konverteringskjede som en rask tilleggsløsning.
Velg en ferdig videotjeneste dersom minst mulig vedlikehold er viktigst. Hvis en
slik tjeneste fortsatt skal unngås, gjennomfør først en avgrenset prøve med de sju
HEVC-filene og representative lange/4K/HDR-mobilfiler, deretter avgjøres arbeidermiljø
og kostnadsramme. Ingen slik prøve eller tjeneste er aktivert nå.

Kilder:
- [Sanity-webhooks](https://www.sanity.io/docs/content-lake/webhooks)
- [Netlify-grenser](https://docs.netlify.com/build/functions/configuration/)
- [FFmpeg MOV/MP4 og faststart](https://www.ffmpeg.org/ffmpeg-formats.html)
- [GitHub Actions-bruk og fakturering](https://docs.github.com/en/actions/concepts/billing-and-usage)

## Kontroller

- `node --test tests/*.test.mjs`: 34 bestått, inkludert bilde-URL-er, utsnitt, grenser,
  gammel/ny videostruktur, tom liste og eksisterende PostHog-tester.
- `node tests/media-browser.mjs`: isolert Edge-test med fiktive data. Ingen videoforespørsler
  før klikk, bytte av kilde, lukking, tastaturåpning i mobilbredde og responsive/lazy bilder.
  Nettlesertesten beviser lastestyringen, ikke dekoding av de eksisterende MOV-filene.
- Nettsidens produksjonsbygg og Studio-bygg består. Eksisterende varsler om stor
  JavaScript-bundle og Studio/styled-components-versjoner er ikke oppgradert i denne endringen.
- Ingen commit, push, deploy eller endring i Shirkus.
