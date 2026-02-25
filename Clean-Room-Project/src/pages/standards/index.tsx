import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import {
	updateStandardsField,
	updateMultipleStandardsFields,
} from "../../redux/slices/standardSlice";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import standardDesign from "./styles";
import standardDataJson from "../../json/standardData.json";
import {
	roomStandards,
	createProjectZone,
	getRoomStandards,
} from "../../backend/controller/controller";
import { Tooltip } from "../../components/toolTip";
import constants from "../../json/constants.json";

type StandardItem = {
	id: number;
	title: string;
	classifications: {
		name: string;
		minAir: number | null;
		maxAir: number | null;
	}[];
};
type StandardJson = { standards: StandardItem[]; text: any };

const data = standardDataJson as unknown as StandardJson;
const standardsData = data.standards;
const t = data.text;

function celsiusToFahrenheit(c: number): number {
	return (c * 9) / 5 + 32;
}
function fahrenheitToCelsius(f: number): number {
	return ((f - 32) * 5) / 9;
}
function roundTo(n: number, decimals: number): number {
	const p = Math.pow(10, decimals);
	return Math.round(n * p) / p;
}
function isNumericLike(s: string): boolean {
	return /^-?\d*\.?\d*$/.test(s);
}
function isRealNumberString(s: string): boolean {
	return /^-?\d+(\.\d+)?$/.test(s);
}
const temperature_range = { min: -30, max: 60 };
function validateTemperature(value: string): string {
	if (!value) return "";
	const num = Number(value);
	if (Number.isNaN(num)) return "Temperature must be a number";
	if (num < temperature_range.min || num > temperature_range.max)
		return "Temperature must be between -30°C and 60°C";
	return "";
}
const humidity_range = { min: 0, max: 100 };
function allowNumericInput(
	setter: (v: string) => void,
	value: string,
	range = humidity_range
) {
	if (value === "" || isNumericLike(value)) setter(value);
	if (!/^[\d*\.?\d*]{0,3}$/.test(value)) return;
	const num = Number(value);
	if (Number.isNaN(num)) return;
	if (num < range.min || num > range.max) return;
	setter(value);
}
function validateHumidity(value: string): string {
	if (!value) return "";
	const num = Number(value);
	if (Number.isNaN(num)) return "Humidity must be a number";
	if (num < 0 || num > 100) return "Humidity must be between 0 and 100";
	return "";
}
function clamp(n: number, min: number, max: number) {
	return Math.min(max, Math.max(min, n));
}
function isSteamMedium(m: string) {
	return String(m || "")
		.toLowerCase()
		.includes("steam");
}
function getFlowVelocityRange(medium: string) {
	return isSteamMedium(medium) ? { min: 3, max: 25 } : { min: 0.5, max: 2.5 };
}
function formatMediumLabel(medium: string) {
	return medium ? medium : "Select Method";
}

