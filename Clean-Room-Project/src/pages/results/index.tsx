import resultsDesign from "./styles";
import resultsText from "../../json/resultsText.json";
import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/header";

// Types
type RoomForm = {
	roomName: string;
	length: string;
	width: string;
	height: string;
	occupancy: string;
	equipmentLoad: string;
	lightingLoad: string;
	infiltrationsPerHour: string;
	freshAirPercent: string;
	exhaustAir: string;
	acph?: number;
	id?: string;
	zoneId?: string;
	zoneSystem?: string;
	zoneSystemType?: string;
	zoneCoolingMethod?: string;
	zoneHeatingMethod?: string;
	zoneReqInsideTempC?: number | string;
	zoneReqInsideHum?: number | string;
	zoneStandard?: string;
	zoneClassification?: string;
};

type ResultsPayload = {
	minTempC?: number | string;
	maxTempC?: number | string;
	rhMin?: number | string;
	rhMax?: number | string;
	rooms?: RoomForm[];
};

// ─── Totals helper ───
function calcTotals(results: any[]) {
	return results.reduce(
		(acc, curr) => ({
			area: acc.area + (Number(curr.area) || 0),
			volume: acc.volume + (Number(curr.volume) || 0),
			roomCfm: acc.roomCfm + (Number(curr.roomCfm) || 0),
			freshAir: acc.freshAir + (Number(curr.freshAir) || 0),
			exhaustAir: acc.exhaustAir + (Number(curr.exhaustAir) || 0),
			dehumid: acc.dehumid + (Number(curr.dehumid) || 0),
			removedWaterVapor:
				acc.removedWaterVapor + (Number(curr.removedWaterVapor) || 0),
			resultant: acc.resultant + (Number(curr.resultant) || 0),
			roomACValue: acc.roomACValue + (Number(curr.roomACValue) || 0),
			roomTermSupplyValue:
				acc.roomTermSupplyValue + (Number(curr.roomTermSupplyValue) || 0),
			cfmACLoadTRValue:
				acc.cfmACLoadTRValue + (Number(curr.cfmACLoadTRValue) || 0),
			resultCoolLoadTRValue:
				acc.resultCoolLoadTRValue + (Number(curr.resultCoolLoadTRValue) || 0),
			AddWaterVapour: acc.AddWaterVapour + (Number(curr.AddWaterVapour) || 0),
			humidcfm: acc.humidcfm + (Number(curr.humidcfm) || 0),
			resultantCfm: acc.resultantCfm + (Number(curr.resultantCfm) || 0),
			heatroomtermsup:
				acc.heatroomtermsup + (Number(curr.heatroomtermsup) || 0),
			roomHeatLoad: acc.roomHeatLoad + (Number(curr.roomHeatLoad) || 0),
			cfmHeatLoadTRValue:
				acc.cfmHeatLoadTRValue + (Number(curr.cfmHeatLoadTRValue) || 0),
			resultHeatLoadTR:
				acc.resultHeatLoadTR + (Number(curr.resultHeatLoadTR) || 0),
		}),
		{
			area: 0,
			volume: 0,
			roomCfm: 0,
			freshAir: 0,
			exhaustAir: 0,
			dehumid: 0,
			removedWaterVapor: 0,
			resultant: 0,
			roomACValue: 0,
			roomTermSupplyValue: 0,
			cfmACLoadTRValue: 0,
			resultCoolLoadTRValue: 0,
			AddWaterVapour: 0,
			humidcfm: 0,
			resultantCfm: 0,
			heatroomtermsup: 0,
			cfmHeatLoadTRValue: 0,
			roomHeatLoad: 0,
			resultHeatLoadTR: 0,
		}
	);
}

