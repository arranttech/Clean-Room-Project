import XLSXStyle from "xlsx-js-style";

// Colours 
const C = {
  white:   "FFFFFF",
  black:   "000000",
  yellow:  "FFFF00",
  gray:    "D9D9D9",
  dkGray:  "BFBFBF",
};

const thin   = { style: "thin",   color: { rgb: C.black } };
const medium = { style: "medium", color: { rgb: C.black } };
const B  = () => ({ top: thin,   bottom: thin,   left: thin,   right: thin   });
const BM = () => ({ top: medium, bottom: medium, left: medium, right: medium });

type CO = XLSXStyle.CellObject;

function mc(v: any, bg: string, fc: string, bold: boolean, ha: "left"|"center"|"right", border: any = B(), sz = 9, italic = false): CO {
  const isN = typeof v === "number";
  return {
    v: v ?? "", t: isN ? "n" : "s",
    s: {
      font:      { bold, italic, color: { rgb: fc }, name: "Arial", sz },
      fill:      { fgColor: { rgb: bg }, patternType: "solid" },
      alignment: { horizontal: ha, vertical: "center", wrapText: true },
      border,
    },
  };
}

//  Cell helpers
const pageHdr  = (v: any) => mc(v, C.yellow, C.black, true,  "center", BM(), 11);
const colHdr   = (v: any) => mc(v, C.gray,   C.black, true,  "center", B(),  9);
const ahuHdr   = (v: any) => mc(v, C.yellow, C.black, true,  "left",   BM(), 9);
const lbl      = (v: any) => mc(v, C.gray,   C.black, true,  "left",   B(),  9);
const val      = (v: any) => mc(v, C.white,  C.black, false, "left",   B(),  9);
const valR     = (v: any) => mc(v, C.white,  C.black, false, "right",  B(),  9);
const fltrHdr  = (v: any) => mc(v, C.dkGray, C.black, true,  "center", B(),  9);
const fltrVal  = (v: any) => mc(v, C.white,  C.black, false, "center", B(),  9);
const fltrValR = (v: any) => mc(v, C.white,  C.black, false, "right",  B(),  9);
const note     = (v: any) => mc(v, C.white,  C.black, false, "left",   B(),  8, true);
const eW       = (): CO   => ({ v: "", t: "s", s: { fill: { fgColor: { rgb: C.white }, patternType: "solid" } } });
const eG       = (): CO   => ({ v: "", t: "s", s: { fill: { fgColor: { rgb: C.gray  }, patternType: "solid" }, border: B() } });

function mg(rs: number, re: number, cs: number, ce: number) {
  return { s: { r: rs, c: cs }, e: { r: re, c: ce } };
}

function buildWS(rows: CO[][]): XLSXStyle.WorkSheet {
  const ws: XLSXStyle.WorkSheet = {};
  const range = { s: { r: 0, c: 0 }, e: { r: rows.length - 1, c: 0 } };
  rows.forEach((row, r) =>
    row.forEach((cell, c) => {
      if (c > range.e.c) range.e.c = c;
      ws[XLSXStyle.utils.encode_cell({ r, c })] = cell;
    })
  );
  ws["!ref"] = XLSXStyle.utils.encode_range(range);
  return ws;
}

// STATIC DATA 
const STATIC_ZONE = {
  ahuTitle:         "AHU - 1 Air-Conditioning System (DX)",
  classification:   "Class 100K",
  cfm:              15750,
  acLoad:           56,
  ahuW:             2050,
  ahuH:             2050,
  ahuL:             5900,
  blower:           710,
  staticPr:         125,
  motorHp:          20,
  coilRows:         8,
  coilHeadType:     "Distributor",
  coilSize:         "1293 h x 1650 w",
  filtStages:       3,
  filterRatings:    "10µ, 5µ & 1µ",
  filterTableRows: [
    // [rating, widthMm, heightMm, depthMm, qty]
    ["",    6,   6,   "",  ""],   
    ["10µ", 610, 610, 150, 9 ],
    ["5µ",  610, 610, 300, 9 ],
    ["1µ",  610, 610, 300, 9 ],
  ] as [string, number|string, number|string, number|string, number|string][],
};