export default function Standard() {
	const s = standardDesign;
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const projectIdFromRedux = useAppSelector(
		(state: any) => state.projectInfo.projectId
	);
	const projectId = location.state?.projectId ?? projectIdFromRedux;

	// read zoneId from Redux to detect "Add Another Zone" reset
	const zoneIdFromRedux = useAppSelector(
		(state: any) => state.standards.zoneId
	);

	const standard = useAppSelector((state: any) => state.standards.standard);
	const classification = useAppSelector(
		(state: any) => state.standards.classification
	);
	const acph = useAppSelector((state: any) => state.standards.acph);
	const system = useAppSelector((state: any) => state.standards.system);
	const systemType = useAppSelector((state: any) => state.standards.systemType);
	const heatingMethod = useAppSelector(
		(state: any) => state.standards.heatingMethod
	);
	const coolingMethod = useAppSelector(
		(state: any) => state.standards.coolingMethod
	);
	const tempUnit = useAppSelector((state: any) => state.standards.tempUnit);
	const reqInsideTempC = useAppSelector(
		(state: any) => state.standards.reqInsideTempC
	);
	const reqInsideTempDisplay = useAppSelector(
		(state: any) => state.standards.reqInsideTempDisplay
	);
	const reqInsideHum = useAppSelector(
		(state: any) => state.standards.reqInsideHum
	);
	const flowVelocity = useAppSelector(
		(state: any) => state.standards.flowVelocity
	);
	const heatingFlowVelocity = useAppSelector(
		(state: any) => state.standards.heatingFlowVelocity
	);
	const coolingFlowVelocity = useAppSelector(
		(state: any) => state.standards.coolingFlowVelocity
	);

	const minTempC = useAppSelector((state: any) => state.projectInfo.minTemp);
	const maxTempC = useAppSelector((state: any) => state.projectInfo.maxTemp);
	const rhMin = useAppSelector(
		(state: any) => state.projectInfo.relativeHumidityMin
	);
	const rhMax = useAppSelector(
		(state: any) => state.projectInfo.relativeHumidityMax
	);

	const [errors, setErrors] = useState({
		standard: "",
		classification: "",
		acph: "",
		system: "",
		systemType: "",
		heatingMethod: "",
		coolingMethod: "",
		humidity: "",
		temperature: "",
	});

	useEffect(() => {
		if (!projectId) return;
		if (zoneIdFromRedux === null) return; //  skip if Add Another Zone was clicked
		if (standard) return; //  skip if already pre-filled
		const fetchStandards = async () => {
			try {
				const data = await getRoomStandards(projectId);
				const std = data.standards?.[0];
				if (std) {
					dispatch(
						updateMultipleStandardsFields({
							system: std.project_system || "",
							systemType: std.project_system_type || "",
							heatingMethod: std.project_heating_method || "",
							coolingMethod: std.project_cooling_method || "",
							standard: std.project_standard || "",
							classification: std.project_classification_name || "",
							acph: std.project_ACPH ? String(std.project_ACPH) : "",
							tempUnit: std.project_temp_unit || "C",
							reqInsideTempC: std.project_required_inside_temp
								? String(std.project_required_inside_temp)
								: "",
							reqInsideTempDisplay: std.project_required_inside_temp
								? String(std.project_required_inside_temp)
								: "",
							reqInsideHum: std.project_required_inside_humid
								? String(std.project_required_inside_humid)
								: "",
							flowVelocity: std.flow_velocity || 1.5,
						})
					);
				}
			} catch (error) {
				console.error("Failed to fetch room standards:", error);
			}
		};
		fetchStandards();
	}, [projectId, zoneIdFromRedux]);

	const selectedStandard = standardsData.find((x) => x.title === standard);
	const SPECIAL_STANDARDS = ["NC-Non Classified", "ISO 14698", "SCHEDULE M"];

	const isNonClassifiedSystem = useMemo(
		() => systemType.toLowerCase().includes("non-classified"),
		[systemType]
	);

	const filteredStandardsData = useMemo(() => {
		if (systemType !== "" && !isNonClassifiedSystem)
			return standardsData.filter(
				(item) => !SPECIAL_STANDARDS.includes(item.title)
			);
		return standardsData;
	}, [systemType, isNonClassifiedSystem]);

	const classList = useMemo(() => {
		if (!selectedStandard) return [];
		if (SPECIAL_STANDARDS.includes(selectedStandard.title))
			return selectedStandard.classifications;
		return selectedStandard.classifications.filter((c) => {
			const isNCClass =
				c.name.toLowerCase().includes("non classified") ||
				c.name.toLowerCase().includes("non-classified");
			return isNonClassifiedSystem ? isNCClass : !isNCClass;
		});
	}, [selectedStandard, isNonClassifiedSystem]);

	const selectedClass = classList.find((c) => c.name === classification);

	const acphOptions = useMemo(() => {
		const out: number[] = [];
		if (selectedClass?.minAir != null && selectedClass?.maxAir != null) {
			for (let v = selectedClass.minAir; v <= selectedClass.maxAir; v++)
				out.push(v);
		}
		return out;
	}, [selectedClass]);

	const acphDisabled =
		!selectedClass ||
		selectedClass.minAir == null ||
		selectedClass.maxAir == null;

	useEffect(() => {
		if (!selectedClass) {
			dispatch(updateStandardsField({ field: "acph", value: "" }));
			return;
		}
		if (selectedClass.minAir == null || selectedClass.maxAir == null) {
			dispatch(updateStandardsField({ field: "acph", value: "" }));
			return;
		}
		const min = selectedClass.minAir;
		const max = selectedClass.maxAir;
		const current = Number(acph);
		const isCurrentValid =
			acph !== "" && !Number.isNaN(current) && current >= min && current <= max;
		if (!isCurrentValid)
			dispatch(updateStandardsField({ field: "acph", value: String(max) }));
	}, [classification, selectedClass, acph, dispatch]);

	const isHeating =
		system === t.options.systems.heating ||
		system === t.options.systems.heatingVentilation ||
		system === t.options.systems.heatingCooling;
	const isCooling =
		system === t.options.systems.cooling ||
		system === t.options.systems.coolingVentilation ||
		system === t.options.systems.heatingCooling;
	const isVentilation =
		system === t.options.systems.ventilation ||
		system === t.options.systems.coolingVentilation ||
		system === t.options.systems.heatingVentilation;
	const ventilationOnly =
		(isVentilation && !isHeating && !isCooling) ||
		systemType === t.options.systems.ventilation;
	const showHeatingMethod = isHeating && !ventilationOnly;
	const showCoolingMethod = isCooling && !ventilationOnly;
	const isHeatingCooling = system === t.options.systems.heatingCooling;
	const isCoolingVent = system === t.options.systems.coolingVentilation;
	const isHeatingVent = system === t.options.systems.heatingVentilation;

	const systemTypeLabel = isHeatingCooling
		? t.labels.systemTypeGeneric
		: isHeatingVent
		? t.labels.systemTypeHeating
		: isCoolingVent
		? t.labels.systemTypeCooling
		: isHeating
		? t.labels.systemTypeHeating
		: isCooling
		? t.labels.systemTypeCooling
		: t.labels.systemTypeVentilation;
	const systemTypePlaceholder = isHeatingCooling
		? t.placeholders.systemTypeGeneric
		: isHeatingVent
		? t.placeholders.systemTypeHeating
		: isCoolingVent
		? t.placeholders.systemTypeCooling
		: isHeating
		? t.placeholders.systemTypeHeating
		: isCooling
		? t.placeholders.systemTypeCooling
		: t.placeholders.systemTypeVentilation;

	const systemTypes = useMemo(() => {
		if (!system) return [];
		if (isHeatingCooling) return t.options.systemTypes.combined || [];
		if (isHeatingVent) return t.options.systemTypes.heatingVent || [];
		if (isCoolingVent) return t.options.systemTypes.coolingVent || [];
		if (system === t.options.systems.heating)
			return t.options.systemTypes.heating || [];
		if (system === t.options.systems.cooling)
			return t.options.systemTypes.cooling || [];
		if (system === t.options.systems.ventilation)
			return t.options.systemTypes.ventilation || [];
		if (isHeating) return t.options.systemTypes.heating || [];
		if (isCooling) return t.options.systemTypes.cooling || [];
		if (isVentilation) return t.options.systemTypes.ventilation || [];
		return [];
	}, [
		system,
		isHeatingCooling,
		isHeatingVent,
		isCoolingVent,
		isHeating,
		isCooling,
		isVentilation,
	]);

	const heatingMethods: string[] = t.options.methods.heating || [];
	const coolingMethods: string[] = t.options.methods.cooling || [];

	useEffect(() => {
		if (ventilationOnly) {
			dispatch(
				updateMultipleStandardsFields({
					heatingMethod: "",
					coolingMethod: "",
					reqInsideTempC: t.misc.ambient,
					reqInsideTempDisplay: t.misc.ambient,
					reqInsideHum: t.misc.ambient,
				})
			);
		} else {
			if (reqInsideTempC === t.misc.ambient)
				dispatch(updateStandardsField({ field: "reqInsideTempC", value: "" }));
			if (reqInsideTempDisplay === t.misc.ambient)
				dispatch(
					updateStandardsField({ field: "reqInsideTempDisplay", value: "" })
				);
			if (reqInsideHum === t.misc.ambient)
				dispatch(updateStandardsField({ field: "reqInsideHum", value: "" }));
		}
	}, [system, systemType, ventilationOnly]);

	const tempToDisplay = (cStr: string): string => {
		if (!cStr) return "";
		if (!isRealNumberString(cStr)) return cStr;
		const c = parseFloat(cStr);
		if (Number.isNaN(c)) return cStr;
		return tempUnit === "C"
			? String(roundTo(c, 2))
			: String(roundTo(celsiusToFahrenheit(c), 2));
	};

	useEffect(() => {
		if (ventilationOnly) return;
		if (!reqInsideTempC) {
			dispatch(
				updateStandardsField({ field: "reqInsideTempDisplay", value: "" })
			);
			return;
		}
		if (reqInsideTempC === t.misc.ambient) {
			dispatch(
				updateStandardsField({
					field: "reqInsideTempDisplay",
					value: t.misc.ambient,
				})
			);
			return;
		}
		if (!isRealNumberString(reqInsideTempC)) {
			dispatch(
				updateStandardsField({
					field: "reqInsideTempDisplay",
					value: reqInsideTempC,
				})
			);
			return;
		}
		const c = parseFloat(reqInsideTempC);
		const display =
			tempUnit === "C"
				? String(roundTo(c, 2))
				: String(roundTo(celsiusToFahrenheit(c), 2));
		dispatch(
			updateStandardsField({ field: "reqInsideTempDisplay", value: display })
		);
	}, [tempUnit, reqInsideTempC, ventilationOnly]);

	const onReqInsideTempChange = (val: string) => {
		if (ventilationOnly) return;
		if (val === "") {
			dispatch(
				updateMultipleStandardsFields({
					reqInsideTempDisplay: "",
					reqInsideTempC: "",
				})
			);
			return;
		}
		if (!isNumericLike(val)) return;
		dispatch(
			updateStandardsField({ field: "reqInsideTempDisplay", value: val })
		);
		if (!isRealNumberString(val)) return;
		const n = parseFloat(val);
		if (Number.isNaN(n)) return;
		if (tempUnit === "C")
			dispatch(
				updateStandardsField({
					field: "reqInsideTempC",
					value: String(roundTo(n, 2)),
				})
			);
		else
			dispatch(
				updateStandardsField({
					field: "reqInsideTempC",
					value: String(roundTo(fahrenheitToCelsius(n), 4)),
				})
			);
	};

	const tempPlaceholder =
		tempUnit === "C" ? t.placeholders.reqTempC : t.placeholders.reqTempF;

	const flowMedium = useMemo(() => {
		if (showCoolingMethod && coolingMethod) return coolingMethod;
		if (showHeatingMethod && heatingMethod) return heatingMethod;
		if (showCoolingMethod) return coolingMethod;
		if (showHeatingMethod) return heatingMethod;
		return "";
	}, [showCoolingMethod, showHeatingMethod, coolingMethod, heatingMethod]);

	const flowRange = useMemo(
		() => getFlowVelocityRange(flowMedium),
		[flowMedium]
	);
	const heatingFlowRange = useMemo(
		() => getFlowVelocityRange(heatingMethod),
		[heatingMethod]
	);
	const coolingFlowRange = useMemo(
		() => getFlowVelocityRange(coolingMethod),
		[coolingMethod]
	);

	useEffect(() => {
		const clamped = clamp(flowVelocity, flowRange.min, flowRange.max);
		if (clamped !== flowVelocity)
			dispatch(updateStandardsField({ field: "flowVelocity", value: clamped }));
	}, [flowRange.min, flowRange.max]);

	const roomPayload = useMemo(() => {
		const isVentilationOnly = system === t.options.systems.ventilation;
		return {
			fromCustomerInfo: {
				minimumTemp: minTempC,
				maximumTemp: maxTempC,
				minRelativeHumidity: rhMin,
				maxRelativeHumidity: rhMax,
			},
			standard,
			classification,
			acph,
			acphMin: selectedClass?.minAir ?? null,
			acphMax: selectedClass?.maxAir ?? null,
			system,
			systemType,
			heatingMethod,
			coolingMethod,
			tempUnit,
			reqInsideTemp: reqInsideTempDisplay,
			reqInsideHum,
			reqInsideTempC,
			maxTempC,
			minTemp: tempToDisplay(minTempC),
			maxTemp: tempToDisplay(maxTempC),
			minTempC,
			rhMin,
			rhMax,
			ventilationOnly: isVentilationOnly,
			flowVelocity,
			flowVelocityUnit: "m/s",
			flowMedium,
			heatingFlowVelocity,
			coolingFlowVelocity,
		};
	}, [
		standard,
		classification,
		acph,
		selectedClass,
		system,
		systemType,
		heatingMethod,
		coolingMethod,
		tempUnit,
		reqInsideTempDisplay,
		reqInsideTempC,
		reqInsideHum,
		minTempC,
		maxTempC,
		rhMin,
		rhMax,
		flowVelocity,
		flowMedium,
		heatingFlowVelocity,
		coolingFlowVelocity,
	]);

	useEffect(() => {
		console.group("STANDARD SCREEN - CURRENT STATE");
		console.log(roomPayload);
		console.groupEnd();
	}, [roomPayload]);

	const isFormValid = (() => {
		if (!standard || errors.standard) return false;
		if (!classification || errors.classification) return false;
		if (!acph || errors.acph) return false;
		if (!system || errors.system) return false;
		if (!systemType || errors.systemType) return false;
		if (!ventilationOnly) {
			if (!heatingMethod && showHeatingMethod) return false;
			if (!coolingMethod && showCoolingMethod) return false;
			if (!reqInsideHum || errors.humidity) return false;
			if (!reqInsideTempC || errors.temperature) return false;
		}
		return true;
	})();

	const createProjectZones = async () => {
		const payload = { project_id: projectId, zone_name: "Zone 001" };
		try {
			const data = await createProjectZone(payload);
			console.log("Project zone created:", data);
			return data;
		} catch (error) {
			console.error("Failed to create project zone:", error);
			throw error;
		}
	};

	const saveroomStandards = async () => {
		const payload = {
			project_id: projectId,
			system,
			systemType,
			heatingMethod,
			coolingMethod,
			standard,
			classification,
			acph,
			tempUnit,
			reqInsideTempC,
			reqInsideHum,
			maxTempC,
			minTempC,
			rhMin,
			rhMax,
			flowVelocity,
			flowMedium,
			heatingFlowVelocity,
			coolingFlowVelocity,
		};
		try {
			console.log("Saving room standards with payload:", payload);
			const data = await roomStandards(payload);
			console.log("Room standards saved:", data);
			return data;
		} catch (error) {
			console.error("Failed to save room standards:", error);
			throw error;
		}
	};

	const handleNext = async (e?: React.MouseEvent) => {
		if (e) e.preventDefault();

		if (!isFormValid) {
			alert("Please fill all required fields correctly before proceeding.");
			return;
		}
		try {
			const zoneData = await createProjectZones();
			const standardData = await saveroomStandards();

			const newZoneId = zoneData?.zoneId;
			const newProjectStandardId = standardData?.roomStandardsId;

			console.log("IDs from backend:", { newZoneId, newProjectStandardId });

			if (!newZoneId || !newProjectStandardId) {
				console.error("Missing IDs from backend");
				alert("Failed to get IDs from server. Please try again.");
				return;
			}

			dispatch(updateStandardsField({ field: "zoneId", value: newZoneId }));
			dispatch(
				updateStandardsField({
					field: "projectStandardId",
					value: newProjectStandardId,
				})
			);

			navigate("/room", {
				state: {
					...roomPayload,
					zoneId: newZoneId,
					projectStandardId: newProjectStandardId,
				},
			});
		} catch (error) {
			console.error("Error saving data:", error);
		}
	};

	return (
		<div className={s.page}>
			<div className={s.top}>
				<h1 className={s.title}>{t.page.title}</h1>
				<p className={s.subtitle}>{t.page.subtitle}</p>
			</div>

			<div className={s.cardWrap}>
				<div className={s.card}>
					<div className={s.cardHeader}>
						<div className={s.cardHeaderTitle}>{t.page.cardTitle}</div>
					</div>
					<div className={s.divider} />
					<div className={s.body}>
						<div className={s.grid2}>
							<div className={s.field}>
								<label className={s.label}>
									{t.labels.system} <span className={s.required}>*</span>
									<Tooltip
										id="system"
										content={constants.Tooltip.systemTooltip}
									/>
								</label>
								<select
									className={s.select}
									value={system}
									onChange={(e) => {
										dispatch(
											updateStandardsField({
												field: "system",
												value: e.target.value,
											})
										);
										dispatch(
											updateStandardsField({ field: "systemType", value: "" })
										);
									}}
									required={true}
								>
									<option value="">{t.placeholders.system}</option>
									<option value={t.options.systems.heating}>
										{t.options.systems.heating}
									</option>
									<option value={t.options.systems.cooling}>
										{t.options.systems.cooling}
									</option>
									<option value={t.options.systems.ventilation}>
										{t.options.systems.ventilation}
									</option>
									<option value={t.options.systems.coolingVentilation}>
										{t.options.systems.coolingVentilation}
									</option>
									<option value={t.options.systems.heatingVentilation}>
										{t.options.systems.heatingVentilation}
									</option>
									<option value={t.options.systems.heatingCooling}>
										{t.options.systems.heatingCooling}
									</option>
								</select>
							</div>
							{system !== "" && (
								<div className={s.field}>
									<label className={s.label}>
										{systemTypeLabel} <span className={s.required}>*</span>
										<Tooltip
											id="systemType"
											content={
												systemTypeLabel === t.labels.systemTypeGeneric
													? constants.Tooltip.heatingSystemTypeTooltip
													: systemTypeLabel === t.labels.systemTypeHeating
													? constants.Tooltip.heatingSystemTypeTooltip
													: systemTypeLabel === t.labels.systemTypeCooling
													? constants.Tooltip.coolingSystemTypeTooltip
													: constants.Tooltip.ventilationSystemTypeTooltip
											}
										/>
									</label>
									<select
										className={s.select}
										value={systemType}
										onChange={(e) => {
											dispatch(
												updateStandardsField({
													field: "systemType",
													value: e.target.value,
												})
											);
											dispatch(
												updateStandardsField({
													field: "classification",
													value: "",
												})
											);
											dispatch(
												updateStandardsField({ field: "acph", value: "" })
											);
										}}
										required={true}
									>
										<option value="">{systemTypePlaceholder}</option>
										{systemTypes.map((v: string) => (
											<option key={v} value={v}>
												{v}
											</option>
										))}
									</select>
								</div>
							)}
						</div>

						{(showHeatingMethod || showCoolingMethod) && (
							<div className={"mt-6 " + s.grid2}>
								{showHeatingMethod && (
									<div className={s.field}>
										<label className={s.label}>
											{t.labels.heatingMethod}{" "}
											<span className={s.required}>*</span>
											<Tooltip
												id="heatingMethod"
												content={constants.Tooltip.heatingMethodTooltip}
											/>
										</label>
										<select
											className={s.select}
											value={heatingMethod}
											onChange={(e) =>
												dispatch(
													updateStandardsField({
														field: "heatingMethod",
														value: e.target.value,
													})
												)
											}
											required={true}
										>
											<option value="">{t.placeholders.heatingMethod}</option>
											{heatingMethods.map((m: string) => (
												<option key={m} value={m}>
													{m}
												</option>
											))}
										</select>
									</div>
								)}
								{showCoolingMethod && (
									<div className={s.field}>
										<label className={s.label}>
											{t.labels.coolingMethod}{" "}
											<span className={s.required}>*</span>
											<Tooltip
												id="coolingMethod"
												content={constants.Tooltip.coolingMethodTooltip}
											/>
										</label>
										<select
											className={s.select}
											value={coolingMethod}
											onChange={(e) =>
												dispatch(
													updateStandardsField({
														field: "coolingMethod",
														value: e.target.value,
													})
												)
											}
											required={true}
										>
											<option value="">{t.placeholders.coolingMethod}</option>
											{coolingMethods.map((m: string) => (
												<option key={m} value={m}>
													{m}
												</option>
											))}
										</select>
									</div>
								)}
							</div>
						)}

						<div className={s.sectionSpacer}>
							<div className={s.grid3}>
								<div className={s.field}>
									<label className={s.label}>
										{t.labels.standard} <span className={s.required}>*</span>
										<Tooltip
											id="standard"
											content={constants.Tooltip.standardTooltip}
										/>
									</label>
									<select
										className={s.select}
										value={standard}
										onChange={(e) => {
											dispatch(
												updateStandardsField({
													field: "standard",
													value: e.target.value,
												})
											);
											dispatch(
												updateStandardsField({
													field: "classification",
													value: "",
												})
											);
											dispatch(
												updateStandardsField({ field: "acph", value: "" })
											);
										}}
										required={true}
									>
										<option value="">{t.placeholders.standard}</option>
										{filteredStandardsData.map((item) => (
											<option key={item.id} value={item.title}>
												{item.title}
											</option>
										))}
									</select>
								</div>
								<div className={s.field}>
									<label className={s.label}>
										{t.labels.classification}{" "}
										<span className={s.required}>*</span>
										<Tooltip
											id="classification"
											content={constants.Tooltip.classificationTooltip}
										/>
									</label>
									<select
										className={selectedStandard ? s.select : s.selectDisabled}
										disabled={!selectedStandard}
										value={classification}
										onChange={(e) =>
											dispatch(
												updateStandardsField({
													field: "classification",
													value: e.target.value,
												})
											)
										}
										required={true}
									>
										<option value="">
											{selectedStandard
												? t.placeholders.classification
												: t.placeholders.classificationDisabled}
										</option>
										{classList.map((c) => (
											<option key={c.name} value={c.name}>
												{c.name}
											</option>
										))}
									</select>
								</div>
								<div className={s.field}>
									<label className={s.label}>
										{t.labels.acph} <span className={s.required}>*</span>
										<Tooltip
											id="acph"
											content={constants.Tooltip.acphTooltip}
										/>
									</label>
									<select
										className={!acphDisabled ? s.select : s.selectDisabled}
										disabled={acphDisabled}
										value={acph}
										onChange={(e) =>
											dispatch(
												updateStandardsField({
													field: "acph",
													value: e.target.value,
												})
											)
										}
										required={true}
									>
										{acphDisabled ? (
											<option value="">{t.placeholders.acphDisabled}</option>
										) : (
											acphOptions.map((v) => (
												<option key={v} value={v}>
													{v}
												</option>
											))
										)}
									</select>
									{selectedClass?.minAir != null &&
										selectedClass?.maxAir != null && (
											<div className={s.range}>
												{t.misc.rangeLabel}{" "}
												<span className={s.rangeValue}>
													{selectedClass.minAir} - {selectedClass.maxAir}
												</span>
											</div>
										)}
								</div>
							</div>
						</div>

						<div className={s.sectionLine} />

						<div className={s.sectionSpacer}>
							<div className={s.sectionTitle}>{t.sections.tempHumTitle}</div>
							<div className={s.unitRow}>
								<div className={s.unitLabel}>{t.labels.tempUnit}</div>
								<div className={s.unitGroup}>
									<label className={s.unitOption}>
										<input
											className={s.unitRadio}
											type="radio"
											name="tempUnit"
											value="C"
											checked={tempUnit === "C"}
											onChange={() =>
												dispatch(
													updateStandardsField({
														field: "tempUnit",
														value: "C",
													})
												)
											}
											disabled={ventilationOnly}
										/>
										<span>{t.options.units.c}</span>
									</label>
									<label className={s.unitOption}>
										<input
											className={s.unitRadio}
											type="radio"
											name="tempUnit"
											value="F"
											checked={tempUnit === "F"}
											onChange={() =>
												dispatch(
													updateStandardsField({
														field: "tempUnit",
														value: "F",
													})
												)
											}
											disabled={ventilationOnly}
										/>
										<span>{t.options.units.f}</span>
									</label>
								</div>
								{ventilationOnly && (
									<div className={s.unitHint}>{t.misc.ventilationUnitHint}</div>
								)}
							</div>

							<div className={"mt-6 " + s.grid2}>
								<div className={s.field}>
									<label className={s.label}>
										{t.labels.reqInsideTemp} ({tempUnit === "C" ? "°C" : "°F"}){" "}
										<span className={s.required}>*</span>
										<Tooltip
											id="requiredTemperature"
											content={constants.Tooltip.requiredTemperatureTooltip}
										/>
									</label>
									<input
										className={ventilationOnly ? s.inputDisabled : s.input}
										inputMode="decimal"
										placeholder={tempPlaceholder}
										value={reqInsideTempDisplay}
										maxLength={3}
										required={true}
										onChange={(e) => {
											onReqInsideTempChange(e.target.value);
											setErrors((p) => ({
												...p,
												temperature: validateTemperature(e.target.value),
											}));
										}}
										disabled={ventilationOnly}
									/>
									{errors.temperature && (
										<div className="text-red-500 text-xs mt-1">
											{errors.temperature}
										</div>
									)}
									{!ventilationOnly &&
										reqInsideTempC &&
										reqInsideTempC !== t.misc.ambient && (
											<div className={s.tempHelper}>
												{t.misc.storedInternally} <b>{reqInsideTempC} °C</b>
											</div>
										)}
								</div>
								<div className={s.field}>
									<label className={s.label}>
										{t.labels.reqInsideHum}{" "}
										<span className={s.required}>*</span>
										<Tooltip
											id="requiredHumidity"
											content={constants.Tooltip.requiredHumidityTooltip}
										/>
									</label>
									<input
										className={ventilationOnly ? s.inputDisabled : s.input}
										inputMode="decimal"
										placeholder={t.placeholders.reqHumidity}
										maxLength={3}
										value={reqInsideHum}
										required={true}
										onChange={(e) => {
											allowNumericInput(
												(v) =>
													dispatch(
														updateStandardsField({
															field: "reqInsideHum",
															value: v,
														})
													),
												e.target.value
											);
											setErrors((p) => ({
												...p,
												humidity: validateHumidity(e.target.value),
											}));
										}}
										disabled={ventilationOnly}
									/>
									{errors.humidity && (
										<div className="text-red-500 text-xs mt-1">
											{errors.humidity}
										</div>
									)}
								</div>
							</div>

							<div className={"mt-6 " + s.grid4}>
								<div className={s.field}>
									<label className={s.label}>
										{t.labels.minTemp} ({tempUnit === "C" ? "°C" : "°F"})
									</label>
									<input
										className={s.inputDisabled}
										value={tempToDisplay(minTempC) || "-"}
										disabled
									/>
								</div>
								<div className={s.field}>
									<label className={s.label}>
										{t.labels.maxTemp} ({tempUnit === "C" ? "°C" : "°F"})
									</label>
									<input
										className={s.inputDisabled}
										value={tempToDisplay(maxTempC) || "-"}
										disabled
									/>
								</div>
								<div className={s.field}>
									<label className={s.label}>{t.labels.rhMin}</label>
									<input
										className={s.inputDisabled}
										value={rhMin || "-"}
										disabled
									/>
								</div>
								<div className={s.field}>
									<label className={s.label}>{t.labels.rhMax}</label>
									<input
										className={s.inputDisabled}
										value={rhMax || "-"}
										disabled
									/>
								</div>
							</div>

							{!ventilationOnly &&
								system === t.options.systems.heatingCooling &&
								showHeatingMethod &&
								showCoolingMethod && (
									<div className={s.dualFlowBlock}>
										<div className={s.dualFlowGrid}>
											<div className={s.dualFlowCard}>
												<div className={s.dualFlowTitle}>
													Heating Flow Velocity –{" "}
													{formatMediumLabel(heatingMethod)}
													<span className={s.required}>*</span>
												</div>
												<div className={s.dualFlowRow}>
													<div className={s.dualFlowMin}>
														{heatingFlowRange.min}
													</div>
													<input
														type="range"
														className={s.dualFlowSlider}
														min={heatingFlowRange.min}
														max={heatingFlowRange.max}
														step={0.1}
														value={heatingFlowVelocity}
														onChange={(e) =>
															dispatch(
																updateStandardsField({
																	field: "heatingFlowVelocity",
																	value: clamp(
																		Number(e.target.value),
																		heatingFlowRange.min,
																		heatingFlowRange.max
																	),
																})
															)
														}
													/>
													<div className={s.dualFlowMax}>
														{heatingFlowRange.max}
													</div>
													<input
														className={s.dualFlowValueBox}
														value={heatingFlowVelocity}
														required={true}
														onChange={(e) => {
															const v = Number(e.target.value);
															if (!Number.isNaN(v))
																dispatch(
																	updateStandardsField({
																		field: "heatingFlowVelocity",
																		value: clamp(
																			v,
																			heatingFlowRange.min,
																			heatingFlowRange.max
																		),
																	})
																);
														}}
													/>
													<div className={s.dualFlowUnit}>m/s</div>
												</div>
											</div>
											<div className={s.dualFlowCard}>
												<div className={s.dualFlowTitle}>
													Cooling Flow Velocity -{" "}
													{formatMediumLabel(coolingMethod)}
													<span className={s.required}>*</span>
												</div>
												<div className={s.dualFlowRow}>
													<div className={s.dualFlowMin}>
														{coolingFlowRange.min}
													</div>
													<input
														type="range"
														className={s.dualFlowSlider}
														min={coolingFlowRange.min}
														max={coolingFlowRange.max}
														step={0.1}
														value={coolingFlowVelocity}
														onChange={(e) =>
															dispatch(
																updateStandardsField({
																	field: "coolingFlowVelocity",
																	value: clamp(
																		Number(e.target.value),
																		coolingFlowRange.min,
																		coolingFlowRange.max
																	),
																})
															)
														}
													/>
													<div className={s.dualFlowMax}>
														{coolingFlowRange.max}
													</div>
													<input
														className={s.dualFlowValueBox}
														inputMode="decimal"
														value={String(coolingFlowVelocity)}
														required={true}
														onChange={(e) => {
															const v = e.target.value;
															if (v === "" || isNumericLike(v)) {
																const n = Number(v);
																if (Number.isNaN(n)) return;
																dispatch(
																	updateStandardsField({
																		field: "coolingFlowVelocity",
																		value: clamp(
																			n,
																			coolingFlowRange.min,
																			coolingFlowRange.max
																		),
																	})
																);
															}
														}}
													/>
													<div className={s.dualFlowUnit}>m/s</div>
												</div>
											</div>
										</div>
									</div>
								)}

							{!ventilationOnly &&
								system !== t.options.systems.heatingCooling &&
								(showCoolingMethod || showHeatingMethod) && (
									<div className={s.flowBlock}>
										<div className={s.flowLabelRow}>
											<div className={s.flowTitle}>
												Flow Velocity - {formatMediumLabel(flowMedium)}
												<span className={s.required}> *</span>
											</div>
											<div className={s.flowUnit}></div>
										</div>
										<div className={s.flowRow}>
											<div className={s.flowMin}>{flowRange.min} m/s</div>
											<input
												className={s.flowSlider}
												type="range"
												min={flowRange.min}
												max={flowRange.max}
												step={0.1}
												value={flowVelocity}
												onChange={(e) =>
													dispatch(
														updateStandardsField({
															field: "flowVelocity",
															value: Number(e.target.value),
														})
													)
												}
											/>
											<div className={s.flowMax}>{flowRange.max} m/s</div>
											<div className={s.flowValueBoxWrap}>
												<input
													className={s.flowValueBox}
													inputMode="decimal"
													value={String(flowVelocity)}
													onChange={(e) => {
														const v = e.target.value;
														if (v === "" || isNumericLike(v)) {
															const n = Number(v);
															if (Number.isNaN(n)) return;
															dispatch(
																updateStandardsField({
																	field: "flowVelocity",
																	value: clamp(n, flowRange.min, flowRange.max),
																})
															);
														}
													}}
												/>
											</div>
											<div className={s.flowUnitSmall}>m/s</div>
										</div>
									</div>
								)}
						</div>
					</div>
				</div>

				<div className={s.quickView}>
					Standard: <b>{standard || "-"}</b> | Classification:{" "}
					<b>{classification || "-"}</b> | ACPH: <b>{acph || "-"}</b>
				</div>
			</div>

			<div className={s.footer}>
				<Link to="/project-info" className={s.backLink}>
					<FaArrowLeft /> {t.buttons.back}
				</Link>
				<button
					type="button"
					className={`${s.nextLink} ${!isFormValid ? s.disabled : ""}`}
					onClick={handleNext}
				>
					{t.buttons.next} <FaArrowRight />
				</button>
			</div>
		</div>
	);
}
