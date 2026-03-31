import theme from "../../styles/theme";

const standardDesign = {
	page: `${theme.pageWrapperWhite} px-3 sm:px-4 py-4 sm:py-6`,
  
	top: `mx-auto ${theme.contentMaxWidth5xl} text-center mb-4`,
	title: theme.h1,
	subtitle: `mt-2 text-sm sm:text-base text-${theme.primaryText}`,
  
	cardWrap: `mx-auto mt-6 sm:mt-10 w-full`,
	card: `${theme.card} overflow-hidden`,
  
	cardHeader: `px-4 sm:px-8 pt-6 sm:pt-8 pb-4`,
	cardHeaderTitle:
	  `text-xs sm:text-sm ${theme.weightBold} ${theme.trackingWidest} text-${theme.primaryText} uppercase`,
	divider: theme.divider,
  
	body: `px-4 sm:px-8 py-6 sm:py-8`,
  
	sectionTitle:
	  `text-xs sm:text-sm ${theme.weightBold} ${theme.trackingWidest} text-${theme.primaryText} uppercase`,
	subSectionTitle:
	  `text-xs ${theme.weightBold} ${theme.trackingWide} text-${theme.primaryText} uppercase`,
	sectionSpacer: `mt-6 sm:mt-10`,
	sectionLine: `mt-6 border-t border-${theme.borderColor}`,
  
	grid3: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6`,
	grid2: `grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6`,
	grid4: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6`,
  
	field: theme.formGroup,
	label: theme.labelBold,
	required: `text-${theme.error}`,
  
	select: theme.select,
	selectDisabled: theme.selectDisabled,
  
	input: theme.input,
	inputDisabled: theme.inputDisabled,
	helperText: `text-xs text-${theme.textMuted}`,
  
	range: `mt-1 text-xs text-${theme.textSecondary}`,
	rangeValue: `font-semibold text-${theme.primaryText}`,
	quickView: `mt-6 sm:mt-8 text-xs sm:text-sm text-${theme.textSecondary} px-2`,
	footer:
	  `flex items-center justify-between w-full mt-6 sm:mt-8`,
	backLink: theme.btnSecondary,
	nextLink: theme.btnPrimary,
  
	unitRow: `flex flex-wrap items-center gap-3 sm:gap-4`,
	unitLabel: theme.labelBold,
	unitGroup: `flex items-center gap-2 sm:gap-3`,
	unitOption:
	  `inline-flex items-center gap-2 ${theme.roundMd} border border-${theme.borderColor} bg-slate-100 px-2.5 sm:px-3 py-1.5 sm:py-2 ` +
	  `text-xs sm:text-sm text-${theme.textSecondary} hover:bg-slate-200 ${theme.transition}`,
	unitRadio: `h-4 w-4 accent-${theme.primary}`,
	unitHint: `text-xs text-${theme.textMuted}`,
	tempHelper: `mt-2 sm:mt-3 text-xs text-${theme.textMuted}`,
	disabled: theme.btnDisabled,
  
	flowBlock: `mt-6 sm:mt-8`,
	flowLabelRow: `flex items-center justify-between`,
	flowTitle: theme.labelBold,
	flowUnit: `text-xs ${theme.weightSemibold} text-${theme.textMuted}`,
	flowRow:
	  `mt-3 flex flex-wrap items-center gap-3 sm:gap-4 border-b border-${theme.borderColor} pb-4`,
	flowMin: `text-xs text-${theme.textMuted} w-10 sm:w-12`,
	flowMax: `text-xs text-${theme.textMuted} w-10 sm:w-12 text-right`,
	flowSlider: `flex-1 min-w-[160px] sm:min-w-[240px] accent-${theme.primary}`,
	flowValueBoxWrap: `flex items-center`,
	flowValueBox:
	  `w-16 sm:w-20 ${theme.roundMd} border border-${theme.borderColor} bg-white px-2 sm:px-3 py-1.5 sm:py-2 text-sm ` +
	  `focus:border-${theme.primary} focus:ring-2 focus:ring-${theme.primaryLight} focus:outline-none`,
	flowUnitSmall: `text-xs text-${theme.textSecondary}`,
	flowHint: `mt-2 text-xs text-${theme.textMuted}`,
  
	dualFlowBlock: `mt-6 sm:mt-8`,
	dualFlowGrid: `grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6`,
	dualFlowCard: `${theme.roundMd} border border-${theme.borderColor} bg-slate-50 p-3 sm:p-4`,
	dualFlowTitle: `text-xs sm:text-sm ${theme.weightSemibold} text-${theme.textSecondary} mb-3`,
	dualFlowRow: `flex items-center gap-2 sm:gap-3`,
	dualFlowMin: `text-xs text-${theme.textMuted} w-8 sm:w-10`,
	dualFlowMax: `text-xs text-${theme.textMuted} w-8 sm:w-10 text-right`,
	dualFlowSlider: `flex-1 accent-${theme.primary} min-w-[100px] sm:min-w-[140px]`,
	dualFlowValueBox:
	  `w-14 sm:w-16 ${theme.roundSm} border border-${theme.borderColor} bg-white px-2 py-1 text-sm ` +
	  `focus:border-${theme.primary} focus:ring-2 focus:ring-${theme.primaryLight} focus:outline-none`,
	dualFlowUnit: `text-xs text-${theme.textSecondary}`,
  
	cardStack: `flex flex-col gap-6 sm:gap-8`,
	specialBox:
	  `bg-slate-50 border border-${theme.borderColor} ${theme.roundMd} p-4 sm:p-6 mb-6 sm:mb-10`,
	specialBoxRow: `flex items-center justify-between flex-wrap gap-3`,
	specialBoxTitle: `text-${theme.textSecondary} ${theme.weightBold} mb-1 text-sm sm:text-base`,
	specialBoxValue: `text-${theme.textDisabled} text-xs`,
	specialBoxInputGroup: `flex items-center gap-2 sm:gap-3`,
	specialBoxInput:
	  `w-20 sm:w-24 text-center py-1.5 sm:py-2 border border-${theme.borderColor} ${theme.roundSm} text-${theme.textSecondary} ${theme.weightSemibold} text-sm ` +
	  `focus:border-${theme.primary} focus:ring-1 focus:ring-${theme.primary} outline-none`,
	specialBoxUnit: `text-${theme.textMuted} text-xs sm:text-sm`,
	subSectionHeader:
	  `mt-8 sm:mt-12 text-xs ${theme.weightBold} ${theme.trackingWide} text-${theme.primaryText} uppercase`,
	grid2Space: `grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6`,
  
	filterCard: `${theme.roundMd} border border-${theme.borderColor} bg-white p-3 sm:p-4 ${theme.shadowSm}`,
	filterStatRow: `flex items-center gap-1.5 text-xs text-${theme.textSecondary} mb-1`,
	filterStatLabel: `${theme.weightBold} text-${theme.textPrimary}`,
	filterStatValue: `text-${theme.textSecondary}`,
	filterDpGrid: `grid grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4`,
	filterDpLabel: `text-xs ${theme.weightBold} text-${theme.textPrimary} mb-1`,
	filterDpRange: `text-[10px] text-${theme.textMuted} mt-1`,
  
	filterHeader: `flex justify-between items-start mb-3 sm:mb-4`,
	filterTitle: `text-xs sm:text-sm ${theme.weightBold} text-${theme.textPrimary}`,
	filterStats: `space-y-1 mb-3 sm:mb-4`,
	colEnd: `flex flex-col items-end`,
	errorText: `text-${theme.error} text-xs mt-2 text-right w-full block`,
	transitionOpacity: `transition-opacity duration-300`,
	flex1: `flex-1`,
	requiredText: `text-${theme.error}`,
  
	dropdownWrapper: `relative w-full sm:w-72`,
	selectedTags: `flex flex-wrap gap-1.5 flex-1 mr-2`,
	tag: `bg-${theme.primary} text-white text-[10px] ${theme.weightBold} px-2 sm:px-2.5 py-1 ${theme.roundSm} flex items-center gap-1.5 ${theme.shadowSm}`,
	tagRemove: `cursor-pointer hover:text-blue-200 ${theme.transitionColors}`,
	placeholder: `text-${theme.textDisabled} text-sm`,
	dropdownMenu:
	  `absolute z-50 mt-2 w-full bg-white border border-${theme.borderColor} ${theme.roundLg} ${theme.shadow2xl} ` +
	  `overflow-hidden animate-in fade-in zoom-in duration-200`,
	dropdownContent: `p-2 flex flex-col gap-1`,
	optionLabel: `text-xs sm:text-sm ${theme.weightBold} ${theme.trackingWide}`,
	checkIcon: `text-${theme.primary} text-base sm:text-lg`,
  
	impactTitle:
	  `text-${theme.primaryText} ${theme.weightBold} text-[10px] uppercase ${theme.trackingWidest} opacity-80`,
	impactContent: `flex flex-col gap-3 sm:gap-4`,
	inputGroup: `flex flex-col gap-1.5`,
	inputLabel: `text-xs ${theme.weightSemibold} text-blue-950`,
  
	finalSection: `mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-${theme.borderColor}`,
	finalGrid: `grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-12 gap-y-6 sm:gap-y-10`,
	autoCalcNote: `text-${theme.textDisabled} font-normal ml-1`,
  
	modalOverlay: theme.modalOverlay,
	modalContent:
	  `bg-white ${theme.roundSm} ${theme.shadow2xl} p-5 sm:p-6 w-full max-w-sm transform transition-all`,
	modalTitle: `text-${theme.textPrimary} ${theme.weightBold} text-base sm:text-lg mb-2`,
	modalBody: `text-${theme.textSecondary} mb-5 sm:mb-6 text-xs sm:text-sm`,
	flexEnd: `flex justify-end`,
	modalButton:
	  `bg-${theme.primary} hover:bg-${theme.primaryHover} text-white ${theme.weightMedium} py-2 px-5 sm:px-6 ${theme.roundSm} ${theme.transitionColors} text-xs sm:text-sm`,
	specialBoxSubtitle:
	  `text-[10px] text-${theme.primaryTextLight} ${theme.weightMedium} tracking-tight`,
	relativeFlex: `relative flex items-center`,
	relativeBox: `relative`,
	filterGridMain: `grid grid-cols-1 gap-8 sm:gap-12 mt-6 sm:mt-8 ${theme.transition} duration-300`,
	filterGridLg2: `lg:grid-cols-2`,
	subGridGap: `gap-4 sm:gap-6`,
	subGridMd2: `sm:grid-cols-2 gap-x-6 sm:gap-x-10 gap-y-4 sm:gap-y-6`,
	filterLabelBase: `flex items-center gap-2 sm:gap-3`,
	filterLabelDisabled: `cursor-not-allowed opacity-70`,
	filterLabelEnabled: `cursor-pointer group`,
	checkboxBase:
	  `h-4 w-4 sm:h-5 sm:w-5 ${theme.roundSm} border-${theme.borderColor} text-${theme.primary} focus:ring-${theme.primary}`,
	checkboxDisabled: `cursor-not-allowed bg-gray-100`,
	checkboxEnabled: `cursor-pointer`,
	filterTextBase: `text-xs sm:text-sm ${theme.weightMedium}`,
	filterTextDisabled: `text-${theme.textDisabled}`,
	filterTextEnabled:
	  `text-${theme.textSecondary} group-hover:text-${theme.primary} ${theme.transitionColors}`,
	chevronBase: `text-${theme.textDisabled} ${theme.transition} duration-300`,
	chevronOpen: `rotate-180 text-${theme.primaryTextLight}`,
	optionBase:
	  `flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 ${theme.roundMd} cursor-pointer ${theme.transition}`,
	optionSelected: `bg-blue-50 text-${theme.primaryText} ring-1 ring-blue-700/10`,
	optionUnselected: `hover:bg-slate-50 text-${theme.textSecondary}`,
  
	toggleWrapper: `flex items-center gap-3 cursor-pointer select-none`,
	toggleTrack:
	  `relative w-10 h-5 ${theme.roundFull} ${theme.transition} duration-200 ease-in-out`,
	toggleTrackOff: `bg-slate-200`,
	toggleTrackOn: `bg-${theme.primary}`,
	toggleThumb:
	  `absolute top-1 left-1 w-3 h-3 bg-white ${theme.roundFull} ${theme.transition} duration-200 ease-in-out ${theme.shadowSm}`,
	toggleThumbOn: `translate-x-5`,
	toggleThumbOff: `translate-x-0`,
	toggleLabel:
	  `text-xs ${theme.weightBold} text-${theme.primaryText} uppercase ${theme.trackingWidest}`,
};

export default standardDesign;