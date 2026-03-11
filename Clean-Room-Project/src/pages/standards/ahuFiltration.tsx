import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { updateStandardsField, updateFilterDetail } from "../../redux/slices/standardSlice";
import standardDesign from "./styles";
import ahuData from "../../json/ahuFiltrationData.json";
import standardDataJson from "../../json/standardData.json";
import { Tooltip } from "../../components/Tooltip/index";
import constants from "../../json/constants.json";

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

    const currentInitMmwg = data?.initialDp !== undefined ? data.initialDp / MM_WG_TO_PA : specs.initRange[0];
    const currentFinalMmwg = data?.finalDp !== undefined ? data.finalDp / MM_WG_TO_PA : specs.finalRange[1];

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
    } = useAppSelector((state: any) => state.standards);

    const handling = useAppSelector((state: any) => state.projectInfo?.handling || []);
    const specialHandlingOptions = ahuData.filtrationSelection.specialHandlingOptions;
    const hasSpecialHandling = handling.length > 0 && handling.every((h: string) => specialHandlingOptions.includes(h)); // Check if all handling options are special handling options

    const systems = (standardDataJson as any).text.options.systems;
    const isHeating = [systems.heating, systems.heatingVentilation, systems.heatingCooling].includes(system);
    const isCooling = [systems.cooling, systems.coolingVentilation, systems.heatingCooling].includes(system);

    const handleChange = (field: string, value: any) => {
        dispatch(updateStandardsField({ field, value }));
    };

    const MM_WG_TO_PA = 9.8;
    const numStages = (selectedFilters || []).filter((f: string) => f && f.trim() !== "").length;

    // finalDp is stored in Pa in selectedFilterDetails, convert to mmWG for sum
    const filterDpSumMmWg = Object.entries(selectedFilterDetails)
        .filter(([name]) => selectedFilters.includes(name))
        .reduce((acc: number, [_, curr]: [string, any]) => acc + ((curr.finalDp || 0) / MM_WG_TO_PA), 0);

    const staticPressureMmWg = (Number(plantRoomDistance) * 0.7) + filterDpSumMmWg + (Number(additionalDpValue) || 0);
    const staticPressurePa = Math.round(staticPressureMmWg * MM_WG_TO_PA);
    const staticPressureDisplay = `${Math.round(staticPressureMmWg)} mmWG / ${staticPressurePa} Pa`;

    const additionalDpOptions = Array.from({ length: 6 }, (_, i) => i + 5); // 5 to 10 mmWG

    const handleFilterToggle = (filter: string) => {
        const currentSelected = [...(selectedFilters || [])];
        const index = currentSelected.indexOf(filter);
        if (index > -1) {
            currentSelected.splice(index, 1);
        } else {
            currentSelected.push(filter);
            // Initialize filter detail if not present
            if (!selectedFilterDetails[filter]) {
                const specs = (ahuData.filterSpecs as any)[filter];
                if (specs) {
                    const MM_WG_TO_PA = 9.8;
                    dispatch(updateFilterDetail({
                        filterName: filter,
                        details: {
                            unit: "Pa",
                            initialDp: specs.initRange[0] * MM_WG_TO_PA,
                            finalDp: specs.finalRange[1] * MM_WG_TO_PA
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
                                            if (val > 100) return;
                                            handleChange("plantRoomDistance", val);
                                        }}
                                        onKeyDown={(e) => {
                                            if (["-", "+", "e", "E", "."].includes(e.key)) {
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
                                    {isHeatingCooling ? (
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
                            <div>
                                <div className={s.specialBoxTitle}>Filter Type Selection</div>
                                <div className={s.specialBoxValue}>Select whether filters are for supply or exhaust air</div>
                            </div>
                            <div className="flex gap-6 items-center">
                                {ahuData.filtrationSelection.filterType.map((v: string) => (
                                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="filterTypeSelection"
                                            value={v}
                                            checked={filterTypeSelection === v}
                                            onChange={(e) => {
                                                if (filterTypeSelection !== e.target.value) {
                                                    handleChange("filterTypeSelection", e.target.value);
                                                    handleChange("selectedFilters", []);
                                                    handleChange("selectedFilterDetails", {});
                                                }
                                            }}
                                            className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-full"
                                        />
                                        <span className="text-gray-700 font-medium">{v}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    {filterTypeSelection === "Exhaust" && (
                        <div className={s.specialBox + " bg-blue-50 border-blue-100"}>
                            <div className="text-blue-800 font-bold text-xs mb-3 uppercase tracking-wider">Impact of Exhaust</div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-blue-950">Exhaust Impact Percentage (0-50%)</label>
                                <select
                                    className={s.select + " py-4"}
                                    value={exhaustImpactPercentage}
                                    onChange={(e) => handleChange("exhaustImpactPercentage", e.target.value)}
                                >
                                    <option value="">Select exhaust impact percentage...</option>
                                    {ahuData.filtrationSelection.exhaustImpact.map((val: string) => (
                                        <option key={val} value={val}>{val}</option>
                                    ))}
                                </select>
                                <div className="text-[10px] text-blue-600 font-medium">
                                    {ahuData.filtrationSelection.exhaustImpactHint}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8 transition-opacity duration-300">
                        {/* Split filters into two independent vertical columns */}
                        {[0, 1].map((colIndex) => {
                            const currentFilters = filterTypeSelection === "Exhaust"
                                ? (hasSpecialHandling
                                    ? ahuData.filtrationSelection.specialExhaustFilters
                                    : ahuData.filtrationSelection.exhaustFilters)
                                : ahuData.filtrationSelection.supplyFilters;

                            return (
                                <div key={colIndex} className="flex flex-col gap-6">
                                    {currentFilters
                                        .filter((_, i) => i % 2 === colIndex)
                                        .map((filter) => {
                                            const isSelected = (selectedFilters || []).includes(filter);
                                            const specs = (ahuData.filterSpecs as any)[filter];
                                            return (
                                                <div key={filter} className="flex flex-col">
                                                    <label className="flex items-center gap-3 cursor-pointer group">
                                                        <div className="relative flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                                checked={isSelected}
                                                                onChange={() => handleFilterToggle(filter)}
                                                            />
                                                        </div>
                                                        <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
                                                            {filter}
                                                        </span>
                                                    </label>
                                                    {isSelected && specs && (
                                                        <FilterDetailCard
                                                            filterName={filter}
                                                            specs={specs}
                                                            data={selectedFilterDetails[filter]}
                                                            onUpdate={(details) =>
                                                                dispatch(updateFilterDetail({ filterName: filter, details }))
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
