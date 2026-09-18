# TAP — Irenne Birthday Experience

A mobile-first, static birthday story with a short wake-up mini game, designed to open from an NFC lanyard. It runs with plain HTML, CSS, and JavaScript and can be hosted directly on GitHub Pages.

## Preview locally

Open `index.html` directly, or serve this folder with any static file server:

```powershell
npx serve .
```

The experience is best checked in a phone-sized browser window. Audio is deliberately quiet and begins only after the first interaction, as required by mobile browsers.

## Personalize before publishing

Edit the `CONTENT` object at the top of `app.js`. It contains the age/version, event date, patch notes, private message, and signature. The soundtrack is generated in the browser and starts only after the first poke, so there is no audio file to host.

## Publish on GitHub Pages

Push the files to a GitHub repository, then choose **Settings → Pages → Deploy from a branch** and select the main branch. Write the resulting HTTPS URL to the NFC tag only after testing it on the production site.
