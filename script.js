(function () {
  "use strict";

  const CENTER_INDEX = 12; // middle of a 5x5 grid, row-major
  const GRID_SIZE = 5;
  const TOTAL_SQUARES = GRID_SIZE * GRID_SIZE;

  const generateBtn = document.getElementById("generateBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const centerModeSelect = document.getElementById("centerMode");
  const cardEl = document.getElementById("card");
  const statusEl = document.getElementById("status");

  // Holds the most recently generated card so "Download" can export
  // exactly what's currently shown in the preview.
  let currentSquares = null;
  let currentCenterMode = null;

  /** Fisher-Yates shuffle, returns a new shuffled copy. */
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /**
   * Build the 25 squares for a card based on the chosen center mode.
   * Returns an array of { text, isFree, isCenter } in row-major order (0-24).
   */
  function buildCardSquares(centerMode) {
    if (EBI_DATA_RESOURCES.length < TOTAL_SQUARES - 1) {
      throw new Error("Not enough EMBL-EBI data resources to fill the card.");
    }

    const squares = new Array(TOTAL_SQUARES);

    if (centerMode === "random") {
      // Center is just another randomly drawn resource; draw 25 unique resources total.
      const picks = shuffle(EBI_DATA_RESOURCES).slice(0, TOTAL_SQUARES);
      picks.forEach((res, i) => {
        squares[i] = { text: res.name, url: res.url, isFree: false, isCenter: i === CENTER_INDEX };
      });
      return squares;
    }

    // "free" or "embl-ebi": center is fixed, other 24 squares are random unique resources.
    const picks = shuffle(EBI_DATA_RESOURCES).slice(0, TOTAL_SQUARES - 1);
    let pickIdx = 0;
    for (let i = 0; i < TOTAL_SQUARES; i++) {
      if (i === CENTER_INDEX) {
        if (centerMode === "free") {
          squares[i] = { text: "FREE", url: null, isFree: true, isCenter: true };
        } else {
          squares[i] = { text: "EMBL-EBI", url: "https://www.ebi.ac.uk/", isFree: false, isCenter: true };
        }
      } else {
        const res = picks[pickIdx++];
        squares[i] = { text: res.name, url: res.url, isFree: false, isCenter: false };
      }
    }
    return squares;
  }

  function renderPreview(squares) {
    cardEl.innerHTML = "";

    const title = document.createElement("div");
    title.className = "card-title";
    title.textContent = "EMBL-EBI Resources Bingo";
    cardEl.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "grid";
    squares.forEach((sq) => {
      const div = document.createElement("div");
      div.className = "square" + (sq.isFree ? " free" : "");
      div.textContent = sq.text;
      grid.appendChild(div);
    });
    cardEl.appendChild(grid);
  }

  function generatePdf(squares, centerMode) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const pageWidth = 210;
    const marginX = 15;
    const gridSize = 180; // 5 squares x 36mm
    const squareSize = gridSize / GRID_SIZE;
    const gridTop = 48;

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(10, 80, 50); // EMBL darkest tint green (#0A5032)
    doc.text("EMBL-EBI Resources Bingo", pageWidth / 2, 22, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(
      "Squares drawn at random from EMBL-EBI's Data resources",
      pageWidth / 2,
      30,
      { align: "center" }
    );

    // Grid squares
    squares.forEach((sq, i) => {
      const row = Math.floor(i / GRID_SIZE);
      const col = i % GRID_SIZE;
      const x = marginX + col * squareSize;
      const y = gridTop + row * squareSize;

      if (sq.isFree) {
        doc.setFillColor(0, 123, 83); // EMBL dark tint green (#007B53)
        doc.rect(x, y, squareSize, squareSize, "F");
      } else {
        doc.setDrawColor(0, 123, 83); // EMBL dark tint green (#007B53)
        doc.setLineWidth(0.4);
        doc.rect(x, y, squareSize, squareSize, "S");
      }

      const textColor = sq.isFree ? [255, 255, 255] : [20, 20, 20];
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFont("helvetica", sq.isFree ? "bold" : "normal");
      doc.setFontSize(sq.isFree ? 12 : 9);

      const maxTextWidth = squareSize - 4;
      const lines = doc.splitTextToSize(sq.text, maxTextWidth);
      const lineHeight = sq.isFree ? 5 : 3.6;
      const totalHeight = lines.length * lineHeight;
      let cursorY = y + squareSize / 2 - totalHeight / 2 + lineHeight * 0.75;

      lines.forEach((line) => {
        doc.text(line, x + squareSize / 2, cursorY, { align: "center" });
        cursorY += lineHeight;
      });
    });

    // Footer
    const footerY = gridTop + gridSize + 12;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    const dateStr = new Date().toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.text(
      `Generated ${dateStr}  |  Center square: ${centerModeLabel(centerMode)}  |  Source: https://www.ebi.ac.uk/services/data-resources-and-tools/`,
      pageWidth / 2,
      footerY,
      { align: "center", maxWidth: gridSize }
    );

    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    doc.save(`embl-ebi-bingo-${stamp}.pdf`);
  }

  function centerModeLabel(mode) {
    if (mode === "free") return "Free";
    if (mode === "embl-ebi") return "EMBL-EBI";
    return "Random resource";
  }

  function handleGenerate() {
    try {
      const centerMode = centerModeSelect.value;
      const squares = buildCardSquares(centerMode);
      currentSquares = squares;
      currentCenterMode = centerMode;
      renderPreview(squares);
      statusEl.textContent = "New bingo card generated. Click “Download bingo card” to save it as a PDF.";
    } catch (err) {
      statusEl.textContent = "Something went wrong generating the card. See console for details.";
      console.error(err);
    }
  }

  function handleDownload() {
    if (!currentSquares) {
      statusEl.textContent = "Generate a card first, then download it.";
      return;
    }
    try {
      generatePdf(currentSquares, currentCenterMode);
      statusEl.textContent = "Bingo card downloaded as a PDF.";
    } catch (err) {
      statusEl.textContent = "Something went wrong downloading the PDF. See console for details.";
      console.error(err);
    }
  }

  generateBtn.addEventListener("click", handleGenerate);
  downloadBtn.addEventListener("click", handleDownload);

  // Render one card on load so the page isn't empty, and make it
  // immediately downloadable without requiring an extra click.
  currentSquares = buildCardSquares(centerModeSelect.value);
  currentCenterMode = centerModeSelect.value;
  renderPreview(currentSquares);
})();
