import XLSXStyle from "xlsx-js-style";
import { buildBOQSheet } from "./boqResult";

const C = {
  yellow: "FFFF00",
  cyan: "00B0F0",
  brown: "7F4F00",
  orange: "FF8C00",
  red: "FF0000",
  white: "FFFFFF",
  black: "000000",
  lightGray: "D9D9D9",
};

const thin = { style: "thin", color: { rgb: C.black } };
const medium = { style: "medium", color: { rgb: C.black } };

const B = () => ({ top: thin, bottom: thin, left: thin, right: thin });
const BDivRight = () => ({ top: thin, bottom: thin, left: thin, right: medium });
const BDivLeft = () => ({ top: thin, bottom: thin, left: medium, right: thin });

type CO = XLSXStyle.CellObject;

function mc(
  v: any,
  bg: string,
  fc: string,
  bold: boolean,
  rotate: boolean,
  ha: "left" | "center" | "right",
  border: ReturnType<typeof B> = B()
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
      border,
    },
  };
}

const yTitle = (v: any, bl = B()) =>
  mc(v, C.yellow, C.black, true, false, "center", bl);
const yHdr = (v: any, bl = B()) =>
  mc(v, C.yellow, C.black, true, true, "center", bl);
const cyD = (v: any, bl = B()) =>
  mc(v, C.cyan, C.black, false, false, typeof v === "number" ? "right" : "left", bl);
const brD = (v: any, bl = B()) =>
  mc(v, C.brown, C.white, false, false, typeof v === "number" ? "right" : "left", bl);
const orD = (v: any, bl = B()) =>
  mc(v, C.orange, C.black, false, false, typeof v === "number" ? "right" : "left", bl);
const rdD = (v: any, bl = B()) =>
  mc(v, C.red, C.white, true, false, typeof v === "number" ? "right" : "center", bl);
const fldD = (v: any) => mc(v, C.lightGray, C.black, true, false, "left");
const valD = (v: any) => mc(v, C.white, C.black, false, false, "left");

const eY = (bl = B()): CO => ({
  v: "",
  t: "s",
  s: { fill: { fgColor: { rgb: C.yellow }, patternType: "solid" }, border: bl },
});

const eW = (): CO => ({
  v: "",
  t: "s",
  s: { fill: { fgColor: { rgb: C.white }, patternType: "solid" } },
});

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

type Sec = "cyan" | "brown" | "airflow" | "cooling" | "heating";

type Col = {
  label: string;
  key: string;
  sec: Sec;
  src: "room" | "std" | "result";
  zoneCol?: string;
};

