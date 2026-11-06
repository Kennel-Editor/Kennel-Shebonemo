# PostHog i Shebonemo

Nye sidevisninger registreres av `TrackAllRoutes`. Adminruter, lokal utvikling
og nettlesere med Do Not Track utelates. Automatisk sidevisning, klikkregistrering
og sesjonsopptak er slått av. Mangler klientnøkkel eller vert, sendes ingen hendelser.
Bare Netlifys `production`-kontekst på produksjonsverten kan initialisere SDK-et.
`deploy-preview`, `branch-deploy`, `dev` og ukjent kontekst er deaktivert, selv om
produksjonsnøklene er tilgjengelige. Vite bygger inn konteksten fra Netlifys
innebygde `CONTEXT` og produksjonsverten fra `URL`; ingen miljøvariabler endres.
Hendelser merkes `deployment_context: production`, og statistikkspørringene krever
denne merkingen. Tidligere testhendelser uten merking tas ikke med.
Se [Netlifys kontekstvariabler](https://docs.netlify.com/build/configure-builds/environment-variables/).

## Miljøvariabler som må opprettes

| Navn | Bruk |
| --- | --- |
| `VITE_POSTHOG_KEY` | Shebonemos offentlige PostHog-prosjektnøkkel; byggtid |
| `VITE_POSTHOG_HOST` | Inntaksvert, `https://eu.i.posthog.com` eller `https://us.i.posthog.com`; byggtid |
| `POSTHOG_PROJECT_ID` | Shebonemos numeriske prosjekt-ID; Netlify Functions |
| `POSTHOG_PERSONAL_API_KEY` | Hemmelig nøkkel med lesetilgang til prosjektets spørringer; bare Netlify Functions |
| `POSTHOG_START_AT` | Eksakt ISO-tidspunkt for overgangen, med tidssone; bygg og Netlify Functions |
| `POSTHOG_REGION` | `eu` (standard) eller `us`; samme region som klientprosjektet |

Bruk et eget Shebonemo-prosjekt i PostHog. Ingen Shirkus-nøkler gjenbrukes.
Eksisterende miljøvariabler skal ikke endres. Ingen hemmelige verdier skal legges i repoet.

## Historikk og overgang

`src/data/shebonemo-legacy-reconstructed-preview.json` brukes av statistikkfunksjonen
og valideres ved produksjonsbygg. Den gamle `shebonemo-legacy-preview.json` beholdes
uendret som sammenligningsgrunnlag. Historikkdata sendes ikke med nettleserbygget. Den rå
`data.ndjson`-eksporten brukes ikke. Ingen statistikk leses eller skrives i Sanity.
Eksisterende Sanity-kall for innhold og visningsnavn er beholdt.

Det rekonstruerte previewet har 19 uendrede sider, 486 globale besøk og 353
historiske unike til og med 4. november 2026. Av besøkene er 401 opprinnelig
registrert og 85 konservativt anslått over 40 dager etter 2. september:
42 i september, 36 i oktober og 7 i november. De 186 registrerte sidebesøkene
etter 2. september summeres ikke som globale økter.

Metoden bruker per dag maksimum av antall ulike lagrede besøkshasher på tvers av
sider og største sesjonstall på én side. Det er et konservativt anslag; faktiske
globale økter kan være flere. De 353 historiske unike kommer fra den oppgitte
unionen av gamle globale hasher og 72 nye hasher fra senere sidedata.
Identifikatorene finnes ikke i JSON-filen, så unionen og selve hashberegningen
kan ikke etterprøves fra denne filen alene. Vi validerer format, datoer, dags-/månedssummer,
økte totaltall, 40 rekonstruerte datoer og samsvar med sidesummene i metadataene.

Admin viser historikken som samlet besøkstall. Forklaringer om snapshotstatus og
fordelingen 401 registrerte + 85 anslåtte vises ikke i admin eller periodekortene.
Metadataene og metodeforklaringen beholdes i JSON-filen og denne dokumentasjonen.
Dag-, uke-, måneds- og årskort bruker fortsatt de samme rekonstruerte dagsverdiene.
Besøkstallene endres ikke. Historiske og nye unike vises nå som ett samlet tall,
slik brukeren ønsker, med 353 som historisk globalt utgangspunkt.

Det eksisterende snapshotet er akseptert som historikkgrunnlag for produksjon,
med uendrede 486 besøk og 353 historiske unike. Det er ikke lenger krav om nytt
uttrekk, status `final`, eller sammenhengende historikk helt frem til overgangen.
Statusen `estimated_not_final` og forklaringen om anslag beholdes som de er.
Hullet etter historikken til og med 4. november og frem til PostHog aksepteres;
det fylles ikke med beregnede besøk. Et tomt periodekort i dette hullet betyr
manglende registrering, ikke dokumentasjon på at ingen besøkte siden.

`POSTHOG_START_AT` kan være et vilkårlig ISO-tidspunkt med eksplisitt tidssone,
for eksempel `2026-11-05T14:23:45+01:00` eller tilsvarende UTC-verdi med `Z`.
Millisekunder støttes. Eksemplet er ikke et valgt produksjonstidspunkt.
Produksjonsbygget validerer fortsatt snapshotformat og tidspunkt. Overgangsdatoen
i Oslo må ligge etter siste historikkdag, slik at dagsbasert historikk ikke
overlapper PostHog. Eksakt tidsgrense brukes i alle PostHog-spørringer.

PostHog-hendelser før `POSTHOG_START_AT` utelates fra statistikken. Klienten kan
sende hendelser så snart produksjonsbygget med nøklene er aktivt. Tidspunktet
kan ikke opprette hendelser fra tiden før klienten faktisk ble publisert.
Gamle nettleserbundler får 410 fra `countVisit`, og fortsetter ikke å telle.
De gamle fire Sanity-statistikkendepunktene returnerer også 410.

Besøk totalt er lagret historisk total pluss nye PostHog-sesjoner. Sesjoner på
tvers av flere sider telles én gang i globaltallet, slik som i Shirkus. PostHogs
sesjonsgrenser kan avvike fra den tidligere Sanity-telleren.
Historiske og nye unike summeres i visningen globalt, per side og per periode.
Globalt totaltall er 353 pluss nye unike fra PostHog, med akseptert mulig overlapp.
Daglige historiske unike og lagrede totaltall brukes direkte. For historiske
uker/måneder/år summeres dagsverdiene, begrenset oppad til lagret historisk total.
Dette er et anslag, ikke dedupliserte periodeunike. Kortet viser ett tall under
«Unike», med metodeforklaring som tooltip for slike perioder. Separate råfelt
beholdes i API-et for sporbarhet; `uniquesTotal` brukes til samlet visning.
Historiske besøk for perioder summeres fra dagsverdiene. Ved API-feil vises en
feilmelding; periodekort skjuler utdaterte verdier og admin beholder siste vellykkede henting.

## Før publisering

1. Behold eksisterende historikksnapshot uendret; hullet frem til PostHog er akseptert.
2. Opprett miljøvariablene i riktig Netlify-kontekst. Kontroller prosjekt og region.
3. Sett ønsket faktisk overgangstidspunkt i `POSTHOG_START_AT`, med tidssone,
   tilgjengelig både ved bygging og for Netlify Functions. Midnatt er ikke påkrevd.
4. Kjør bygg og testene på nytt. Verifiser at Deploy Previews og Branch deploys ikke
   sender PostHog-trafikk, også med nøklene tilgjengelige. Kontroller at Netlifys `URL`
   peker på faktisk produksjonsvert. Kontroller i et produksjonsbygg at en ruteendring
   sender én `$pageview`, inkludert tilbake/frem, og at admin og DNT ikke telles.
5. Kontroller at Netlify-funksjonen får svar fra PostHog med den virkelige lesenøkkelen,
   og at historiske/nye tall og periodeskifte stemmer. Dette krever konfigurasjon;
   de automatiske testene bruker simulerte API-svar.

Referanse for PostHogs sesjonsdefinisjon: https://posthog.com/docs/data/sessions

## Endrede og nye filer

- `package.json`, `package-lock.json`: PostHog SDK.
- `src/analytics/posthog.js`: klientoppsett.
- `vite.config.js`: Netlify-kontekst/vert og validering av snapshot og overgangstidspunkt.
- `src/counter/TrackAllRoutes.jsx`: registrering via rutene.
- Fjernet ubrukte `src/counter/useTrackVisit.js`, `src/counter/getVisitorId.js`,
  `functions/lib/_sanityClient.mjs` og `functions/lib/_utils.mjs`.
- `functions/getPosthogStats.mjs`, `functions/lib/_posthogStats.mjs`: JSON-historikk og nye PostHog-tall.
- `functions/countVisit.mjs`: gammel Sanity-skriving deaktivert.
- `functions/getStats.mjs`, `functions/getGlobalStats.mjs`, `functions/getDailyStats.mjs`, `functions/getRangeStats.mjs`: gamle endepunkter deaktivert.
- `src/counter/utils/posthogStats.js`, `src/hooks/useAdminData.js`: henting og eksisterende sidegruppering.
- `src/pages/Admin.jsx`, `src/counter/components/StatsTable.jsx`, `src/counter/components/RangeCard.jsx`: samlede unike og tydelige feil.
- `tests/posthog-stats.test.mjs`, `tests/posthog-tracking.test.mjs`, `tests/posthog-client.test.mjs`: regresjonstester.
- `sanity-studio/components/GlobalTotalField.jsx`, `sanity-studio/schemaTypes/stats.js`:
  den eksisterende skrivebeskyttede visningen er merket som Sanity-arkiv.
- `docs/posthog-migration.md`: denne veiledningen.

JSON-filen og NDJSON-eksporten fra brukeren er ikke endret.

## Lokale kontroller

- `node --test tests/*.test.mjs`: tester også rekonstruksjonsmetadata,
  historiske perioder, preview-/branch-sperre og dekning ved overgang.
- `npm.cmd run build`: lokalt bygg bestod, med advarsel om bundle over 500 kB.
  Produksjonskontekst godtar eksisterende preview-snapshot med gyldig overgangstidspunkt.
- Lokal esbuild-pakking av Netlify-funksjonen og historisk forespørsel fra pakken: bestod.
- `git diff --check`: bestod.
- Forrige fulle `npm.cmd run lint` feilet med 2701 problemer, inkludert genererte `.netlify`-filer.
  Målrettet lint i denne oppdateringen: `vite.config.js`, PostHog-klienten og Admin bestod.
  RangeCard har fortsatt de samme 13 eksisterende `react/prop-types`-feilene; ingen andre lintfeil.
- npm install rapporterte 25 sårbarheter i avhengighetstreet. Ingen automatisk oppgradering
  eller `audit fix` er kjørt som del av denne avgrensede migreringen.

Ingen reell PostHog-forespørsel med hemmelig nøkkel, nettlesertest eller deploy er gjennomført.

## Samlet status og lokal testing

Den nye koden skriver ingen besøksdata til Sanity. De fem gamle endepunktene
beholdes med HTTP 410 for gamle klienter; de skal ikke gjeninnføres. Sletting
av ubrukte hjelpere påvirker ikke lagrede Sanity-dokumenter, eksportfiler,
innholdsskjemaer eller eksisterende innholdshenting. Studio-tallet viser fortsatt
bare Sanity-arkivet; det rekonstruerte snapshotet og PostHog vises på `/admin`.

`TrackAllRoutes` står inne i `BrowserRouter`, over alle rutene. Det dekker hjem,
hundeliste/detalj, kulliste/detalj, galleri/detalj, om oss og kontakt. Admin utelates.
Publisering gir automatisk registrering bare når Vite har klientnøkkel/vert ved
bygging, `CONTEXT=production`, og nettleserverten samsvarer med Netlifys `URL`.
DNT og blokkering av analyse kan fortsatt forhindre registrering.

**`POSTHOG_START_AT` starter ikke registreringen i nettleseren.** Variabelen er
en nedre tidsgrense i serverens statistikkspørringer og et valideringsgrunnlag
for produksjonsbygget. Klienten starter straks et tillatt produksjonsbygg åpnes.
Hendelser før grensen tas ikke med i admin; før fremtidig grense returneres ingen
PostHog-tall. Det er ingen automatisk import eller innhenting av historiske data
fra Sanity. Snapshotet må oppdateres i kildekoden og inngå i et nytt bygg.

Den nye 410-sperren gjelder først når den faktisk publiseres. Eksisterende deploy
kan derfor fortsatt skrive til Sanity nå, men brukbare tall derfra er ikke en
forutsetning for aktivering. Hullet frem til PostHog er eksplisitt akseptert.
Det gjøres ingen automatisk rekonstruksjon eller utfylling av dette hullet.

For lokal admin, stopp en eventuell separat Vite-prosess og kjør fra prosjektroten:

```powershell
netlify.cmd login
netlify.cmd link
netlify.cmd dev --context dev --no-open
```

Login/link trengs bare hvis CLI-et ikke allerede er koblet til riktig Shebonemo-site.
Åpne `http://localhost:8888/admin`. CLI-et bruker dev-kontekstens variabler
(«Local development (Netlify CLI)»); dette publiserer ingenting. Nettleserregistrering forblir avslått
lokalt. Vite alene på 5173 kjører ikke Netlify Functions og kan svare med HTML på
statistikkadressen. Klienten viser nå en forklarende feil for dette.

Statistikkhentingen deler samtidige forespørsler til samme adresse. Effect-cleanup
hindrer kun oppdatering av en avmontert komponent, uten å avbryte nettverkskallet.
Dermed gjenbruker StrictModes ekstra oppstart den ventende forespørselen fremfor
å vise `NS_BINDING_ABORTED` og starte på nytt. Ferdige forespørsler lagres ikke;
«Oppdater» henter alltid nye tall.

**Bruk dev-konteksten lokalt, ikke `--context production`.** Netlifys Secrets
Controller maskerer hemmelige produksjonsverdier ved uthenting via CLI/API.
Derfor kan en korrekt lagret og aktiv nøkkel bli erstattet med en maskert verdi
når Netlify Dev startes med produksjonskonteksten. Dev-konteksten er unntatt denne
maskeringen. Behold hemmelighetsmerkingen i produksjon, og bruk verdiene under
«Local development (Netlify CLI)» til lokal testing. At CLI-et returnerer en
maskert produksjonsverdi beviser ikke at feil verdi er lagret i Netlify.
Se [Netlifys Secrets Controller-policy](https://docs.netlify.com/build/environment-variables/secrets-controller/).

`netlify.toml` angir nå eksplisitt `framework = "vite"`, målport 5173 og proxyport
8888. Vite har samme port og `strictPort: true`. Stopp gamle Vite-/Netlify Dev-prosesser
før oppstart; Netlify Dev starter Vite selv. Den tidligere lange startkommandoen
angav kommando og målport uten rammeverk, noe som i den installerte CLI-en hopper
over rammeverksdeteksjonen. SPA-fallbacken svarte da med HTML på `/@vite/client`,
`/src/main.jsx` og `/@react-refresh`, og Firefox blokkerte modulene som ugyldig MIME-type.
Det skal ikke løses ved å overstyre MIME-headere; Vite må få levere selve modulene.
Oppsettet er kontrollert gjennom en separat Netlify Dev-proxy: alle tre moduler
returnerte HTTP 200 med `text/javascript`, mens `/admin` returnerte HTML.

Deploy Previews kan teste admin og funksjonene med nødvendige lesevariabler, men
registrerer ikke kundebesøk. Produksjonsbygget kan bruke det eksisterende
preview-snapshotet. Miljøvariablenes faktiske verdier, lesetilgang og riktig
PostHog-prosjekt/region er ikke kontrollert mot eksterne tjenester i denne gjennomgangen.

## Trafikkort og ukesvisning

Trafikkdelen har fire kort, med hvert ukeskort plassert under sitt totalkort:

- «Hvor kommer besøkende fra?» viser topp 10 land, etter antall unike besøks-ID-er
  i hele perioden fra `POSTHOG_START_AT` til i dag.
- «Hvordan fant de oss?» viser antall økter fra Direkte, Google, Facebook,
  Instagram, Bing og Andre i samme periode.
- Land per uke: unike besøks-ID-er innen valgt ISO-uke, mandag–søndag i Oslo.
- Trafikkilder per uke: økter innen valgt uke.

Begge ukeskort starter på inneværende uke og kan bla uavhengig med pilene.
Det er ikke mulig å bla frem i fremtidige uker eller bakover før PostHog-startuken.
«Oppdater» henter også trafikkortene på nytt. Visningen tilpasser seg mobilbredde.

`getPosthogStats?traffic=1` bruker bare to trafikkspørringer og de samme filtrene
for tidspunkt, produksjonsmerking og admin som den øvrige statistikken. Det er
ingen skjult begrensning til siste 30 dager. Hver besøks-ID tilordnes sitt første
registrerte land i perioden. Hver økt tilordnes første sidevisnings referrer.
Ukjent land vises som «Ukjent»; ukjent ekstern kilde samles under «Andre».

Historikken på 486 besøk og 353 unike inneholder ikke land eller trafikkilder og
blandes derfor ikke inn i trafikkortene. Tomme perioder har en tydelig tomtilstand,
og API-feil vises som feil, ikke som nullbesøk.

Canada i to forskjellige uker betyr at det var kanadiske besøk i begge ukene.
Det beviser ikke at samme person kom tilbake; denne visningen er ikke en
retensjonsanalyse på individnivå.

Alle 30 tester bestod, og bygget bestod med eksisterende bundle-advarsel.
De nye komponentfilene bestod målrettet lint, og kortene er kontrollert i headless Edge.
Trafikkendringen er kontrollert med enhetstester for periode-/produksjonsfiltre,
tellemåte, feil og ISO-uker rundt årsskifte og sommertid. Lokale forespørsler mot
PostHog via Netlify Dev svarte 200 for totaltrafikk, valgt uke og en historisk måned.
