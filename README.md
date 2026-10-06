# Šangaj Street Food — website

Statički sajt, spreman za GitHub Pages. Bez build koraka.

## Objavljivanje (GitHub Pages)
1. Napravi repozitorijum i ubaci sadržaj ovog foldera u root (index.html mora biti u rootu).
2. Settings → Pages → Source: **Deploy from a branch**, Branch: `main`, folder `/ (root)`.
3. Sajt je na `https://<korisnik>.github.io/<repo>/`.

## Veličina
Ceo sajt ~16 MB (slike su JPG, optimizovane za web). Najveći fajl je `assets/hero-loop.mp4` (10 MB) — u granicama GitHub limita (100 MB po fajlu).

## Struktura
- `index.html`: početna (Šangaj Street Food)
- `kuvanje-na-gajbi/index.html`: stranica Kuvanje na gajbi (URL `/kuvanje-na-gajbi/`)
- `hvala.html`: potvrda posle slanja forme
- `styles.css`: stilovi i animacije početne (zajednička osnova)
- `gajba.css`: identitet Kuvanja na gajbi, važi samo za `body.gajba`
- `script.js`: preloader, status traka, reveal animacije, parallax, hamburger meni, tabovi menija, sticky Poruči, scroll progress
- `gajba.js`: slanje Netlify forme bez reload-a
- `netlify.toml`: Netlify podešavanja (na GitHub Pages se ignoriše)
- `.nojekyll`: da GitHub Pages servira fajlove bez obrade
- `assets/`: video i slike (optimizovane JPG/PNG)

## Dodavanje fotografija
Prazna polja pokazuju putanju koju očekuju:
- jela: prazna polja pokazuju putanju (`assets/food/02.jpg`, `07.jpg` … `12.jpg`); popunjene kartice već imaju slike (`sangaj-specijal.jpg`, `hrskava-piletina.jpg`, `gurmanski-sis.jpg`, `smash-burger.jpg`, `cepkano-prase.jpg`)
- galerija: već popunjena (`assets/gallery/`)

Ubaci fajl sa tim imenom i slika se sama pojavi (bez slike se prikazuje putanja).

## Podaci
Adresa Kralja Petra I Karađorđevića 4, Inđija · Telefon +381 62 830 3866 · Instagram @sangajstreetfood · TikTok @sangaj.street.food · TikTok @sangaj.street.food · Dostava samo na teritoriji Inđije.
Radno vreme: pon–čet 09–23, pet–sub 09–00, ned 16–23.

## Kuvanje na gajbi + Netlify Forms
- Stranica: `kuvanje-na-gajbi/index.html` → URL `/kuvanje-na-gajbi` (radi i na Netlify-ju i na GitHub Pages bez dodatnih pravila). Hero kartica na početnoj vodi ovde.
- Sopstveni identitet (krem #E4D1B4, tamna #1C1614, crvena #862D27, braon #4E372D) je u `gajba.css` i važi samo za `<body class="gajba">` — ostatak sajta se ne menja.
- Forma `kuvanje-na-gajbi` (Netlify Forms):
  - statički u HTML-u, `data-netlify="true"`, skriveno `form-name`, honeypot `bot-field`, `netlify.toml` u rootu
  - `gajba.js` šalje formu bez reload-a (POST na `/`), pa vodi na `hvala.html`; bez JS-a radi običan submit
  - posle deploy-a: Netlify → Site configuration → Forms → **Enable form detection**, pa ponovo deploy
  - gde stižu upiti (email / Slack / webhook): Forms → Form notifications — dodaje se kasnije
  - upiti se vide u Netlify → Forms → kuvanje-na-gajbi
- Placeholderi "klijent treba da pošalje" su u isprekidanom okviru (`g-ph`). Slike: u `<div class="g-img ...">` dodaj `<img src="../assets/gajba/ime.jpg" alt="...">`.
- Logo: `assets/gajba/logo.png`.
