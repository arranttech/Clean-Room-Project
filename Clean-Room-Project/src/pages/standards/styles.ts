const standardDesign = {
	page: "min-h-screen bg-white px-3 sm:px-4 py-4 sm:py-6",
  
	top: "mx-auto max-w-5xl text-center mb-4",
	title: "text-xl sm:text-2xl font-bold text-gray-950 tracking-tight",
	subtitle: "mt-2 text-sm sm:text-base text-blue-600",
  
	cardWrap: "mx-auto mt-6 sm:mt-10 max-w-auto",
	card: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden",
  
	cardHeader: "px-4 sm:px-8 pt-6 sm:pt-8 pb-4",
	cardHeaderTitle:
	  "text-xs sm:text-sm font-bold tracking-widest text-blue-800 uppercase",
	divider: "border-t border-slate-200",
  
	body: "px-4 sm:px-8 py-6 sm:py-8",
  
	sectionTitle:
	  "text-xs sm:text-sm font-bold tracking-widest text-blue-800 uppercase",
	subSectionTitle:
	  "text-xs font-bold tracking-wider text-blue-800 uppercase",
	sectionSpacer: "mt-6 sm:mt-10",
	sectionLine: "mt-6 border-t border-slate-200",
  
	grid3: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6",
	grid2: "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6",
	grid4: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6",
  
	field: "flex flex-col gap-2",
	label: "text-xs sm:text-sm font-semibold text-slate-700",
	required: "text-red-500",
  
	select:
	  "w-full rounded-xl border border-slate-300 bg-white px-3 sm:px-4 py-2.5 sm:py-3 text-sm " +
	  "focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none",
	selectDisabled:
	  "w-full rounded-xl border border-slate-200 bg-slate-100 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-slate-500",
  
	input:
	  "w-full rounded-xl border border-slate-300 bg-white px-3 sm:px-4 py-2.5 sm:py-3 text-sm " +
	  "focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none",
	inputDisabled:
	  "w-full rounded-xl border border-slate-200 bg-slate-100 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-slate-600",
	helperText: "text-xs text-slate-500",
  
	range: "mt-1 text-xs text-slate-600",
	rangeValue: "font-semibold text-blue-600",
	quickView: "mt-6 sm:mt-8 text-xs sm:text-sm text-slate-700 px-2",
	footer:
	  "flex items-center justify-between w-full max-w-auto mt-6 sm:mt-8",
	backLink:
	  "inline-flex items-center gap-2 sm:gap-3 border border-gray-300 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl hover:bg-gray-50 shadow-sm text-gray-600 text-xs sm:text-sm font-medium transition-all",
	nextLink:
	  "inline-flex items-center gap-2 sm:gap-3 bg-blue-700 text-white px-5 sm:px-7 py-2 sm:py-2.5 rounded-xl hover:bg-blue-800 shadow-md text-xs sm:text-sm font-semibold transition-all",
  
	unitRow: "flex flex-wrap items-center gap-3 sm:gap-4",
	unitLabel: "text-xs sm:text-sm font-semibold text-slate-700",
	unitGroup: "flex items-center gap-2 sm:gap-3",
	unitOption:
	  "inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-2.5 sm:px-3 py-1.5 sm:py-2 " +
	  "text-xs sm:text-sm text-slate-700 hover:bg-slate-200 transition",
	unitRadio: "h-4 w-4 accent-blue-600",
	unitHint: "text-xs text-slate-500",
	tempHelper: "mt-2 sm:mt-3 text-xs text-slate-500",
	disabled: "opacity-40 cursor-not-allowed",
  
	flowBlock: "mt-6 sm:mt-8",
	flowLabelRow: "flex items-center justify-between",
	flowTitle: "text-xs sm:text-sm font-semibold text-slate-700",
	flowUnit: "text-xs font-semibold text-slate-500",
	flowRow:
	  "mt-3 flex flex-wrap items-center gap-3 sm:gap-4 border-b border-slate-200 pb-4",
	flowMin: "text-xs text-slate-500 w-10 sm:w-12",
	flowMax: "text-xs text-slate-500 w-10 sm:w-12 text-right",
	flowSlider: "flex-1 min-w-[160px] sm:min-w-[240px] accent-blue-600",
	flowValueBoxWrap: "flex items-center",
	flowValueBox:
	  "w-16 sm:w-20 rounded-xl border border-slate-300 bg-white px-2 sm:px-3 py-1.5 sm:py-2 text-sm " +
	  "focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none",
	flowUnitSmall: "text-xs text-slate-600",
	flowHint: "mt-2 text-xs text-slate-500",
  
	dualFlowBlock: "mt-6 sm:mt-8",
	dualFlowGrid: "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6",
	dualFlowCard: "rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4",
	dualFlowTitle: "text-xs sm:text-sm font-semibold text-slate-700 mb-3",
	dualFlowRow: "flex items-center gap-2 sm:gap-3",
	dualFlowMin: "text-xs text-slate-500 w-8 sm:w-10",
	dualFlowMax: "text-xs text-slate-500 w-8 sm:w-10 text-right",
	dualFlowSlider: "flex-1 accent-blue-600 min-w-[100px] sm:min-w-[140px]",
	dualFlowValueBox:
	  "w-14 sm:w-16 rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm " +
	  "focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none",
	dualFlowUnit: "text-xs text-slate-600",
  
	cardStack: "flex flex-col gap-6 sm:gap-8",
	specialBox:
	  "bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-6 mb-6 sm:mb-10",
	specialBoxRow: "flex items-center justify-between flex-wrap gap-3",
	specialBoxTitle: "text-slate-700 font-bold mb-1 text-sm sm:text-base",
	specialBoxValue: "text-slate-400 text-xs",
	specialBoxInputGroup: "flex items-center gap-2 sm:gap-3",
	specialBoxInput:
	  "w-20 sm:w-24 text-center py-1.5 sm:py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold text-sm " +
	  "focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none",
	specialBoxUnit: "text-slate-500 text-xs sm:text-sm",
	subSectionHeader:
	  "mt-8 sm:mt-12 text-xs font-bold tracking-wider text-blue-800 uppercase",
	grid2Space: "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6",
  
	filterCard: "rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm",
	filterStatRow: "flex items-center gap-1.5 text-xs text-slate-600 mb-1",
	filterStatLabel: "font-bold text-slate-700",
	filterStatValue: "text-slate-600",
	filterDpGrid: "grid grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4",
	filterDpLabel: "text-xs font-bold text-slate-700 mb-1",
	filterDpRange: "text-[10px] text-slate-500 mt-1",
  
	filterHeader: "flex justify-between items-start mb-3 sm:mb-4",
	filterTitle: "text-xs sm:text-sm font-bold text-slate-800",
	filterStats: "space-y-1 mb-3 sm:mb-4",
	colEnd: "flex flex-col items-end",
	errorText: "text-red-500 text-xs mt-2 text-right w-full block",
	transitionOpacity: "transition-opacity duration-300",
	flex1: "flex-1",
	requiredText: "text-red-600",
  
	dropdownWrapper: "relative w-full sm:w-72",
	selectedTags: "flex flex-wrap gap-1.5 flex-1 mr-2",
	tag: "bg-blue-600 text-white text-[10px] font-bold px-2 sm:px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm",
	tagRemove: "cursor-pointer hover:text-blue-200 transition-colors",
	placeholder: "text-slate-400 text-sm",
	dropdownMenu:
	  "absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl " +
	  "overflow-hidden animate-in fade-in zoom-in duration-200",
	dropdownContent: "p-2 flex flex-col gap-1",
	optionLabel: "text-xs sm:text-sm font-bold tracking-wide",
	checkIcon: "text-blue-600 text-base sm:text-lg",
  
	typeGroup: "flex flex-col gap-4 sm:gap-6",
	typeTitle:
	  "text-blue-800 font-bold text-xs sm:text-sm uppercase tracking-widest border-b border-blue-100 pb-2",
	impactBox:
	  "bg-blue-50/50 border border-blue-100 rounded-xl p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 shadow-sm",
	impactTitle:
	  "text-blue-800 font-bold text-[10px] uppercase tracking-wider opacity-80",
	impactContent: "flex flex-col gap-3 sm:gap-4",
	inputGroup: "flex flex-col gap-1.5",
	inputLabel: "text-xs font-semibold text-blue-950",
  
	finalSection: "mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-200",
	finalGrid: "grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-12 gap-y-6 sm:gap-y-10",
	autoCalcNote: "text-slate-400 font-normal ml-1",
  
	modalOverlay:
	  "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity px-4",
	modalContent:
	  "bg-white rounded-lg shadow-xl p-5 sm:p-6 w-full max-w-sm transform transition-all",
	modalTitle: "text-slate-800 font-bold text-base sm:text-lg mb-2",
	modalBody: "text-slate-600 mb-5 sm:mb-6 text-xs sm:text-sm",
	flexEnd: "flex justify-end",
	modalButton:
	  "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 sm:px-6 rounded transition-colors text-xs sm:text-sm",
	specialBoxSubtitle:
	  "text-[10px] text-blue-600 font-medium tracking-tight",
	relativeFlex: "relative flex items-center",
	relativeBox: "relative",
	filterGridMain: "grid grid-cols-1 gap-8 sm:gap-12 mt-6 sm:mt-8 transition-all duration-300",
	filterGridLg2: "lg:grid-cols-2",
	subGridGap: "gap-4 sm:gap-6",
	subGridMd2: "sm:grid-cols-2 gap-x-6 sm:gap-x-10 gap-y-4 sm:gap-y-6",
	filterLabelBase: "flex items-center gap-2 sm:gap-3",
	filterLabelDisabled: "cursor-not-allowed opacity-70",
	filterLabelEnabled: "cursor-pointer group",
	checkboxBase:
	  "h-4 w-4 sm:h-5 sm:w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500",
	checkboxDisabled: "cursor-not-allowed bg-gray-100",
	checkboxEnabled: "cursor-pointer",
	filterTextBase: "text-xs sm:text-sm font-medium",
	filterTextDisabled: "text-slate-500",
	filterTextEnabled:
	  "text-slate-700 group-hover:text-blue-600 transition-colors",
	chevronBase: "text-slate-400 transition-transform duration-300",
	chevronOpen: "rotate-180 text-blue-500",
	optionBase:
	  "flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl cursor-pointer transition-all",
	optionSelected: "bg-blue-50 text-blue-700 ring-1 ring-blue-700/10",
	optionUnselected: "hover:bg-slate-50 text-slate-700",
  
	toggleWrapper: "flex items-center gap-3 cursor-pointer select-none",
	toggleTrack:
	  "relative w-10 h-5 rounded-full transition-colors duration-200 ease-in-out",
	toggleTrackOff: "bg-slate-200",
	toggleTrackOn: "bg-blue-600",
	toggleThumb:
	  "absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out shadow-sm",
	toggleThumbOn: "translate-x-5",
	toggleThumbOff: "translate-x-0",
	toggleLabel:
	  "text-xs font-bold text-blue-800 uppercase tracking-wider",
  };
  
  export default standardDesign;