const COLS: Col[] = [
  { label: "Room Name", key: "project_RoomName", sec: "cyan", src: "room" },
  { label: "Length (m)", key: "room_Length", sec: "cyan", src: "room" },
  { label: "Width (m)", key: "room_Width", sec: "cyan", src: "room" },
  { label: "Height (m)", key: "room_Height", sec: "cyan", src: "room" },
  { label: "Occupancy", key: "room_Occupancy", sec: "cyan", src: "room" },
  { label: "Equipment Load (kW)", key: "room_Equipment_Load", sec: "cyan", src: "room" },
  { label: "Lighting (W/m²)", key: "room_Lighting", sec: "cyan", src: "room" },
  { label: "Infiltrations", key: "room_Infiltrations", sec: "cyan", src: "room" },
  { label: "Fresh Air (%)", key: "room_FreshAir", sec: "cyan", src: "room" },
  { label: "Exhaust Air (%)", key: "room_ExhaustAir", sec: "cyan", src: "room" },
  { label: "Exhaust Air Cfm", key: "room_ExhaustAirCfm", sec: "cyan", src: "room" },
  { label: "ACPH", key: "project_ACPH", sec: "cyan", src: "room" },

  { label: "Standard ID", key: "project_standard_id", sec: "brown", src: "std" },
  { label: "System", key: "project_system", sec: "brown", src: "std" },
  { label: "System Type", key: "project_system_type", sec: "brown", src: "std" },
  { label: "Heating Method", key: "project_heating_method", sec: "brown", src: "std" },
  { label: "Cooling Method", key: "project_cooling_method", sec: "brown", src: "std" },
  { label: "Standard", key: "project_standard", sec: "brown", src: "std" },
  { label: "Classification", key: "project_classification_name", sec: "brown", src: "std" },
  { label: "ACPH (Std)", key: "project_ACPH", sec: "brown", src: "std" },
  { label: "Temp Unit", key: "project_temp_Unit", sec: "brown", src: "std" },
  { label: "Req. Inside Temp", key: "project_required_inside_temp", sec: "brown", src: "std" },
  { label: "Req. Inside Humidity", key: "project_required_inside_humid", sec: "brown", src: "std" },
  { label: "Max Temp (°C)", key: "project_max_temp", sec: "brown", src: "std" },
  { label: "Min Temp (°C)", key: "project_min_temp", sec: "brown", src: "std" },
  { label: "Min Humidity (%)", key: "project_relative_min_humid", sec: "brown", src: "std" },
  { label: "Max Humidity (%)", key: "project_relative_max_humid", sec: "brown", src: "std" },
  { label: "Flow Velocity", key: "flow_velocity", sec: "brown", src: "std" },
  { label: "Heat Flow Velocity", key: "heating_flow_velocity", sec: "brown", src: "std" },
  { label: "Cool Flow Velocity", key: "cooling_flow_velocity", sec: "brown", src: "std" },
  { label: "Pipe Configuration", key: "pipe_configuration", sec: "brown", src: "std" },
  { label: "Static Pressure (Supply)", key: "static_Pressure_Supply", sec: "brown", src: "std" },
  { label: "Static Pressure (Exhaust)", key: "static_Pressure_Exhaust", sec: "brown", src: "std" },
  { label: "Filtration Stages (Supply)", key: "total_Filtration_Stages_Supply", sec: "brown", src: "std" },
  { label: "Filtration Stages (Exhaust)", key: "total_Filtration_Stages_Exhaust", sec: "brown", src: "std" },

  { label: "Area (m²)", key: "project_Area", sec: "airflow", src: "result", zoneCol: "zone_Area" },
  { label: "Volume (m³)", key: "project_Volume", sec: "airflow", src: "result", zoneCol: "zone_Volume" },
  { label: "Room CFM", key: "project_RoomCfm", sec: "airflow", src: "result", zoneCol: "zone_RoomCfm" },
  { label: "Fresh Air (CFM)", key: "project_FreshAir", sec: "airflow", src: "result", zoneCol: "zone_FreshAir" },
  { label: "Exhaust Air (CFM)", key: "project_ExhaustAir", sec: "airflow", src: "result", zoneCol: "zone_ExhaustAir" },
  { label: "Dehumid CFM", key: "project_DehumidCfm", sec: "cooling", src: "result", zoneCol: "zone_DehumidCfm" },
  { label: "Rem. Water Vapour", key: "project_Rem_Water_Vapour", sec: "cooling", src: "result", zoneCol: "zone_Rem_Water_Vapour" },
  { label: "Result CFM (Cooling)", key: "project_ResultCfm", sec: "cooling", src: "result", zoneCol: "zone_ResultCfm" },
  { label: "Terminal Mod (Cool)", key: "project_Room_Termi_Supply_Mod", sec: "cooling", src: "result", zoneCol: "zone_Room_Termi_Supply_Mod" },
  { label: "Room AC Load (TR)", key: "project_Room_AC_Load_TR", sec: "cooling", src: "result", zoneCol: "zone_Room_AC_Load_TR" },
  { label: "CFM AC Load (TR)", key: "project_Cfm_AC_Load_TR", sec: "cooling", src: "result", zoneCol: "zone_Cfm_AC_Load_TR" },
  { label: "Res. Cooling Load (TR)", key: "project_Res_Cooling_Load_TR", sec: "cooling", src: "result", zoneCol: "zone_Res_Cooling_Load_TR" },

  { label: "Add. Water Vapour", key: "project_add_Water_Vapour", sec: "heating", src: "result", zoneCol: "zone_add_Water_Vapour" },
  { label: "Humid CFM", key: "project_HumidCfm", sec: "heating", src: "result", zoneCol: "zone_HumidCfm" },
  { label: "Result CFM (Heating)", key: "project_ResultCfm_Hot", sec: "heating", src: "result", zoneCol: "zone_ResultCfm_Hot" },
  { label: "Terminal Mod (Heat)", key: "project_Room_Term_Supply_Mod", sec: "heating", src: "result", zoneCol: "zone_Room_Term_Supply_Mod" },
  { label: "Room Heat Load (TR)", key: "project_Room_Heating_Load_TR", sec: "heating", src: "result", zoneCol: "zone_Room_Heating_Load_TR" },
  { label: "CFM Heat Load (TR)", key: "project_Cfm_Heating_Load_TR", sec: "heating", src: "result", zoneCol: "zone_Cfm_Heating_Load_TR" },
  { label: "Res. Heat Load (TR)", key: "project_Result_Heating_Load_TR", sec: "heating", src: "result", zoneCol: "zone_Result_Heating_Load_TR" },
];

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

