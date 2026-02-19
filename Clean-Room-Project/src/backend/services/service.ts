
export type RoomPayload = {
    roomName: string;
    length: number;
    width: number;
    height: number;
    acph: number;
    freshAirPercent: number;
    exhaustAir: number;
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

    let faPercent = isVentilationSystem ? 100 : Number(room.freshAirPercent || 0);

    const faFactor = faPercent / 100;

    const eaRaw = Number(room.exhaustAir || 0);
    const eaFactor = eaRaw > 1 ? eaRaw / 100 : eaRaw;

  /* ================= CALCULATIONS ================= */

  const areaFt2 = L * W * 10.76;

  const volumeFt3 = Math.ceil(areaFt2 * H * 3.28 * 100) / 100;

  const roomCfm = (volumeFt3 * ACPH) / 60;

  const freshAir = isVentilationSystem ? faPercent : roomCfm * faFactor;

  const exhaustAir = roomCfm * eaFactor;

  /* ================= RESPONSE ================= */

    return {
    roomName: room.roomName,
    areaFt2: Number(areaFt2.toFixed(2)),
    volumeFt3: Number(volumeFt3.toFixed(2)),
    roomCfm: Number(roomCfm.toFixed(3)),
    freshAir: Number(freshAir.toFixed(3)),
    exhaustAir: Number(exhaustAir.toFixed(3)),
    };
}