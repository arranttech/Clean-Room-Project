import { useEffect, useState, useRef } from "react";
import { HiChevronDown, HiX, HiCheck } from "react-icons/hi";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { updateStandardsField, updateFilterDetail, updateMultipleStandardsFields } from "../../redux/slices/standardSlice";
import standardDesign from "./styles";
import ahuData from "../../json/ahuFiltrationData.json";
import standardDataJson from "../../json/standardData.json";
import { Tooltip } from "../../components/Tooltip/index";
import constants from "../../json/constants.json";

export const AHU_CONSTRUCTION_FIELDS = [
    "plantRoomDistance",
    "panelThicknessProfile",
    "panelConstruction",
    "airHandlingConstruction",
    "fireControl",
    "vfd",
    "pressureGauge",
    "virusBurner",
    "doorInterlocking",
    "bmsMonitoring",
    "emsMonitoring",
    "humidistat",
    "thermostat",
    "flowControlValve",
    "yStrainer",
    "purgeWall",
    "pipeConfiguration",
    "treatedFreshAirUnit",
];

export const ahupayload = (standards: any) => {
    const payload: any = {};
    AHU_CONSTRUCTION_FIELDS.forEach(field => {
        payload[field] = standards[field];
    });
    return payload;
};

export const validateAhuConstruction = (standards: any) => {
    const { plantRoomDistance } = standards;
    if (!plantRoomDistance || Number(plantRoomDistance) < 30 || Number(plantRoomDistance) > 100) {
        return "Plant room distance needs to be between 30 and 100 meters.";
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
    const MM_WG_TO_PA = 9.8;

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
            <div className="flex justify-between items-start mb-4">
                <div className="text-sm font-bold text-slate-800">{filterName}</div>
            </div>

            <div className="space-y-1 mb-4">
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
    const isRestrictedHandling = handling.some((h: string) => ["Non-Contagious", "Non-Hazardous"].includes(h));
    const specialHandlingOptions = ahuData.filtrationSelection.specialHandlingOptions;
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

    const MM_WG_TO_PA = 9.8;
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
    const staticPressureMmWg = (Number(plantRoomDistance) * 0.7) + filterDpSumMmWg + (Number(additionalDpValue) || 0);
    const staticPressurePa = Math.round(staticPressureMmWg * MM_WG_TO_PA);
    const staticPressureDisplay = `${Math.round(staticPressureMmWg)} mmWG / ${staticPressurePa} Pa`;

    // Sync calculated values to Redux
    useEffect(() => {
        dispatch(updateMultipleStandardsFields({
            totalFiltrationStages: numStages,
            staticPressure: staticPressureMmWg
        }));
    }, [numStages, staticPressureMmWg, dispatch]);

    const additionalDpOptions = Array.from({ length: 6 }, (_, i) => i + 5); // addional dp only ranges from 5 to 10 mmWG

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
                    const MM_WG_TO_PA = 9.8;
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
        return isSteamMedium(medium) ? { min: 3, max: 25 } : { min: 0.5, max: 2.5 };
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
                            const MM_WG_TO_PA = 9.8;
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
                                    Plant Room Distance <span className={s.required}>*</span>
                                </div>
                                <div className={s.specialBoxValue}>Range: 30-100 meters</div>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className={s.specialBoxInputGroup}>
                                    <input
                                        type="number"
                                        className={s.specialBoxInput}
                                        placeholder="eg: 55"
                                        value={plantRoomDistance}
                                        min={30}
                                        max={100}
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
                                {plantRoomDistance !== "" && (Number(plantRoomDistance) < 30 || Number(plantRoomDistance) > 100) && (
                                    <div className="text-red-500 text-xs mt-2 text-right w-full block">
                                        Distance must be between 30 and 100 meters
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="transition-opacity duration-300">
                        {/* Construction Specs Grid */}
                        <div className={s.grid2}>

                            <div className={s.field}>
                                <label className={s.label}>
                                    Panel Thickness & Profile <span className={s.required}>*</span>
                                    <Tooltip id="panelThickness" content={constants.Tooltip.panelThicknessTooltip} />
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
                                    Panel Construction <span className={s.required}>*</span>
                                    <Tooltip id="panelConstruction" content={constants.Tooltip.panelConstructionTooltip} />
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
                                    Air Handling Construction <span className={s.required}>*</span>
                                    <Tooltip id="airHandling" content={constants.Tooltip.airHandlingTooltip} />
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
                                    Fire Control <span className={s.required}>*</span>
                                    <Tooltip id="fireControl" content={constants.Tooltip.fireControlTooltip} />
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
                                    Variable Frequency Drive <span className={s.required}>*</span>
                                    <Tooltip id="vfd" content={constants.Tooltip.vfdTooltip} />
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
                                    Pressure Gauge <span className={s.required}>*</span>
                                    <Tooltip id="pressureGauge" content={constants.Tooltip.pressureGaugeTooltip} />
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
                                    Virus Burner <span className={s.required}>*</span>
                                    <Tooltip id="virusBurner" content={constants.Tooltip.virusBurnerTooltip} />
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
                                    Door interlocking systems for air locks and corridor areas <span className={s.required}>*</span>
                                    <Tooltip id="doorInterlocking" content={constants.Tooltip.doorInterlockingTooltip} />
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
                                    BMS Monitoring <span className={s.required}>*</span>
                                    <Tooltip id="bmsMonitoring" content={constants.Tooltip.bmsMonitoringTooltip} />
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
                                    EMS Monitoring <span className={s.required}>*</span>
                                    <Tooltip id="emsMonitoring" content={constants.Tooltip.emsMonitoringTooltip} />
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
                                            Humidistat <span className={s.required}>*</span>
                                            <Tooltip id="humidistat" content={constants.Tooltip.humidistatTooltip} />
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
                                            Thermostat <span className={s.required}>*</span>
                                            <Tooltip id="thermostat" content={constants.Tooltip.thermostatTooltip} />
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
                                            Flow-control Valve <span className={s.required}>*</span>
                                            <Tooltip id="flowControlValve" content={constants.Tooltip.flowControlValveTooltip} />
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
                                            Y-strainer <span className={s.required}>*</span>
                                            <Tooltip id="yStrainer" content={constants.Tooltip.yStrainerTooltip} />
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
                                            Purge Wall <span className={s.required}>*</span>
                                            <Tooltip id="purgeWall" content={constants.Tooltip.purgeWallTooltip} />
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
                                            Pipe Configuration <span className={s.required}>*</span>
                                            <Tooltip id="pipeConfiguration" content={constants.Tooltip.pipeConfigurationTooltip} />
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
                                            Treated fresh-air unit <span className={s.required}>*</span>
                                            <Tooltip id="treatedFreshAir" content={constants.Tooltip.treatedFreshAirTooltip} />
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
                            <div className="flex-1">
                                <div className={s.specialBoxTitle}>Filter Type Selection <span className="text-red-600">*</span></div>
                                <div className={s.specialBoxValue}><span className="text-[10px] text-blue-600 font-medium tracking-tight">Select whether filters are for supply or exhaust air</span></div>
                            </div>

                            <div ref={filterTypeRef} className="relative w-72">
                                <div
                                    onClick={() => setFilterTypeOpen(!filterTypeOpen)}
                                    className={`${s.input} cursor-pointer flex items-center justify-between min-h-[48px] px-4 py-2 bg-white border-2 ${filterTypeOpen
                                        ? 'border-blue-500 ring-4 ring-blue-50'
                                        : filterTypes.length === 0
                                            ? 'border-red-300 bg-red-50/10'
                                            : 'border-slate-200'
                                        }`}
                                >
                                    <div className="flex flex-wrap gap-1.5 flex-1 mr-2">
                                        {filterTypes.length > 0 ? (
                                            filterTypes.map((type: string) => (
                                                <span
                                                    key={type}
                                                    className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm"
                                                >
                                                    {type.toUpperCase()}
                                                    <HiX
                                                        className="cursor-pointer hover:text-blue-200 transition-colors"
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
                                            <span className="text-slate-400 text-sm">{filterTypes.length === 0 ? 'Select at least one...' : 'Select filter types...'}</span>
                                        )}
                                    </div>
                                    <HiChevronDown className={`text-slate-400 transition-transform duration-300 ${filterTypeOpen ? 'rotate-180 text-blue-500' : ''}`} />
                                </div>

                                {filterTypeOpen && (
                                    <div className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                                        <div className="p-2 flex flex-col gap-1">
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
                                                            className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all ${isSelected
                                                                ? 'bg-blue-50 text-blue-700'
                                                                : 'hover:bg-slate-50 text-slate-700'
                                                                }`}
                                                        >
                                                            <span className="text-sm font-bold tracking-wide">{v}</span>
                                                            {isSelected && <HiCheck className="text-blue-600 text-lg" />}
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={`grid grid-cols-1 ${filterTypes.length > 1 ? 'lg:grid-cols-2' : ''} gap-12 mt-8 transition-all duration-300`}>
                        {filterTypes.map((type) => (
                            <div key={type} className="flex flex-col gap-6">
                                <div className="text-blue-800 font-bold text-sm uppercase tracking-widest border-b border-blue-100 pb-2">
                                    {type} Filters
                                </div>

                                {type === "Exhaust" && (
                                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex flex-col gap-4 shadow-sm">
                                        <div className="text-blue-800 font-bold text-[10px] uppercase tracking-wider opacity-80">Impact of Exhaust</div>
                                        <div className="flex flex-col gap-4">
                                            {handling.includes("Bio-safety") && (
                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-xs font-semibold text-blue-950">Bio-safety Level <span className="text-red-600">*</span></label>
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

                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-semibold text-blue-950">
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
                                <div className={`grid grid-cols-1 ${filterTypes.length > 1 ? 'gap-6' : 'md:grid-cols-2 gap-x-10 gap-y-6'}`}>
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
                                            <div key={colIndex} className="flex flex-col gap-6">
                                                {currentFilters
                                                    .filter((_, i) => filterTypes.length > 1 ? true : i % 2 === colIndex)
                                                    .map((filter) => {
                                                        const compositeKey = `${type}:${filter}`;
                                                        const isSelected = (selectedFilters || []).includes(compositeKey);
                                                        const isPreselectedAndDisabled = specialExhaustFilters.includes(filter);
                                                        const specs = (ahuData.filterSpecs as any)[filter];
                                                        return (
                                                            <div key={compositeKey} className="flex flex-col">
                                                                <label className={`flex items-center gap-3 ${isPreselectedAndDisabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer group'}`}>
                                                                    <div className="relative flex items-center">
                                                                        <input
                                                                            type="checkbox"
                                                                            className={`h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 ${isPreselectedAndDisabled ? 'cursor-not-allowed bg-gray-100' : 'cursor-pointer'}`}
                                                                            checked={isSelected || isPreselectedAndDisabled}
                                                                            disabled={isPreselectedAndDisabled}
                                                                            onChange={() => handleFilterToggle(type, filter)}
                                                                        />
                                                                    </div>
                                                                    <span className={`text-sm font-medium ${isPreselectedAndDisabled ? 'text-slate-500' : 'text-slate-700 group-hover:text-blue-600 transition-colors'}`}>
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

                    <div className="mt-12 pt-8 border-t border-slate-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                            {/* No. of Filtration Stages */}
                            <div className={s.field}>
                                <label className={s.label}>
                                    No. of Filtration Stages in AHU <span className="text-slate-400 font-normal ml-1">(Auto-calculated)</span>
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
                                    {additionalDpOptions.map((mmwg) => {
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
                                <div className="relative">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-sm transform transition-all">
                        <div className="text-slate-800 font-bold text-lg mb-2">Invalid Distance</div>
                        <div className="text-slate-600 mb-6 text-sm">
                            Plant room distance needs to be between 30 and 100 meters.
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition-colors text-sm"
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
