# EMBL-EBI Conference Bingo

A free, single-page web app that generates a printable 5x5 bingo card (as a PDF)
randomly filled with EMBL-EBI data resources. Click "Generate a new bingo card" and a
freshly randomised PDF downloads automatically.

**Live demo:** `https://malloryfreeberg.github.io/ebi-bingo/`

## Features

- 5x5 bingo grid, one EMBL-EBI data resource per square
- Squares are randomly drawn (no repeats) each time you click generate
- Choose what goes in the center square:
  - **Free** — a classic bingo free space
  - **EMBL-EBI** — a mention of EMBL-EBI as an institution
  - **Random EMBL-EBI resource** — center is just another random draw
- Output is a print-ready PDF
- 100% client-side — no server, no build step, no tracking

## Resource list

Squares are drawn from EMBL-EBI's 
["Data resources" list](https://www.ebi.ac.uk/services/data-resources-and-tools/). The 55 resources are
captured in [`resources.js`](resources.js). If EMBL-EBI adds, removes, or
renames resources on that page, update `resources.js` to match.

## Running locally

No build step needed — it's plain HTML/CSS/JS.

1. Clone the repo
2. Open `index.html` directly in a browser, or serve the folder locally, e.g.:
   ```bash
   python3 -m http.server 8000
   ```
   then visit `http://localhost:8000`

## Deploying with GitHub Pages

1. Push this repo to `https://github.com/malloryfreeberg/ebi-bingo`
2. In the repo, go to **Settings → Pages**
3. Under "Build and deployment", set **Source** to "Deploy from a branch"
4. Choose the `main` branch and `/ (root)` folder, then **Save**
5. Your app will be live at `https://malloryfreeberg.github.io/<repo-name>/` within a few minutes

## Tech

- Vanilla HTML/CSS/JavaScript
- [jsPDF](https://github.com/parallax/jsPDF) (loaded via CDN) for client-side PDF generation

## License

Licensed under the [Apache License 2.0](LICENSE) — free to copy, modify, and reuse.