function borderForVisibleIndex(colIdx: number, visibleCols: Col[]): ReturnType<typeof B> {
  const current = visibleCols[colIdx];
  const prev = visibleCols[colIdx - 1];
  const next = visibleCols[colIdx + 1];

  if (!current) return B();

  if (current.sec !== prev?.sec && current.sec !== "cyan") return BDivLeft();
  if (current.sec !== next?.sec && current.sec !== "heating") return BDivRight();

  return B();
}

function dataCell(v: any, sec: Sec, border: ReturnType<typeof B>): CO {
  if (sec === "brown") return brD(v, border);
  if (sec === "cyan") return cyD(v, border);
  return orD(v, border);
}

function normalizeSystemText(v: any): string {
  return String(v ?? "")
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getSystemFlags(systemTypeRaw: any) {
  const systemType = normalizeSystemText(systemTypeRaw);
  const has = (key: string) => systemType.includes(key);

  return {
    isCoolingSystem: has("cooling") && !has("heating") && !has("ventilation"),
    isHeatingSystem: has("heating") && !has("cooling") && !has("ventilation"),
    isVentilationSystem: has("ventilation") && !has("cooling") && !has("heating"),
    isCoolingVentilation: has("cooling") && has("ventilation") && !has("heating"),
    isHeatingVentilation: has("heating") && has("ventilation") && !has("cooling"),
    isCoolingHeating: has("cooling") && has("heating"),
  };
}

function isSupplyRoom(room: any): boolean {
  const exhaustPercent = Number(room.room_ExhaustAir ?? 0);
  const exhaustCfm = Number(room.room_ExhaustAirCfm ?? 0);

  return (
    (isNaN(exhaustPercent) || exhaustPercent === 0) &&
    (isNaN(exhaustCfm) || exhaustCfm === 0)
  );
}

function hasThermalValues(result: any): boolean {
  return (
    Number(result.project_DehumidCfm || 0) > 0 ||
    Number(result.project_Rem_Water_Vapour || 0) > 0 ||
    Number(result.project_ResultCfm || 0) > 0 ||
    Number(result.project_Room_Termi_Supply_Mod || 0) > 0 ||
    Number(result.project_Room_AC_Load_TR || 0) > 0 ||
    Number(result.project_Cfm_AC_Load_TR || 0) > 0 ||
    Number(result.project_Res_Cooling_Load_TR || 0) > 0 ||
    Number(result.project_add_Water_Vapour || 0) > 0 ||
    Number(result.project_HumidCfm || 0) > 0 ||
    Number(result.project_ResultCfm_Hot || 0) > 0 ||
    Number(result.project_Room_Term_Supply_Mod || 0) > 0 ||
    Number(result.project_Room_Heating_Load_TR || 0) > 0 ||
    Number(result.project_Cfm_Heating_Load_TR || 0) > 0 ||
    Number(result.project_Result_Heating_Load_TR || 0) > 0
  );
}

function getAllResultRowsForRoom(room: any, resByName: Map<string, any[]>): any[] {
  const rName = String(room.project_RoomName ?? "").trim();

  return [
    ...(resByName.get(rName) || []),
    ...(resByName.get(`${rName} - Ventilation`) || []),
    ...(resByName.get(`${rName}-Ventilation`) || []),
  ];
}

function getVentilationResultForRoom(room: any, resByName: Map<string, any[]>): any {
  const allRows = getAllResultRowsForRoom(room, resByName);

  const roomExhaustPercent = Number(room.room_ExhaustAir ?? 0);
  const roomExhaustCfm = Number(room.room_ExhaustAirCfm ?? 0);

  const roomHasNoExhaustInput =
    (isNaN(roomExhaustPercent) || roomExhaustPercent === 0) &&
    (isNaN(roomExhaustCfm) || roomExhaustCfm === 0);

  if (roomHasNoExhaustInput) {
    return (
      allRows.find(
        (r) =>
          !hasThermalValues(r) &&
          Number(r.project_ExhaustAir || 0) === 0
      ) ||
      allRows.find((r) => !hasThermalValues(r)) ||
      {}
    );
  }

  return (
    allRows.find(
      (r) =>
        !hasThermalValues(r) &&
        Number(r.project_ExhaustAir || 0) > 0
    ) ||
    allRows.find((r) => !hasThermalValues(r)) ||
    {}
  );
}

function getResultForRoom(
  room: any,
  resByName: Map<string, any[]>,
  isVentilationTable: boolean
): any {
  const allRows = getAllResultRowsForRoom(room, resByName);

  if (isVentilationTable) {
    return getVentilationResultForRoom(room, resByName);
  }

  return (
    allRows.find((r) => hasThermalValues(r)) ||
    allRows[0] ||
    {}
  );
}

function calculateDbFilteredTotals(
  zoneRooms: any[],
  resByName: Map<string, any[]>,
  col: Col,
  isVentilationTable: boolean
): number {
  if (!col.zoneCol) return 0;

  let sum = 0;

  for (const room of zoneRooms) {
    const res = getResultForRoom(room, resByName, isVentilationTable);
    const val = parseFloat(res[col.key]);

    if (!isNaN(val)) sum += val;
  }

  return sum;
}

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
    if (v === "PROJECT INFORMATION" || v === "CUSTOMER INFORMATION") return { hpt: 28 };
    if (v === "Field") return { hpt: 40 };
    return { hpt: 20 };
  });

  return ws;
}

