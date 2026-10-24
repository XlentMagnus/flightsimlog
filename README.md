# Flightlog

Personlig flyghistorik for MSFS 2020/2024. Next.js (App Router) + TypeScript + Drizzle + Neon Postgres.

- `/` publik loggbok med statistik och filter pa simulator
- `/admin` losenordsskyddad hantering (lagg till, redigera, ta bort)

## Karta

Startsidan visar alla rutter pa en OpenStreetMap-karta (Leaflet) med bla storcirkellinjer. Kartan foljer simulator-filtret, och linjer for rutter du flugit flera ganger blir tjockare.

Koordinater slas upp fran `src/data/airports.json` (28 298 flygplatser med ICAO-kod), genererad fran paketet `airportsdata` (MIT, baserat pa OurAirports som ar public domain). Okanda ICAO-koder listas under kartan i stallet for att krascha sidan.

OSM:s publika tile-server ar avsedd for modest trafik. For en personlig sida ar det okej, men byt till en egen tile-leverantor om sidan far mycket besokare.

## Kom igang lokalt

1. Skapa en Neon-databas (gratis) pa https://neon.new eller via Vercel Marketplace.
2. Kopiera `.env.example` till `.env.local` och fyll i `DATABASE_URL`, `ADMIN_PASSWORD` och `SESSION_SECRET` (`openssl rand -hex 32`).
3. `npm install`
4. `npm run db:push` skapar tabellen `flights`.
5. `npm run dev` och oppna http://localhost:3000

## Deploy pa Vercel

1. Pusha projektet till GitHub och importera det i Vercel.
2. Lagg till Neon via Vercel Marketplace (Storage), vilket satter `DATABASE_URL` automatiskt.
3. Lagg till `ADMIN_PASSWORD` och `SESSION_SECRET` under Environment Variables.
4. Kor `npm run db:push` en gang lokalt mot samma databas (med `DATABASE_URL` i `.env.local`).

## Plan for version 2

`flights.owner_id` finns redan som kolumn. Nasta steg ar en users-tabell, riktig inloggning och en egen sida per anvandare.