// Component
export default function Results() {
	const s = resultsDesign;
	const t = resultsText;

	const location = useLocation();
	const props = (location.state || {}) as ResultsPayload;
	const payload = useMemo(() => props, [props]);
	const rooms = payload.rooms || [];

	// Shared CustomerInfo
	const minTemp = Number(payload.minTempC || 0);
	const maxTemp = Number(payload.maxTempC || 0);
	const rhMin = Number(payload.rhMin || 0);
	const rhMax = Number(payload.rhMax || 0);

	useEffect(() => {
		console.log("=== RESULTS PAGE DEBUG ===");
		console.log("Rooms:", rooms.length);
		const zids = [...new Set(rooms.map((r) => r.zoneId || "1"))];
		zids.forEach((zid) => {
			const zr = rooms.filter((r) => String(r.zoneId || "1") === String(zid));
			console.log(
				`Zone ${zid}: ${zr.length} rooms | System: ${zr[0]?.zoneSystem}`
			);
			zr.forEach((r, i) =>
				console.log(`  ${i + 1}: ${r.roomName} ACPH:${r.acph}`)
			);
		});
		console.log("=========================");
	}, [rooms]);

	// ─── Group rooms by zoneId ───
	const zoneGroups = useMemo(() => {
		const map = new Map<string, RoomForm[]>();
		rooms.forEach((room) => {
			const zid = String(room.zoneId || "1");
			if (!map.has(zid)) map.set(zid, []);
			map.get(zid)!.push(room);
		});
		return Array.from(map.entries()).sort(
			(a, b) => Number(a[0]) - Number(b[0])
		);
	}, [rooms]);

	// ─── Compute results for one zone (exact same formulas) ───
	const computeZone = (zoneRooms: RoomForm[]) => {
		// Read zone-level standards from first room in zone
		const first = zoneRooms[0];
		const zoneSystemName = String(first.zoneSystem || "")
			.toUpperCase()
			.trim();
		const zoneCoolingMethod = first.zoneCoolingMethod || "";
		const zoneHeatingMethod = first.zoneHeatingMethod || "";
		const reqInsideTemp = Number(first.zoneReqInsideTempC || 0);
		const reqInsideHum = Number(first.zoneReqInsideHum || 0);
		const roomClassi = String(first.zoneClassification ?? "").trim();

		// Per-zone system flags
		const isCoolingSystem = t.fields.SystemCond.cooling.some(
			(name: string) => name.toUpperCase() === zoneSystemName
		);
		const isHeatingSystem = t.fields.SystemCond.heating.some(
			(name: string) => name.toUpperCase() === zoneSystemName
		);
		const isHeatingandCoolingSystem = t.fields.SystemCond.heatandcold.some(
			(name: string) => name.toUpperCase() === zoneSystemName
		);
		const showCooling = isCoolingSystem || isHeatingandCoolingSystem;
		const showHeating = isHeatingSystem || isHeatingandCoolingSystem;

		const isVentilationSystem =
			first.zoneSystem === "Ventilation System" ||
			first.zoneSystemType === "Ventilation System";

		// Constants
		const frAirCal = t.fields.remWaterVapour.FrAirCal.value;
		const c1 = t.fields.remWaterVapour.delTempConst;
		const c2 = t.fields.remWaterVapour.watConst;
		const roomACconst = t.fields.roomACloadTR;
		const roomHeatConst = t.fields.roomHeatLoadTR;

		const isTempValid =
			!isNaN(reqInsideTemp) && first.zoneReqInsideTempC !== "";

		const results = zoneRooms.map((room) => {
			const ACPH = Number(room.acph || 0);
			const L = Number(room.length || 0);
			const W = Number(room.width || 0);
			const H = Number(room.height || 0);
			const occupancy = Number(room.occupancy || 0);
			const equipment = Number(room.equipmentLoad || 0);
			const lighting = Number(room.lightingLoad || 0);
			const infiltrationsPerHour = Number(room.infiltrationsPerHour || 0);

			let faPercent = isVentilationSystem
				? 100
				: Number(room.freshAirPercent || 0);
			const faFactor = faPercent / 100;
			const eaRaw = Number(room.exhaustAir || 0);
			const eaFactor = eaRaw > 1 ? eaRaw / 100 : eaRaw;

			const areaFt2 = L * W * 10.76;
			const volumeFt3 = Math.ceil(areaFt2 * H * 3.28 * 100) / 100;
			const roomCfm = (volumeFt3 * ACPH) / 60;
			const freshAir = isVentilationSystem ? faPercent : roomCfm * faFactor;
			const exhaustAir = roomCfm * eaFactor;

			let dehumidValue: number | string;
			let removedWaterValue: number | string;
			let roomACValue: number | string;
			let cfmACLoadTRValue: number | string = "-";
			let resultant: number | string = 0;
			let resultCoolLoadTRValue: number | string;
			let addWaterValue: number | string;
			let humidValue: number | string;
			let resultantCfm: number | string = 0;
			let roomHeatLoad: number | string = 0;
			let resultHeatLoadTR: number | string = 0;
			let cfmHeatLoadTRValue: number | string = 0;
			let delWaterVal = 0;
			let baseLoad = 0;
			let delAHUVal = 0;
			let correction = 0;
			let ERLH = 0;

			/////////////////////////// COOLING ////////////////////////////////////
			if (showCooling && isTempValid) {
				if (isVentilationSystem) {
					dehumidValue =
						Math.ceil(
							(occupancy * 200 + infiltrationsPerHour * 375 + freshAir) / 25
						) * 25;
				} else {
					dehumidValue =
						Math.ceil(
							(occupancy * 200 +
								infiltrationsPerHour * 375 +
								(exhaustAir + roomCfm)) /
								25
						) * 25;
				}

				const peakTempVP =
					c1.value1 *
					Math.pow(10, (c1.value2 * maxTemp) / (c1.value3 + maxTemp));
				const roomTempVP =
					c1.value1 *
					Math.pow(
						10,
						(c1.value2 * reqInsideTemp) / (c1.value3 + reqInsideTemp)
					);
				const humidOut = (rhMax / 100) * peakTempVP;
				const humidIn = (reqInsideHum / 100) * roomTempVP;
				const waterOut = humidOut / (c2.value2 - humidOut);
				const waterIn = humidIn / (c2.value2 - humidIn);
				const delWater = c2.value1 * (waterOut - waterIn);
				removedWaterValue = Number(
					(freshAir * frAirCal * (delWater / c2.value3)).toFixed(3)
				);

				const pc = roomACconst.PeopleConst;
				const tempdiffer =
					roomACconst.TempdiffConst.value * Math.abs(maxTemp - reqInsideTemp);
				const wallConduction = roomACconst.WallConst.value * (H * (L + W));
				const peopleNAirflow =
					pc.value1 * (occupancy * pc.value2 + (freshAir + exhaustAir));
				const equipNlight =
					roomACconst.EqupConst.value * (equipment * 1000 + lighting * areaFt2);
				const infilteration =
					infiltrationsPerHour * roomACconst.InfilterConst.value;
				const ERSH =
					tempdiffer * (wallConduction + peopleNAirflow) +
					equipNlight +
					infilteration;
				roomACValue = Number(
					(Math.ceil((ERSH / roomACconst.TonsConst.value) * 2) / 2).toFixed(2)
				);
			} else {
				dehumidValue = first.zoneReqInsideTempC || "Invalid";
				removedWaterValue = first.zoneReqInsideTempC || "Invalid";
				roomACValue = first.zoneReqInsideTempC || "Invalid";
				cfmACLoadTRValue = first.zoneReqInsideTempC || "Invalid";
			}

			const baseAirflow = roomCfm + freshAir;
			const baseResultant = Math.ceil(baseAirflow / 25) * 25;
			if (typeof dehumidValue === "number") {
				resultant = Math.ceil(Math.max(baseAirflow, dehumidValue) / 25) * 25;
			} else {
				resultant = baseResultant;
			}

			const V1 = t.fields.ClassifiCondition;
			const V2 = t.fields.roomTerminalSupply.VelocityConst;
			let Classifi = String(roomClassi || "")
				.toUpperCase()
				.trim();
			let Value = parseFloat(String(resultant));
			let result = 0;

			if (V1.ISO8Cd.includes(Classifi) || V1.ISO7Cd.includes(Classifi)) {
				result = Value / V2.ISO8VV;
			} else if (V1.ISOCd6.includes(Classifi)) {
				result = Value / V2.ISO6VV;
			} else if (V1.ISOCd5.includes(Classifi)) {
				result = Value / V2.ISO5VV;
			} else if (V1.ISOCd4.includes(Classifi)) {
				result = Value / V2.ISO4VV;
			} else if (V1.ISOCd3.includes(Classifi)) {
				result = Value / V2.ISO3VV;
			} else if (V1.ISOCd2.includes(Classifi)) {
				result = Value / V2.ISO2VV;
			} else if (V1.ISOCd1.includes(Classifi)) {
				result = Value / V2.ISO1VV;
			} else {
				result = Value / V2.NCVV;
			}

			if (result > 0) result = Number(result.toFixed(2));
			const roomTermSupplyValue = Math.ceil(result / 2) * 2;

			if (isTempValid) {
				let rawValue = 0;
				if (typeof resultant === "number") {
					let divisor = 0;
					if (zoneCoolingMethod === "Chilled Water") divisor = 400;
					else if (zoneCoolingMethod === "DX") divisor = 300;
					else if (zoneCoolingMethod === "Brine") divisor = 600;
					if (divisor > 0) rawValue = resultant / divisor;
				}
				cfmACLoadTRValue = Math.ceil(rawValue / 0.5) * 0.5;
				resultCoolLoadTRValue =
					Math.ceil(
						Math.max(Number(roomACValue), Number(cfmACLoadTRValue)) / 0.5
					) * 0.5;
			} else {
				cfmACLoadTRValue = first.zoneReqInsideTempC || "Invalid";
				resultCoolLoadTRValue = first.zoneReqInsideTempC || "Invalid";
			}

			/////////////////////////// HEATING ////////////////////////////////////
			if (showHeating && isTempValid) {
				const peakTempMin =
					c1.value1 *
					Math.pow(10, (c1.value2 * minTemp) / (c1.value3 + minTemp));
				const roomAWVTemp =
					c1.value1 *
					Math.pow(
						10,
						(c1.value2 * reqInsideTemp) / (c1.value3 + reqInsideTemp)
					);
				const humidOut = (rhMin / 100) * peakTempMin;
				const humidIn = (reqInsideHum / 100) * roomAWVTemp;
				const waterOut = humidOut / (c2.value2 - humidOut);
				const waterIn = humidIn / (c2.value2 - humidIn);
				const delWater = Number((c2.value1 * (waterOut - waterIn)).toFixed(3));
				addWaterValue = Math.abs(
					Number((freshAir * frAirCal * (delWater / c2.value3)).toFixed(3))
				);

				const peakTempAHU =
					c1.value1 *
					Math.pow(
						10,
						(c1.value2 * (reqInsideTemp - 8)) /
							(c1.value3 + (reqInsideTemp - 8))
					);
				const roomTempAHU =
					c1.value1 *
					Math.pow(
						10,
						(c1.value2 * reqInsideTemp) / (c1.value3 + reqInsideTemp)
					);
				const humidAHUOut = ((reqInsideHum + 40) / 100) * peakTempAHU;
				const humidAHUIn = (reqInsideHum / 100) * roomTempAHU;
				const waterAHUOut = humidAHUOut / (c2.value2 - humidAHUOut);
				const waterAHUIn = humidAHUIn / (c2.value2 - humidAHUIn);
				const delWatAHU = Number(
					(c2.value1 * (waterAHUOut - waterAHUIn)).toFixed(3)
				);
				delAHUVal = 0.68 * delWatAHU;
				delWaterVal = 0.68 * delWater;
				const waterRatio = delWater !== 0 ? delAHUVal / delWaterVal : 0;
				const freshroomCal = freshAir + exhaustAir;
				baseLoad =
					occupancy * 200 +
					infiltrationsPerHour * 375 +
					Number(freshroomCal.toFixed(3));
				correction = (roomCfm - freshAir) * waterRatio;
				humidValue = Math.ceil((baseLoad + correction) / 25) * 25;
				ERLH = delWaterVal * baseLoad + (roomCfm - freshAir) * delAHUVal;
			} else {
				addWaterValue = first.zoneReqInsideTempC || "Invalid";
				humidValue = first.zoneReqInsideTempC || "Invalid";
			}

			// HEAT RESULTANT CFM//
			if (typeof humidValue === "number") {
				resultantCfm =
					Math.ceil(Math.max(roomCfm + freshAir, humidValue) / 25) * 25;
			} else {
				resultantCfm = Math.ceil((roomCfm + freshAir) / 25) * 25;
			}

			let heatValue = parseFloat(String(resultantCfm));
			let heatresult = 0;
			if (V1.ISO8Cd.includes(Classifi) || V1.ISO7Cd.includes(Classifi)) {
				heatresult = heatValue / V2.ISO8VV;
			} else if (V1.ISOCd6.includes(Classifi)) {
				heatresult = heatValue / V2.ISO5VV;
			} else if (V1.ISOCd5.includes(Classifi)) {
				heatresult = heatValue / V2.ISO5VV;
			} else if (V1.ISOCd4.includes(Classifi)) {
				heatresult = heatValue / V2.ISO4VV;
			} else if (V1.ISOCd3.includes(Classifi)) {
				heatresult = heatValue / V2.ISO3VV;
			} else if (V1.ISOCd2.includes(Classifi)) {
				heatresult = heatValue / V2.ISO2VV;
			} else if (V1.ISOCd1.includes(Classifi)) {
				heatresult = heatValue / V2.ISO1VV;
			} else {
				heatresult = heatValue / V2.NCVV;
			}

			if (heatresult > 0) heatresult = Number(heatresult.toFixed(2));
			const roomTermSupplyHeatValue = Math.ceil(heatresult / 2) * 2;

			if (isTempValid) {
				let rawValue = 0;
				if (typeof resultantCfm === "number" && resultantCfm > 0) {
					let divisor = 0;
					const method = zoneHeatingMethod?.trim();
					if (method === "Hot Water" || method === "Steam") divisor = 400;
					if (divisor > 0) rawValue = resultantCfm / divisor;
				}
				cfmHeatLoadTRValue = Math.ceil(rawValue / 0.5) * 0.5;

				const pc = roomACconst.PeopleConst;
				const hc = roomHeatConst;
				const tempdiffer =
					roomACconst.TempdiffConst.value * (minTemp - reqInsideTemp);
				const dimenCal =
					Number((hc.value1 * tempdiffer).toFixed(5)) *
					(H * 2 * (L + W) + L * W);
				const FilterCal = Number(
					(hc.value2 * (L * W + infiltrationsPerHour * hc.value3)).toFixed(5)
				);
				const equpNlightn = Number(
					(
						roomACconst.EqupConst.value *
						(equipment * hc.value4 + lighting * areaFt2)
					).toFixed(5)
				);
				const peopCal = Number(
					(
						pc.value1 *
						tempdiffer *
						(occupancy * pc.value2 + Number((freshAir + exhaustAir).toFixed(2)))
					).toFixed(5)
				);
				const HeatERSH = dimenCal + FilterCal + equpNlightn + peopCal;
				const ERTH = HeatERSH + ERLH;
				const roomheatloadConst = ERTH / roomACconst.TonsConst.value;
				roomHeatLoad = Number(Math.ceil(Math.abs(roomheatloadConst) * 2) / 2);
				resultHeatLoadTR =
					Math.ceil(
						Math.max(Number(roomHeatLoad), Number(cfmHeatLoadTRValue)) / 0.5
					) * 0.5;
			} else {
				cfmHeatLoadTRValue = first.zoneReqInsideTempC || "Invalid";
				roomHeatLoad = first.zoneReqInsideTempC || "Invalid";
				resultHeatLoadTR = first.zoneReqInsideTempC || "Invalid";
			}

			return {
				roomName: room.roomName,
				area: Number(areaFt2.toFixed(2)),
				volume: Number(volumeFt3.toFixed(2)),
				roomCfm: Number(roomCfm.toFixed(3)),
				freshAir: Number(freshAir.toFixed(3)),
				exhaustAir: Number(exhaustAir.toFixed(3)),
				dehumid: dehumidValue,
				removedWaterVapor: removedWaterValue,
				AddWaterVapour: addWaterValue,
				humidcfm: humidValue,
				resultant,
				roomACValue,
				roomTermSupplyValue,
				cfmACLoadTRValue,
				resultCoolLoadTRValue,
				resultantCfm,
				heatroomtermsup: roomTermSupplyHeatValue,
				cfmHeatLoadTRValue,
				roomHeatLoad,
				resultHeatLoadTR,
			};
		});

		return {
			results,
			showCooling,
			showHeating,
			isHeatingandCoolingSystem,
			zoneSystem: first.zoneSystem || "",
			zoneClassification: first.zoneClassification || "",
			zoneStandard: first.zoneStandard || "",
		};
	};

	// ─── Compute all zones ───
	const zoneData = useMemo(() => {
		return zoneGroups.map(([zid, zoneRooms]) => ({
			zoneId: zid,
			...computeZone(zoneRooms),
		}));
	}, [zoneGroups, minTemp, maxTemp, rhMin, rhMax]);

	// UI
	return (
		<>
			<Header />
			<div className={s.wrap}>
				<div className={s.card}>
					<div className={s.headerSection}>
						<div className={s.title}>{t.title}</div>
						<div className={s.subtitle}>{t.subtitle}</div>
					</div>

					{zoneData.map(
						({
							zoneId,
							results,
							showCooling,
							showHeating,
							isHeatingandCoolingSystem,
							zoneSystem,
							zoneStandard,
							zoneClassification,
						}) => {
							const totals = calcTotals(results);

							return (
								<div key={zoneId} style={{ marginBottom: "48px" }}>
									{/* Zone header with system info */}
									<h2
										style={{
											fontSize: "1.25rem",
											fontWeight: 700,
											padding: "12px 16px",
											marginBottom: "12px",
											background: "#f0f4ff",
											borderRadius: "8px",
											color: "#1e3a5f",
										}}
									>
										Zone {zoneId} — {zoneSystem} ({zoneStandard} /{" "}
										{zoneClassification})
									</h2>

									{/* ══════ Case 1: Heating AND Cooling → 2 tables ══════ */}
									{isHeatingandCoolingSystem ? (
										<>
											<h3 className={s.headerSubTitle}>Cooling Results</h3>
											<div
												className={s.tableOuter}
												style={{ marginBottom: "40px" }}
											>
												<div className={s.tableScroll}>
													<table className={s.table}>
														<thead className={s.thead}>
															<tr>
																<th className={s.thRoom}>Room Name</th>
																<th className={s.th}>{t.fields.area.label}</th>
																<th className={s.th}>
																	{t.fields.volume.label}
																</th>
																<th className={s.th}>
																	{t.fields.roomCfm.label}
																</th>
																<th className={s.th}>
																	{t.fields.freshAir.label}
																</th>
																<th className={s.th}>
																	{t.fields.exhaustAir.label}
																</th>
																<th className={s.th}>
																	{t.fields.Dehumidification.label}
																</th>
																<th className={s.th}>
																	{t.fields.remWaterVapour.label}
																</th>
																<th className={s.th}>
																	{t.fields.resultantCfm.label}
																</th>
																<th className={s.th}>
																	{t.fields.RoomACloadTR.label}
																</th>
																<th className={s.th}>
																	{t.fields.RoomTerminalSupply.label}
																</th>
																<th className={s.th}>
																	{t.fields.cfmACLoadTR.label}
																</th>
																<th className={s.th}>
																	{t.fields.ResultCoolLoadTR.label}
																</th>
															</tr>
														</thead>
														<tbody>
															{results.map((r: any, idx: number) => (
																<tr key={idx} className={s.tr}>
																	<td className={s.tdRoom}>
																		{r.roomName || `Room ${idx + 1}`}
																	</td>
																	<td className={s.td}>{r.area}</td>
																	<td className={s.td}>{r.volume}</td>
																	<td className={s.td}>{r.roomCfm}</td>
																	<td className={s.td}>{r.freshAir}</td>
																	<td className={s.td}>{r.exhaustAir}</td>
																	<td className={s.td}>{r.dehumid}</td>
																	<td className={s.td}>
																		{r.removedWaterVapor}
																	</td>
																	<td className={s.td}>{r.resultant}</td>
																	<td className={s.td}>{r.roomACValue}</td>
																	<td className={s.td}>
																		{r.roomTermSupplyValue}
																	</td>
																	<td className={s.td}>{r.cfmACLoadTRValue}</td>
																	<td className={s.td}>
																		{r.resultCoolLoadTRValue}
																	</td>
																</tr>
															))}
															<tr
																className={s.tr}
																style={{ fontWeight: "bold" }}
															>
																<td className={s.tdRoom}>TOTAL</td>
																<td className={s.td}>
																	{totals.area.toFixed(2)}
																</td>
																<td className={s.td}>
																	{totals.volume.toFixed(2)}
																</td>
																<td className={s.td}>
																	{totals.roomCfm.toFixed(2)}
																</td>
																<td className={s.td}>
																	{totals.freshAir.toFixed(2)}
																</td>
																<td className={s.td}>
																	{totals.exhaustAir.toFixed(2)}
																</td>
																<td className={s.td}>{totals.dehumid}</td>
																<td className={s.td}>
																	{totals.removedWaterVapor.toFixed(3)}
																</td>
																<td className={s.td}>{totals.resultant}</td>
																<td className={s.td}>
																	{totals.roomACValue.toFixed(2)}
																</td>
																<td className={s.td}>
																	{totals.roomTermSupplyValue}
																</td>
																<td className={s.td}>
																	{totals.cfmACLoadTRValue.toFixed(2)}
																</td>
																<td className={s.td}>
																	{totals.resultCoolLoadTRValue.toFixed(2)}
																</td>
															</tr>
														</tbody>
													</table>
												</div>
											</div>

											<h3 className={s.headerSubTitle}>Heating Results</h3>
											<div className={s.tableOuter}>
												<div className={s.tableScroll}>
													<table className={s.table}>
														<thead className={s.thead}>
															<tr>
																<th className={s.thRoom}>Room Name</th>
																<th className={s.th}>{t.fields.area.label}</th>
																<th className={s.th}>
																	{t.fields.volume.label}
																</th>
																<th className={s.th}>
																	{t.fields.roomCfm.label}
																</th>
																<th className={s.th}>
																	{t.fields.freshAir.label}
																</th>
																<th className={s.th}>
																	{t.fields.exhaustAir.label}
																</th>
																<th className={s.th}>
																	{t.fields.AddWaterVapour.label}
																</th>
																<th className={s.th}>
																	{t.fields.Humidification.label}
																</th>
																<th className={s.th}>
																	{t.fields.HeatResultantCfm.label}
																</th>
																<th className={s.th}>
																	{t.fields.HeatRoomTerminalSupply.label}
																</th>
																<th className={s.th}>
																	{t.fields.CfmHeatingLoadTR.label}
																</th>
																<th className={s.th}>
																	{t.fields.RoomHeatingLoadinTR.label}
																</th>
																<th className={s.th}>
																	{t.fields.ResHeatingLoadinTR.label}
																</th>
															</tr>
														</thead>
														<tbody>
															{results.map((r: any, idx: number) => (
																<tr key={idx} className={s.tr}>
																	<td className={s.tdRoom}>
																		{r.roomName || `Room ${idx + 1}`}
																	</td>
																	<td className={s.td}>{r.area}</td>
																	<td className={s.td}>{r.volume}</td>
																	<td className={s.td}>{r.roomCfm}</td>
																	<td className={s.td}>{r.freshAir}</td>
																	<td className={s.td}>{r.exhaustAir}</td>
																	<td className={s.td}>{r.AddWaterVapour}</td>
																	<td className={s.td}>{r.humidcfm}</td>
																	<td className={s.td}>{r.resultantCfm}</td>
																	<td className={s.td}>{r.heatroomtermsup}</td>
																	<td className={s.td}>
																		{r.cfmHeatLoadTRValue}
																	</td>
																	<td className={s.td}>{r.roomHeatLoad}</td>
																	<td className={s.td}>{r.resultHeatLoadTR}</td>
																</tr>
															))}
															<tr
																className={s.tr}
																style={{ fontWeight: "bold" }}
															>
																<td className={s.tdRoom}>TOTAL</td>
																<td className={s.td}>
																	{totals.area.toFixed(2)}
																</td>
																<td className={s.td}>
																	{totals.volume.toFixed(2)}
																</td>
																<td className={s.td}>
																	{totals.roomCfm.toFixed(2)}
																</td>
																<td className={s.td}>
																	{totals.freshAir.toFixed(2)}
																</td>
																<td className={s.td}>
																	{totals.exhaustAir.toFixed(2)}
																</td>
																<td className={s.td}>
																	{totals.AddWaterVapour.toFixed(3)}
																</td>
																<td className={s.td}>{totals.humidcfm}</td>
																<td className={s.td}>{totals.resultantCfm}</td>
																<td className={s.td}>
																	{totals.heatroomtermsup}
																</td>
																<td className={s.td}>
																	{totals.cfmHeatLoadTRValue}
																</td>
																<td className={s.td}>{totals.roomHeatLoad}</td>
																<td className={s.td}>
																	{totals.resultHeatLoadTR}
																</td>
															</tr>
														</tbody>
													</table>
												</div>
											</div>
										</>
									) : (
										/* ══════ Case 2: Single system — conditional columns ══════ */
										<div className={s.tableOuter}>
											<div className={s.tableScroll}>
												<table className={s.table}>
													<thead className={s.thead}>
														<tr>
															<th className={s.thRoom}>Room Name</th>
															<th className={s.th}>{t.fields.area.label}</th>
															<th className={s.th}>{t.fields.volume.label}</th>
															<th className={s.th}>{t.fields.roomCfm.label}</th>
															<th className={s.th}>
																{t.fields.freshAir.label}
															</th>
															<th className={s.th}>
																{t.fields.exhaustAir.label}
															</th>
															{showCooling && (
																<>
																	<th className={s.th}>
																		{t.fields.Dehumidification.label}
																	</th>
																	<th className={s.th}>
																		{t.fields.remWaterVapour.label}
																	</th>
																	<th className={s.th}>
																		{t.fields.resultantCfm.label}
																	</th>
																	<th className={s.th}>
																		{t.fields.RoomACloadTR.label}
																	</th>
																	<th className={s.th}>
																		{t.fields.RoomTerminalSupply.label}
																	</th>
																	<th className={s.th}>
																		{t.fields.cfmACLoadTR.label}
																	</th>
																	<th className={s.th}>
																		{t.fields.ResultCoolLoadTR.label}
																	</th>
																</>
															)}
															{showHeating && (
																<>
																	<th className={s.th}>
																		{t.fields.AddWaterVapour.label}
																	</th>
																	<th className={s.th}>
																		{t.fields.Humidification.label}
																	</th>
																	<th className={s.th}>
																		{t.fields.HeatResultantCfm.label}
																	</th>
																	<th className={s.th}>
																		{t.fields.HeatRoomTerminalSupply.label}
																	</th>
																	<th className={s.th}>
																		{t.fields.CfmHeatingLoadTR.label}
																	</th>
																	<th className={s.th}>
																		{t.fields.RoomHeatingLoadinTR.label}
																	</th>
																	<th className={s.th}>
																		{t.fields.ResHeatingLoadinTR.label}
																	</th>
																</>
															)}
														</tr>
													</thead>
													<tbody>
														{results.length > 0 ? (
															results.map((r: any, idx: number) => (
																<tr key={idx} className={s.tr}>
																	<td className={s.tdRoom}>
																		{r.roomName || `Room ${idx + 1}`}
																	</td>
																	<td className={s.td}>{r.area}</td>
																	<td className={s.td}>{r.volume}</td>
																	<td className={s.td}>{r.roomCfm}</td>
																	<td className={s.td}>{r.freshAir}</td>
																	<td className={s.td}>{r.exhaustAir}</td>
																	{showCooling && (
																		<>
																			<td className={s.td}>{r.dehumid}</td>
																			<td className={s.td}>
																				{r.removedWaterVapor}
																			</td>
																			<td className={s.td}>{r.resultant}</td>
																			<td className={s.td}>{r.roomACValue}</td>
																			<td className={s.td}>
																				{r.roomTermSupplyValue}
																			</td>
																			<td className={s.td}>
																				{r.cfmACLoadTRValue}
																			</td>
																			<td className={s.td}>
																				{r.resultCoolLoadTRValue}
																			</td>
																		</>
																	)}
																	{showHeating && (
																		<>
																			<td className={s.td}>
																				{r.AddWaterVapour}
																			</td>
																			<td className={s.td}>{r.humidcfm}</td>
																			<td className={s.td}>{r.resultantCfm}</td>
																			<td className={s.td}>
																				{r.heatroomtermsup}
																			</td>
																			<td className={s.td}>
																				{r.cfmHeatLoadTRValue}
																			</td>
																			<td className={s.td}>{r.roomHeatLoad}</td>
																			<td className={s.td}>
																				{r.resultHeatLoadTR}
																			</td>
																		</>
																	)}
																</tr>
															))
														) : (
															<tr>
																<td className={s.emptyRow} colSpan={20}>
																	No rooms added yet.
																</td>
															</tr>
														)}
														{results.length > 0 && (
															<tr
																className={s.tr}
																style={{ fontWeight: "bold" }}
															>
																<td className={s.tdRoom}>TOTAL</td>
																<td className={s.td}>
																	{totals.area.toFixed(2)}
																</td>
																<td className={s.td}>
																	{totals.volume.toFixed(2)}
																</td>
																<td className={s.td}>
																	{totals.roomCfm.toFixed(2)}
																</td>
																<td className={s.td}>
																	{totals.freshAir.toFixed(2)}
																</td>
																<td className={s.td}>
																	{totals.exhaustAir.toFixed(2)}
																</td>
																{showCooling && (
																	<>
																		<td className={s.td}>{totals.dehumid}</td>
																		<td className={s.td}>
																			{totals.removedWaterVapor.toFixed(3)}
																		</td>
																		<td className={s.td}>{totals.resultant}</td>
																		<td className={s.td}>
																			{totals.roomACValue.toFixed(2)}
																		</td>
																		<td className={s.td}>
																			{totals.roomTermSupplyValue}
																		</td>
																		<td className={s.td}>
																			{totals.cfmACLoadTRValue.toFixed(2)}
																		</td>
																		<td className={s.td}>
																			{totals.resultCoolLoadTRValue.toFixed(2)}
																		</td>
																	</>
																)}
																{showHeating && (
																	<>
																		<td className={s.td}>
																			{totals.AddWaterVapour.toFixed(3)}
																		</td>
																		<td className={s.td}>{totals.humidcfm}</td>
																		<td className={s.td}>
																			{totals.resultantCfm}
																		</td>
																		<td className={s.td}>
																			{totals.heatroomtermsup}
																		</td>
																		<td className={s.td}>
																			{totals.cfmHeatLoadTRValue}
																		</td>
																		<td className={s.td}>
																			{totals.roomHeatLoad}
																		</td>
																		<td className={s.td}>
																			{totals.resultHeatLoadTR}
																		</td>
																	</>
																)}
															</tr>
														)}
													</tbody>
												</table>
											</div>
										</div>
									)}
								</div>
							);
						}
					)}

					{zoneData.length === 0 && (
						<div
							style={{ padding: "40px", textAlign: "center", color: "#999" }}
						>
							No rooms added yet.
						</div>
					)}
				</div>
			</div>
		</>
	);
}