function buildZoneSheet(
  standards: any[],
  rooms: any[],
  results: any[],
  zones: any[]
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

  const zoneMap = new Map<string, { name: string; zoneId: string; rooms: any[] }>();

  for (const room of rooms) {
    const zid = String(room.zone_id ?? "");
    const zname = room.zone_name ?? `Zone ${zid}`;

    if (!zoneMap.has(zid)) {
      zoneMap.set(zid, { name: zname, zoneId: zid, rooms: [] });
    }

    zoneMap.get(zid)!.rooms.push(room);
  }

  const resByName = new Map<string, any[]>();

  for (const r of results ?? []) {
    const name = String(r.project_RoomName ?? "").trim();

    if (!resByName.has(name)) {
      resByName.set(name, []);
    }

    resByName.get(name)!.push(r);
  }

  const stdById = new Map<string, any>();
  for (const s of standards ?? []) {
    stdById.set(String(s.project_standard_id), s);
  }

  const firstStd = standards?.[0] ?? {};

  let maxCols = 1;
  let ri = 0;

  function getTableVisibleCols(zoneName: string, zoneRooms: any[]): Col[] {
    const firstRoom = zoneRooms[0] ?? {};
    const std = stdById.get(String(firstRoom.project_standard_id ?? "")) ?? firstStd;

    const systemTypeRaw =
      firstRoom.project_system ||
      std.project_system ||
      firstRoom.project_system_type ||
      std.project_system_type ||
      "";

    const flags = getSystemFlags(systemTypeRaw);
    const isVentilationTable = zoneName.toLowerCase().includes("ventilation");

    return COLS.filter((col) => {
      // Ventilation tables: only room + standard + airflow columns
      if (isVentilationTable) {
        return (
          col.sec === "cyan" ||
          col.sec === "brown" ||
          col.sec === "airflow"
        );
      }

      if (col.sec === "cooling") {
        return (
          flags.isCoolingSystem ||
          flags.isCoolingVentilation ||
          flags.isCoolingHeating
        );
      }

      if (col.sec === "heating") {
        return (
          flags.isHeatingSystem ||
          flags.isHeatingVentilation ||
          flags.isCoolingHeating
        );
      }

      return true;
    });
  }

  function renderTitleRow(zoneName: string, visibleCols: Col[]) {
    const titleRow: CO[] = visibleCols.map(() => eY());

    const lastIndex = visibleCols.length - 1;
    titleRow[0] = yTitle(zoneName);

    const coolingStart = visibleCols.findIndex((c) => c.sec === "cooling");
    const coolingEnd = visibleCols.map((c) => c.sec).lastIndexOf("cooling");

    const heatingStart = visibleCols.findIndex((c) => c.sec === "heating");
    const heatingEnd = visibleCols.map((c) => c.sec).lastIndexOf("heating");

    const brownLastIndex = (() => {
      const reversed = visibleCols.slice().reverse();
      const indexInReversed = reversed.findIndex((c) => c.sec === "brown");
      return indexInReversed === -1 ? -1 : visibleCols.length - 1 - indexInReversed;
    })();

    merges.push(mg(ri, ri, 0, Math.min(lastIndex, brownLastIndex)));

    if (coolingStart !== -1) {
      titleRow[coolingStart] = yTitle("Cooling Details", BDivLeft());
      merges.push(mg(ri, ri, coolingStart, coolingEnd));
    }

    if (heatingStart !== -1) {
      titleRow[heatingStart] = yTitle("Heating Details", BDivLeft());
      merges.push(mg(ri, ri, heatingStart, heatingEnd));
    }

    allRows.push(titleRow);
    rowHeights.push({ hpt: 30 });
    ri++;
  }

  function renderTable(zoneName: string, zoneId: string, zoneRooms: any[]) {
    if (!zoneRooms.length) return;

    const isVentilationTable = zoneName.toLowerCase().includes("ventilation");
    const tableVisibleCols = getTableVisibleCols(zoneName, zoneRooms);
    maxCols = Math.max(maxCols, tableVisibleCols.length);

    renderTitleRow(zoneName, tableVisibleCols);

    allRows.push(
      tableVisibleCols.map((col, i) =>
        yHdr(col.label, borderForVisibleIndex(i, tableVisibleCols))
      )
    );
    rowHeights.push({ hpt: 80 });
    ri++;

    for (const room of zoneRooms) {
      const rName = String(room.project_RoomName ?? "").trim();
      const res = getResultForRoom(room, resByName, isVentilationTable);
      const std = stdById.get(String(room.project_standard_id ?? "")) ?? firstStd;

      const dataRow: CO[] = tableVisibleCols.map((col, i) => {
        let raw: any;

        if (col.src === "room") raw = room[col.key];
        else if (col.src === "std") raw = std[col.key];
        else raw = res[col.key];

        const v = TEXT_KEYS.has(col.key)
          ? label(raw)
          : num(raw) !== ""
            ? num(raw)
            : label(raw);

        return dataCell(v, col.sec, borderForVisibleIndex(i, tableVisibleCols));
      });

      allRows.push(dataRow);
      rowHeights.push({ hpt: 18 });
      ri++;
    }

    const totalsRow: CO[] = tableVisibleCols.map((col, i) => {
      const bl = borderForVisibleIndex(i, tableVisibleCols);

      if (i === 0) return rdD("TOTAL", bl);
      if (!col.zoneCol) return rdD("", bl);

      const total = calculateDbFilteredTotals(
        zoneRooms,
        resByName,
        col,
        isVentilationTable
      );
      return rdD(total, bl);
    });

    allRows.push(totalsRow);
    rowHeights.push({ hpt: 20 });
    ri++;

    allRows.push(Array.from({ length: tableVisibleCols.length }, () => eW()));
    rowHeights.push({ hpt: 12 });
    ri++;
  }

  // REPLACE THIS BLOCK AT THE END OF buildZoneSheet
  for (const [zoneId, { name: zoneName, rooms: zoneRooms }] of zoneMap.entries()) {
    const firstRoom = zoneRooms[0] ?? {};
    const std = stdById.get(String(firstRoom.project_standard_id ?? "")) ?? firstStd;

    // Dynamically fetch system type to avoid static string dependency 
    const systemTypeRaw =
      firstRoom.project_system ||
      std.project_system ||
      firstRoom.project_system_type ||
      std.project_system_type ||
      "";

    const flags = getSystemFlags(systemTypeRaw);
    const roomsWithExhaust = zoneRooms.filter((r) => !isSupplyRoom(r));
    const roomsWithoutExhaust = zoneRooms.filter((r) => isSupplyRoom(r));

    if (flags.isCoolingVentilation || flags.isHeatingVentilation) {
      const typeLabel = flags.isCoolingVentilation ? "Cooling" : "Heating";

      renderTable(`${zoneName} ${typeLabel} (Exhaust)`, zoneId, roomsWithExhaust);
      renderTable(`${zoneName} ${typeLabel} (Supply)`, zoneId, roomsWithoutExhaust);

      renderTable(`${zoneName} Ventilation (Exhaust)`, zoneId, roomsWithExhaust);
      renderTable(`${zoneName} Ventilation (Supply)`, zoneId, roomsWithoutExhaust);
    } else {
      renderTable(`${zoneName} (Exhaust)`, zoneId, roomsWithExhaust);
      renderTable(`${zoneName} (Supply)`, zoneId, roomsWithoutExhaust);
    }
  }

  const ws = buildWS(allRows);
  ws["!merges"] = merges;
  ws["!cols"] = Array.from({ length: maxCols }, () => ({ wch: 13 }));
  ws["!rows"] = rowHeights;

  return ws;
}

export async function downloadProjectXLSX(
  projectId: number,
  projectUniqueId: string,
  fetchFn: (id: number) => Promise<any>
) {
  const data = await fetchFn(projectId);
  const { project, standards, rooms, results, zones } = data;

  const wb = XLSXStyle.utils.book_new();

  XLSXStyle.utils.book_append_sheet(
    wb,
    buildProjectInfoSheet(project),
    "Project Info"
  );

  XLSXStyle.utils.book_append_sheet(
    wb,
    buildZoneSheet(standards ?? [], rooms ?? [], results ?? [], zones ?? []),
    "Zone"
  );

  XLSXStyle.utils.book_append_sheet(wb, buildBOQSheet(), "BOQ");

  XLSXStyle.writeFile(wb, `${projectUniqueId}_export.xlsx`);
}