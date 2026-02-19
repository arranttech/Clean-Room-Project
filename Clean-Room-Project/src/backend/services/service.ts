export type RoomPayload = {
  roomName: string;
  length: number; // in meters
  width: number;  // in meters
  height: number; // in meters
  acph: number;   // air changes per hour
  freshAirPercent: number; // percentage (0-100)
  exhaustAir: number;      // fraction or percentage
  zoneSystem?: string;
  zoneSystemType?: string;
};

export function airflowService(room: RoomPayload) {
  const ACPH = Number(room.acph || 0);
  const L = Number(room.length || 0);
  const W = Number(room.width || 0);
  const H = Number(room.height || 0);

  const isVentilationSystem =
    room.zoneSystem === "Ventilation System" ||
    room.zoneSystemType === "Ventilation System";

  const faPercent = isVentilationSystem ? 100 : Number(room.freshAirPercent || 0);
  const faFactor = faPercent / 100;

  const eaRaw = Number(room.exhaustAir || 0);
  const eaFactor = eaRaw > 1 ? eaRaw / 100 : eaRaw;

  // Convert area from m² to ft² (1 m² = 10.7639 ft²)
  const areaFt2 = L * W * 10.7639;

  // Convert volume from m³ to ft³ (1 m = 3.28084 ft)
  const volumeFt3 = Number((areaFt2 * H * 3.28084).toFixed(2));

  // Calculate airflow cubic feet per minute
  const roomCfm = (volumeFt3 * ACPH) / 60;

  const freshAir = isVentilationSystem ? faPercent : roomCfm * faFactor;

  const exhaustAir = roomCfm * eaFactor;

  return {
    roomName: room.roomName,
    areaFt2: Number(areaFt2.toFixed(2)),
    volumeFt3,
    roomCfm: Number(roomCfm.toFixed(3)),
    freshAir: Number(freshAir.toFixed(3)),
    exhaustAir: Number(exhaustAir.toFixed(3)),
  };
}