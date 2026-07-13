# EMBL-EBI Resources Bingo

A free, single-page web app that generates a printable 5x5 bingo card (as a PDF)
randomly filled with EMBL-EBI data resources. Click "Generate a new bingo card"
to randomize the squares, preview them on screen, then click "Download bingo
card" to save the current card as a PDF.

**Live demo:** https://malloryfreeberg.github.io/ebi-bingo/

## Features

- 5x5 bingo grid, one EMBL-EBI resource per square
- Squares are randomly drawn (no repeats) each time you click "Generate a new bingo card"
- Choose what goes in the center square:
  - **Free** — a classic bingo free space
  - **EMBL-EBI** — any mention of EMBL-EBI in general
  - **Random EMBL-EBI resource** — another random resource draw
- Use the "Download bingo card" button when you want to download the card
- Output is a print-ready PDF

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

## Tech stack

- Vanilla HTML/CSS/JavaScript
- [jsPDF](https://github.com/parallax/jsPDF) (loaded via CDN) for client-side PDF generation
- Colors use EMBL's official "Dark tint green" (`#007B53`) and "Darkest tint
  green" (`#0A5032`) from the
  [EMBL brand guidelines](https://www.embl.org/guidelines/design/design-guidelines/colours/)

## License

Licensed under the [Apache License 2.0](LICENSE) — free to copy, modify, and reuse.
