import XLSXStyle from "xlsx-js-style";

// Colours
const C = {
  yellow: "FFFF00",
  cyan: "00B0F0",
  brown: "7F4F00",
  orange: "FF8C00",
  dark: "404040",
  green: "92D050",
  darkGreen: "375623",
  red: "FF0000",
  white: "FFFFFF",
  black: "000000",
  lightGray: "D9D9D9",
};

// Border
const B = () => {
  const s = { style: "thin", color: { rgb: C.black } };
  return { top: s, bottom: s, left: s, right: s };
};

type CO = XLSXStyle.CellObject;

// Cell factory
function mc(
  v: any,
  bg: string,
  fc: string,
  bold: boolean,
  rotate: boolean,
  ha: "left" | "center" | "right"
): CO {
  const isN = typeof v === "number";
  return {
    v: v ?? "",
    t: isN ? "n" : "s",
    s: {
      font: { bold, color: { rgb: fc }, name: "Arial", sz: 9 },
      fill: { fgColor: { rgb: bg }, patternType: "solid" },
      alignment: {
        horizontal: ha,
        vertical: "center",
        wrapText: true,
        textRotation: rotate ? 90 : 0,
      },
      border: B(),
    },
  };
}

// Shorthand builders
const yTitle = (v: any) => mc(v, C.yellow, C.black, true, false, "center");
const yHdr = (v: any) => mc(v, C.yellow, C.black, true, true, "center");
const cyD = (v: any) =>
  mc(
    v,
    C.cyan,
    C.black,
    false,
    false,
    typeof v === "number" ? "right" : "left"
  );
const brD = (v: any) =>
  mc(
    v,
    C.brown,
    C.white,
    false,
    false,
    typeof v === "number" ? "right" : "left"
  );
const orD = (v: any) =>
  mc(
    v,
    C.orange,
    C.black,
    false,
    false,
    typeof v === "number" ? "right" : "left"
  );
const dkD = (v: any) =>
  mc(
    v,
    C.dark,
    C.white,
    false,
    false,
    typeof v === "number" ? "right" : "center"
  );
const gnD = (v: any) =>
  mc(
    v,
    C.green,
    C.black,
    false,
    false,
    typeof v === "number" ? "right" : "left"
  );
const dgD = (v: any) =>
  mc(
    v,
    C.darkGreen,
    C.white,
    false,
    false,
    typeof v === "number" ? "right" : "left"
  );
const rdD = (v: any) =>
  mc(
    v,
    C.red,
    C.white,
    true,
    false,
    typeof v === "number" ? "right" : "center"
  );
const fldD = (v: any) => mc(v, C.lightGray, C.black, true, false, "left");
const valD = (v: any) => mc(v, C.white, C.black, false, false, "left");
const eY = (): CO => ({
  v: "",
  t: "s",
  s: {
    fill: { fgColor: { rgb: C.yellow }, patternType: "solid" },
    border: B(),
  },
});
const eW = (): CO => ({
  v: "",
  t: "s",
  s: { fill: { fgColor: { rgb: C.white }, patternType: "solid" } },
});

// Helpers
function parseJson(val: string): string {
  try {
    const a = JSON.parse(val);
    return Array.isArray(a) ? a.join(", ") : val;
  } catch {
    return val ?? "—";
  }
}
function label(v: any): any {
  return v == null || v === "" ? "—" : v;
}
function num(v: any): any {
  const n = parseFloat(v);
  return isNaN(n) ? "" : n;
}
function sumF(arr: any[], k: string) {
  return arr.reduce((s, r) => {
    const v = parseFloat(r[k]);
    return s + (isNaN(v) ? 0 : v);
  }, 0);
}
function r2(v: number) {
  return Math.round(v * 100) / 100;
}
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

//Column definitions
type Sec = "cyan" | "brown" | "orange" | "dark" | "green" | "darkGreen";
type Col = {
  label: string;
  key: string;
  sec: Sec;
  src: "room" | "std" | "result";
};

