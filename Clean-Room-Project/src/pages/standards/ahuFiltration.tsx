import { useEffect, useState, useRef, type CSSProperties } from "react";
import { HiChevronDown, HiX, HiCheck } from "react-icons/hi";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { updateStandardsField, updateFilterDetail, updateMultipleStandardsFields } from "../../redux/slices/standardSlice";
import standardDesign from "./styles";
import ahuData from "../../json/ahuFiltrationData.json";
import standardDataJson from "../../json/standardData.json";
import { Tooltip } from "../../components/Tooltip/index";
import constants from "../../json/constants.json";

const config = (ahuData as any).ahuConstructionConfig;
const filterSelectionConfig = (ahuData as any).filtrationSelection;
const filterSpecsMap = (ahuData as any).filterSpecs;

const FILTER_SPEC_ALIASES: Record<string, string> = {
    "EPA (H11) (pre-HEPA) filter": "EPA (pre-HEPA) filter",
    "Leagcy (H13 ~50mm) filter": "Leagcy (H13 ~150) filter",
    "Leagcy (H13 ~100mm) filter": "Leagcy (H13 ~300) filter",
    "Leagcy (H14 ~150mm) filter": "Leagcy (H14 ~150) filter",
    "Leagcy (H14 ~300mm) filter": "Leagcy (H14 ~300) filter",
    "Upper HEPA (H15 ~150mm) filter": "Upper HEPA (H15 ~150) filter",
    "Upper HEPA (H15 ~300mm) filter": "Upper HEPA (H15 ~300) filter",
};

const getFilterSpecs = (filterName: string) => {
    if (!filterName) return null;
    if (filterSpecsMap[filterName]) return filterSpecsMap[filterName];
    const alias = FILTER_SPEC_ALIASES[filterName];
    if (alias && filterSpecsMap[alias]) return filterSpecsMap[alias];
    const withoutMm = filterName.replace(/~(\d+)mm/g, "~$1");
    if (filterSpecsMap[withoutMm]) return filterSpecsMap[withoutMm];
    return null;
};