// Build BOQ sheet 
export function buildBOQSheet(): XLSXStyle.WorkSheet {
  const allRows:    CO[][] = [];
  const merges:     ReturnType<typeof mg>[] = [];
  const rowHeights: { hpt: number }[] = [];

  let ri = 0;

  // ROW 0
  allRows.push([pageHdr("AIR HANDLING UNITS"), eW(), eW(), eW(), eW(), eW(), eW(), eW()]);
  merges.push(mg(ri, ri, 0, 7));
  rowHeights.push({ hpt: 22 });
  ri++;

  //ROW 1
  allRows.push([
    colHdr("S.No."),
    colHdr("Description & Specifications"),
    eG(), eG(), eG(), eG(),
    colHdr("Units"),
    colHdr("Qty"),
  ]);
  merges.push(mg(ri, ri, 1, 5));
  rowHeights.push({ hpt: 16 });
  ri++;

  //ROW 2
  allRows.push([
    val("1"),
    ahuHdr(STATIC_ZONE.ahuTitle),
    eW(), eW(), eW(), eW(),
    val("Nos."),
    val("1"),
  ]);
  merges.push(mg(ri, ri, 1, 5));
  rowHeights.push({ hpt: 20 });
  ri++;

  // ROW 3
  allRows.push([
    lbl("CLASS"),
    val(STATIC_ZONE.classification),
    lbl("CFM"),
    valR(STATIC_ZONE.cfm),
    lbl("AC Load"),
    valR(STATIC_ZONE.acLoad),
    eW(), eW(),
  ]);
  rowHeights.push({ hpt: 18 });
  ri++;

  // ROW 4
  allRows.push([
    lbl("AHU(W)"),
    valR(STATIC_ZONE.ahuW),
    lbl("AHU(H)"),
    valR(STATIC_ZONE.ahuH),
    lbl("AHU(L)"),
    valR(STATIC_ZONE.ahuL),
    eW(), eW(),
  ]);
  rowHeights.push({ hpt: 18 });
  ri++;

  // ROW 5
  allRows.push([
    lbl("Blower"),
    valR(STATIC_ZONE.blower),
    lbl("Static Pr"),
    valR(STATIC_ZONE.staticPr),
    lbl("Motor Hp"),
    valR(STATIC_ZONE.motorHp),
    eW(), eW(),
  ]);
  rowHeights.push({ hpt: 18 });
  ri++;

  // ROW 6
  allRows.push([
    lbl("Coil Rows"),
    valR(STATIC_ZONE.coilRows),
    lbl("Coil Head Type"),
    val(STATIC_ZONE.coilHeadType),
    lbl("Coil Size hxw in mm"),
    val(STATIC_ZONE.coilSize),
    eW(), eW(),
  ]);
  rowHeights.push({ hpt: 18 });
  ri++;

  //ROW 7
  allRows.push([
    lbl("No. of Filtr. Stages"),
    valR(STATIC_ZONE.filtStages),
    lbl("Filter Ratings"),
    val(STATIC_ZONE.filterRatings),
    eG(), eG(),
    eW(), eW(),
  ]);
  merges.push(mg(ri, ri, 3, 5));
  rowHeights.push({ hpt: 18 });
  ri++;

  // ROW 8
  allRows.push([
    fltrHdr("Filter Rating"),
    fltrHdr("Width\nmm"),
    fltrHdr("Height\nmm"),
    fltrHdr("Depth\nmm"),
    fltrHdr("Filter Qty\nNos"),
    eG(), eG(), eG(),
  ]);
  rowHeights.push({ hpt: 28 });
  ri++;

  // ROW 9
  for (const [rating, w, h, d, qty] of STATIC_ZONE.filterTableRows) {
    allRows.push([
      fltrVal(rating),
      fltrValR(w),
      fltrValR(h),
      fltrValR(d),
      fltrValR(qty),
      eG(), eG(), eG(),
    ]);
    rowHeights.push({ hpt: 16 });
    ri++;
  }

  // ── Last row: italic note + Nos. 1 ───────────────────────────────────────
  // PDF: "Filters Size and Quantity for mentioned ratings"   Nos. 1
  allRows.push([
    note("Filters Size and Quantity for mentioned ratings"),
    eW(), eW(), eW(), eW(), eW(),
    val("Nos."),
    val("1"),
  ]);
  merges.push(mg(ri, ri, 0, 5));
  rowHeights.push({ hpt: 14 });
  ri++;

  const ws = buildWS(allRows);
  ws["!merges"] = merges;
  ws["!cols"] = [
    { wch: 22 }, 
    { wch: 14 }, 
    { wch: 16 }, 
    { wch: 14 },
    { wch: 22 }, 
    { wch: 18 }, 
    { wch: 8  }, 
    { wch: 6  }, 
  ];
  ws["!rows"] = rowHeights;
  return ws;
}