const COLS: Col[] = [
  // CYAN - Room inputs (no Zone column)
  { label: "Room Name", key: "project_RoomName", sec: "cyan", src: "room" },
  { label: "Length (m)", key: "room_Length", sec: "cyan", src: "room" },
  { label: "Width (m)", key: "room_Width", sec: "cyan", src: "room" },
  { label: "Height (m)", key: "room_Height", sec: "cyan", src: "room" },
  { label: "Occupancy", key: "room_Occupancy", sec: "cyan", src: "room" },
  {
    label: "Equipment Load (kW)",
    key: "room_Equipment_Load",
    sec: "cyan",
    src: "room",
  },
  { label: "Lighting (W/m²)", key: "room_Lighting", sec: "cyan", src: "room" },
  {
    label: "Infiltrations",
    key: "room_Infiltrations",
    sec: "cyan",
    src: "room",
  },
  { label: "Fresh Air (%)", key: "room_FreshAir", sec: "cyan", src: "room" },
  {
    label: "Exhaust Air (m³/s)",
    key: "room_ExhaustAir",
    sec: "cyan",
    src: "room",
  },
  { label: "ACPH", key: "project_ACPH", sec: "cyan", src: "room" },
  // BROWN - Standards
  {
    label: "Standard ID",
    key: "project_standard_id",
    sec: "brown",
    src: "std",
  },
  { label: "System", key: "project_system", sec: "brown", src: "std" },
  {
    label: "System Type",
    key: "project_system_type",
    sec: "brown",
    src: "std",
  },
  {
    label: "Heating Method",
    key: "project_heating_method",
    sec: "brown",
    src: "std",
  },
  {
    label: "Cooling Method",
    key: "project_cooling_method",
    sec: "brown",
    src: "std",
  },
  { label: "Standard", key: "project_standard", sec: "brown", src: "std" },
  {
    label: "Classification",
    key: "project_classification_name",
    sec: "brown",
    src: "std",
  },
  { label: "ACPH (Std)", key: "project_ACPH", sec: "brown", src: "std" },
  { label: "Temp Unit", key: "project_temp_Unit", sec: "brown", src: "std" },
  {
    label: "Req. Inside Temp",
    key: "project_required_inside_temp",
    sec: "brown",
    src: "std",
  },
  {
    label: "Req. Inside Humidity",
    key: "project_required_inside_humid",
    sec: "brown",
    src: "std",
  },
  { label: "Max Temp (°C)", key: "project_max_temp", sec: "brown", src: "std" },
  { label: "Min Temp (°C)", key: "project_min_temp", sec: "brown", src: "std" },
  {
    label: "Min Humidity (%)",
    key: "project_relative_min_humid",
    sec: "brown",
    src: "std",
  },
  {
    label: "Max Humidity (%)",
    key: "project_relative_max_humid",
    sec: "brown",
    src: "std",
  },
  { label: "Flow Velocity", key: "flow_velocity", sec: "brown", src: "std" },
  {
    label: "Heat Flow Velocity",
    key: "heating_flow_velocity",
    sec: "brown",
    src: "std",
  },
  {
    label: "Cool Flow Velocity",
    key: "cooling_flow_velocity",
    sec: "brown",
    src: "std",
  },
  {
    label: "Pipe Configuration",
    key: "pipe_configuration",
    sec: "brown",
    src: "std",
  },
  {
    label: "Static Pressure",
    key: "static_Pressure",
    sec: "brown",
    src: "std",
  },
  {
    label: "Filtration Stages",
    key: "total_Filtration_Stages",
    sec: "brown",
    src: "std",
  },
  // ORANGE - Results
  { label: "Area (m²)", key: "project_Area", sec: "orange", src: "result" },
  { label: "Volume (m³)", key: "project_Volume", sec: "orange", src: "result" },
  { label: "Room CFM", key: "project_RoomCfm", sec: "orange", src: "result" },
  {
    label: "Fresh Air (CFM)",
    key: "project_FreshAir",
    sec: "orange",
    src: "result",
  },
  {
    label: "Exhaust Air (CFM)",
    key: "project_ExhaustAir",
    sec: "orange",
    src: "result",
  },
  {
    label: "Dehumid CFM",
    key: "project_DehumidCfm",
    sec: "orange",
    src: "result",
  },
  {
    label: "Rem. Water Vapour",
    key: "project_Rem_Water_Vapour",
    sec: "orange",
    src: "result",
  },
  {
    label: "Result CFM (Cooling)",
    key: "project_ResultCfm",
    sec: "orange",
    src: "result",
  },
  {
    label: "Terminal Mod (Cool)",
    key: "project_Room_Termi_Supply_Mod",
    sec: "orange",
    src: "result",
  },
  {
    label: "Room AC Load (TR)",
    key: "project_Room_AC_Load_TR",
    sec: "orange",
    src: "result",
  },
  {
    label: "CFM AC Load (TR)",
    key: "project_Cfm_AC_Load_TR",
    sec: "orange",
    src: "result",
  },
  {
    label: "Res. Cooling Load(TR)",
    key: "project_Res_Cooling_Load_TR",
    sec: "orange",
    src: "result",
  },
  // DARK - 2 separator cols
  {
    label: "Add. Water Vapour",
    key: "project_add_Water_Vapour",
    sec: "dark",
    src: "result",
  },
  { label: "Humid CFM", key: "project_HumidCfm", sec: "dark", src: "result" },
  // GREEN - Chilled Water
  {
    label: "Result CFM (Heating)",
    key: "project_ResultCfm_Hot",
    sec: "green",
    src: "result",
  },
  {
    label: "Terminal Mod (Heat)",
    key: "project_Room_Term_Supply_Mod",
    sec: "green",
    src: "result",
  },
  {
    label: "Room Heat Load (TR)",
    key: "project_Room_Heating_Load_TR",
    sec: "green",
    src: "result",
  },
  {
    label: "CFM Heat Load (TR)",
    key: "project_Cfm_Heating_Load_TR",
    sec: "green",
    src: "result",
  },
  {
    label: "Res. Heat Load (TR)",
    key: "project_Result_Heating_Load_TR",
    sec: "green",
    src: "result",
  },
  // DARK GREEN - Hot Water/Steam
  {
    label: "Chilled Water Flow",
    key: "chilled_water_flow",
    sec: "darkGreen",
    src: "result",
  },
  {
    label: "Chilled Water Temp",
    key: "chilled_water_temp",
    sec: "darkGreen",
    src: "result",
  },
  {
    label: "Hot Water Flow",
    key: "hot_water_flow",
    sec: "darkGreen",
    src: "result",
  },
  {
    label: "Hot Water Temp",
    key: "hot_water_temp",
    sec: "darkGreen",
    src: "result",
  },
];

