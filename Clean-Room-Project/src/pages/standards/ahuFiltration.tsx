import { useEffect, useState, useRef } from "react";
import { HiChevronDown, HiX, HiCheck } from "react-icons/hi";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { updateStandardsField, updateFilterDetail, updateMultipleStandardsFields } from "../../redux/slices/standardSlice";
import standardDesign from "./styles";
import ahuData from "../../json/ahuFiltrationData.json";
import standardDataJson from "../../json/standardData.json";
import { Tooltip } from "../../components/Tooltip/index";
import constants from "../../json/constants.json";

const config = (ahuData as any).ahuConstructionConfig;

export const AHU_CONSTRUCTION_FIELDS = Object.keys(config.fields);

export const ahupayload = (standards: any) => {
    const payload: any = {};
    AHU_CONSTRUCTION_FIELDS.forEach(field => {
        payload[field] = standards[field];
    });
    return payload;
};

export const validateAhuConstruction = (standards: any) => {
    const { plantRoomDistance } = standards;
    const { min, max } = config.plantRoomDistanceLimits;
    if (!plantRoomDistance || Number(plantRoomDistance) < min || Number(plantRoomDistance) > max) {
        return `Plant room distance needs to be between ${min} and ${max} meters.`;
    }
    return null;
};


const FilterDetailCard = ({
    filterName,
    specs,
    data,
    onUpdate
}: {
    filterName: string;
    specs: any;
    data: any;
    onUpdate: (details: any) => void;
}) => {
    // mmWG TO PA conversion factor
    const s = standardDesign;
    const MM_WG_TO_PA = config.calculationConstants.MM_WG_TO_PA;

    const generateMmwgSteps = (minMmwg: number, maxMmwg: number) => {
        const steps = [];
        const start = Math.floor(minMmwg);
        const end = Math.ceil(maxMmwg);
        for (let i = start; i <= end; i++) {
            if (i >= minMmwg && i <= maxMmwg) {
                steps.push(i);
            }
        }
        if (!steps.includes(minMmwg)) steps.push(minMmwg);
        if (!steps.includes(maxMmwg)) steps.push(maxMmwg);
        return Array.from(new Set(steps)).sort((a, b) => a - b);
    };

    const initMmwgSteps = generateMmwgSteps(specs.initRange[0], specs.initRange[1]);
    const finalMmwgSteps = generateMmwgSteps(specs.finalRange[0], specs.finalRange[1]);

    const formatPressure = (mmwg: number) => {
        const pa = Math.round(mmwg * MM_WG_TO_PA);
        return `${mmwg} mmWG / ${pa} Pa`;
    };

    const currentInitMmwg = data?.initialDp !== undefined ? Math.round(data.initialDp / MM_WG_TO_PA * 10) / 10 : specs.initRange[0];
    const currentFinalMmwg = data?.finalDp !== undefined ? Math.round(data.finalDp / MM_WG_TO_PA * 10) / 10 : specs.finalRange[1];

    return (
        <div className={s.filterCard + " mt-3"}>
            <div className={s.filterHeader}>
                <div className={s.filterTitle}>{filterName}</div>
            </div>

            <div className={s.filterStats}>
                <div className={s.filterStatRow}>
                    <span className={s.filterStatLabel}>Filter Rating:</span>
                    <span className={s.filterStatValue}>{specs.rating}</span>
                </div>
                <div className={s.filterStatRow}>
                    <span className={s.filterStatLabel}>Depth:</span>
                    <span className={s.filterStatValue}>{specs.depth}</span>
                </div>
                <div className={s.filterStatRow}>
                    <span className={s.filterStatLabel}>Min. Efficiency:</span>
                    <span className={s.filterStatValue}>{specs.efficiency}</span>
                </div>
            </div>

            <div className={s.filterDpGrid}>
                <div>
                    <div className={s.filterDpLabel}>Initial Δp:</div>
                    <select
                        className={s.select + " py-2 text-xs"}
                        value={currentInitMmwg}
                        onChange={(e) => onUpdate({ initialDp: Number(e.target.value) * MM_WG_TO_PA })}
                    >
                        {initMmwgSteps.map((mmwg) => (
                            <option key={mmwg} value={mmwg}>
                                {formatPressure(mmwg)}
                            </option>
                        ))}
                    </select>
                    <div className={s.filterDpRange}>
                        Range: {formatPressure(specs.initRange[0])} - {formatPressure(specs.initRange[1])}
                    </div>
                </div>
                <div>
                    <div className={s.filterDpLabel}>Final Δp:</div>
                    <select
                        className={s.select + " py-2 text-xs"}
                        value={currentFinalMmwg}
                        onChange={(e) => onUpdate({ finalDp: Number(e.target.value) * MM_WG_TO_PA })}
                    >
                        {finalMmwgSteps.map((mmwg) => (
                            <option key={mmwg} value={mmwg}>
                                {formatPressure(mmwg)}
                            </option>
                        ))}
                    </select>
                    <div className={s.filterDpRange}>
                        Range: {formatPressure(specs.finalRange[0])} - {formatPressure(specs.finalRange[1])}
                    </div>
                </div>
            </div>
        </div>
    );
};