export const AHU_CONSTRUCTION_FIELDS = Object.keys(config.fields);
const MM_WG_TO_PA = config.calculationConstants.MM_WG_TO_PA;
const ISO9_VENTILATION_SUGGESTED_SUPPLY_KEYS = new Set<string>([
    "Supply:Pre-HEPA Super fine filter",
    "Supply:High Fine filter",
]);
const ISO8_VENTILATION_SUGGESTED_SUPPLY_KEYS = new Set<string>([
    "Supply:Pre-HEPA Super fine filter",
    "Supply:High Fine filter",
    "Supply:Fine pre-filter",
]);
const ISO7_VENTILATION_SUGGESTED_SUPPLY_KEYS = new Set<string>([
    "Supply:Leagcy (H14 ~300mm) filter",
    "Supply:Leagcy (H14 ~150mm) filter",
    "Supply:Leagcy (H13 ~300mm) filter",
    "Supply:ULPA filter (U15 ~150mm)",
    "Supply:Pre-HEPA Super fine filter",
    "Supply:High Fine filter",
    "Supply:Fine pre-filter",
]);
const ISO6_VENTILATION_SUGGESTED_SUPPLY_KEYS = new Set<string>([
    "Supply:ULPA filter (U15 ~150mm)",
    "Supply:Leagcy (H14 ~150mm) filter",
    "Supply:Pre-HEPA Super fine filter",
    "Supply:High Fine filter",
    "Supply:Fine pre-filter",
]);
const ISO5_VENTILATION_SUGGESTED_SUPPLY_KEYS = new Set<string>([
    "Supply:ULPA filter (U15 ~150mm)",
    "Supply:Leagcy (H14 ~150mm) filter",
    "Supply:Pre-HEPA Super fine filter",
    "Supply:High Fine filter",
    "Supply:Fine pre-filter",
]);
const ISO4_VENTILATION_SUGGESTED_SUPPLY_KEYS = new Set<string>([
    "Supply:ULPA filter (U17 ~150mm)",
    "Supply:Pre-HEPA Super fine filter",
    "Supply:High Fine filter",
    "Supply:Fine pre-filter",
]);
const ISO3_VENTILATION_SUGGESTED_SUPPLY_KEYS = new Set<string>([
    "Supply:Pre-HEPA Super fine filter",
    "Supply:High Fine filter",
    "Supply:Fine pre-filter",
]);
const ISO2_VENTILATION_SUGGESTED_SUPPLY_KEYS = new Set<string>([
    "Supply:Pre-HEPA Super fine filter",
    "Supply:High Fine filter",
    "Supply:Fine pre-filter",
]);
const ISO1_VENTILATION_SUGGESTED_SUPPLY_KEYS = new Set<string>([
    "Supply:Pre-HEPA Super fine filter",
    "Supply:High Fine filter",
    "Supply:Fine pre-filter",
]);
const ISO8_COOLING_SUGGESTED_SUPPLY_KEYS = new Set<string>([
    "Supply:High Fine filter",
    "Supply:Leagcy (H13 ~150mm) filter",
    "Supply:Leagcy (H13 ~300mm) filter",
    "Supply:Leagcy (H14 ~150mm) filter",
    "Supply:Leagcy (H14 ~300mm) filter",
]);
const ISO7_COOLING_SUGGESTED_SUPPLY_KEYS = new Set<string>([
    "Supply:High Fine filter",
    "Supply:Leagcy (H13 ~150mm) filter",
    "Supply:Leagcy (H14 ~150mm) filter",
    "Supply:Leagcy (H14 ~300mm) filter",
]);
const getIsoVentilationSuggestedSupplyKeys = (
    standard: string,
    system: string,
    systemType: string,
    classification: string
) => {
    const isIsoVentilationContext =
        standard === "ISO 14644-4" &&
        system === "Ventilation System" &&
        (systemType === "Cleanroom Ventilation System" || systemType === "Non-Classified Ventilation System");

    if (!isIsoVentilationContext) return new Set<string>();
    if (classification === "ISO 9 (Non-Classified)") return ISO9_VENTILATION_SUGGESTED_SUPPLY_KEYS;
    if (classification === "ISO 8") return ISO8_VENTILATION_SUGGESTED_SUPPLY_KEYS;
    if (classification === "ISO 7") return ISO7_VENTILATION_SUGGESTED_SUPPLY_KEYS;
    if (classification === "ISO 6") return ISO6_VENTILATION_SUGGESTED_SUPPLY_KEYS;
    if (classification === "ISO 5") return ISO5_VENTILATION_SUGGESTED_SUPPLY_KEYS;
    if (classification === "ISO 4") return ISO4_VENTILATION_SUGGESTED_SUPPLY_KEYS;
    if (classification === "ISO 3") return ISO3_VENTILATION_SUGGESTED_SUPPLY_KEYS;
    if (classification === "ISO 2") return ISO2_VENTILATION_SUGGESTED_SUPPLY_KEYS;
    if (classification === "ISO 1") return ISO1_VENTILATION_SUGGESTED_SUPPLY_KEYS;
    return new Set<string>();
};

const getContextSuggestedSupplyKeys = (
    standard: string,
    system: string,
    systemType: string,
    classification: string,
    coolingMethod: string,
    heatingMethod: string
) => {
    const ventilationSuggested = getIsoVentilationSuggestedSupplyKeys(
        standard,
        system,
        systemType,
        classification
    );
    if (ventilationSuggested.size > 0) return ventilationSuggested;

    const isIso9ThermalContext =
        standard === "ISO 14644-4" &&
        ["Air-Cooling System", "Air-Heating System"].includes(system) &&
        ["ISO 9", "ISO 9 (Non-Classified)"].includes(classification);

    if (isIso9ThermalContext) {
        return ISO9_VENTILATION_SUGGESTED_SUPPLY_KEYS;
    }

    const isIsoCoolingContext =
        standard === "ISO 14644-4" &&
        system === "Air-Cooling System" &&
        systemType === "Cleanroom Air-Cooling System" &&
        ["ISO 8", "ISO 7"].includes(classification) &&
        ["Chilled Water", "Brine", "DX"].includes(coolingMethod);

    const isIsoHeatingContext =
        standard === "ISO 14644-4" &&
        system === "Air-Heating System" &&
        systemType === "Cleanroom Air-Heating System" &&
        ["ISO 8", "ISO 7"].includes(classification) &&
        ["Hot Water", "Steam"].includes(heatingMethod);

    if (!isIsoCoolingContext && !isIsoHeatingContext) return new Set<string>();
    if (classification === "ISO 8") return ISO8_COOLING_SUGGESTED_SUPPLY_KEYS;
    if (classification === "ISO 7") return ISO7_COOLING_SUGGESTED_SUPPLY_KEYS;
    return new Set<string>();
};

