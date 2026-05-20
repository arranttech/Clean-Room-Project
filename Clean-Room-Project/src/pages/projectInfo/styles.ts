import theme from "../../styles/theme";

const projectInfoDesign = {
	wrapper:
	  `${theme.pageWrapperWhite} flex flex-col items-center px-3 sm:px-6 py-4 sm:py-6`,
  
	top: `text-center mb-4 w-full ${theme.contentMaxWidth5xl}`,
	title: theme.h1,
	headerText: theme.pageSubtitle,
  
	card: `${theme.card} p-4 sm:p-8 w-full`,
	cardTitle: `${theme.h2} mb-3`,
	divider: `${theme.divider} mb-4 sm:mb-6`,
  
	fieldGroup: theme.formGroup,
	rowGroup: `${theme.formRow} sm:items-end`,
  
	label: theme.labelBold,
  
	input: theme.input,
	disabledInput: theme.inputDisabled,
  
	inputWrapper:
	  `flex items-center border border-${theme.borderColor} ${theme.roundMd} bg-white gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3`,
	inputborder:
	  `flex-1 bg-transparent text-sm text-${theme.textSecondary} placeholder-${theme.textDisabled} focus:outline-none`,
	clearButton: `text-${theme.primaryTextLight} text-base shrink-0`,
	locationClear:
	  `shrink-0 text-${theme.textDisabled} hover:text-${theme.error} ${theme.transitionColors} p-1`,
	locationClearIcon: `text-sm`,
	locationResultText:
	  `p-3 border border-${theme.primaryBorder} ${theme.roundMd} bg-${theme.primaryLight}/60 mt-2 cursor-pointer hover:bg-${theme.primaryLight}/70 ${theme.transitionColors}`,
	locationText: `text-xs ${theme.weightSemibold} text-${theme.primaryText}`,
	selectedLocation: `text-xs text-${theme.primaryTextLight} break-words`,
	coordinates: `${theme.weightSemibold} text-${theme.textDisabled} text-[10px]`,
	coordinatesText: `text-[10px] ml-3`,
  
	dropdownIcon: `text-${theme.textDisabled} text-xs`,
	industryOpen:
	  `absolute z-50 mt-2 w-full ${theme.roundMd} border border-${theme.borderColor} bg-white ${theme.shadow2xl} max-h-56 sm:max-h-64 overflow-y-auto`,
	selectIndustry:
	  `px-4 py-3 ${theme.weightSemibold} border-b border-${theme.borderColor}/50 text-${theme.textSecondary} text-sm`,
	industryOptions:
	  `flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 ${theme.transitionColors} text-sm`,
	industryCheckbox:
	  `h-5 w-5 shrink-0 ${theme.roundSm} border-${theme.borderColor} text-${theme.primary}`,
  
	footer:
	  `flex items-center justify-between w-full mt-6 sm:mt-8`,
	backLink: theme.btnSecondary,
	nextLink: theme.btnPrimary,
	disabled: theme.btnDisabled,
  };
  
  export default projectInfoDesign;