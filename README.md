# Lumen Bible Study

A modern web-first Bible study app inspired by deep-study tools like Logos, but scoped around a legal, static-site friendly first foundation: whole-Bible navigation, public-domain translation selection, chapter search, notes, parallel text comparison, and a lightweight study assistant.

## Bible Texts

The reader loads public-domain Bible texts from OriginsAPI at runtime. The current translation selector includes:

- KJV, ASV, BBE, Darby, Douay-Rheims Challoner, Geneva 1599, Rotherham, YLT
- Tyndale New Testament
- Clementine Latin Vulgate
- Textus Receptus Greek New Testament
- Westminster Leningrad Codex Hebrew Old Testament

Modern translations such as NIV, ESV, NASB, NLT, NKJV, CSB, and similar editions are copyrighted. They should be added only through a licensed provider such as API.Bible or direct publisher agreements. A GitHub Pages frontend cannot safely hide a provider API key, so licensed translations should go behind a backend or serverless proxy before production use.

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Notes

- Public-domain Bible text is loaded from OriginsAPI.
- The study-desk photo is from Unsplash by Tim Wildsmith.
- The app uses an original name and visual direction; it does not copy Logos branding.