const NCOLS = COLS.length;
const GREEN_START = COLS.findIndex((c) => c.sec === "green");
const DKGREEN_START = COLS.findIndex((c) => c.sec === "darkGreen");
const MAIN_END = GREEN_START - 1;

const TEXT_KEYS = new Set([
  "project_RoomName",
  "project_system",
  "project_system_type",
  "project_heating_method",
  "project_cooling_method",
  "project_standard",
  "project_classification_name",
  "pipe_configuration",
  "project_temp_Unit",
]);
const NO_SUM = new Set([...TEXT_KEYS, "project_standard_id"]);

function dataCell(v: any, sec: Sec): CO {
  switch (sec) {
    case "brown":
      return brD(v);
    case "orange":
      return orD(v);
    case "dark":
      return dkD(v);
    case "green":
      return gnD(v);
    case "darkGreen":
      return dgD(v);
    default:
      return cyD(v);
  }
}

// Sheet 1: Project Info 
function buildProjectInfoSheet(project: any): XLSXStyle.WorkSheet {
  const bl = () => eW();

  const section = (title: string, fields: [string, any][]): CO[][] => [
    [bl(), yTitle(title), eY(), bl()],
    [bl(), yHdr("Field"), yHdr("Value"), bl()],
    ...fields.map(([f, v]) => [bl(), fldD(f), valD(v), bl()]),
    [bl(), bl(), bl(), bl()],
  ];

  const allRows: CO[][] = [
    ...Array.from({ length: 3 }, () => [bl(), bl(), bl(), bl()]),
    ...section("PROJECT INFORMATION", [
      ["Project ID", label(project.project_unique_id)],
      ["Project Name", label(project.project_name)],
      ["Status", label(project.project_status)],
      ["Unit / Branch", label(project.project_unit_branch)],
      ["Location", label(project.project_Location)],
      ["Industry", parseJson(project.project_Industry)],
      ["Handling", parseJson(project.project_Handling)],
      ["Max Outdoor Temp (°C)", label(project.project_max_temp)],
      ["Min Outdoor Temp (°C)", label(project.project_min_temp)],
      ["Min Relative Humidity (%)", label(project.project_relative_min_humid)],
      ["Max Relative Humidity (%)", label(project.project_relative_max_humid)],
      ["Created At", label(project.created_at)],
    ]),
    ...section("CUSTOMER INFORMATION", [
      ["Customer Name", label(project.customer_name)],
      ["Customer Address", label(project.customer_address)],
      ["Customer Phone", label(project.customer_phone)],
      ["Customer Email", label(project.customer_email_id)],
      ["Additional Notes", label(project.customers_additional_notes)],
    ]),
  ];

  const merges: ReturnType<typeof mg>[] = [];
  allRows.forEach((row, i) => {
    const cell = row[1] as any;
    if (
      cell?.s?.fill?.fgColor?.rgb === C.yellow &&
      cell?.s?.alignment?.textRotation !== 90
    ) {
      merges.push(mg(i, i, 1, 2));
    }
  });

  const ws = buildWS(allRows);
  ws["!merges"] = merges;
  ws["!cols"] = [{ wch: 8 }, { wch: 34 }, { wch: 55 }, { wch: 8 }];
  ws["!rows"] = allRows.map((row) => {
    const v = (row[1] as any)?.v;
    if (v === "PROJECT INFORMATION" || v === "CUSTOMER INFORMATION")
      return { hpt: 28 };
    if (v === "Field") return { hpt: 40 };
    return { hpt: 20 };
  });
  return ws;
}

