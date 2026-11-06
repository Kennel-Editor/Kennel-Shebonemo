# Kennel-Shebonemo
Website for Kennel-Shebonemo

## Lokal utvikling med Netlify Functions

Stopp eventuelle separate Vite- og Netlify Dev-prosesser. Fra prosjektroten:

```powershell
netlify.cmd dev --context dev --no-open
```

Åpne http://localhost:8888/admin. Netlify Dev starter Vite på port 5173 og
funksjonene via port 8888. Prosjektet må være koblet til riktig Netlify-site
for å hente variablene fra «Local development (Netlify CLI)». Kommandoen publiserer ikke.
Lokal PostHog-registrering er deaktivert.

`npm run dev` alene starter bare Vite og er ikke tilstrekkelig for adminstatistikken.
