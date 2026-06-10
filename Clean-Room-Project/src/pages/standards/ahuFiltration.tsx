import { useEffect, useState, useRef } from "react";
import { HiChevronDown, HiX, HiCheck } from "react-icons/hi";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import filterPreselectionRules from "../../json/filterPreselectionRules.json";
import {
  updateStandardsField,
  updateFilterDetail,
  updateMultipleStandardsFields,
} from "../../redux/slices/standardSlice";
import standardDesign from "./styles";
import ahuData from "../../json/ahuFiltrationData.json";
import standardDataJson from "../../json/standardData.json";
import { Tooltip } from "../../components/Tooltip/index";
import store from "../../redux/store";
import constants from "../../json/constants.json";

const config = (ahuData as any).ahuConstructionConfig;
const filterSelectionConfig = (ahuData as any).filtrationSelection;
const filterSpecsMap = (ahuData as any).filterSpecs;

const getIsoEquivalent = (standard: string, classification: string) => {
  if (standard === "ISO 14644-4") {
    return { isoStandard: standard, isoClassification: classification };
  }

  const mapping: Record<string, Record<string, string>> = (ahuData as any)
    .filtrationSelection.standardToIsoMapping || {};
  const isoClass = mapping[standard]?.[classification];
  if (isoClass) {
    return { isoStandard: "ISO 14644-4", isoClassification: isoClass };
  }

  return { isoStandard: standard, isoClassification: classification };
};

const getFilterSpecs = (filterName: string) => {
  if (!filterName) return null;
  if (filterSpecsMap[filterName]) return filterSpecsMap[filterName];
  const filterSpecAliases: Record<string, string> =
    (ahuData as any).filtrationSelection.filterSpecAliases || {};
  const alias = filterSpecAliases[filterName];
  if (alias && filterSpecsMap[alias]) return filterSpecsMap[alias];
  const withoutMm = filterName.replace(/~(\d+)mm/g, "~$1");
  if (filterSpecsMap[withoutMm]) return filterSpecsMap[withoutMm];
  return null;
};

export const AHU_CONSTRUCTION_FIELDS = Object.keys(config.fields);
export const AHU_CONSTRUCTION_KEYS = [
  ...Object.keys(config.fields || {}),
  ...Object.keys((ahuData as any).additionalSpecifications || {}),
];
const MM_WG_TO_PA = config.calculationConstants.MM_WG_TO_PA;

const ruleMatchesSelectionContext = (
  rule: any,
  standard: string,
  system: string,
  systemType: string,
  coolingMethod: string,
  heatingMethod: string,
) => {
  const configuredSystems = Array.isArray(rule.system)
    ? rule.system.filter(Boolean)
    : [rule.system].filter(Boolean);

  const configuredSystemTypes = Array.isArray(rule.systemType)
    ? rule.systemType.filter(Boolean)
    : [rule.systemType].filter(Boolean);

  const systemCandidates =
    system === "Air Cooling and Air Heating System"
      ? ["Air-Cooling System", "Air-Heating System", system]
      : system === "Air Cooling and Ventilation System"
        ? ["Air-Cooling System", system]
        : system === "Air-Cooling System"
          ? ["Air Cooling and Ventilation System", system]
          : system === "Air Heating and Ventilation System"
            ? ["Air-Heating System", system]
            : system === "Air-Heating System"
              ? ["Air Heating and Ventilation System", system]
              : [system];

  const combinedSystemTypeMap: Record<string, string[]> = {
    "Cleanroom Air System (Heating & Cooling)": [
      "Cleanroom Air-Cooling System",
      "Cleanroom Air-Heating System",
    ],
    "Comfort Air System (Heating & Cooling)": [
      "Comfort Air-Cooling System",
      "Comfort Air-Heating System",
    ],
    "Non-Classified Air System (Heating & Cooling)": [
      "Non-Classified Air-Cooling System",
      "Non-Classified Air-Heating System",
    ],
  };
  const mappedSystemTypes = combinedSystemTypeMap[systemType] || [];
  const systemTypeCandidates = [systemType, ...mappedSystemTypes];

  const systemMatches =
    configuredSystems.length > 0 &&
    systemCandidates.some((candidate) => configuredSystems.includes(candidate));
  const systemTypeMatches =
    configuredSystemTypes.length > 0 &&
    systemTypeCandidates.some((candidate) =>
      configuredSystemTypes.includes(candidate),
    );

  if (rule.standard !== standard || !systemMatches || !systemTypeMatches) {
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
    return methodCandidates.some((method) =>
      configuredMethods.includes(method),
    );
  }

  return true;
};

export const ahupayload = (standards: any) => {
  const payload: any = {
    selectedFilters: standards.selectedFilters || [],
    filterTypeSelection: standards.filterTypeSelection || [],
    selectedFilterDetails: standards.selectedFilterDetails || {},
  };
  AHU_CONSTRUCTION_KEYS.forEach((field) => {
    payload[field] = standards[field];
  });

  const filterData = [...(standards.ahufiltrationData || [])];
  const pushFilterState = (field: string) => {
    const existingIndex = filterData.findIndex(
      (item: any) => item.field === field,
    );
    if (existingIndex >= 0) {
      filterData[existingIndex] = { field, value: standards[field] };
    } else if (standards[field] !== undefined) {
      filterData.push({ field, value: standards[field] });
    }
  };

  // Ensure all critical filtration states are saved in the database JSON
  pushFilterState("selectedFilters");
  pushFilterState("filterTypeSelection");
  pushFilterState("selectedFilterDetails");

  payload.ahufiltrationData = filterData;
  payload.ahuConstructionData = standards.ahuConstructionData || [];
  return payload;
};

export const validateAhuConstruction = (standards: any) => {
  const { plantRoomDistance, system } = standards;
  const { min, max } = config.plantRoomDistanceLimits;
  if (
    plantRoomDistance &&
    (Number(plantRoomDistance) < min || Number(plantRoomDistance) > max)
  ) {
    return `Plant room distance needs to be between ${min} and ${max} meters.`;
  }

  if (system !== "Ventilation System") {
    if (!standards.pipeConfiguration) {
      return "Please select Pipe Configuration in Additional Specifications.";
    }
  }

  return null;
};

// FilterDetailCard removed, inline row rendering is used instead.
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

const formatPressure = (mmwg: number) => {
  const pa = Math.round(mmwg * MM_WG_TO_PA);
  return `${mmwg} mmWG / ${pa} Pa`;
};