const ruleMatchesSelectionContext = (
    rule: any,
    standard: string,
    system: string,
    systemType: string,
    coolingMethod: string,
    heatingMethod: string
) => {
    const configuredSystems = Array.isArray(rule.system)
        ? rule.system.filter(Boolean)
        : [rule.system].filter(Boolean);

    const configuredSystemTypes = Array.isArray(rule.systemType)
        ? rule.systemType.filter(Boolean)
        : [rule.systemType].filter(Boolean);

    const systemMatches =
        configuredSystems.length > 0 && configuredSystems.includes(system);
    const systemTypeMatches =
        configuredSystemTypes.length > 0 && configuredSystemTypes.includes(systemType);

    if (
        rule.standard !== standard ||
        !systemMatches ||
        !systemTypeMatches
    ) {
        return false;
    }

    const configuredMethods = Array.isArray(rule.methods)
        ? rule.methods.filter(Boolean)
        : Array.isArray(rule.coolingMethods)
        ? rule.coolingMethods.filter(Boolean)
        : Array.isArray(rule.heatingMethods)
        ? rule.heatingMethods.filter(Boolean)
        : [];

    if (configuredMethods.length > 0) {
        const methodCandidates = [coolingMethod, heatingMethod].filter(Boolean);
        return methodCandidates.some((method) => configuredMethods.includes(method));
    }

    return true;
};


export const ahupayload = (standards: any) => {
    const payload: any = {};
    AHU_CONSTRUCTION_FIELDS.forEach(field => {
        payload[field] = standards[field];
    });
    return payload;
};

