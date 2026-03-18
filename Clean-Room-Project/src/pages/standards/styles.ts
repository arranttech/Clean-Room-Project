const standardDesign = {
	page: "min-h-screen bg-white px-4 py-6",

	top: "mx-auto max-w-5xl text-center mb-4",
	title: "text-2xl font-bold text-gray-950 tracking-tight",
	subtitle: "mt-2 text-base text-blue-600",

	cardWrap: "mx-auto mt-10 max-w-auto",
	card: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden",

	cardHeader: "px-8 pt-8 pb-4",
	cardHeaderTitle: "text-sm font-bold tracking-widest text-blue-800 uppercase",
	divider: "border-t border-slate-200",

	body: "px-8 py-8",

	sectionTitle: "text-sm font-bold tracking-widest text-blue-800 uppercase",
	subSectionTitle: "text-xs font-bold tracking-wider text-blue-800 uppercase",
	sectionSpacer: "mt-10",
	sectionLine: "mt-6 border-t border-slate-200",

	grid3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
	grid2: "grid grid-cols-1 md:grid-cols-2 gap-6",
	grid4: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",

	field: "flex flex-col gap-2",
	label: "text-sm font-semibold text-slate-700",
	required: "text-red-500",

	select:
		"w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm " +
		"focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none",

	selectDisabled:
		"w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500",

	input:
		"w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm " +
		"focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none",

	inputDisabled:
		"w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-600",
	helperText: "text-xs text-slate-500",

	range: "mt-1 text-xs text-slate-600",
	rangeValue: "font-semibold text-blue-600",
	quickView: "mt-8 text-sm text-slate-700",
	footer: "flex items-center justify-between w-full max-w-auto mt-8 align-middle",
	backLink:
		"inline-flex items-center gap-3 border border-gray-300 px-5 py-2.5 rounded-xl hover:bg-gray-50 shadow-sm text-gray-600 text-sm font-medium transition-all",
	nextLink:
		"inline-flex items-center gap-3 bg-blue-700 text-white px-7 py-2.5 rounded-xl hover:bg-blue-800 shadow-md text-sm font-semibold transition-all",

	unitRow: "flex flex-wrap items-center gap-4",
	unitLabel: "text-sm font-semibold text-slate-700",
	unitGroup: "flex items-center gap-3",
	unitOption:
		"inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 " +
		"text-sm text-slate-700 hover:bg-slate-200 transition",
	unitRadio: "h-4 w-4 accent-blue-600",
	unitHint: "text-xs text-slate-500",
	tempHelper: "mt-3 text-xs text-slate-500",
	disabled: "opacity-40 cursor-not-allowed",

	flowBlock: "mt-8",
	flowLabelRow: "flex items-center justify-between",
	flowTitle: "text-sm font-semibold text-slate-700",
	flowUnit: "text-xs font-semibold text-slate-500",

	flowRow:
		"mt-3 flex flex-wrap items-center gap-4 border-b border-slate-200 pb-4",
	flowMin: "text-xs text-slate-500 w-12",
	flowMax: "text-xs text-slate-500 w-12 text-right",
	flowSlider: "flex-1 min-w-[240px] accent-blue-600",
	flowValueBoxWrap: "flex items-center",
	flowValueBox:
		"w-20 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm " +
		"focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none",
	flowUnitSmall: "text-xs text-slate-600",
	flowHint: "mt-2 text-xs text-slate-500",

	/* ---------- Dual Flow Velocity (Heating + Cooling) ---------- */
	dualFlowBlock: "mt-8",
	dualFlowGrid: "grid grid-cols-1 md:grid-cols-2 gap-6",

	dualFlowCard: "rounded-xl border border-slate-200 bg-slate-50 p-4",

	dualFlowTitle: "text-sm font-semibold text-slate-700 mb-3",

	dualFlowRow: "flex items-center gap-3",

	dualFlowMin: "text-xs text-slate-500 w-10",

	dualFlowMax: "text-xs text-slate-500 w-10 text-right",

	dualFlowSlider: "flex-1 accent-blue-600 min-w-[140px]",

	dualFlowValueBox:
		"w-16 rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm " +
		"focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none",

	dualFlowUnit: "text-xs text-slate-600",
	cardStack: "flex flex-col gap-8",
	specialBox: "bg-slate-50 border border-slate-200 rounded-xl p-6 mb-10",
	specialBoxRow: "flex items-center justify-between",
	specialBoxTitle: "text-slate-700 font-bold mb-1",
	specialBoxValue: "text-slate-400 text-xs",
	specialBoxInputGroup: "flex items-center gap-3",
	specialBoxInput:
		"w-24 text-center py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold " +
		"focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none",
	specialBoxUnit: "text-slate-500 text-sm",
	subSectionHeader: "mt-12 text-xs font-bold tracking-wider text-blue-800 uppercase",
	grid2Space: "grid grid-cols-1 md:grid-cols-2 gap-6 mt-6",

	/* ---------- Filter Detail Card ---------- */
	filterCard: "rounded-xl border border-slate-200 bg-white p-4 shadow-sm",
	filterStatRow: "flex items-center gap-1.5 text-xs text-slate-600 mb-1",
	filterStatLabel: "font-bold text-slate-700",
	filterStatValue: "text-slate-600",
	filterDpGrid: "grid grid-cols-2 gap-4 mt-4",
	filterDpLabel: "text-xs font-bold text-slate-700 mb-1",
	filterDpRange: "text-[10px] text-slate-500 mt-1",

	/* ---------- AHU Filtration Specific Styles ---------- */
	filterHeader: "flex justify-between items-start mb-4",
	filterTitle: "text-sm font-bold text-slate-800",
	filterStats: "space-y-1 mb-4",
	colEnd: "flex flex-col items-end",
	errorText: "text-red-500 text-xs mt-2 text-right w-full block",
	transitionOpacity: "transition-opacity duration-300",
	flex1: "flex-1",
	requiredText: "text-red-600",

	/* ---------- Filter Type Dropdown ---------- */
	dropdownWrapper: "relative w-72",
	selectedTags: "flex flex-wrap gap-1.5 flex-1 mr-2",
	tag: "bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm",
	tagRemove: "cursor-pointer hover:text-blue-200 transition-colors",
	placeholder: "text-slate-400 text-sm",
	dropdownMenu:
		"absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl " +
		"overflow-hidden animate-in fade-in zoom-in duration-200",
	dropdownContent: "p-2 flex flex-col gap-1",
	optionLabel: "text-sm font-bold tracking-wide",
	checkIcon: "text-blue-600 text-lg",

	/* ---------- Impact / Exhaust Styles ---------- */
	typeGroup: "flex flex-col gap-6",
	typeTitle: "text-blue-800 font-bold text-sm uppercase tracking-widest border-b border-blue-100 pb-2",
	impactBox: "bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex flex-col gap-4 shadow-sm",
	impactTitle: "text-blue-800 font-bold text-[10px] uppercase tracking-wider opacity-80",
	impactContent: "flex flex-col gap-4",
	inputGroup: "flex flex-col gap-1.5",
	inputLabel: "text-xs font-semibold text-blue-950",

	/* ---------- Final Section & Calculations ---------- */
	finalSection: "mt-12 pt-8 border-t border-slate-200",
	finalGrid: "grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10",
	autoCalcNote: "text-slate-400 font-normal ml-1",

	/* ---------- Modal Styles ---------- */
	modalOverlay: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity",
	modalContent: "bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-sm transform transition-all",
	modalTitle: "text-slate-800 font-bold text-lg mb-2",
	modalBody: "text-slate-600 mb-6 text-sm",
	flexEnd: "flex justify-end",
	modalButton: "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition-colors text-sm",
	specialBoxSubtitle: "text-[10px] text-blue-600 font-medium tracking-tight",
	relativeFlex: "relative flex items-center",
	relativeBox: "relative",
	filterGridMain: "grid grid-cols-1 gap-12 mt-8 transition-all duration-300",
	filterGridLg2: "lg:grid-cols-2",
	subGridGap: "gap-6",
	subGridMd2: "md:grid-cols-2 gap-x-10 gap-y-6",
	filterLabelBase: "flex items-center gap-3",
	filterLabelDisabled: "cursor-not-allowed opacity-70",
	filterLabelEnabled: "cursor-pointer group",
	checkboxBase: "h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500",
	checkboxDisabled: "cursor-not-allowed bg-gray-100",
	checkboxEnabled: "cursor-pointer",
	filterTextBase: "text-sm font-medium",
	filterTextDisabled: "text-slate-500",
	filterTextEnabled: "text-slate-700 group-hover:text-blue-600 transition-colors",
	chevronBase: "text-slate-400 transition-transform duration-300",
	chevronOpen: "rotate-180 text-blue-500",
	optionBase: "flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all",
	optionSelected: "bg-blue-50 text-blue-700 ring-1 ring-blue-700/10",
	optionUnselected: "hover:bg-slate-50 text-slate-700",
	// toggle style 
	toggleWrapper: "flex items-center gap-3 cursor-pointer select-none",
	toggleTrack: "relative w-10 h-5 rounded-full transition-colors duration-200 ease-in-out",
	toggleTrackOff: "bg-slate-200",
	toggleTrackOn: "bg-blue-600",
	toggleThumb: "absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out shadow-sm",
	toggleThumbOn: "translate-x-5",
	toggleThumbOff: "translate-x-0",
	toggleLabel: "text-xs font-bold text-blue-800 uppercase tracking-wider",
};

export default standardDesign;