const ConfigSelect = ({
  label,
  field,
  options,
  value,
  onChange,
  tooltipId,
  tooltipContent,
  required,
}: any) => {
  const s = standardDesign;
  const isAhuConstructionField = AHU_CONSTRUCTION_KEYS.includes(field);

  return (
    <div className={s.field}>
      <label className={s.label}>
        {label} {required && <span className={s.required}>*</span>}
        {tooltipId && <Tooltip id={tooltipId} content={tooltipContent} />}
      </label>
      {isAhuConstructionField ? (
        <div
          className={s.checkboxGroupContainer}
          title={!value ? "Please select an option" : ""}
        >
          {options.map((opt: string) => (
            <label
              key={opt}
              className={s.checkboxGroupLabel}
              title={!value ? "Please select an option" : ""}
            >
              <input
                type="radio"
                name={field}
                checked={value === opt}
                onChange={(e) => {
                  if (e.target.checked) onChange(field, opt);
                }}
                className={s.checkboxGroupInput}
              />
              <span className={s.checkboxGroupText}>{opt}</span>
            </label>
          ))}
        </div>
      ) : (
        <select
          className={s.select}
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
          required={required}
        >
          <option value="">Select Option</option>
          {options.map((val: string) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
      )}
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
  const appliedHandlingSupplyPreselectionRefV2 = useRef<
    Record<string, boolean>
  >({});
  const appliedHandlingExhaustPreselectionRefV2 = useRef<
    Record<string, boolean>
  >({});
  const appliedHandlingConstructionPreselectionRef = useRef<
    Record<string, boolean>
  >({});
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
    heatingFlowVelocity,
    filterTypeSelection,
    selectedFilters = [],
    selectedFilterDetails = {},
    exhaustImpactPercentage,
    additionalDpValue,
    additionalDpValueExhaust,
    system,
    heatingMethod,
    coolingMethod,
    coolingFlowVelocity,
    standard,
    classification,
    systemType,
    ahufiltrationData = [],
    ahuConstructionData = [],
  } = useAppSelector((state: any) => state.standards);

  const filterTypes = Array.isArray(filterTypeSelection)
    ? filterTypeSelection
    : [filterTypeSelection].filter(Boolean);

  const showSupplyFields = filterTypes.includes("Supply");
  const showExhaustFields = filterTypes.includes("Exhaust");

  const industry = useAppSelector(
    (state: any) => state.projectInfo?.industry || "",
  );

  const handling = useAppSelector(
    (state: any) => state.projectInfo?.handling || [],
  );
  const normalizedHandlingSelections = new Set(
    handling.map((h: string) =>
      String(h || "")
        .trim()
        .toLowerCase(),
    ),
  );

  const typedFilterPreselectionRules = filterPreselectionRules as Record<
    string,
    Record<
      string,
      {
        supplyFilters: string[];
        exhaustFilters: string[];
      }
    >
  >;

  const selectedIndustryRules = typedFilterPreselectionRules[industry] || {};

  const handlingBasedSupplyPreselectionRules: Record<string, string[]> =
    Object.fromEntries(
      Object.entries(selectedIndustryRules).map(([handlingName, rule]) => [
        String(handlingName || "")
          .trim()
          .toLowerCase(),
        rule.supplyFilters || [],
      ]),
    );

  const handlingBasedExhaustPreselectionRules: Record<string, string[]> =
    Object.fromEntries(
      Object.entries(selectedIndustryRules).map(([handlingName, rule]) => [
        String(handlingName || "")
          .trim()
          .toLowerCase(),
        rule.exhaustFilters || [],
      ]),
    );

  const activeHandlingSupplyPreselectionRules = Object.entries(
    handlingBasedSupplyPreselectionRules,
  ).filter(([handlingName]) => normalizedHandlingSelections.has(handlingName));

  const activeHandlingExhaustPreselectionRules = Object.entries(
    handlingBasedExhaustPreselectionRules,
  ).filter(([handlingName]) => normalizedHandlingSelections.has(handlingName));

  const handlingSupplyFilters = new Set(
    activeHandlingSupplyPreselectionRules.flatMap(([, filters]) => filters),
  );
  const handlingExhaustFilters = new Set(
    activeHandlingExhaustPreselectionRules.flatMap(([, filters]) => filters),
  );

  const handlingBasedConstructionRequiredRules: Record<
    string,
    Record<string, string>
  > = {
    "potent compound (hpapi)": {
      virusBurner: "Required",
    },
  };
  const activeHandlingConstructionRules = Object.entries(
    handlingBasedConstructionRequiredRules,
  ).filter(([handlingName]) => normalizedHandlingSelections.has(handlingName));

  const { isoStandard, isoClassification } = getIsoEquivalent(
    standard,
    classification,
  );

  const autoRulesForUi = Array.isArray(filterSelectionConfig.autoSelectionRules)
    ? filterSelectionConfig.autoSelectionRules
    : [];
  const matchedAutoRuleForUi = autoRulesForUi.find((rule: any) =>
    ruleMatchesSelectionContext(
      rule,
      isoStandard,
      system,
      systemType,
      coolingMethod,
      heatingMethod,
    ),
  );
  const matchedAutoClassForUi = (
    matchedAutoRuleForUi?.classifications || []
  ).find((entry: any) => entry.name === isoClassification);

  const autoRuleContextKey = `${isoStandard || ""}||${system || ""}||${systemType || ""}||${isoClassification || ""}||${coolingMethod || ""}||${heatingMethod || ""}`;

  const currentRuleSupplyKeys = (
    Array.isArray(matchedAutoClassForUi?.filters?.Supply)
      ? matchedAutoClassForUi.filters.Supply
      : []
  ).map((filterName: string) => `Supply:${filterName}`);

  const autoRulePreselectedKeys = new Set<string>(
    (Array.isArray(matchedAutoClassForUi?.filterTypeSelection)
      ? matchedAutoClassForUi.filterTypeSelection
      : []
    ).flatMap((type: string) => {
      const filtersForType = Array.isArray(
        matchedAutoClassForUi?.filters?.[type],
      )
        ? matchedAutoClassForUi.filters[type]
        : [];
      return filtersForType.map(
        (filterName: string) => `${type}:${filterName}`,
      );
    }),
  );
  const systems = (standardDataJson as any).text.options.systems;
  const isHeating = [
    systems.heating,
    systems.heatingVentilation,
    systems.heatingCooling,
  ].includes(system);
  const isCooling = [
    systems.cooling,
    systems.coolingVentilation,
    systems.heatingCooling,
  ].includes(system);

  const handleChange = (field: string, value: any) => {
    dispatch(updateStandardsField({ field, value }));

    const SEPARATE_COLUMNS = [
      "heatingFlowVelocity",
      "coolingFlowVelocity",
      "selectedFilters",
      "filterTypeSelection",
      "plantRoomDistance",
      "additionalDpValue",
    ];
    if (SEPARATE_COLUMNS.includes(field)) return;

    if (AHU_CONSTRUCTION_KEYS.includes(field)) {
      handleAhuConstructionDataChange(field, value);
    } else {
      handleAhuFiltrationDataChange(field, value);
    }
  };

  const handleAhuConstructionDataChange = (field: string, value: any) => {
    const prevData = Array.isArray(ahuConstructionData)
      ? ahuConstructionData
      : [];
    const existingIndex = prevData.findIndex(
      (item: any) => item.field === field,
    );
    let newData;
    if (existingIndex >= 0) {
      newData = [...prevData];
      newData[existingIndex] = { ...newData[existingIndex], value: value };
    } else {
      newData = [...prevData, { field: field, value: value }];
    }
    dispatch(
      updateStandardsField({ field: "ahuConstructionData", value: newData }),
    );
  };

  const handleAhuFiltrationDataChange = (field: string, value: any) => {
    const prevData = Array.isArray(ahufiltrationData) ? ahufiltrationData : [];
    // 1. Check if an object for this field already exists in the array
    const existingIndex = prevData.findIndex(
      (item: any) => item.field === field,
    );

    let newData;
    if (existingIndex >= 0) {
      // 2. If it exists, create a copy of the array and update that specific object
      newData = [...prevData];
      newData[existingIndex] = { ...newData[existingIndex], value: value };
    } else {
      // 3. If it doesn't exist yet, push it as a new object
      newData = [...prevData, { field: field, value: value }];
    }
    dispatch(
      updateStandardsField({ field: "ahufiltrationData", value: newData }),
    );
  };

  useEffect(() => {
    if (
      additionalDpValueExhaust !== "" &&
      Number(additionalDpValueExhaust) !== 0
    )
      return;
    const saved = (
      Array.isArray(ahufiltrationData) ? ahufiltrationData : []
    ).find((item: any) => item?.field === "additionalDpValueExhaust");
    if (
      saved &&
      saved.value !== undefined &&
      saved.value !== null &&
      saved.value !== ""
    ) {
      dispatch(
        updateStandardsField({
          field: "additionalDpValueExhaust",
          value: Number(saved.value),
        }),
      );
    }
  }, [additionalDpValueExhaust, ahufiltrationData, dispatch]);

  useEffect(() => {
    if (!system) {
      if (plantRoomDistance !== "") {
        dispatch(
          updateStandardsField({
            field: "plantRoomDistance",
            value: "",
          }),
        );
      }
      return;
    }

    if (
      plantRoomDistance !== "" &&
      plantRoomDistance !== null &&
      plantRoomDistance !== undefined
    ) {
      return;
    }
    dispatch(
      updateStandardsField({
        field: "plantRoomDistance",
        value: config.plantRoomDistanceLimits.min,
      }),
    );
  }, [system, plantRoomDistance, dispatch]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        filterTypeRef.current &&
        !filterTypeRef.current.contains(e.target as Node)
      ) {
        setFilterTypeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!system) {
      if (pipeConfiguration !== "") {
        dispatch(
          updateStandardsField({ field: "pipeConfiguration", value: "" }),
        );
      }
      return;
    }

    const shouldAutoSelectSinglePipe = [
      systems.heating,
      systems.cooling,
      systems.coolingVentilation,
      systems.heatingVentilation,
    ].includes(system);
    if (!shouldAutoSelectSinglePipe) return;
    if (pipeConfiguration === "Single Pipe") return;
    dispatch(
      updateStandardsField({
        field: "pipeConfiguration",
        value: "Single Pipe",
      }),
    );
  }, [system, pipeConfiguration, dispatch, systems]);

  // DERIVED VALUES: Count stages and calculate total pressure drop
  const activeFilters = (selectedFilters || []).filter(
    (k: string) => k && filterTypes.some((t: string) => k.startsWith(`${t}:`)),
  );
  const numSupplyStages = activeFilters.filter((k: string) =>
    k.startsWith("Supply:"),
  ).length;
  const numExhaustStages = activeFilters.filter((k: string) =>
    k.startsWith("Exhaust:"),
  ).length;

  const getFinalDpMmWgForKey = (k: string) => {
    const detail = selectedFilterDetails[k];
    if (detail?.finalDp) return detail.finalDp / MM_WG_TO_PA;
    const specs = getFilterSpecs(k.split(":")[1]);
    return specs ? Math.max(...specs.finalRange) : 0;
  };

  const numStagesSupply = activeFilters.filter((k: string) =>
    k.startsWith("Supply:"),
  ).length;
  const numStagesExhaust = activeFilters.filter((k: string) =>
    k.startsWith("Exhaust:"),
  ).length;

  const supplyFinalPressureMmWg = activeFilters
    .filter((k: string) => k.startsWith("Supply:"))
    .reduce((sum: number, k: string) => sum + getFinalDpMmWgForKey(k), 0);
  const exhaustFinalPressureMmWg = activeFilters
    .filter((k: string) => k.startsWith("Exhaust:"))
    .reduce((sum: number, k: string) => sum + getFinalDpMmWgForKey(k), 0);

  const formatPressureDisplay = (mmWgValue: number) => {
    const pa = Math.round(mmWgValue * MM_WG_TO_PA);
    return `${Math.round(mmWgValue)} mmWG / ${pa} Pa`;
  };
  const supplyFinalPressureWithAdditionalMmWg =
    supplyFinalPressureMmWg + (Number(additionalDpValue) || 0);
  const exhaustFinalPressureWithAdditionalMmWg =
    exhaustFinalPressureMmWg + (Number(additionalDpValueExhaust) || 0);
  const distanceDpParams =
    Number(plantRoomDistance) *
    config.calculationConstants.PLANT_ROOM_DISTANCE_FACTOR;

  // Static Pressure (mmWG) = (Plant Room Distance (m) * 0.7) + specific stream Filter Δp (mmWG) + specific stream Additional Δp (mmWG)
  const staticPressureSupplyMmWg = showSupplyFields
    ? distanceDpParams + supplyFinalPressureWithAdditionalMmWg
    : 0;
  const staticPressureExhaustMmWg = showExhaustFields
    ? distanceDpParams + exhaustFinalPressureWithAdditionalMmWg
    : 0;

  const supplyFinalPressureDisplay = formatPressureDisplay(
    staticPressureSupplyMmWg,
  );
  const exhaustFinalPressureDisplay = formatPressureDisplay(
    staticPressureExhaustMmWg,
  );

  // Sync calculated values to Redux
  useEffect(() => {
    dispatch(
      updateMultipleStandardsFields({
        totalFiltrationStagesSupply: numStagesSupply,
        totalFiltrationStagesExhaust: numStagesExhaust,
        staticPressureSupply: staticPressureSupplyMmWg,
        staticPressureExhaust: staticPressureExhaustMmWg,
      }),
    );
  }, [
    numStagesSupply,
    numStagesExhaust,
    staticPressureSupplyMmWg,
    staticPressureExhaustMmWg,
    dispatch,
  ]);

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
          dispatch(
            updateFilterDetail({
              filterName: k,
              details: {
                unit: "Pa",
                initialDp: specs.initRange[0] * MM_WG_TO_PA,
                finalDp: Math.max(...specs.finalRange) * MM_WG_TO_PA,
              },
            }),
          );
        }
      }
    }
    handleChange("selectedFilters", currentSelected);
  };

  const clamp = (n: number, min: number, max: number) =>
    Math.min(max, Math.max(min, n));
  const isNumericLike = (v: string) => /^\d*\.?\d*$/.test(v);

  function isSteamMedium(m: string) {
    return String(m || "")
      .toLowerCase()
      .includes("steam");
  }
  function getFlowVelocityRange(medium: string) {
    return isSteamMedium(medium)
      ? config.flowVelocityRange.steam
      : config.flowVelocityRange.water;
  }
  function formatMediumLabel(medium: string) {
    return medium ? medium : "Select Method";
  }

  const isHeatingCooling = system === "Air Cooling and Air Heating System";

  const useCoolingFlowVelocity =
    system === "Air Cooling and Air Heating System" &&
    pipeConfiguration === "Single Pipe";

  const flowMedium = useCoolingFlowVelocity
    ? coolingMethod
    : isHeating
      ? heatingMethod
      : coolingMethod;

  const flowRange = getFlowVelocityRange(flowMedium);

  const heatingFlowRange = getFlowVelocityRange(heatingMethod);
  const coolingFlowRange = getFlowVelocityRange(coolingMethod);

  useEffect(() => {
    // Enforce boundaries when medium changes (e.g. from Hot Water to Steam)
    if (
      heatingFlowVelocity < heatingFlowRange.min ||
      heatingFlowVelocity > heatingFlowRange.max
    ) {
      handleChange(
        "heatingFlowVelocity",
        clamp(
          Number(heatingFlowVelocity),
          heatingFlowRange.min,
          heatingFlowRange.max,
        ),
      );
    }
    if (
      coolingFlowVelocity < coolingFlowRange.min ||
      coolingFlowVelocity > coolingFlowRange.max
    ) {
      handleChange(
        "coolingFlowVelocity",
        clamp(
          Number(coolingFlowVelocity),
          coolingFlowRange.min,
          coolingFlowRange.max,
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowMedium, heatingMethod, coolingMethod]);

  // Auto-select filters from JSON rules for ISO cleanroom ventilation flow.
  useEffect(() => {
    const autoRules = Array.isArray(filterSelectionConfig.autoSelectionRules)
      ? filterSelectionConfig.autoSelectionRules
      : [];

    const matchedRule = autoRules.find((rule: any) =>
      ruleMatchesSelectionContext(
        rule,
        isoStandard,
        system,
        systemType,
        coolingMethod,
        heatingMethod,
      ),
    );
    if (!matchedRule) return;

    const classRule = (matchedRule.classifications || []).find(
      (entry: any) => entry.name === isoClassification,
    );
    if (!classRule) return;

    const requestedTypes = Array.isArray(classRule.filterTypeSelection)
      ? classRule.filterTypeSelection.filter(Boolean)
      : [];
    const selectedTypesForRule = filterTypes.filter((type: string) =>
      requestedTypes.includes(type),
    );
    if (selectedTypesForRule.length === 0) return;

    const applyKey = `${autoRuleContextKey}||${selectedTypesForRule.slice().sort().join(",")}`;
    if (appliedAutoRuleRef.current === applyKey) return;
    appliedAutoRuleRef.current = applyKey;

    const dismissedSupplySet =
      dismissedSupplyByContextRef.current[autoRuleContextKey] || new Set();

    const currentReduxFilters =
      store.getState().standards?.selectedFilters || [];
    const nextSelected = [...currentReduxFilters];
    const detailsToAdd: Array<{ filterName: string; details: any }> = [];

    selectedTypesForRule.forEach((type: string) => {
      const configuredFilters = Array.isArray(classRule.filters?.[type])
        ? classRule.filters[type]
        : [];

      configuredFilters.forEach((filterName: string) => {
        const key = `${type}:${filterName}`;
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
      nextSelected.length !== currentReduxFilters.length ||
      nextSelected.some((k: string) => !currentReduxFilters.includes(k));

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

  // Clear stale selected filters when classification or system type changes.
  useEffect(() => {
    const autoRules = Array.isArray(filterSelectionConfig.autoSelectionRules)
      ? filterSelectionConfig.autoSelectionRules
      : [];
    const matchedRule = autoRules.find((rule: any) =>
      ruleMatchesSelectionContext(
        rule,
        isoStandard,
        system,
        systemType,
        coolingMethod,
        heatingMethod,
      ),
    );
    if (!matchedRule) return;

    const classRule = (matchedRule.classifications || []).find(
      (entry: any) => entry.name === isoClassification,
    );

    // Build the full set of allowed keys for this context
    const allowedKeys = new Set<string>();
    if (classRule) {
      (["Supply", "Exhaust"] as const).forEach((type) => {
        const preselected = Array.isArray(classRule.filters?.[type])
          ? classRule.filters[type]
          : [];
        const userChoice = Array.isArray(classRule.userChoiceFilters?.[type])
          ? classRule.userChoiceFilters[type]
          : [];
        [...preselected, ...userChoice].forEach((f: string) =>
          allowedKeys.add(`${type}:${f}`),
        );
      });
    }

    const cleaned = (selectedFilters || []).filter((k: string) => {
      const [type, filter] = k.split(":");
      if (!filterTypes.includes(type)) return false;

      if (allowedKeys.has(k)) return true;
      if (type === "Supply" && handlingSupplyFilters.has(filter)) return true;
      if (type === "Exhaust" && handlingExhaustFilters.has(filter)) return true;
      return false;
    });
    if (cleaned.length !== (selectedFilters || []).length) {
      handleChange("selectedFilters", cleaned);
    }
  }, [
    isoStandard,
    system,
    systemType,
    isoClassification,
    coolingMethod,
    heatingMethod,
    handlingSupplyFilters,
    handlingExhaustFilters,
    filterTypes,
    selectedFilters,
  ]);

  // Track context to set default filter type selection (Supply vs Supply+Exhaust)
  const lastSystemTypeContextRef = useRef("");

  useEffect(() => {
    if (!system || !systemType) return;
    const context = `${system}||${systemType}`;
    if (lastSystemTypeContextRef.current === context) return;
    lastSystemTypeContextRef.current = context;

    const isVentilationSystem = system === "Ventilation System";
    const isCoolingVentilationVent =
      system === "Air Cooling and Ventilation System" &&
      systemType === "Ventilation System";
    const isHeatingVentilationVent =
      system === "Air Heating and Ventilation System" &&
      systemType === "Ventilation System";

    const shouldDefaultBoth =
      isVentilationSystem ||
      isCoolingVentilationVent ||
      isHeatingVentilationVent;

    if (shouldDefaultBoth) {
      const currentTypes = Array.isArray(filterTypeSelection)
        ? filterTypeSelection
        : [];
      if (
        !currentTypes.includes("Supply") ||
        !currentTypes.includes("Exhaust")
      ) {
        const updated = Array.from(
          new Set([...currentTypes, "Supply", "Exhaust"]),
        );
        handleChange("filterTypeSelection", updated);
      }
    } else {
      // For all other systems, default to Supply only when the system changes
      handleChange("filterTypeSelection", ["Supply"]);
    }
  }, [system, systemType]);

  useEffect(() => {
    const activeExhaustNames = new Set(
      activeHandlingExhaustPreselectionRules.map(([name]) => name),
    );
    Object.keys(appliedHandlingExhaustPreselectionRefV2.current).forEach(
      (name) => {
        if (!activeExhaustNames.has(name)) {
          delete appliedHandlingExhaustPreselectionRefV2.current[name];
        }
      },
    );

    const activeSupplyNames = new Set(
      activeHandlingSupplyPreselectionRules.map(([name]) => name),
    );
    Object.keys(appliedHandlingSupplyPreselectionRefV2.current).forEach(
      (name) => {
        if (!activeSupplyNames.has(name)) {
          delete appliedHandlingSupplyPreselectionRefV2.current[name];
        }
      },
    );
  }, [
    activeHandlingExhaustPreselectionRules,
    activeHandlingSupplyPreselectionRules,
  ]);

  useEffect(() => {
    const activeRuleNames = new Set(
      activeHandlingConstructionRules.map(([name]) => name),
    );
    Object.keys(appliedHandlingConstructionPreselectionRef.current).forEach(
      (name) => {
        if (!activeRuleNames.has(name)) {
          delete appliedHandlingConstructionPreselectionRef.current[name];
        }
      },
    );
  }, [activeHandlingConstructionRules]);

  useEffect(() => {
    if (activeHandlingConstructionRules.length === 0) return;
    const unappliedRules = activeHandlingConstructionRules.filter(
      ([handlingName]) =>
        !appliedHandlingConstructionPreselectionRef.current[handlingName],
    );
    if (unappliedRules.length === 0) return;

    unappliedRules.forEach(([, requiredFields]) => {
      Object.entries(requiredFields).forEach(([field, requiredValue]) => {
        if (field === "virusBurner" && virusBurner === requiredValue) return;
        dispatch(updateStandardsField({ field, value: requiredValue }));

        const prevData = Array.isArray(ahuConstructionData)
          ? ahuConstructionData
          : [];
        const existingIndex = prevData.findIndex(
          (item: { field?: string }) => item.field === field,
        );
        let newData;
        if (existingIndex >= 0) {
          newData = [...prevData];
          newData[existingIndex] = {
            ...newData[existingIndex],
            value: requiredValue,
          };
        } else {
          newData = [...prevData, { field, value: requiredValue }];
        }
        dispatch(
          updateStandardsField({
            field: "ahuConstructionData",
            value: newData,
          }),
        );
      });
    });

    unappliedRules.forEach(([handlingName]) => {
      appliedHandlingConstructionPreselectionRef.current[handlingName] = true;
    });
  }, [
    activeHandlingConstructionRules,
    virusBurner,
    ahuConstructionData,
    dispatch,
  ]);

  useEffect(() => {
    if (
      activeHandlingSupplyPreselectionRules.length === 0 &&
      activeHandlingExhaustPreselectionRules.length === 0
    ) {
      return;
    }

    const unappliedSupplyRules = activeHandlingSupplyPreselectionRules.filter(
      ([handlingName]) =>
        !appliedHandlingSupplyPreselectionRefV2.current[handlingName],
    );

    const unappliedExhaustRules = activeHandlingExhaustPreselectionRules.filter(
      ([handlingName]) =>
        !appliedHandlingExhaustPreselectionRefV2.current[handlingName],
    );

    if (
      unappliedSupplyRules.length === 0 &&
      unappliedExhaustRules.length === 0
    ) {
      return;
    }

    const filtersToAdd = new Set<string>();

    unappliedSupplyRules.forEach(([handlingName, filters]) => {
      if (!filterTypes.includes("Supply")) return;
      filters.forEach((filter) => {
        filtersToAdd.add(`Supply:${filter}`);
      });
      appliedHandlingSupplyPreselectionRefV2.current[handlingName] = true;
    });

    unappliedExhaustRules.forEach(([handlingName, filters]) => {
      if (!filterTypes.includes("Exhaust")) return;
      filters.forEach((filter) => {
        filtersToAdd.add(`Exhaust:${filter}`);
      });
      appliedHandlingExhaustPreselectionRefV2.current[handlingName] = true;
    });

    if (filtersToAdd.size > 0) {
      const currentSelected = [
        ...(store.getState().standards?.selectedFilters || []),
      ];
      let selectionChanged = false;

      filtersToAdd.forEach((k) => {
        if (!currentSelected.includes(k)) {
          currentSelected.push(k);
          selectionChanged = true;

          if (!selectedFilterDetails[k]) {
            const filterName = k.split(":")[1];
            const specs = getFilterSpecs(filterName);
            if (specs) {
              dispatch(
                updateFilterDetail({
                  filterName: k,
                  details: {
                    unit: "Pa",
                    initialDp: specs.initRange[0] * MM_WG_TO_PA,
                    finalDp: Math.max(...specs.finalRange) * MM_WG_TO_PA,
                  },
                }),
              );
            }
          }
        }
      });

      if (selectionChanged) {
        handleChange("selectedFilters", currentSelected);
      }
    }
  }, [
    activeHandlingSupplyPreselectionRules,
    activeHandlingExhaustPreselectionRules,
    selectedFilters,
    selectedFilterDetails,
    dispatch,
    filterTypes,
  ]);

  return (
    <>
      {/* Card 3: AHU Construction Specifications */}
      <div className={s.card}>
        <div className={s.cardHeader + " flex items-center justify-between"}>
          <div className={s.cardHeaderTitle}>
            AHU Construction Specifications
          </div>
          <div
            className={s.toggleWrapper}
            onClick={() => setShowConstructionSpecs(!showConstructionSpecs)}
          >
            <span className={s.toggleLabel}>
              {showConstructionSpecs ? "Hide" : "Show"}
            </span>
            <div
              className={
                s.toggleTrack +
                (showConstructionSpecs
                  ? " " + s.toggleTrackOn
                  : " " + s.toggleTrackOff)
              }
            >
              <div
                className={
                  s.toggleThumb +
                  (showConstructionSpecs
                    ? " " + s.toggleThumbOn
                    : " " + s.toggleThumbOff)
                }
              />
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
                    <div className={s.specialBoxValue}>
                      Range: {config.plantRoomDistanceLimits.min}-
                      {config.plantRoomDistanceLimits.max}{" "}
                      {config.fields.plantRoomDistance.unit}
                    </div>
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
                        onChange={(e) => {
                          // dont allow more than 3 digits
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
                          if (["-", "+", "e", "E", "."].includes(e.key)) {
                            //not allowing non-numeric characters and decimal point
                            e.preventDefault();
                          }
                        }}
                      />
                      <span className={s.specialBoxUnit}>meters</span>
                    </div>
                    {plantRoomDistance !== "" &&
                      (Number(plantRoomDistance) <
                        config.plantRoomDistanceLimits.min ||
                        Number(plantRoomDistance) >
                          config.plantRoomDistanceLimits.max) && (
                        <div className={s.errorText}>
                          Distance must be between{" "}
                          {config.plantRoomDistanceLimits.min} and{" "}
                          {config.plantRoomDistanceLimits.max} meters
                        </div>
                      )}
                  </div>
                </div>
              </div>

              <div className={s.transitionOpacity}>
                {/* Construction Specs Grid */}
                <div className={s.grid2}>
                  <ConfigSelect
                    label={config.fields.panelThicknessProfile.label}
                    field="panelThicknessProfile"
                    options={ahuData.ahuConstruction.panelThicknessProfile}
                    value={panelThicknessProfile}
                    onChange={handleChange}
                    tooltipId="panelThickness"
                    tooltipContent={constants.Tooltip.panelThicknessTooltip}
                  />
                  <ConfigSelect
                    label={config.fields.panelConstruction.label}
                    field="panelConstruction"
                    options={ahuData.ahuConstruction.panelConstruction}
                    value={panelConstruction}
                    onChange={handleChange}
                    tooltipId="panelConstruction"
                    tooltipContent={constants.Tooltip.panelConstructionTooltip}
                  />
                  <ConfigSelect
                    label={config.fields.airHandlingConstruction.label}
                    field="airHandlingConstruction"
                    options={ahuData.ahuConstruction.airHandlingConstruction}
                    value={airHandlingConstruction}
                    onChange={handleChange}
                    tooltipId="airHandling"
                    tooltipContent={constants.Tooltip.airHandlingTooltip}
                  />
                  <ConfigSelect
                    label={config.fields.fireControl.label}
                    field="fireControl"
                    options={ahuData.ahuConstruction.fireControl}
                    value={fireControl}
                    onChange={handleChange}
                    tooltipId="fireControl"
                    tooltipContent={constants.Tooltip.fireControlTooltip}
                  />
                  <ConfigSelect
                    label={config.fields.vfd.label}
                    field="vfd"
                    options={ahuData.ahuConstruction.vfd}
                    value={vfd}
                    onChange={handleChange}
                    tooltipId="vfd"
                    tooltipContent={constants.Tooltip.vfdTooltip}
                  />
                  <ConfigSelect
                    label={config.fields.pressureGauge.label}
                    field="pressureGauge"
                    options={ahuData.ahuConstruction.pressureGauge}
                    value={pressureGauge}
                    onChange={handleChange}
                    tooltipId="pressureGauge"
                    tooltipContent={constants.Tooltip.pressureGaugeTooltip}
                  />
                  <ConfigSelect
                    label={config.fields.virusBurner.label}
                    field="virusBurner"
                    options={ahuData.ahuConstruction.virusBurner}
                    value={virusBurner}
                    onChange={handleChange}
                    tooltipId="virusBurner"
                    tooltipContent={constants.Tooltip.virusBurnerTooltip}
                  />
                  <ConfigSelect
                    label={config.fields.doorInterlocking.label}
                    field="doorInterlocking"
                    options={ahuData.ahuConstruction.doorInterlocking}
                    value={doorInterlocking}
                    onChange={handleChange}
                    tooltipId="doorInterlocking"
                    tooltipContent={constants.Tooltip.doorInterlockingTooltip}
                  />
                  <ConfigSelect
                    label={config.fields.bmsMonitoring.label}
                    field="bmsMonitoring"
                    options={ahuData.ahuConstruction.bmsMonitoring}
                    value={bmsMonitoring}
                    onChange={handleChange}
                    tooltipId="bmsMonitoring"
                    tooltipContent={constants.Tooltip.bmsMonitoringTooltip}
                  />
                  <ConfigSelect
                    label={config.fields.emsMonitoring.label}
                    field="emsMonitoring"
                    options={ahuData.ahuConstruction.emsMonitoring}
                    value={emsMonitoring}
                    onChange={handleChange}
                    tooltipId="emsMonitoring"
                    tooltipContent={constants.Tooltip.emsMonitoringTooltip}
                  />
                </div>

                {/* Additional Specifications Sub-section */}
                {system !== "Ventilation System" && (
                  <>
                    <div className={s.subSectionHeader}>
                      {system === "Air-Cooling System" ||
                      system === "Air Cooling and Ventilation System" ||
                      system === "Air Cooling and Air Heating System"
                        ? "Additional Specifications for Air Cooling System"
                        : system === "Air-Heating System" ||
                            system === "Air Heating and Ventilation System"
                          ? "Additional Specifications for Air Heating System"
                          : "Additional Specifications"}
                    </div>
                    <div className={s.sectionLine} />

                    <div className={s.grid2Space}>
                      <ConfigSelect
                        label={config.fields.humidistat.label}
                        field="humidistat"
                        options={ahuData.additionalSpecifications.humidistat}
                        value={humidistat}
                        onChange={handleChange}
                        tooltipId="humidistat"
                        tooltipContent={constants.Tooltip.humidistatTooltip}
                      />
                      <ConfigSelect
                        label={config.fields.thermostat.label}
                        field="thermostat"
                        options={ahuData.additionalSpecifications.thermostat}
                        value={thermostat}
                        onChange={handleChange}
                        tooltipId="thermostat"
                        tooltipContent={constants.Tooltip.thermostatTooltip}
                      />
                      <ConfigSelect
                        label={config.fields.flowControlValve.label}
                        field="flowControlValve"
                        options={
                          ahuData.additionalSpecifications.flowControlValve
                        }
                        value={flowControlValve}
                        onChange={handleChange}
                        tooltipId="flowControlValve"
                        tooltipContent={
                          constants.Tooltip.flowControlValveTooltip
                        }
                      />
                      <ConfigSelect
                        label={config.fields.yStrainer.label}
                        field="yStrainer"
                        options={ahuData.additionalSpecifications.yStrainer}
                        value={yStrainer}
                        onChange={handleChange}
                        tooltipId="yStrainer"
                        tooltipContent={constants.Tooltip.yStrainerTooltip}
                      />
                      <ConfigSelect
                        label={config.fields.purgeWall.label}
                        field="purgeWall"
                        options={ahuData.additionalSpecifications.purgeWall}
                        value={purgeWall}
                        onChange={handleChange}
                        tooltipId="purgeWall"
                        tooltipContent={constants.Tooltip.purgeWallTooltip}
                      />
                      <ConfigSelect
                        label={config.fields.pipeConfiguration.label}
                        field="pipeConfiguration"
                        options={
                          system === "Air Cooling and Air Heating System"
                            ? ahuData.additionalSpecifications.pipeConfiguration
                            : ["Single Pipe"]
                        }
                        value={pipeConfiguration}
                        onChange={handleChange}
                        tooltipId="pipeConfiguration"
                        tooltipContent={
                          constants.Tooltip.pipeConfigurationTooltip
                        }
                        required={system !== "Ventilation System"}
                      />
                      <ConfigSelect
                        label={config.fields.treatedFreshAirUnit.label}
                        field="treatedFreshAirUnit"
                        options={
                          ahuData.additionalSpecifications.treatedFreshAirUnit
                        }
                        value={treatedFreshAirUnit}
                        onChange={handleChange}
                        tooltipId="treatedFreshAir"
                        tooltipContent={
                          constants.Tooltip.treatedFreshAirTooltip
                        }
                      />

                      {/* Original Flow Velocity Logic*/}
                      {isHeatingCooling && pipeConfiguration === "Dual Pipe" ? (
                        <>
                          <div className={s.flowBlock + " md:col-span-2"}>
                            <div className={s.dualFlowTitle}>
                              Heating Flow Velocity -{" "}
                              {formatMediumLabel(heatingMethod)}{" "}
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
                                  handleChange(
                                    "heatingFlowVelocity",
                                    clamp(
                                      Number(e.target.value),
                                      heatingFlowRange.min,
                                      heatingFlowRange.max,
                                    ),
                                  )
                                }
                              />
                              <div className={s.dualFlowMax}>
                                {heatingFlowRange.max}
                              </div>
                              <input
                                className={s.dualFlowValueBox}
                                inputMode="decimal"
                                value={heatingFlowVelocity}
                                required={true}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  if (v === "" || isNumericLike(v)) {
                                    const n = Number(v);
                                    if (!isNaN(n))
                                      handleChange(
                                        "heatingFlowVelocity",
                                        clamp(
                                          n,
                                          heatingFlowRange.min,
                                          heatingFlowRange.max,
                                        ),
                                      );
                                  }
                                }}
                              />
                              <div className={s.dualFlowUnit}>m/s</div>
                            </div>
                          </div>
                          <div className={s.flowBlock + " md:col-span-2"}>
                            <div className={s.dualFlowTitle}>
                              Cooling Flow Velocity -{" "}
                              {formatMediumLabel(coolingMethod)}{" "}
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
                                  handleChange(
                                    "coolingFlowVelocity",
                                    clamp(
                                      Number(e.target.value),
                                      coolingFlowRange.min,
                                      coolingFlowRange.max,
                                    ),
                                  )
                                }
                              />
                              <div className={s.dualFlowMax}>
                                {coolingFlowRange.max}
                              </div>
                              <input
                                className={s.dualFlowValueBox}
                                inputMode="decimal"
                                value={coolingFlowVelocity}
                                required={true}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  if (v === "" || isNumericLike(v)) {
                                    const n = Number(v);
                                    if (!isNaN(n))
                                      handleChange(
                                        "coolingFlowVelocity",
                                        clamp(
                                          n,
                                          coolingFlowRange.min,
                                          coolingFlowRange.max,
                                        ),
                                      );
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
                              Flow Velocity - {formatMediumLabel(flowMedium)}{" "}
                              <span className={s.required}>*</span>
                            </div>
                            <div className={s.dualFlowRow}>
                              <div className={s.dualFlowMin}>
                                {flowRange.min}
                              </div>
                              <input
                                type="range"
                                className={s.dualFlowSlider}
                                min={flowRange.min}
                                max={flowRange.max}
                                step={0.1}
                                value={
                                  useCoolingFlowVelocity
                                    ? coolingFlowVelocity
                                    : isHeating
                                      ? heatingFlowVelocity
                                      : coolingFlowVelocity
                                }
                                onChange={(e) => {
                                  const val = clamp(
                                    Number(e.target.value),
                                    flowRange.min,
                                    flowRange.max,
                                  );
                                  if (useCoolingFlowVelocity) {
                                    handleChange("coolingFlowVelocity", val);
                                  } else {
                                    if (isHeating)
                                      handleChange("heatingFlowVelocity", val);
                                    if (isCooling)
                                      handleChange("coolingFlowVelocity", val);
                                  }
                                }}
                              />
                              <div className={s.dualFlowMax}>
                                {flowRange.max}
                              </div>
                              <input
                                className={s.dualFlowValueBox}
                                inputMode="decimal"
                                value={
                                  useCoolingFlowVelocity
                                    ? coolingFlowVelocity
                                    : isHeating
                                      ? heatingFlowVelocity
                                      : coolingFlowVelocity
                                }
                                required={true}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  if (v === "" || isNumericLike(v)) {
                                    const n = Number(v);
                                    if (!isNaN(n)) {
                                      const val = clamp(
                                        n,
                                        flowRange.min,
                                        flowRange.max,
                                      );
                                      if (useCoolingFlowVelocity) {
                                        handleChange(
                                          "coolingFlowVelocity",
                                          val,
                                        );
                                      } else {
                                        if (isHeating)
                                          handleChange(
                                            "heatingFlowVelocity",
                                            val,
                                          );

                                        if (isCooling)
                                          handleChange(
                                            "coolingFlowVelocity",
                                            val,
                                          );
                                      }
                                    }
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
            <span className={s.toggleLabel}>
              {showFiltrationDetails ? "Hide" : "Show"}
            </span>
            <div
              className={
                s.toggleTrack +
                (showFiltrationDetails
                  ? " " + s.toggleTrackOn
                  : " " + s.toggleTrackOff)
              }
            >
              <div
                className={
                  s.toggleThumb +
                  (showFiltrationDetails
                    ? " " + s.toggleThumbOn
                    : " " + s.toggleThumbOff)
                }
              />
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
                    <div className={s.specialBoxTitle}>
                      Filter Type Selection{" "}
                      <span className={s.requiredText}>*</span>
                    </div>
                    <div className={s.specialBoxValue}>
                      <span className={s.specialBoxSubtitle}>
                        Select whether filters are for supply or exhaust air
                      </span>
                    </div>
                  </div>

                  <div ref={filterTypeRef} className={s.dropdownWrapper}>
                    <div
                      onClick={() => setFilterTypeOpen(!filterTypeOpen)}
                      className={`${s.input} cursor-pointer flex items-center justify-between min-h-[48px] px-4 py-2 bg-white border-2 ${
                        filterTypeOpen
                          ? "border-blue-500 ring-4 ring-blue-50"
                          : "border-slate-200"
                      }`}
                    >
                      <div className={s.selectedTags}>
                        {filterTypes.length > 0 ? (
                          filterTypes.map((type: string) => (
                            <span key={type} className={s.tag}>
                              {type.toUpperCase()}
                              <HiX
                                className={s.tagRemove}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const updated = filterTypes.filter(
                                    (t: string) => t !== type,
                                  );
                                  handleChange("filterTypeSelection", updated);

                                  const prefix = `${type}:`;
                                  const newSelected = (
                                    selectedFilters || []
                                  ).filter(
                                    (f: string) => !f.startsWith(prefix),
                                  );
                                  handleChange("selectedFilters", newSelected);

                                  const newDetails = {
                                    ...selectedFilterDetails,
                                  };
                                  Object.keys(newDetails).forEach((k) => {
                                    if (k.startsWith(prefix))
                                      delete newDetails[k];
                                  });
                                  handleChange(
                                    "selectedFilterDetails",
                                    newDetails,
                                  );
                                }}
                              />
                            </span>
                          ))
                        ) : (
                          <span className={s.placeholder}>
                            {filterTypes.length === 0
                              ? "Select at least one..."
                              : "Select filter types..."}
                          </span>
                        )}
                      </div>
                      <HiChevronDown
                        className={`${s.chevronBase} ${filterTypeOpen ? s.chevronOpen : ""}`}
                      />
                    </div>

                    {filterTypeOpen && (
                      <div className={s.dropdownMenu}>
                        <div className={s.dropdownContent}>
                          {ahuData.filtrationSelection.filterType.map(
                            (v: string) => {
                              const isSelected = filterTypes.includes(v);
                              return (
                                <div
                                  key={v}
                                  onClick={() => {
                                    const updated = isSelected
                                      ? filterTypes.filter(
                                          (t: string) => t !== v,
                                        )
                                      : [...filterTypes, v];

                                    handleChange(
                                      "filterTypeSelection",
                                      updated,
                                    );

                                    if (isSelected && !updated.includes(v)) {
                                      const prefix = `${v}:`;
                                      const newSelected = (
                                        selectedFilters || []
                                      ).filter(
                                        (f: string) => !f.startsWith(prefix),
                                      );
                                      handleChange(
                                        "selectedFilters",
                                        newSelected,
                                      );

                                      const newDetails = {
                                        ...selectedFilterDetails,
                                      };
                                      Object.keys(newDetails).forEach((k) => {
                                        if (k.startsWith(prefix))
                                          delete newDetails[k];
                                      });
                                      handleChange(
                                        "selectedFilterDetails",
                                        newDetails,
                                      );
                                    }
                                  }}
                                  className={`${s.optionBase} ${
                                    isSelected
                                      ? s.optionSelected
                                      : s.optionUnselected
                                  }`}
                                >
                                  <span className={s.optionLabel}>{v}</span>
                                  {isSelected && (
                                    <HiCheck className={s.checkIcon} />
                                  )}
                                </div>
                              );
                            },
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-8 mt-6">
                {filterTypes.map((type) => {
                  const baseFilters =
                    type === "Exhaust"
                      ? ahuData.filtrationSelection.exhaustFilters
                      : ahuData.filtrationSelection.supplyFilters;

                  const currentFilters = baseFilters
                    .filter((filter: string) => {
                      const k = `${type}:${filter}`;
                      const isSelected = (selectedFilters || []).includes(k);
                      const isUserChoice =
                        matchedAutoClassForUi?.userChoiceFilters?.[
                          type
                        ]?.includes(filter) || false;
                      const isAutoPreselected =
                        matchedAutoClassForUi?.filters?.[type]?.includes(
                          filter,
                        ) || false;
                      const isHandlingPreselected =
                        type === "Supply"
                          ? handlingSupplyFilters.has(filter)
                          : handlingExhaustFilters.has(filter);
                      return (
                        isSelected ||
                        isUserChoice ||
                        isAutoPreselected ||
                        isHandlingPreselected
                      );
                    })
                    .sort((a: string, b: string) => {
                      const isPreA =
                        matchedAutoClassForUi?.filters?.[type]?.includes(a) ||
                        false ||
                        (type === "Supply"
                          ? handlingSupplyFilters.has(a)
                          : handlingExhaustFilters.has(a));
                      const isPreB =
                        matchedAutoClassForUi?.filters?.[type]?.includes(b) ||
                        false ||
                        (type === "Supply"
                          ? handlingSupplyFilters.has(b)
                          : handlingExhaustFilters.has(b));
                      if (isPreA && !isPreB) return -1;
                      if (!isPreA && isPreB) return 1;
                      return 0;
                    });

                  const selectedCount = currentFilters.filter(
                    (filter: string) => {
                      const k = `${type}:${filter}`;
                      return (selectedFilters || []).includes(k);
                    },
                  ).length;

                  const titleBarClass =
                    type === "Supply" ? s.titleBarSupply : s.titleBarExhaust;
                  const thClass = type === "Supply" ? s.thSupply : s.thExhaust;

                  return (
                    <div key={type} className="flex flex-col gap-4">
                      <div
                        className={`flex items-center gap-2 ${titleBarClass}`}
                      >
                        <h3 className="text-sm font-bold text-slate-800">
                          {type} Filters
                        </h3>
                        <span className="text-xs font-semibold text-slate-400">
                          ({selectedCount} selected)
                        </span>
                      </div>

                      {type === "Exhaust" && (
                        <div className={s.impactBox}>
                          <div className={s.impactTitle}>Impact of Exhaust</div>
                          <div className={s.impactContent}>
                            <div className={s.field}>
                              <label className={s.label}>
                                Exhaust Impact (0-120%){" "}
                                <span className={s.required}>*</span>
                              </label>
                              <input
                                type="number"
                                className={s.input}
                                placeholder="Enter percentage (0-120)"
                                value={
                                  exhaustImpactPercentage
                                    ? exhaustImpactPercentage.replace(
                                        /[^0-9.-]/g,
                                        "",
                                      )
                                    : ""
                                }
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val === "") {
                                    handleChange("exhaustImpactPercentage", "");
                                    return;
                                  }
                                  dispatch(
                                    updateStandardsField({
                                      field: "exhaustImpactPercentage",
                                      value: val,
                                    }),
                                  );
                                }}
                              />
                              {exhaustImpactPercentage &&
                                (Number(
                                  exhaustImpactPercentage.replace(
                                    /[^0-9.-]/g,
                                    "",
                                  ),
                                ) < 0 ||
                                  Number(
                                    exhaustImpactPercentage.replace(
                                      /[^0-9.-]/g,
                                      "",
                                    ),
                                  ) > 120) && (
                                  <div className="text-red-500 text-xs mt-1">
                                    Value must be between 0 and 120%
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className={s.tableWrapper}>
                        <table className={s.table}>
                          <thead>
                            <tr className={thClass}>
                              <th className={s.th}>Select</th>
                              <th className={s.th}>Filter Name</th>
                              <th className={s.th}>Rating</th>
                              <th className={s.th}>Depth</th>
                              <th className={s.th}>Efficiency</th>
                              <th className={s.th}>Initial Δp</th>
                              <th className={s.th}>Final Δp</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentFilters.map((filter: string) => {
                              const k = `${type}:${filter}`;
                              const isSelected = (
                                selectedFilters || []
                              ).includes(k);
                              const specs = getFilterSpecs(filter);
                              const isActive = isSelected;
                              const rowClass = isActive
                                ? s.rowSelected
                                : s.rowUnselected;

                              const data = selectedFilterDetails[k];
                              const currentInitMmwg =
                                data?.initialDp !== undefined &&
                                data?.initialDp !== null
                                  ? Math.round(
                                      (data.initialDp / MM_WG_TO_PA) * 10,
                                    ) / 10
                                  : specs
                                    ? specs.initRange[0]
                                    : 0;
                              const currentFinalMmwg =
                                data?.finalDp !== undefined &&
                                data?.finalDp !== null
                                  ? Math.round(
                                      (data.finalDp / MM_WG_TO_PA) * 10,
                                    ) / 10
                                  : specs
                                    ? specs.finalRange[1]
                                    : 0;

                              const initMmwgSteps = specs
                                ? generateMmwgSteps(
                                    specs.initRange[0],
                                    specs.initRange[1],
                                  )
                                : [];
                              const finalMmwgSteps = specs
                                ? generateMmwgSteps(
                                    specs.finalRange[0],
                                    specs.finalRange[1],
                                  )
                                : [];

                              return (
                                <tr key={k} className={rowClass}>
                                  <td className={s.td}>
                                    <div className={s.tableCheckboxWrapper}>
                                      <input
                                        type="checkbox"
                                        className={`${s.checkboxBase} ${s.checkboxEnabled}`}
                                        checked={isActive}
                                        onChange={() =>
                                          handleFilterToggle(type, filter)
                                        }
                                      />
                                    </div>
                                  </td>
                                  <td className={s.td}>
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span
                                        className={`${s.filterTextBase} text-slate-700`}
                                      >
                                        {filter}
                                      </span>
                                      {matchedAutoClassForUi?.filters?.[
                                        type
                                      ]?.includes(filter) && (
                                        <span className={s.pillPreselected}>
                                          Preselected
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className={s.td}>
                                    {specs?.rating || (
                                      <span className={s.emptyDash}>—</span>
                                    )}
                                  </td>
                                  <td className={s.td}>
                                    {specs?.depth || (
                                      <span className={s.emptyDash}>—</span>
                                    )}
                                  </td>
                                  <td className={s.td}>
                                    {specs?.efficiency || (
                                      <span className={s.emptyDash}>—</span>
                                    )}
                                  </td>
                                  <td className={s.td}>
                                    {isActive && specs ? (
                                      <select
                                        className={s.tableSelectInput}
                                        value={currentInitMmwg}
                                        onChange={(e) =>
                                          dispatch(
                                            updateFilterDetail({
                                              filterName: k,
                                              details: {
                                                initialDp:
                                                  Number(e.target.value) *
                                                  MM_WG_TO_PA,
                                              },
                                            }),
                                          )
                                        }
                                      >
                                        {initMmwgSteps.map((mmwg) => (
                                          <option key={mmwg} value={mmwg}>
                                            {formatPressure(mmwg)}
                                          </option>
                                        ))}
                                      </select>
                                    ) : (
                                      <span className={s.emptyDash}>—</span>
                                    )}
                                  </td>
                                  <td className={s.td}>
                                    {isActive && specs ? (
                                      <select
                                        className={s.tableSelectInput}
                                        value={currentFinalMmwg}
                                        onChange={(e) =>
                                          dispatch(
                                            updateFilterDetail({
                                              filterName: k,
                                              details: {
                                                finalDp:
                                                  Number(e.target.value) *
                                                  MM_WG_TO_PA,
                                              },
                                            }),
                                          )
                                        }
                                      >
                                        {finalMmwgSteps.map((mmwg) => (
                                          <option key={mmwg} value={mmwg}>
                                            {formatPressure(mmwg)}
                                          </option>
                                        ))}
                                      </select>
                                    ) : (
                                      <span className={s.emptyDash}>—</span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={s.finalSection}>
                <div className={s.finalGrid}>
                  {showSupplyFields && (
                    <div className={s.field}>
                      <label className={s.label}>
                        Number of filtration stages in Supply{" "}
                        <span className={s.autoCalcNote}>
                          (Auto-calculated)
                        </span>
                      </label>
                      <input
                        type="text"
                        className={s.inputDisabled}
                        value={numSupplyStages}
                        readOnly
                      />
                    </div>
                  )}

                  {showExhaustFields && (
                    <div className={s.field}>
                      <label className={s.label}>
                        Number of filtration stages in Exhaust{" "}
                        <span className={s.autoCalcNote}>
                          (Auto-calculated)
                        </span>
                      </label>
                      <input
                        type="text"
                        className={s.inputDisabled}
                        value={numExhaustStages}
                        readOnly
                      />
                    </div>
                  )}

                  {showSupplyFields && (
                    <div className={s.field}>
                      <label className={s.label}>
                        Include any additional pressure drop allowance for
                        supply filters <span className={s.required}>*</span>
                      </label>
                      <select
                        className={s.select + " py-4"}
                        value={additionalDpValue}
                        onChange={(e) =>
                          handleChange(
                            "additionalDpValue",
                            e.target.value === "" ? "" : Number(e.target.value),
                          )
                        }
                        required={showSupplyFields}
                      >
                        <option value="" disabled>
                          Select Option
                        </option>
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
                  )}

                  {showExhaustFields && (
                    <div className={s.field}>
                      <label className={s.label}>
                        Include any additional pressure drop allowance for
                        exhaust filters <span className={s.required}>*</span>
                      </label>
                      <select
                        className={s.select + " py-4"}
                        value={additionalDpValueExhaust}
                        onChange={(e) =>
                          handleChange(
                            "additionalDpValueExhaust",
                            e.target.value === "" ? "" : Number(e.target.value),
                          )
                        }
                        required={showExhaustFields}
                      >
                        <option value="" disabled>
                          Select Option
                        </option>
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
                  )}

                  {showSupplyFields && (
                    <div className={s.field}>
                      <label className={s.label}>
                        Static pressure requirement for blower in Supply filters{" "}
                        <span className={s.autoCalcNote}>
                          (Auto-calculated)
                        </span>
                      </label>
                      <input
                        type="text"
                        className={s.inputDisabled}
                        value={supplyFinalPressureDisplay}
                        readOnly
                      />
                    </div>
                  )}

                  {showExhaustFields && (
                    <div className={s.field}>
                      <label className={s.label}>
                        Static pressure requirement for blower in Exhaust
                        filters{" "}
                        <span className={s.autoCalcNote}>
                          (Auto-calculated)
                        </span>
                      </label>
                      <input
                        type="text"
                        className={s.inputDisabled}
                        value={exhaustFinalPressureDisplay}
                        readOnly
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Custom Distance Validation Modal */}
      {showDistanceModal && (
        <div className={s.modalOverlay}>
          <div className={s.modalContent}>
            <div className={s.modalTitle}>Invalid Distance</div>
            <div className={s.modalBody}>
              Plant room distance needs to be between{" "}
              {config.plantRoomDistanceLimits.min} and{" "}
              {config.plantRoomDistanceLimits.max} meters.
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