// Sheet 2: Zone 
function buildZoneSheet(
  standards: any[],
  rooms: any[],
  results: any[]
): XLSXStyle.WorkSheet {
  const allRows: CO[][] = [];
  const merges: ReturnType<typeof mg>[] = [];
  const rowHeights: { hpt: number }[] = [];

  if (!rooms?.length) {
    const ws = buildWS([
      [mc("No room data found.", C.yellow, C.black, true, false, "center")],
    ]);
    ws["!cols"] = [{ wch: 40 }];
    return ws;
  }
  const zoneMap = new Map<string, { name: string; rooms: any[] }>();
  for (const room of rooms) {
    const zname =
      room.zone_name && String(room.zone_name).trim() !== ""
        ? String(room.zone_name).trim()
        : `Zone ${room.zone_id ?? "Unknown"}`;
    if (!zoneMap.has(zname)) zoneMap.set(zname, { name: zname, rooms: [] });
    zoneMap.get(zname)!.rooms.push(room);
  }
  const sortedZones = [...zoneMap.entries()];
  const resByName = new Map<string, any>();
  for (const r of results ?? [])
    resByName.set(String(r.project_RoomName ?? "").trim(), r);
  const stdById = new Map<string, any>();
  for (const s of standards ?? [])
    stdById.set(String(s.project_standard_id), s);
  const firstStd = standards?.[0] ?? {};

  let ri = 0;

  for (const [, { name: zoneName, rooms: zoneRooms }] of sortedZones) {
    const titleRow: CO[] = [];
    titleRow.push(yTitle(zoneName));
    for (let c = 1; c <= MAIN_END; c++) titleRow.push(eY());
    titleRow.push(yTitle("Chilled Water Details"));
    for (let c = GREEN_START + 1; c < DKGREEN_START; c++) titleRow.push(eY());
    titleRow.push(yTitle("Hot Water/Steam Details"));
    for (let c = DKGREEN_START + 1; c < NCOLS; c++) titleRow.push(eY());

    merges.push(mg(ri, ri, 0, MAIN_END));
    merges.push(mg(ri, ri, GREEN_START, DKGREEN_START - 1));
    merges.push(mg(ri, ri, DKGREEN_START, NCOLS - 1));
    allRows.push(titleRow);
    rowHeights.push({ hpt: 24 });
    ri++;
    allRows.push(COLS.map((col) => yHdr(col.label)));
    rowHeights.push({ hpt: 80 });
    ri++;
    for (const room of zoneRooms) {
      const rName = String(room.project_RoomName ?? "").trim();
      const res = resByName.get(rName) ?? {};
      const std =
        stdById.get(String(room.project_standard_id ?? "")) ?? firstStd;

      const dataRow: CO[] = COLS.map((col) => {
        let raw: any;
        if (col.src === "room") raw = room[col.key];
        else if (col.src === "std") raw = std[col.key];
        else raw = res[col.key];

        const v = TEXT_KEYS.has(col.key)
          ? label(raw)
          : num(raw) !== ""
          ? num(raw)
          : label(raw);

        return dataCell(v, col.sec);
      });

      allRows.push(dataRow);
      rowHeights.push({ hpt: 18 });
      ri++;
    }
    const totalsRow: CO[] = COLS.map((col, i) => {
      if (i === 0) return rdD("TOTAL");
      if (NO_SUM.has(col.key)) return rdD("");
      const src =
        col.src === "room"
          ? zoneRooms
          : zoneRooms.map(
              (r) =>
                resByName.get(String(r.project_RoomName ?? "").trim()) ?? {}
            );
      return rdD(r2(sumF(src, col.key)));
    });

    allRows.push(totalsRow);
    rowHeights.push({ hpt: 20 });
    ri++;

    // ── White spacer between zones ────────────────────────────────────
    allRows.push(Array.from({ length: NCOLS }, () => eW()));
    rowHeights.push({ hpt: 12 });
    ri++;
  }

  const ws = buildWS(allRows);
  ws["!merges"] = merges;
  ws["!cols"] = COLS.map(() => ({ wch: 13 }));
  ws["!rows"] = rowHeights;
  return ws;
}

//Main export 
export async function downloadProjectXLSX(
  projectId: number,
  projectUniqueId: string,
  fetchFn: (id: number) => Promise<any>
) {
  const data = await fetchFn(projectId);
  const { project, standards, rooms, results } = data;

  const wb = XLSXStyle.utils.book_new();

  // Sheet 1 – Project Info
  XLSXStyle.utils.book_append_sheet(
    wb,
    buildProjectInfoSheet(project),
    "Project Info"
  );

  // Sheet 2 – Zone 
  XLSXStyle.utils.book_append_sheet(
    wb,
    buildZoneSheet(standards ?? [], rooms ?? [], results ?? []),
    "Zone"
  );

  XLSXStyle.writeFile(wb, `${projectUniqueId}_export.xlsx`);
}