import XLSXStyle from "xlsx-js-style";
import { buildBOQSheet } from "./boqResult";

const C = {
  yellow: "FFFF00",
  cyan: "00B5F1",
  brown: "7D5D00",
  orange: "FFC000",
  red: "FF0000",
  white: "FFFFFF",
  black: "000000",
  lightGray: "595959",
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

function toNum(v: any): number {
  const n = parseFloat(String(v ?? "0").replace(/[^0-9.-]/g, ""));
  return isNaN(n) ? 0 : n;
}

function mg(rs: number, re: number, cs: number, ce: number) {
  return { s: { r: rs, c: cs }, e: { r: re, c: ce } };
}

function buildWS(rows: CO[][]): XLSXStyle.WorkSheet {
  if (!rows.length) {
    rows = [[mc("No export data found.", C.yellow, C.black, true, false, "center")]];
  }

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
  { label: "Filtration Stages (Supply)", key: "number_of_Filtrations_Supply", sec: "brown", src: "std" },
  { label: "Filtration Stages (Exhaust)", key: "number_of_Filtrations_Exhaust", sec: "brown", src: "std" },

  { label: "Area (m²)", key: "project_Area", sec: "airflow", src: "result", zoneCol: "zone_Area" },
  { label: "Volume (m³)", key: "project_Volume", sec: "airflow", src: "result", zoneCol: "zone_Volume" },
  { label: "Room CFM", key: "project_RoomCfm", sec: "airflow", src: "result", zoneCol: "zone_RoomCfm" },
  { label: "Fresh Air (CFM)", key: "project_FreshAir", sec: "airflow", src: "result", zoneCol: "zone_FreshAir" },
  { label: "Resultant Supply Air (CFM)", key: "project_ResultantSupplyAir", sec: "airflow", src: "result", zoneCol: "zone_ResultantSupplyAir" },
  { label: "Resultant Exhaust Air (CFM)", key: "project_ExhaustAir", sec: "airflow", src: "result", zoneCol: "zone_ExhaustAir" },
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

function isSupplyByRoomInput(room: any): boolean {
  const exhaustPercent = Number(room.room_ExhaustAir);
  const exhaustCfm = Number(room.room_ExhaustAirCfm);

  return (
    (
      (isNaN(exhaustPercent) || exhaustPercent === 0) &&
      (isNaN(exhaustCfm) || exhaustCfm === 0)
    ) ||
    (
      (isNaN(exhaustPercent) || exhaustPercent !== 0) &&
      (isNaN(exhaustCfm) || exhaustCfm !== 0)
    )
  );
}

function isExhaustByRoomInput(room: any): boolean {
  const exhaustPercent = Number(room.room_ExhaustAir);
  const exhaustCfm = Number(room.room_ExhaustAirCfm);

  return (
    (isNaN(exhaustPercent) || exhaustPercent !== 0) &&
    (isNaN(exhaustCfm) || exhaustCfm !== 0)
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

function sameZone(room: any, result: any): boolean {
  const roomZoneId = String(room.zone_id ?? room.project_zone_id ?? "").trim();
  const resultZoneId = String(result.zone_id ?? result.project_zone_id ?? result.project_ZoneId ?? "").trim();

  if (!roomZoneId || !resultZoneId) return true;

  return roomZoneId === resultZoneId;
}

function getZoneId(obj: any): string {
  return String(
    obj.zone_id ??
    obj.project_zone_id ??
    obj.project_ZoneId ??
    obj.zoneId ??
    ""
  ).trim();
}

function resultMapKey(projectId: any, zoneId: any, roomName: any): string {
  return `${String(projectId ?? "").trim()}__${String(zoneId ?? "").trim()}__${normalizeResultRoomName(roomName).toLowerCase()}`;
}

function normalizeResultRoomName(name: any): string {
  return String(name ?? "")
    .replace(" - Ventilation", "")
    .replace("-Ventilation", "")
    .trim();
}

function getAllResultRowsForRoom(room: any, resByName: Map<string, any[]>): any[] {
  const key = resultMapKey(
    room.project_id,
    room.zone_id,
    room.project_RoomName
  );

  return resByName.get(key) || [];
}

function getVentilationResultForRoom(room: any, resByName: Map<string, any[]>): any {
  const allRows = getAllResultRowsForRoom(room, resByName);

  return allRows.find((r) => !hasThermalValues(r)) || {};
}

function hasCoolingValues(result: any): boolean {
  return (
    Number(result.project_DehumidCfm || 0) > 0 ||
    Number(result.project_Rem_Water_Vapour || 0) > 0 ||
    Number(result.project_ResultCfm || 0) > 0 ||
    Number(result.project_Room_Termi_Supply_Mod || 0) > 0 ||
    Number(result.project_Room_AC_Load_TR || 0) > 0 ||
    Number(result.project_Cfm_AC_Load_TR || 0) > 0 ||
    Number(result.project_Res_Cooling_Load_TR || 0) > 0
  );
}

function hasHeatingValues(result: any): boolean {
  return (
    Number(result.project_add_Water_Vapour || 0) > 0 ||
    Number(result.project_HumidCfm || 0) > 0 ||
    Number(result.project_ResultCfm_Hot || 0) > 0 ||
    Number(result.project_Room_Term_Supply_Mod || 0) > 0 ||
    Number(result.project_Room_Heating_Load_TR || 0) > 0 ||
    Number(result.project_Cfm_Heating_Load_TR || 0) > 0 ||
    Number(result.project_Result_Heating_Load_TR || 0) > 0
  );
}

type TableKind = "normal" | "cooling" | "heating" | "ventilation";
type TableSide = "supply" | "exhaust";

function getResultForRoom(
  room: any,
  resByName: Map<string, any[]>,
  tableKind: TableKind,
  tableSide: TableSide
): any {
  const allRows = getAllResultRowsForRoom(room, resByName);

  if (tableKind === "ventilation") {
    return getVentilationResultForRoom(room, resByName);
  }

  const sideMatchedRows = allRows.filter((r) => {
    const dbExhaustAir = Number(r.project_ExhaustAir || 0);

    if (tableSide === "supply") return dbExhaustAir === 0;
    return dbExhaustAir > 0;
  });

  if (!sideMatchedRows.length) return {};

  if (tableKind === "cooling") {
    return sideMatchedRows.find((r) => hasCoolingValues(r)) || {};
  }

  if (tableKind === "heating") {
    return sideMatchedRows.find((r) => hasHeatingValues(r)) || {};
  }

  return sideMatchedRows.find((r) => hasThermalValues(r)) || sideMatchedRows[0] || {};
}

function calculateDbFilteredTotals(
  zoneRooms: any[],
  resByName: Map<string, any[]>,
  col: Col,
  tableKind: TableKind,
  tableSide: TableSide
): number {
  if (!col.zoneCol) return 0;

  let sum = 0;

  for (const room of zoneRooms) {
    const res = getResultForRoom(room, resByName, tableKind, tableSide);
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
    const key = resultMapKey(
      r.project_id,
      r.zone_id,
      r.project_RoomName
    );

    if (!resByName.has(key)) {
      resByName.set(key, []);
    }

    resByName.get(key)!.push(r);
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

  function renderTable(
    zoneName: string,
    zoneId: string,
    zoneRooms: any[],
    tableKind: TableKind,
    tableSide: TableSide
  ) {
    if (!zoneRooms.length) return;

    const getRoomByResult = (result: any) => {
      const resultName = String(result.project_RoomName ?? "")
        .replace(" - Ventilation", "")
        .replace("-Ventilation", "")
        .trim();

      return zoneRooms.find((room) => {
        const roomName = String(room.project_RoomName ?? "").trim();
        return roomName === resultName && sameZone(room, result);
      });
    };

    const tableRows: { room: any; res: any }[] = [];

    if (tableKind === "ventilation") {
      for (const room of zoneRooms) {

        const isRoomSupply = isSupplyByRoomInput(room);
        const isRoomExhaust = isExhaustByRoomInput(room);

        if (tableSide === "supply" && !isRoomSupply) continue;
        if (tableSide === "exhaust" && !isRoomExhaust) continue;

        const res = getVentilationResultForRoom(room, resByName);

        if (Object.keys(res).length > 0) {
          tableRows.push({ room, res });
        }
      }
    } else {
      const addedRows = new Set<string>();

      for (const room of zoneRooms) {
        const resultRows = getAllResultRowsForRoom(room, resByName);

        for (const res of resultRows) {

          const isRoomSupply = isSupplyByRoomInput(room);
          const isRoomExhaust = isExhaustByRoomInput(room);

          if (tableSide === "supply" && !isRoomSupply) continue;
          if (tableSide === "exhaust" && !isRoomExhaust) continue;

          if (tableKind === "cooling") {
            const coolingDataSum =
              toNum(res.project_DehumidCfm) +
              toNum(res.project_Rem_Water_Vapour) +
              toNum(res.project_ResultCfm) +
              toNum(res.project_Room_Termi_Supply_Mod) +
              toNum(res.project_Room_AC_Load_TR) +
              toNum(res.project_Cfm_AC_Load_TR) +
              toNum(res.project_Res_Cooling_Load_TR);

            if (coolingDataSum === 0) continue;
          }

          if (tableKind === "heating") {
            const heatingDataSum =
              toNum(res.project_add_Water_Vapour) +
              toNum(res.project_HumidCfm) +
              toNum(res.project_ResultCfm_Hot) +
              toNum(res.project_Room_Term_Supply_Mod) +
              toNum(res.project_Room_Heating_Load_TR) +
              toNum(res.project_Cfm_Heating_Load_TR) +
              toNum(res.project_Result_Heating_Load_TR);

            if (heatingDataSum === 0) continue;
          }

          if (tableKind === "normal") {
            const coolingDataSum =
              toNum(res.project_DehumidCfm) +
              toNum(res.project_Rem_Water_Vapour) +
              toNum(res.project_ResultCfm) +
              toNum(res.project_Room_Termi_Supply_Mod) +
              toNum(res.project_Room_AC_Load_TR) +
              toNum(res.project_Cfm_AC_Load_TR) +
              toNum(res.project_Res_Cooling_Load_TR);

            const heatingDataSum =
              toNum(res.project_add_Water_Vapour) +
              toNum(res.project_HumidCfm) +
              toNum(res.project_ResultCfm_Hot) +
              toNum(res.project_Room_Term_Supply_Mod) +
              toNum(res.project_Room_Heating_Load_TR) +
              toNum(res.project_Cfm_Heating_Load_TR) +
              toNum(res.project_Result_Heating_Load_TR);

            // For Air Cooling and Heating System:
            // remove row if cooling section OR heating section is fully zero
            if (coolingDataSum === 0 || heatingDataSum === 0) continue;
          }

          const uniqueKey = [
            getZoneId(room),
            String(room.project_RoomName ?? "").trim(),
            tableKind,
            tableSide,
            normalizeResultRoomName(res.project_RoomName),
            toNum(res.project_ExhaustAir),
            toNum(res.project_DehumidCfm),
            toNum(res.project_Rem_Water_Vapour),
            toNum(res.project_ResultCfm),
            toNum(res.project_Room_Termi_Supply_Mod),
            toNum(res.project_Room_AC_Load_TR),
            toNum(res.project_Cfm_AC_Load_TR),
            toNum(res.project_Res_Cooling_Load_TR),
            toNum(res.project_add_Water_Vapour),
            toNum(res.project_HumidCfm),
            toNum(res.project_ResultCfm_Hot),
            toNum(res.project_Room_Term_Supply_Mod),
            toNum(res.project_Room_Heating_Load_TR),
            toNum(res.project_Cfm_Heating_Load_TR),
            toNum(res.project_Result_Heating_Load_TR),
          ].join("__");

          if (addedRows.has(uniqueKey)) continue;

          addedRows.add(uniqueKey);
          tableRows.push({ room, res });
        }
      }
    }

    if (!tableRows.length) return;

    const tableVisibleCols = getTableVisibleCols(
      zoneName,
      tableRows.map((x) => x.room)
    );

    maxCols = Math.max(maxCols, tableVisibleCols.length);

    renderTitleRow(zoneName, tableVisibleCols);

    allRows.push(
      tableVisibleCols.map((col, i) =>
        yHdr(col.label, borderForVisibleIndex(i, tableVisibleCols))
      )
    );
    rowHeights.push({ hpt: 80 });
    ri++;

    for (const { room, res } of tableRows) {
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

      const total = tableRows.reduce((sum, row) => {
        const val = parseFloat(row.res[col.key]);
        return isNaN(val) ? sum : sum + val;
      }, 0);

      return rdD(total, bl);
    });

    allRows.push(totalsRow);
    rowHeights.push({ hpt: 20 });
    ri++;

    allRows.push(Array.from({ length: tableVisibleCols.length }, () => eW()));
    rowHeights.push({ hpt: 12 });
    ri++;
  }

  for (const [zoneId, { name: zoneName, rooms: zoneRooms }] of zoneMap.entries()) {
    const firstRoom = zoneRooms[0] ?? {};
    const std = stdById.get(String(firstRoom.project_standard_id ?? "")) ?? firstStd;

    const systemTypeRaw =
      firstRoom.project_system ||
      std.project_system ||
      firstRoom.project_system_type ||
      std.project_system_type ||
      "";

    const flags = getSystemFlags(systemTypeRaw);

    if (flags.isCoolingVentilation || flags.isHeatingVentilation) {
      const typeLabel = flags.isCoolingVentilation ? "Air Cooling System" : "Air Heating System";
      const mainKind: TableKind = flags.isCoolingVentilation ? "cooling" : "heating";

      renderTable(`${zoneName} ${typeLabel} (Exhaust)`, zoneId, zoneRooms, mainKind, "exhaust");
      renderTable(`${zoneName} ${typeLabel} (Supply)`, zoneId, zoneRooms, mainKind, "supply");

      renderTable(`${zoneName} Ventilation System (Exhaust)`, zoneId, zoneRooms, "ventilation", "exhaust");
      renderTable(`${zoneName} Ventilation System (Supply)`, zoneId, zoneRooms, "ventilation", "supply");
    } else if (flags.isHeatingSystem) {
      renderTable(`${zoneName} Air Heating System (Exhaust)`, zoneId, zoneRooms, "heating", "exhaust");
      renderTable(`${zoneName} Air Heating System (Supply)`, zoneId, zoneRooms, "heating", "supply");
    } else if (flags.isCoolingSystem) {
      renderTable(`${zoneName} Air Cooling System (Exhaust)`, zoneId, zoneRooms, "cooling", "exhaust");
      renderTable(`${zoneName} Air Cooling System (Supply)`, zoneId, zoneRooms, "cooling", "supply");
    } else if (flags.isVentilationSystem) {
      renderTable(`${zoneName} Ventilation System (Exhaust)`, zoneId, zoneRooms, "ventilation", "exhaust");
      renderTable(`${zoneName} Ventilation System (Supply)`, zoneId, zoneRooms, "ventilation", "supply");
    } else {
      renderTable(`${zoneName} Air Cooling and Heating System (Exhaust)`, zoneId, zoneRooms, "normal", "exhaust");
      renderTable(`${zoneName} Air Cooling and Heating System (Supply)`, zoneId, zoneRooms, "normal", "supply");
    }
  }

  const ws = buildWS(allRows);
  ws["!merges"] = merges;
  ws["!cols"] = Array.from({ length: maxCols }, () => ({ wch: 13 }));
  ws["!rows"] = rowHeights;

  return ws;
}

function normalizeExcelOutputData(data: any) {
  const spRows = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
      ? data
      : [];

  // If API already returns old structure, keep it as-is
  if (data?.project || data?.rooms || data?.results || data?.zones || data?.standards) {
    return data;
  }

  const zoneMap = new Map<string, any>();
  const roomMap = new Map<string, any>();
  const resultRows: any[] = [];
  const standardMap = new Map<string, any>();

  for (const row of spRows) {
    const zoneId = String(row.zone_id ?? "");
    const roomName = String(row.project_RoomName ?? "").trim();
    const roomId = String(row.project_RoomId ?? "");
    const standardId = String(row.project_standard_id ?? "");

    if (zoneId && !zoneMap.has(zoneId)) {
      zoneMap.set(zoneId, {
        zone_id: row.zone_id,
        project_id: row.project_id,
        zone_name: row.zone_name,
      });
    }

    const roomKey = `${row.project_id}__${zoneId}__${roomId}__${normalizeResultRoomName(roomName)}`;

    if (!roomMap.has(roomKey)) {
      roomMap.set(roomKey, {
        ...row,
        zone_id: row.zone_id,
        zone_name: row.zone_name,
        project_RoomId: row.project_RoomId,
        project_RoomName: normalizeResultRoomName(row.project_RoomName),
        room_Length: row.room_Length,
        room_Width: row.room_Width,
        room_Height: row.room_Height,
        room_ExhaustAir: row.room_ExhaustAir,
        room_ExhaustAirCfm: row.room_ExhaustAirCfm,
        project_standard_id: row.project_standard_id,
      });
    }

    if (standardId && !standardMap.has(standardId)) {
      standardMap.set(standardId, {
        ...row,
        project_standard_id: row.project_standard_id,
      });
    }

    resultRows.push({
      ...row,
      zone_id: row.zone_id,
      project_id: row.project_id,
      project_RoomName: normalizeResultRoomName(row.project_RoomName),
    });
  }

  return {
    project: spRows[0] ?? {},
    standards: Array.from(standardMap.values()),
    rooms: Array.from(roomMap.values()),
    results: resultRows,
    zones: Array.from(zoneMap.values()),
  };
}

export async function downloadProjectXLSX(
  projectId: number,
  projectUniqueId: string,
  fetchFn: (id: number) => Promise<any>
) {
  const rawData = await fetchFn(projectId);
  const data = normalizeExcelOutputData(rawData);

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