const AHUFiltration = () => {
    const s = standardDesign;
    const dispatch = useAppDispatch();
    const [showDistanceModal, setShowDistanceModal] = useState(false);
    const [filterTypeOpen, setFilterTypeOpen] = useState(false);
    const filterTypeRef = useRef<HTMLDivElement>(null);

    // Redux state values
    const {
        plantRoomDistance,
        panelThicknessProfile,
        panelConstruction,
        airHandlingConstruction,
        fireControl,
        vfd,
        pressureGauge,
        virusBurner,
        doorInterlocking,
        bmsMonitoring,
        emsMonitoring,
        humidistat,
        thermostat,
        flowControlValve,
        yStrainer,
        purgeWall,
        pipeConfiguration,
        treatedFreshAirUnit,
        flowVelocity,
        heatingFlowVelocity,
        filterTypeSelection,
        selectedFilters = [],
        selectedFilterDetails = {},
        exhaustImpactPercentage,
        additionalDpValue,
        system,
        heatingMethod,
        coolingMethod,
        coolingFlowVelocity,
        bioSafetyLevel,
    } = useAppSelector((state: any) => state.standards);

    const filterTypes = Array.isArray(filterTypeSelection) ? filterTypeSelection : [filterTypeSelection].filter(Boolean);

    const handling = useAppSelector((state: any) => state.projectInfo?.handling || []);
    const isRestrictedHandling = handling.some((h: string) => config.handling.restrictedHandlingValues.includes(h));
    const specialHandlingOptions = config.handling.specialHandlingOptions;
    const hasSpecialHandling = handling.length > 0 && handling.some((h: string) => specialHandlingOptions.includes(h)); // true if any selected handling matches special handling criteria

    const systems = (standardDataJson as any).text.options.systems;
    const isHeating = [systems.heating, systems.heatingVentilation, systems.heatingCooling].includes(system);
    const isCooling = [systems.cooling, systems.coolingVentilation, systems.heatingCooling].includes(system);

    const handleChange = (field: string, value: any) => {
        dispatch(updateStandardsField({ field, value }));
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (filterTypeRef.current && !filterTypeRef.current.contains(e.target as Node)) {
                setFilterTypeOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isRestrictedHandling && filterTypes.includes("Exhaust")) {
            const updated = filterTypes.filter((t: string) => t !== "Exhaust");
            handleChange("filterTypeSelection", updated);

            // Clear exhaust filters
            const prefix = "Exhaust:";
            const newSelected = (selectedFilters || []).filter((f: string) => !f.startsWith(prefix));
            handleChange("selectedFilters", newSelected);

            const newDetails = { ...selectedFilterDetails };
            Object.keys(newDetails).forEach(k => {
                if (k.startsWith(prefix)) delete newDetails[k];
            });
            handleChange("selectedFilterDetails", newDetails);
        }
    }, [isRestrictedHandling]);

    const MM_WG_TO_PA = config.calculationConstants.MM_WG_TO_PA;
    const activeFilters = (selectedFilters || []).filter((f: string) => {
        if (!f || f.trim() === "") return false;
        return filterTypes.some(type => f.startsWith(`${type}:`));
    });
    const numStages = activeFilters.length;

    // finalDp is stored in Pa in selectedFilterDetails, convert to mmWG for sum
    const filterDpSumMmWg = Object.entries(selectedFilterDetails || {})
        .filter(([key]) => activeFilters.includes(key))
        .reduce((acc: number, [_, curr]: [string, any]) => acc + ((curr.finalDp || 0) / MM_WG_TO_PA), 0);

    // Static Pressure (mmWG) = (Plant Room Distance (m) * 0.7) + Sum of Filter Δp (mmWG) + Additional Δp (mmWG)
    const staticPressureMmWg = (Number(plantRoomDistance) * config.calculationConstants.PLANT_ROOM_DISTANCE_FACTOR) + filterDpSumMmWg + (Number(additionalDpValue) || 0);
    const staticPressurePa = Math.round(staticPressureMmWg * MM_WG_TO_PA);
    const staticPressureDisplay = `${Math.round(staticPressureMmWg)} mmWG / ${staticPressurePa} Pa`;

    // Sync calculated values to Redux
    useEffect(() => {
        dispatch(updateMultipleStandardsFields({
            totalFiltrationStages: numStages,
            staticPressure: staticPressureMmWg
        }));
    }, [numStages, staticPressureMmWg, dispatch]);

    const additionalDpOptions = config.additionalDpOptions;

    const handleFilterToggle = (type: string, filter: string) => {
        const compositeKey = `${type}:${filter}`;
        const currentSelected = [...(selectedFilters || [])];
        const index = currentSelected.indexOf(compositeKey);
        if (index > -1) {
            currentSelected.splice(index, 1);
        } else {
            currentSelected.push(compositeKey);
            // Initialize filter detail if not present
            if (!selectedFilterDetails[compositeKey]) {
                const specs = (ahuData.filterSpecs as any)[filter];
                if (specs) {
                    const MM_WG_TO_PA = config.calculationConstants.MM_WG_TO_PA;
                    dispatch(updateFilterDetail({
                        filterName: compositeKey,
                        details: {
                            unit: "Pa",
                            initialDp: specs.initRange[0] * MM_WG_TO_PA,
                            finalDp: Math.max(...specs.finalRange) * MM_WG_TO_PA
                        }
                    }));
                }
            }
        }
        handleChange("selectedFilters", currentSelected);
    };

    const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
    const isNumericLike = (v: string) => /^\d*\.?\d*$/.test(v);

    function isSteamMedium(m: string) {
        return String(m || "").toLowerCase().includes("steam");
    }
    function getFlowVelocityRange(medium: string) {
        return isSteamMedium(medium) ? config.flowVelocityRange.steam : config.flowVelocityRange.water;
    }
    function formatMediumLabel(medium: string) {
        return medium ? medium : "Select Method";
    }

    const isHeatingCooling = system === "Air Cooling and Air Heating System";
    const flowMedium = isHeating ? heatingMethod : coolingMethod;
    const flowRange = getFlowVelocityRange(flowMedium);
    const heatingFlowRange = getFlowVelocityRange(heatingMethod);
    const coolingFlowRange = getFlowVelocityRange(coolingMethod);

    useEffect(() => {
        // Enforce boundaries when medium changes (e.g. from Hot Water to Steam)
        if (flowVelocity < flowRange.min || flowVelocity > flowRange.max) {
            handleChange("flowVelocity", clamp(Number(flowVelocity), flowRange.min, flowRange.max));
        }
        if (heatingFlowVelocity < heatingFlowRange.min || heatingFlowVelocity > heatingFlowRange.max) {
            handleChange("heatingFlowVelocity", clamp(Number(heatingFlowVelocity), heatingFlowRange.min, heatingFlowRange.max));
        }
        if (coolingFlowVelocity < coolingFlowRange.min || coolingFlowVelocity > coolingFlowRange.max) {
            handleChange("coolingFlowVelocity", clamp(Number(coolingFlowVelocity), coolingFlowRange.min, coolingFlowRange.max));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flowMedium, heatingMethod, coolingMethod]);

    // Auto-select special exhaust filters when hasSpecialHandling and Exhaust mode is active
    useEffect(() => {
        if (filterTypeSelection === "Exhaust" && hasSpecialHandling) {
            const specialFilters = ahuData.filtrationSelection.specialExhaustFilters;
            const currentSelected = [...(selectedFilters || [])];
            let changed = false;

            specialFilters.forEach(filter => {
                if (!currentSelected.includes(filter)) {
                    currentSelected.push(filter);
                    changed = true;

                    // Initialize filter detail when auto-selecting the special filters
                    if (!selectedFilterDetails[filter]) {
                        const specs = (ahuData.filterSpecs as any)[filter];
                        if (specs) {
                            const MM_WG_TO_PA = config.calculationConstants.MM_WG_TO_PA;
                            dispatch(updateFilterDetail({
                                filterName: filter,
                                details: {
                                    unit: "Pa",
                                    initialDp: specs.initRange[0] * MM_WG_TO_PA,
                                    finalDp: Math.max(...specs.finalRange) * MM_WG_TO_PA
                                }
                            }));
                        }
                    }
                }
            });

            if (changed) {
                handleChange("selectedFilters", currentSelected);
            }
        }
    }, [filterTypeSelection, hasSpecialHandling]);



    return (
        <>
            {/* Card 3: AHU Construction Specifications */}
            <div className={s.card}>
                <div className={s.cardHeader}>
                    <div className={s.cardHeaderTitle}>AHU Construction Specifications</div>
                </div>
                <div className={s.divider} />
                <div className={s.body}>
                    <div className={s.specialBox}>
                        <div className={s.specialBoxRow}>
                            <div>
                                <div className={s.specialBoxTitle}>
                                    {config.fields.plantRoomDistance.label} <span className={s.required}>*</span>
                                </div>
                                <div className={s.specialBoxValue}>Range: {config.plantRoomDistanceLimits.min}-{config.plantRoomDistanceLimits.max} {config.fields.plantRoomDistance.unit}</div>
                            </div>
                            <div className={s.colEnd}>
                                <div className={s.specialBoxInputGroup}>
                                    <input
                                        type="number"
                                        className={s.specialBoxInput}
                                        placeholder="eg: 55"
                                        value={plantRoomDistance}
                                        min={config.plantRoomDistanceLimits.min}
                                        max={config.plantRoomDistanceLimits.max}
                                        onChange={(e) => { // dont allow more than 3 digits
                                            const raw = e.target.value;
                                            if (raw === "") {
                                                handleChange("plantRoomDistance", "");
                                                return;
                                            }
                                            if (!/^\d*$/.test(raw)) return;
                                            const val = parseInt(raw, 10);
                                            if (val > 100) return; // input max is 100
                                            handleChange("plantRoomDistance", val);
                                        }}
                                        onKeyDown={(e) => {
                                            if (["-", "+", "e", "E", "."].includes(e.key)) { //not allowing non-numeric characters and decimal point
                                                e.preventDefault();
                                            }
                                        }}
                                        required={true}
                                    />
                                    <span className={s.specialBoxUnit}>meters</span>
                                </div>
                                {plantRoomDistance !== "" && (Number(plantRoomDistance) < config.plantRoomDistanceLimits.min || Number(plantRoomDistance) > config.plantRoomDistanceLimits.max) && (
                                    <div className={s.errorText}>
                                        Distance must be between {config.plantRoomDistanceLimits.min} and {config.plantRoomDistanceLimits.max} meters
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={s.transitionOpacity}>
                        {/* Construction Specs Grid */}
                        <div className={s.grid2}>

                            <div className={s.field}>
                                <label className={s.label}>
                                    {config.fields.panelThicknessProfile.label} <span className={s.required}>*</span>
                                    <Tooltip id="panelThickness" content={constants.Tooltip[config.fields.panelThicknessProfile.tooltip as keyof typeof constants.Tooltip] as string} />
                                </label>
                                <select
                                    className={s.select}
                                    value={panelThicknessProfile}
                                    onChange={(e) => handleChange("panelThicknessProfile", e.target.value)}
                                    required={true}
                                >
                                    <option value="">Select Option</option>
                                    {ahuData.ahuConstruction.panelThicknessProfile.map((v: string) => (<option key={v} value={v}>{v}</option>))}
                                </select>
                            </div>

                            <div className={s.field}>
                                <label className={s.label}>
                                    {config.fields.panelConstruction.label} <span className={s.required}>*</span>
                                    <Tooltip id="panelConstruction" content={constants.Tooltip[config.fields.panelConstruction.tooltip as keyof typeof constants.Tooltip] as string} />
                                </label>
                                <select
                                    className={s.select}
                                    value={panelConstruction}
                                    onChange={(e) => handleChange("panelConstruction", e.target.value)}
                                    required={true}
                                >
                                    <option value="">Select Option</option>
                                    {ahuData.ahuConstruction.panelConstruction.map((v: string) => (<option key={v} value={v}>{v}</option>))}
                                </select>
                            </div>

                            <div className={s.field}>
                                <label className={s.label}>
                                    {config.fields.airHandlingConstruction.label} <span className={s.required}>*</span>
                                    <Tooltip id="airHandling" content={constants.Tooltip[config.fields.airHandlingConstruction.tooltip as keyof typeof constants.Tooltip] as string} />
                                </label>
                                <select
                                    className={s.select}
                                    value={airHandlingConstruction}
                                    onChange={(e) => handleChange("airHandlingConstruction", e.target.value)}
                                    required={true}
                                >
                                    <option value="">Select Option</option>
                                    {ahuData.ahuConstruction.airHandlingConstruction.map((v: string) => (<option key={v} value={v}>{v}</option>))}
                                </select>
                            </div>

                            <div className={s.field}>
                                <label className={s.label}>
                                    {config.fields.fireControl.label} <span className={s.required}>*</span>
                                    <Tooltip id="fireControl" content={constants.Tooltip[config.fields.fireControl.tooltip as keyof typeof constants.Tooltip] as string} />
                                </label>
                                <select
                                    className={s.select}
                                    value={fireControl}
                                    onChange={(e) => handleChange("fireControl", e.target.value)}
                                    required={true}
                                >
                                    <option value="">Select Option</option>
                                    {ahuData.ahuConstruction.fireControl.map((v: string) => (<option key={v} value={v}>{v}</option>))}
                                </select>
                            </div>

                            <div className={s.field}>
                                <label className={s.label}>
                                    {config.fields.vfd.label} <span className={s.required}>*</span>
                                    <Tooltip id="vfd" content={constants.Tooltip[config.fields.vfd.tooltip as keyof typeof constants.Tooltip] as string} />
                                </label>
                                <select
                                    className={s.select}
                                    value={vfd}
                                    onChange={(e) => handleChange("vfd", e.target.value)}
                                    required={true}
                                >
                                    <option value="">Select Option</option>
                                    {ahuData.ahuConstruction.vfd.map((v: string) => (<option key={v} value={v}>{v}</option>))}
                                </select>
                            </div>

                            <div className={s.field}>
                                <label className={s.label}>
                                    {config.fields.pressureGauge.label} <span className={s.required}>*</span>
                                    <Tooltip id="pressureGauge" content={constants.Tooltip[config.fields.pressureGauge.tooltip as keyof typeof constants.Tooltip] as string} />
                                </label>
                                <select
                                    className={s.select}
                                    value={pressureGauge}
                                    onChange={(e) => handleChange("pressureGauge", e.target.value)}
                                    required={true}
                                >
                                    <option value="">Select Option</option>
                                    {ahuData.ahuConstruction.pressureGauge.map((v: string) => (<option key={v} value={v}>{v}</option>))}
                                </select>
                            </div>

                            <div className={s.field}>
                                <label className={s.label}>
                                    {config.fields.virusBurner.label} <span className={s.required}>*</span>
                                    <Tooltip id="virusBurner" content={constants.Tooltip[config.fields.virusBurner.tooltip as keyof typeof constants.Tooltip] as string} />
                                </label>
                                <select
                                    className={s.select}
                                    value={virusBurner}
                                    onChange={(e) => handleChange("virusBurner", e.target.value)}
                                    required={true}
                                >
                                    <option value="">Select Option</option>
                                    {ahuData.ahuConstruction.virusBurner.map((v: string) => (<option key={v} value={v}>{v}</option>))}
                                </select>
                            </div>

                            <div className={s.field}>
                                <label className={s.label}>
                                    {config.fields.doorInterlocking.label} <span className={s.required}>*</span>
                                    <Tooltip id="doorInterlocking" content={constants.Tooltip[config.fields.doorInterlocking.tooltip as keyof typeof constants.Tooltip] as string} />
                                </label>
                                <select
                                    className={s.select}
                                    value={doorInterlocking}
                                    onChange={(e) => handleChange("doorInterlocking", e.target.value)}
                                    required={true}
                                >
                                    <option value="">Select Option</option>
                                    {ahuData.ahuConstruction.doorInterlocking.map((v: string) => (<option key={v} value={v}>{v}</option>))}
                                </select>
                            </div>

                            <div className={s.field}>
                                <label className={s.label}>
                                    {config.fields.bmsMonitoring.label} <span className={s.required}>*</span>
                                    <Tooltip id="bmsMonitoring" content={constants.Tooltip[config.fields.bmsMonitoring.tooltip as keyof typeof constants.Tooltip] as string} />
                                </label>
                                <select
                                    className={s.select}
                                    value={bmsMonitoring}
                                    onChange={(e) => handleChange("bmsMonitoring", e.target.value)}
                                    required={true}
                                >
                                    <option value="">Select Option</option>
                                    {ahuData.ahuConstruction.bmsMonitoring.map((v: string) => (<option key={v} value={v}>{v}</option>))}
                                </select>
                            </div>

                            <div className={s.field}>
                                <label className={s.label}>
                                    {config.fields.emsMonitoring.label} <span className={s.required}>*</span>
                                    <Tooltip id="emsMonitoring" content={constants.Tooltip[config.fields.emsMonitoring.tooltip as keyof typeof constants.Tooltip] as string} />
                                </label>
                                <select
                                    className={s.select}
                                    value={emsMonitoring}
                                    onChange={(e) => handleChange("emsMonitoring", e.target.value)}
                                    required={true}
                                >
                                    <option value="">Select Option</option>
                                    {ahuData.ahuConstruction.emsMonitoring.map((v: string) => (<option key={v} value={v}>{v}</option>))}
                                </select>
                            </div>
                        </div>

                        {/* Additional Specifications Sub-section */}
                        {system !== "Ventilation System" && (
                            <>
                                <div className={s.subSectionHeader}>
                                    {system === "Air-Cooling System" || system === "Air Cooling and Ventilation System" || system === "Air Cooling and Air Heating System"
                                        ? "Additional Specifications for Air Cooling System"
                                        : system === "Air-Heating System" || system === "Air Heating and Ventilation System"
                                            ? "Additional Specifications for Air Heating System"
                                            : "Additional Specifications"}
                                </div>
                                <div className={s.sectionLine} />

                                <div className={s.grid2Space}>
                                    <div className={s.field}>
                                        <label className={s.label}>
                                            {config.fields.humidistat.label} <span className={s.required}>*</span>
                                            <Tooltip id="humidistat" content={constants.Tooltip[config.fields.humidistat.tooltip as keyof typeof constants.Tooltip] as string} />
                                        </label>
                                        <select
                                            className={s.select}
                                            value={humidistat}
                                            onChange={(e) => handleChange("humidistat", e.target.value)}
                                            required={true}
                                        >
                                            <option value="">Select Option</option>
                                            {ahuData.additionalSpecifications.humidistat.map((v: string) => (<option key={v} value={v}>{v}</option>))}
                                        </select>
                                    </div>

                                    <div className={s.field}>
                                        <label className={s.label}>
                                            {config.fields.thermostat.label} <span className={s.required}>*</span>
                                            <Tooltip id="thermostat" content={constants.Tooltip[config.fields.thermostat.tooltip as keyof typeof constants.Tooltip] as string} />
                                        </label>
                                        <select
                                            className={s.select}
                                            value={thermostat}
                                            onChange={(e) => handleChange("thermostat", e.target.value)}
                                            required={true}
                                        >
                                            <option value="">Select Option</option>
                                            {ahuData.additionalSpecifications.thermostat.map((v: string) => (<option key={v} value={v}>{v}</option>))}
                                        </select>
                                    </div>

                                    <div className={s.field}>
                                        <label className={s.label}>
                                            {config.fields.flowControlValve.label} <span className={s.required}>*</span>
                                            <Tooltip id="flowControlValve" content={constants.Tooltip[config.fields.flowControlValve.tooltip as keyof typeof constants.Tooltip] as string} />
                                        </label>
                                        <select
                                            className={s.select}
                                            value={flowControlValve}
                                            onChange={(e) => handleChange("flowControlValve", e.target.value)}
                                            required={true}
                                        >
                                            <option value="">Select Option</option>
                                            {ahuData.additionalSpecifications.flowControlValve.map((v: string) => (<option key={v} value={v}>{v}</option>))}
                                        </select>
                                    </div>

                                    <div className={s.field}>
                                        <label className={s.label}>
                                            {config.fields.yStrainer.label} <span className={s.required}>*</span>
                                            <Tooltip id="yStrainer" content={constants.Tooltip[config.fields.yStrainer.tooltip as keyof typeof constants.Tooltip] as string} />
                                        </label>
                                        <select
                                            className={s.select}
                                            value={yStrainer}
                                            onChange={(e) => handleChange("yStrainer", e.target.value)}
                                            required={true}
                                        >
                                            <option value="">Select Option</option>
                                            {ahuData.additionalSpecifications.yStrainer.map((v: string) => (<option key={v} value={v}>{v}</option>))}
                                        </select>
                                    </div>

                                    <div className={s.field}>
                                        <label className={s.label}>
                                            {config.fields.purgeWall.label} <span className={s.required}>*</span>
                                            <Tooltip id="purgeWall" content={constants.Tooltip[config.fields.purgeWall.tooltip as keyof typeof constants.Tooltip] as string} />
                                        </label>
                                        <select
                                            className={s.select}
                                            value={purgeWall}
                                            onChange={(e) => handleChange("purgeWall", e.target.value)}
                                            required={true}
                                        >
                                            <option value="">Select Option</option>
                                            {ahuData.additionalSpecifications.purgeWall.map((v: string) => (<option key={v} value={v}>{v}</option>))}
                                        </select>
                                    </div>

                                    <div className={s.field}>
                                        <label className={s.label}>
                                            {config.fields.pipeConfiguration.label} <span className={s.required}>*</span>
                                            <Tooltip id="pipeConfiguration" content={constants.Tooltip[config.fields.pipeConfiguration.tooltip as keyof typeof constants.Tooltip] as string} />
                                        </label>
                                        <select
                                            className={s.select}
                                            value={pipeConfiguration}
                                            onChange={(e) => handleChange("pipeConfiguration", e.target.value)}
                                            required={true}
                                        >
                                            <option value="">Select Option</option>
                                            {(system === "Air Cooling and Air Heating System"
                                                ? ahuData.additionalSpecifications.pipeConfiguration
                                                : ["Single Pipe"]
                                            ).map((v: string) => (<option key={v} value={v}>{v}</option>))}
                                        </select>
                                    </div>

                                    <div className={s.field}>
                                        <label className={s.label}>
                                            {config.fields.treatedFreshAirUnit.label} <span className={s.required}>*</span>
                                            <Tooltip id="treatedFreshAir" content={constants.Tooltip[config.fields.treatedFreshAirUnit.tooltip as keyof typeof constants.Tooltip] as string} />
                                        </label>
                                        <select
                                            className={s.select}
                                            value={treatedFreshAirUnit}
                                            onChange={(e) => handleChange("treatedFreshAirUnit", e.target.value)}
                                            required={true}
                                        >
                                            <option value="">Select Option</option>
                                            {ahuData.additionalSpecifications.treatedFreshAirUnit.map((v: string) => (<option key={v} value={v}>{v}</option>))}
                                        </select>
                                    </div>

                                    {/* Original Flow Velocity Logic*/}
                                    {isHeatingCooling && pipeConfiguration === "Dual Pipe" ? (
                                        <>
                                            <div className={s.flowBlock + " md:col-span-2"}>
                                                <div className={s.dualFlowTitle}>
                                                    Heating Flow Velocity - {formatMediumLabel(heatingMethod)} <span className={s.required}>*</span>
                                                </div>
                                                <div className={s.dualFlowRow}>
                                                    <div className={s.dualFlowMin}>{heatingFlowRange.min}</div>
                                                    <input
                                                        type="range"
                                                        className={s.dualFlowSlider}
                                                        min={heatingFlowRange.min}
                                                        max={heatingFlowRange.max}
                                                        step={0.1}
                                                        value={heatingFlowVelocity}
                                                        onChange={(e) => handleChange("heatingFlowVelocity", clamp(Number(e.target.value), heatingFlowRange.min, heatingFlowRange.max))}
                                                    />
                                                    <div className={s.dualFlowMax}>{heatingFlowRange.max}</div>
                                                    <input
                                                        className={s.dualFlowValueBox}
                                                        inputMode="decimal"
                                                        value={heatingFlowVelocity}
                                                        required={true}
                                                        onChange={(e) => {
                                                            const v = e.target.value;
                                                            if (v === "" || isNumericLike(v)) {
                                                                const n = Number(v);
                                                                if (!isNaN(n)) handleChange("heatingFlowVelocity", clamp(n, heatingFlowRange.min, heatingFlowRange.max));
                                                            }
                                                        }}
                                                    />
                                                    <div className={s.dualFlowUnit}>m/s</div>
                                                </div>
                                            </div>
                                            <div className={s.flowBlock + " md:col-span-2"}>
                                                <div className={s.dualFlowTitle}>
                                                    Cooling Flow Velocity - {formatMediumLabel(coolingMethod)} <span className={s.required}>*</span>
                                                </div>
                                                <div className={s.dualFlowRow}>
                                                    <div className={s.dualFlowMin}>{coolingFlowRange.min}</div>
                                                    <input
                                                        type="range"
                                                        className={s.dualFlowSlider}
                                                        min={coolingFlowRange.min}
                                                        max={coolingFlowRange.max}
                                                        step={0.1}
                                                        value={coolingFlowVelocity}
                                                        onChange={(e) => handleChange("coolingFlowVelocity", clamp(Number(e.target.value), coolingFlowRange.min, coolingFlowRange.max))}
                                                    />
                                                    <div className={s.dualFlowMax}>{coolingFlowRange.max}</div>
                                                    <input
                                                        className={s.dualFlowValueBox}
                                                        inputMode="decimal"
                                                        value={coolingFlowVelocity}
                                                        required={true}
                                                        onChange={(e) => {
                                                            const v = e.target.value;
                                                            if (v === "" || isNumericLike(v)) {
                                                                const n = Number(v);
                                                                if (!isNaN(n)) handleChange("coolingFlowVelocity", clamp(n, coolingFlowRange.min, coolingFlowRange.max));
                                                            }
                                                        }}
                                                    />
                                                    <div className={s.dualFlowUnit}>m/s</div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        (isHeating || isCooling) && (
                                            <div className={s.flowBlock + " md:col-span-2"}>
                                                <div className={s.dualFlowTitle}>
                                                    Flow Velocity - {formatMediumLabel(flowMedium)} <span className={s.required}>*</span>
                                                </div>
                                                <div className={s.dualFlowRow}>
                                                    <div className={s.dualFlowMin}>{flowRange.min}</div>
                                                    <input
                                                        type="range"
                                                        className={s.dualFlowSlider}
                                                        min={flowRange.min}
                                                        max={flowRange.max}
                                                        step={0.1}
                                                        value={flowVelocity}
                                                        onChange={(e) => handleChange("flowVelocity", clamp(Number(e.target.value), flowRange.min, flowRange.max))}
                                                    />
                                                    <div className={s.dualFlowMax}>{flowRange.max}</div>
                                                    <input
                                                        className={s.dualFlowValueBox}
                                                        inputMode="decimal"
                                                        value={flowVelocity}
                                                        required={true}
                                                        onChange={(e) => {
                                                            const v = e.target.value;
                                                            if (v === "" || isNumericLike(v)) {
                                                                const n = Number(v);
                                                                if (!isNaN(n)) handleChange("flowVelocity", clamp(n, flowRange.min, flowRange.max));
                                                            }
                                                        }}
                                                    />
                                                    <div className={s.dualFlowUnit}>m/s</div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Card 4: Filtration Details */}
            <div className={`${s.card} transition-opacity duration-300`}>
                <div className={s.cardHeader}>
                    <div className={s.cardHeaderTitle}>Filtration Details</div>
                </div>
                <div className={s.divider} />
                <div className={s.body}>
                    <div className={s.specialBox}>
                        <div className={s.specialBoxRow}>
                            <div className={s.flex1}>
                                <div className={s.specialBoxTitle}>Filter Type Selection <span className={s.requiredText}>*</span></div>
                                <div className={s.specialBoxValue}><span className={s.specialBoxSubtitle}>Select whether filters are for supply or exhaust air</span></div>
                            </div>

                            <div ref={filterTypeRef} className={s.dropdownWrapper}>
                                <div
                                    onClick={() => setFilterTypeOpen(!filterTypeOpen)}
                                    className={`${s.input} cursor-pointer flex items-center justify-between min-h-[48px] px-4 py-2 bg-white border-2 ${filterTypeOpen
                                        ? 'border-blue-500 ring-4 ring-blue-50'
                                        : filterTypes.length === 0
                                            ? 'border-red-300 bg-red-50/10'
                                            : 'border-slate-200'
                                        }`}
                                >
                                    <div className={s.selectedTags}>
                                        {filterTypes.length > 0 ? (
                                            filterTypes.map((type: string) => (
                                                <span
                                                    key={type}
                                                    className={s.tag}
                                                >
                                                    {type.toUpperCase()}
                                                    <HiX
                                                        className={s.tagRemove}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const updated = filterTypes.filter((t: string) => t !== type);
                                                            handleChange("filterTypeSelection", updated);

                                                            const prefix = `${type}:`;
                                                            const newSelected = (selectedFilters || []).filter((f: string) => !f.startsWith(prefix));
                                                            handleChange("selectedFilters", newSelected);

                                                            const newDetails = { ...selectedFilterDetails };
                                                            Object.keys(newDetails).forEach(k => {
                                                                if (k.startsWith(prefix)) delete newDetails[k];
                                                            });
                                                            handleChange("selectedFilterDetails", newDetails);
                                                        }}
                                                    />
                                                </span>
                                            ))
                                        ) : (
                                            <span className={s.placeholder}>{filterTypes.length === 0 ? 'Select at least one...' : 'Select filter types...'}</span>
                                        )}
                                    </div>
                                    <HiChevronDown className={`${s.chevronBase} ${filterTypeOpen ? s.chevronOpen : ""}`} />
                                </div>

                                {filterTypeOpen && (
                                    <div className={s.dropdownMenu}>
                                        <div className={s.dropdownContent}>
                                            {ahuData.filtrationSelection.filterType
                                                .filter((v: string) => isRestrictedHandling ? v === "Supply" : true)
                                                .map((v: string) => {
                                                    const isSelected = filterTypes.includes(v);
                                                    return (
                                                        <div
                                                            key={v}
                                                            onClick={() => {
                                                                const updated = isSelected
                                                                    ? filterTypes.filter((t: string) => t !== v)
                                                                    : [...filterTypes, v];

                                                                handleChange("filterTypeSelection", updated);

                                                                if (isSelected && !updated.includes(v)) {
                                                                    const prefix = `${v}:`;
                                                                    const newSelected = (selectedFilters || []).filter((f: string) => !f.startsWith(prefix));
                                                                    handleChange("selectedFilters", newSelected);

                                                                    const newDetails = { ...selectedFilterDetails };
                                                                    Object.keys(newDetails).forEach(k => {
                                                                        if (k.startsWith(prefix)) delete newDetails[k];
                                                                    });
                                                                    handleChange("selectedFilterDetails", newDetails);
                                                                }
                                                            }}
                                                            className={`${s.optionBase} ${isSelected
                                                                ? s.optionSelected
                                                                : s.optionUnselected
                                                                }`}
                                                        >
                                                            <span className={s.optionLabel}>{v}</span>
                                                            {isSelected && <HiCheck className={s.checkIcon} />}
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={`${s.filterGridMain} ${filterTypes.length > 1 ? s.filterGridLg2 : ""}`}>
                        {filterTypes.map((type) => (
                            <div key={type} className={s.typeGroup}>
                                <div className={s.typeTitle}>
                                    {type} Filters
                                </div>

                                {type === "Exhaust" && (
                                    <div className={s.impactBox}>
                                        <div className={s.impactTitle}>Impact of Exhaust</div>
                                        <div className={s.impactContent}>
                                            {handling.includes("Bio-safety") && (
                                                <div className={s.inputGroup}>
                                                    <label className={s.inputLabel}>Bio-safety Level <span className={s.requiredText}>*</span></label>
                                                    <select
                                                        className={s.select + " py-2 text-xs"}
                                                        value={bioSafetyLevel}
                                                        onChange={(e) => handleChange("bioSafetyLevel", e.target.value)}
                                                        required={true}
                                                    >
                                                        <option value="">Select level...</option>
                                                        {ahuData.filtrationSelection.bioSafetyLevels.map((val: string) => (
                                                            <option key={val} value={val}>{val}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}

                                            <div className={s.inputGroup}>
                                                <label className={s.inputLabel}>
                                                    Exhaust Impact {handling.includes("Bio-safety") ? "(0-100%)" : "(0-50%)"}
                                                </label>
                                                <select
                                                    className={s.select + " py-2 text-xs"}
                                                    value={exhaustImpactPercentage}
                                                    onChange={(e) => handleChange("exhaustImpactPercentage", e.target.value)}
                                                >
                                                    <option value="">Select percentage...</option>
                                                    {(handling.includes("Bio-safety")
                                                        ? ahuData.filtrationSelection.exhaustImpactBioSafety
                                                        : ahuData.filtrationSelection.exhaustImpact
                                                    ).map((val: string) => (
                                                        <option key={val} value={val}>{val}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className={`grid grid-cols-1 ${filterTypes.length > 1 ? s.subGridGap : s.subGridMd2}`}>
                                    {/* Sub-grid for filters - use two columns only if single type is selected */}
                                    {(filterTypes.length > 1 ? [0] : [0, 1]).map((colIndex) => {
                                        const baseFilters = type === "Exhaust"
                                            ? ahuData.filtrationSelection.exhaustFilters
                                            : ahuData.filtrationSelection.supplyFilters;

                                        const specialExhaustFilters = type === "Exhaust" && hasSpecialHandling
                                            ? ahuData.filtrationSelection.specialExhaustFilters
                                            : [];

                                        const currentFilters = (type === "Exhaust" && hasSpecialHandling)
                                            ? [
                                                ...specialExhaustFilters,
                                                ...baseFilters.filter(f => !specialExhaustFilters.includes(f))
                                            ]
                                            : baseFilters;

                                        return (
                                            <div key={colIndex} className={s.typeGroup}>
                                                {currentFilters
                                                    .filter((_, i) => filterTypes.length > 1 ? true : i % 2 === colIndex)
                                                    .map((filter) => {
                                                        const compositeKey = `${type}:${filter}`;
                                                        const isSelected = (selectedFilters || []).includes(compositeKey);
                                                        const isPreselectedAndDisabled = specialExhaustFilters.includes(filter);
                                                        const specs = (ahuData.filterSpecs as any)[filter];
                                                        return (
                                                            <div key={compositeKey} className={s.inputGroup}>
                                                                <label className={`${s.filterLabelBase} ${isPreselectedAndDisabled ? s.filterLabelDisabled : s.filterLabelEnabled}`}>
                                                                    <div className={s.relativeFlex}>
                                                                        <input
                                                                            type="checkbox"
                                                                            className={`${s.checkboxBase} ${isPreselectedAndDisabled ? s.checkboxDisabled : s.checkboxEnabled}`}
                                                                            checked={isSelected || isPreselectedAndDisabled}
                                                                            disabled={isPreselectedAndDisabled}
                                                                            onChange={() => handleFilterToggle(type, filter)}
                                                                        />
                                                                    </div>
                                                                    <span className={`${s.filterTextBase} ${isPreselectedAndDisabled ? s.filterTextDisabled : s.filterTextEnabled}`}>
                                                                        {filter}
                                                                    </span>
                                                                </label>
                                                                {(isSelected || isPreselectedAndDisabled) && specs && (
                                                                    <FilterDetailCard
                                                                        filterName={filter}
                                                                        specs={specs}
                                                                        data={selectedFilterDetails[compositeKey]}
                                                                        onUpdate={(details) =>
                                                                            dispatch(updateFilterDetail({ filterName: compositeKey, details }))
                                                                        }
                                                                    />
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={s.finalSection}>
                        <div className={s.finalGrid}>
                            {/* No. of Filtration Stages */}
                            <div className={s.field}>
                                <label className={s.label}>
                                    No. of Filtration Stages in AHU <span className={s.autoCalcNote}>(Auto-calculated)</span>
                                </label>
                                <input
                                    type="text"
                                    className={s.inputDisabled}
                                    value={numStages}
                                    readOnly
                                />
                            </div>

                            {/* Additional Pressure Drop */}
                            <div className={s.field}>
                                <label className={s.label}>Include any additional pressure drop allowance <span className={s.required}>*</span></label>
                                <select
                                    className={s.select + " py-4"}
                                    value={additionalDpValue}
                                    onChange={(e) => handleChange("additionalDpValue", e.target.value === "" ? "" : Number(e.target.value))}
                                    required={true}
                                >
                                    <option value="" disabled>Select Option</option>
                                    <option value={0}>None</option>
                                    {additionalDpOptions.map((mmwg: number) => {
                                        const pa = Math.round(mmwg * MM_WG_TO_PA);
                                        return (
                                            <option key={mmwg} value={mmwg}>
                                                {mmwg} mmWG / {pa} Pa
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            {/* Static Pressure Requirement */}
                            <div className={s.field}>
                                <label className={s.label}>
                                    Static Pressure Requirement for Blower
                                    <Tooltip id="staticPressure" content={constants.Tooltip.staticPressureTooltip} />
                                </label>
                                <div className={s.relativeBox}>
                                    <input
                                        type="text"
                                        className={s.inputDisabled + " bg-slate-50 font-bold text-blue-900"}
                                        value={staticPressureDisplay}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

            {/* Custom Distance Validation Modal */}
            {showDistanceModal && (
                <div className={s.modalOverlay}>
                    <div className={s.modalContent}>
                        <div className={s.modalTitle}>Invalid Distance</div>
                        <div className={s.modalBody}>
                            Plant room distance needs to be between {config.plantRoomDistanceLimits.min} and {config.plantRoomDistanceLimits.max} meters.
                        </div>
                        <div className={s.flexEnd}>
                            <button
                                className={s.modalButton}
                                onClick={() => setShowDistanceModal(false)}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AHUFiltration;