export const validateAhuConstruction = (standards: any) => {
    const { plantRoomDistance, system } = standards;
    const { min, max } = config.plantRoomDistanceLimits;
    if (plantRoomDistance && (Number(plantRoomDistance) < min || Number(plantRoomDistance) > max)) {
        return `Plant room distance needs to be between ${min} and ${max} meters.`;
    }

    if (system !== "Ventilation System") {
        if (!standards.pipeConfiguration) {
            return "Please select Pipe Configuration in Additional Specifications.";
        }
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
const ConfigSelect = ({ label, field, options, value, onChange, tooltipId, tooltipContent, required }: any) => {
    const s = standardDesign;
    return (
        <div className={s.field}>
            <label className={s.label}>
                {label} {required && <span className={s.required}>*</span>}
                {tooltipId && <Tooltip id={tooltipId} content={tooltipContent} />}
            </label>
            <select className={s.select} value={value} onChange={e => onChange(field, e.target.value)} required={required}>
                <option value="">Select Option</option>
                {options.map((val: string) => <option key={val} value={val}>{val}</option>)}
            </select>
        </div>
    );
};
const AHUFiltration = () => {
    const s = standardDesign;
    const dispatch = useAppDispatch();
    const [showDistanceModal, setShowDistanceModal] = useState(false);
    const [showConstructionSpecs, setShowConstructionSpecs] = useState(false);
    const [showFiltrationDetails, setShowFiltrationDetails] = useState(false);
    const [filterTypeOpen, setFilterTypeOpen] = useState(false);
    const filterTypeRef = useRef<HTMLDivElement>(null);
    const appliedAutoRuleRef = useRef<string>("");
    const dismissedSupplyByContextRef = useRef<Record<string, Set<string>>>({});
    const dismissedRuleKeysByContextRef = useRef<Record<string, Set<string>>>({});

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
        standard,
        classification,
        systemType,
    } = useAppSelector((state: any) => state.standards);

    const filterTypes = Array.isArray(filterTypeSelection) ? filterTypeSelection : [filterTypeSelection].filter(Boolean);

    const handling = useAppSelector((state: any) => state.projectInfo?.handling || []);
    const specialHandlingOptions = config.handling.specialHandlingOptions;
    const hasSpecialHandling = handling.length > 0 && handling.some((h: string) => specialHandlingOptions.includes(h)); // true if any selected handling matches special handling criteria

    const autoRulesForUi = Array.isArray(filterSelectionConfig.autoSelectionRules)
        ? filterSelectionConfig.autoSelectionRules
        : [];
    const matchedAutoRuleForUi = autoRulesForUi.find((rule: any) =>
        ruleMatchesSelectionContext(rule, standard, system, systemType, coolingMethod, heatingMethod)
    );
    const matchedAutoClassForUi = (matchedAutoRuleForUi?.classifications || []).find(
        (entry: any) => entry.name === classification
    );
    const autoRuleContextKey = `${standard || ""}||${system || ""}||${systemType || ""}||${classification || ""}||${coolingMethod || ""}||${heatingMethod || ""}`;
    const contextSuggestedSupplyKeys = getContextSuggestedSupplyKeys(
        standard,
        system,
        systemType,
        classification,
        coolingMethod,
        heatingMethod
    );
    const hasSuggestedSupplyMode = contextSuggestedSupplyKeys.size > 0;
    const currentRuleSupplyKeys = (Array.isArray(matchedAutoClassForUi?.filters?.Supply)
        ? matchedAutoClassForUi.filters.Supply
        : []
    ).map((filterName: string) => `Supply:${filterName}`);

    const autoRulePreselectedKeys = new Set<string>(
        (Array.isArray(matchedAutoClassForUi?.filterTypeSelection)
            ? matchedAutoClassForUi.filterTypeSelection
            : []
        ).flatMap((type: string) => {
            const filtersForType = Array.isArray(matchedAutoClassForUi?.filters?.[type])
                ? matchedAutoClassForUi.filters[type]
                : [];
            return filtersForType
                .map((filterName: string) => `${type}:${filterName}`)
                .filter((key: string) => !(hasSuggestedSupplyMode && contextSuggestedSupplyKeys.has(key)));
        })
    );
    const dismissedRuleKeysForUi =
        dismissedRuleKeysByContextRef.current[autoRuleContextKey] || new Set<string>();

    const hasRuleBasedPreselected = [...autoRulePreselectedKeys].some((k: string) =>
        selectedFilters.includes(k)
    );

    const hasPreselectedModeActive =
        hasRuleBasedPreselected ||
        (hasSpecialHandling &&
            filterTypes.includes("Exhaust") &&
            (filterSelectionConfig.specialExhaustFilters?.length ?? 0) > 0);

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

    // DERIVED VALUES: Count stages and calculate total pressure drop
    const kExhaust = (filterTypes.includes("Exhaust") && hasSpecialHandling)
        ? filterSelectionConfig.specialExhaustFilters.map((f: string) => `Exhaust:${f}`)
        : [];
    const activeFilters = [...new Set([...(selectedFilters || []), ...kExhaust])]
        .filter(k => k && filterTypes.some(t => k.startsWith(`${t}:`)));
    const numStages = activeFilters.length;
    const numSupplyStages = activeFilters.filter((k: string) => k.startsWith("Supply:")).length;
    const numExhaustStages = activeFilters.filter((k: string) => k.startsWith("Exhaust:")).length;

    const filterDpSumMmWg = activeFilters.reduce((sum, k) => {
        const detail = selectedFilterDetails[k];
        if (detail?.finalDp) return sum + (detail.finalDp / MM_WG_TO_PA);
        const specs = getFilterSpecs(k.split(":")[1]);
        return sum + (specs ? Math.max(...specs.finalRange) : 0);
    }, 0);

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
        const k = `${type}:${filter}`;
        const currentSelected = [...(selectedFilters || [])];
        const index = currentSelected.indexOf(k);
        if (index > -1) {
            currentSelected.splice(index, 1);

            if (autoRulePreselectedKeys.has(k)) {
                if (!dismissedRuleKeysByContextRef.current[autoRuleContextKey]) {
                    dismissedRuleKeysByContextRef.current[autoRuleContextKey] = new Set();
                }
                dismissedRuleKeysByContextRef.current[autoRuleContextKey].add(k);
            }

            if (type === "Supply" && currentRuleSupplyKeys.includes(k)) {
                if (!dismissedSupplyByContextRef.current[autoRuleContextKey]) {
                    dismissedSupplyByContextRef.current[autoRuleContextKey] = new Set();
                }
                dismissedSupplyByContextRef.current[autoRuleContextKey].add(k);
            }
        } else {
            currentSelected.push(k);

            dismissedRuleKeysByContextRef.current[autoRuleContextKey]?.delete(k);

            if (type === "Supply") {
                dismissedSupplyByContextRef.current[autoRuleContextKey]?.delete(k);
            }

            // Initialize filter detail if not present
            if (!selectedFilterDetails[k]) {
                const specs = getFilterSpecs(filter);
                if (specs) {
                    dispatch(updateFilterDetail({
                        filterName: k,
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

    // Auto-select filters from JSON rules for ISO cleanroom ventilation flow.
    useEffect(() => {
        const contextSuggestedSupplyKeysForEffect = getContextSuggestedSupplyKeys(
            standard,
            system,
            systemType,
            classification,
            coolingMethod,
            heatingMethod
        );
        const hasSuggestedSupplyModeForEffect =
            contextSuggestedSupplyKeysForEffect.size > 0;

        const autoRules = Array.isArray(filterSelectionConfig.autoSelectionRules)
            ? filterSelectionConfig.autoSelectionRules
            : [];

        const matchedRule = autoRules.find((rule: any) =>
            ruleMatchesSelectionContext(rule, standard, system, systemType, coolingMethod, heatingMethod)
        );
        if (!matchedRule) return;

        const classRule = (matchedRule.classifications || []).find(
            (entry: any) => entry.name === classification
        );
        if (!classRule) return;

        const requestedTypes = Array.isArray(classRule.filterTypeSelection)
            ? classRule.filterTypeSelection.filter(Boolean)
            : [];
        const selectedTypesForRule = filterTypes.filter((type: string) =>
            requestedTypes.includes(type)
        );
        if (selectedTypesForRule.length === 0) return;

        const applyKey = `${autoRuleContextKey}||${selectedTypesForRule.slice().sort().join(",")}`;
        if (appliedAutoRuleRef.current === applyKey) return;
        appliedAutoRuleRef.current = applyKey;

        const dismissedSupplySet =
            dismissedSupplyByContextRef.current[autoRuleContextKey] || new Set();

        const nextSelected = hasSuggestedSupplyModeForEffect
            ? [...(selectedFilters || [])].filter((k: string) => !contextSuggestedSupplyKeysForEffect.has(k))
            : [...(selectedFilters || [])];
        const detailsToAdd: Array<{ filterName: string; details: any }> = [];

        selectedTypesForRule.forEach((type: string) => {
            const configuredFilters = Array.isArray(classRule.filters?.[type])
                ? classRule.filters[type]
                : [];

            configuredFilters.forEach((filterName: string) => {
                const key = `${type}:${filterName}`;
                if (hasSuggestedSupplyModeForEffect && contextSuggestedSupplyKeysForEffect.has(key)) return;
                if (type === "Supply" && dismissedSupplySet.has(key)) return;
                if (nextSelected.includes(key)) return;
                nextSelected.push(key);

                const specs = getFilterSpecs(filterName);
                if (specs && !selectedFilterDetails[key]) {
                    detailsToAdd.push({
                        filterName: key,
                        details: {
                            unit: "Pa",
                            initialDp: specs.initRange[0] * MM_WG_TO_PA,
                            finalDp: Math.max(...specs.finalRange) * MM_WG_TO_PA,
                        },
                    });
                }
            });
        });

        const selectedChanged =
            nextSelected.length !== selectedFilters.length ||
            nextSelected.some((k: string) => !selectedFilters.includes(k));

        if (selectedChanged) {
            handleChange("selectedFilters", nextSelected);
        }
        if (detailsToAdd.length > 0) {
            detailsToAdd.forEach(({ filterName, details }) => {
                dispatch(updateFilterDetail({ filterName, details }));
            });
        }
    }, [
        standard,
        system,
        systemType,
        classification,
        coolingMethod,
        heatingMethod,
        filterTypes,
        selectedFilters,
        selectedFilterDetails,
        autoRuleContextKey,
    ]);

    // Auto-select special exhaust filters
    useEffect(() => {
        if (!filterTypes.includes("Exhaust") || !hasSpecialHandling) return;
        const kEx = filterSelectionConfig.specialExhaustFilters.map((f: string) => `Exhaust:${f}`);
        const missing = kEx.filter((k: string) => !selectedFilters.includes(k));
        if (missing.length > 0) {
            handleChange("selectedFilters", [...selectedFilters, ...missing]);
            missing.forEach((k: string) => {
                const specs = getFilterSpecs(k.split(":")[1]);
                if (specs) dispatch(updateFilterDetail({
                    filterName: k,
                    details: { unit: "Pa", initialDp: specs.initRange[0] * MM_WG_TO_PA, finalDp: Math.max(...specs.finalRange) * MM_WG_TO_PA }
                }));
            });
        }
    }, [filterTypeSelection, hasSpecialHandling]);



    return (
        <>
            {/* Card 3: AHU Construction Specifications */}
            <div className={s.card}>
                <div className={s.cardHeader + " flex items-center justify-between"}>
                    <div className={s.cardHeaderTitle}>AHU Construction Specifications</div>
                    <div
                        className={s.toggleWrapper}
                        onClick={() => setShowConstructionSpecs(!showConstructionSpecs)}
                    >
                        <span className={s.toggleLabel}>{showConstructionSpecs ? "Hide" : "Show"}</span>
                        <div className={s.toggleTrack + (showConstructionSpecs ? " " + s.toggleTrackOn : " " + s.toggleTrackOff)}>
                            <div className={s.toggleThumb + (showConstructionSpecs ? " " + s.toggleThumbOn : " " + s.toggleThumbOff)} />
                        </div>
                    </div>
                </div>
                {showConstructionSpecs && (
                    <>
                        <div className={s.divider} />
                        <div className={s.body}>
                            <div className={s.specialBox}>
                                <div className={s.specialBoxRow}>
                                    <div>
                                        <div className={s.specialBoxTitle}>
                                            {config.fields.plantRoomDistance.label}
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

                                    <ConfigSelect label={config.fields.panelThicknessProfile.label} field="panelThicknessProfile" options={ahuData.ahuConstruction.panelThicknessProfile} value={panelThicknessProfile} onChange={handleChange} tooltipId="panelThickness" tooltipContent={constants.Tooltip.panelThicknessTooltip} />
                                    <ConfigSelect label={config.fields.panelConstruction.label} field="panelConstruction" options={ahuData.ahuConstruction.panelConstruction} value={panelConstruction} onChange={handleChange} tooltipId="panelConstruction" tooltipContent={constants.Tooltip.panelConstructionTooltip} />
                                    <ConfigSelect label={config.fields.airHandlingConstruction.label} field="airHandlingConstruction" options={ahuData.ahuConstruction.airHandlingConstruction} value={airHandlingConstruction} onChange={handleChange} tooltipId="airHandling" tooltipContent={constants.Tooltip.airHandlingTooltip} />
                                    <ConfigSelect label={config.fields.fireControl.label} field="fireControl" options={ahuData.ahuConstruction.fireControl} value={fireControl} onChange={handleChange} tooltipId="fireControl" tooltipContent={constants.Tooltip.fireControlTooltip} />
                                    <ConfigSelect label={config.fields.vfd.label} field="vfd" options={ahuData.ahuConstruction.vfd} value={vfd} onChange={handleChange} tooltipId="vfd" tooltipContent={constants.Tooltip.vfdTooltip} />
                                    <ConfigSelect label={config.fields.pressureGauge.label} field="pressureGauge" options={ahuData.ahuConstruction.pressureGauge} value={pressureGauge} onChange={handleChange} tooltipId="pressureGauge" tooltipContent={constants.Tooltip.pressureGaugeTooltip} />
                                    <ConfigSelect label={config.fields.virusBurner.label} field="virusBurner" options={ahuData.ahuConstruction.virusBurner} value={virusBurner} onChange={handleChange} tooltipId="virusBurner" tooltipContent={constants.Tooltip.virusBurnerTooltip} />
                                    <ConfigSelect label={config.fields.doorInterlocking.label} field="doorInterlocking" options={ahuData.ahuConstruction.doorInterlocking} value={doorInterlocking} onChange={handleChange} tooltipId="doorInterlocking" tooltipContent={constants.Tooltip.doorInterlockingTooltip} />
                                    <ConfigSelect label={config.fields.bmsMonitoring.label} field="bmsMonitoring" options={ahuData.ahuConstruction.bmsMonitoring} value={bmsMonitoring} onChange={handleChange} tooltipId="bmsMonitoring" tooltipContent={constants.Tooltip.bmsMonitoringTooltip} />
                                    <ConfigSelect label={config.fields.emsMonitoring.label} field="emsMonitoring" options={ahuData.ahuConstruction.emsMonitoring} value={emsMonitoring} onChange={handleChange} tooltipId="emsMonitoring" tooltipContent={constants.Tooltip.emsMonitoringTooltip} />
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
                                            <ConfigSelect label={config.fields.humidistat.label} field="humidistat" options={ahuData.additionalSpecifications.humidistat} value={humidistat} onChange={handleChange} tooltipId="humidistat" tooltipContent={constants.Tooltip.humidistatTooltip} />
                                            <ConfigSelect label={config.fields.thermostat.label} field="thermostat" options={ahuData.additionalSpecifications.thermostat} value={thermostat} onChange={handleChange} tooltipId="thermostat" tooltipContent={constants.Tooltip.thermostatTooltip} />
                                            <ConfigSelect label={config.fields.flowControlValve.label} field="flowControlValve" options={ahuData.additionalSpecifications.flowControlValve} value={flowControlValve} onChange={handleChange} tooltipId="flowControlValve" tooltipContent={constants.Tooltip.flowControlValveTooltip} />
                                            <ConfigSelect label={config.fields.yStrainer.label} field="yStrainer" options={ahuData.additionalSpecifications.yStrainer} value={yStrainer} onChange={handleChange} tooltipId="yStrainer" tooltipContent={constants.Tooltip.yStrainerTooltip} />
                                            <ConfigSelect label={config.fields.purgeWall.label} field="purgeWall" options={ahuData.additionalSpecifications.purgeWall} value={purgeWall} onChange={handleChange} tooltipId="purgeWall" tooltipContent={constants.Tooltip.purgeWallTooltip} />
                                            <ConfigSelect label={config.fields.pipeConfiguration.label} field="pipeConfiguration" options={system === "Air Cooling and Air Heating System" ? ahuData.additionalSpecifications.pipeConfiguration : ["Single Pipe"]} value={pipeConfiguration} onChange={handleChange} tooltipId="pipeConfiguration" tooltipContent={constants.Tooltip.pipeConfigurationTooltip} required={system !== "Ventilation System"} />
                                            <ConfigSelect label={config.fields.treatedFreshAirUnit.label} field="treatedFreshAirUnit" options={ahuData.additionalSpecifications.treatedFreshAirUnit} value={treatedFreshAirUnit} onChange={handleChange} tooltipId="treatedFreshAir" tooltipContent={constants.Tooltip.treatedFreshAirTooltip} />

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
                    </>
                )}
            </div>

            {/* Card 4: Filtration Details */}
            <div className={`${s.card} transition-opacity duration-300`}>
                <div className={s.cardHeader + " flex items-center justify-between"}>
                    <div className={s.cardHeaderTitle}>Filtration Details</div>
                    <div
                        className={s.toggleWrapper}
                        onClick={() => setShowFiltrationDetails(!showFiltrationDetails)}
                    >
                        <span className={s.toggleLabel}>{showFiltrationDetails ? "Hide" : "Show"}</span>
                        <div className={s.toggleTrack + (showFiltrationDetails ? " " + s.toggleTrackOn : " " + s.toggleTrackOff)}>
                            <div className={s.toggleThumb + (showFiltrationDetails ? " " + s.toggleThumbOn : " " + s.toggleThumbOff)} />
                        </div>
                    </div>
                </div>
                {showFiltrationDetails && (
                    <>
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
                                                        <ConfigSelect label="Bio-safety Level" field="bioSafetyLevel" options={ahuData.filtrationSelection.bioSafetyLevels} value={bioSafetyLevel} onChange={handleChange} required={true} />
                                                    )}

                                                    <ConfigSelect
                                                        label={`Exhaust Impact ${handling.includes("Bio-safety") ? "(0-100%)" : "(0-50%)"}`}
                                                        field="exhaustImpactPercentage"
                                                        options={handling.includes("Bio-safety") ? ahuData.filtrationSelection.exhaustImpactBioSafety : ahuData.filtrationSelection.exhaustImpact}
                                                        value={exhaustImpactPercentage}
                                                        onChange={handleChange}
                                                    />
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
                                                    ? filterSelectionConfig.specialExhaustFilters
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
                                                                const k = `${type}:${filter}`;
                                                                const isSelected = (selectedFilters || []).includes(k);
                                                                const isPreselectedAndDisabled = specialExhaustFilters.includes(filter);
                                                                const isRulePreselectedButManuallyRemoved =
                                                                    !isSelected &&
                                                                    autoRulePreselectedKeys.has(k) &&
                                                                    dismissedRuleKeysForUi.has(k);
                                                                const isSuggestedNotSelected =
                                                                    !isSelected &&
                                                                    hasSuggestedSupplyMode &&
                                                                    contextSuggestedSupplyKeys.has(k);
                                                                const showOrangeForNonSelected =
                                                                    hasPreselectedModeActive &&
                                                                    !isPreselectedAndDisabled &&
                                                                    !isRulePreselectedButManuallyRemoved &&
                                                                    !isSuggestedNotSelected &&
                                                                    !isSelected;
                                                                const checkboxStyle: CSSProperties | undefined =
                                                                    (isRulePreselectedButManuallyRemoved || isSuggestedNotSelected)
                                                                        ? {
                                                                            appearance: "none",
                                                                            WebkitAppearance: "none",
                                                                            MozAppearance: "none",
                                                                            width: "18px",
                                                                            height: "18px",
                                                                            border: "2px solid #22c55e",
                                                                            borderRadius: "4px",
                                                                            backgroundColor: "#dcfce7",
                                                                        }
                                                                        : showOrangeForNonSelected
                                                                            ? {
                                                                                appearance: "none",
                                                                                WebkitAppearance: "none",
                                                                                MozAppearance: "none",
                                                                                width: "18px",
                                                                                height: "18px",
                                                                                border: "2px solid #fc8314",
                                                                                borderRadius: "4px",
                                                                                backgroundColor: "#ffe7d1",
                                                                            }
                                                                            : undefined;
                                                                const specs = getFilterSpecs(filter);
                                                                return (
                                                                    <div key={k} className={s.inputGroup}>
                                                                        <label className={`${s.filterLabelBase} ${isPreselectedAndDisabled ? s.filterLabelDisabled : s.filterLabelEnabled}`}>
                                                                            <div className={s.relativeFlex}>
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className={`${s.checkboxBase} ${isPreselectedAndDisabled ? s.checkboxDisabled : s.checkboxEnabled}`}
                                                                                    checked={isSelected || isPreselectedAndDisabled}
                                                                                    style={checkboxStyle}
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
                                                                                data={selectedFilterDetails[k]}
                                                                                onUpdate={(details) =>
                                                                                    dispatch(updateFilterDetail({ filterName: k, details }))
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
                                            Total number of filtration stages in AHU <span className={s.autoCalcNote}>(Auto-calculated)</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={s.inputDisabled}
                                            value={numStages}
                                            readOnly
                                        />
                                    </div>

                                    <div className={s.field}>
                                        <label className={s.label}>
                                            Number of filtration stages in Supply <span className={s.autoCalcNote}>(Auto-calculated)</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={s.inputDisabled}
                                            value={numSupplyStages}
                                            readOnly
                                        />
                                    </div>

                                    <div className={s.field}>
                                        <label className={s.label}>
                                            Number of filtration stages in Exhaust <span className={s.autoCalcNote}>(Auto-calculated)</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={s.inputDisabled}
                                            value={numExhaustStages}
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
                    </>
                )}
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
