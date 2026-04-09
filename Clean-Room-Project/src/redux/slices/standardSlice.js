import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	standard: "",
	classification: "",
	acph: "",
	acphMin: "",
	acphMax: "",
	system: "",
	systemType: "",
	heatingMethod: "",
	coolingMethod: "",
	tempUnit: "C",
	reqInsideTempC: "",
	reqInsideTempDisplay: "",
	reqInsideHum: "",
	flowVelocity: 1.5,
	heatingFlowVelocity: 1.5,
	coolingFlowVelocity: 1.5,
	zoneName: "",
	zoneId: "",
	projectStandardId: "",
	// Filtration
	preFilter: "",
	fineFilter: "",
	hepaFilter: "",
	carbonFilter: "",
	// Construction Specs
	plantRoomDistance: "",
	panelThicknessProfile: "",
	panelConstruction: "",
	airHandlingConstruction: "",
	fireControl: "",
	vfd: "",
	pressureGauge: "",
	virusBurner: "",
	doorInterlocking: "",
	bmsMonitoring: "",
	emsMonitoring: "",
	// Additional Specs (Air-Heating)
	humidistat: "",
	thermostat: "",
	flowControlValve: "",
	yStrainer: "",
	purgeWall: "",
	pipeConfiguration: "",
	treatedFreshAirUnit: "",
	filterTypeSelection: [],
	selectedFilters: [],
	selectedFilterDetails: {},
	exhaustImpactPercentage: "",
	bioSafetyLevel: "",
	additionalDpValue: 0,
	additionalDpValueExhaust: 0,
	totalFiltrationStagesSupply: 0,
	totalFiltrationStagesExhaust: 0,
	staticPressureSupply: 0,
	staticPressureExhaust: 0,
	numSupplyStages: 0,
    numExhaustStages: 0,
    supplyFinalPressureDisplay: 0,
    exhaustFinalPressureDisplay: 0,
	ahufiltrationData: [],
	ahuConstructionData: [],
};

const standardsSlice = createSlice({
	name: "standards",
	initialState,
	reducers: {
		updateStandardsField: (state, action) => {
			const { field, value } = action.payload;
			state[field] = value;
		},
		updateMultipleStandardsFields: (state, action) => {
			Object.entries(action.payload).forEach(([key, value]) => {
				state[key] = value;
			});
		},
		updateFilterDetail: (state, action) => {
			const { filterName, details } = action.payload;
			if (!state.selectedFilterDetails) {
				state.selectedFilterDetails = {};
			}
			state.selectedFilterDetails[filterName] = {
				...state.selectedFilterDetails[filterName],
				...details,
			};
		},
		resetStandards: () => initialState,
	},
});

export const {
	updateStandardsField,
	updateMultipleStandardsFields,
	updateFilterDetail,
	resetStandards,
} = standardsSlice.actions;

export default standardsSlice.reducer;
