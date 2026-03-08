// projectInfoDesign.ts — Design tokens for the ProjectInfo page

const projectInfoDesign = {
	// Page layout
	wrapper:
		"min-h-screen bg-gray-100 flex flex-col items-center px-6 py-10 font-sans",

	// Header
	top: "text-center mb-8 w-full max-w-5xl",
	title: "text-2xl font-bold text-black-800 tracking-tight",
	headerText: "text-sm text-blue-800 mt-1",

	// Card — wide to match screenshot
	card: "bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-auto",
	cardTitle: "text-lg font-semibold text-blue-600 mb-3",
	divider: "border-gray-200 mb-6",

	// Form field groups
	fieldGroup: "flex flex-col gap-1 mb-5",
	rowGroup: "flex flex-row gap-6 mb-4 items-end",

	// Labels
	label: "text-sm font-semibold text-gray-800 mb-1",

	// Inputs — rounded bordered style matching screenshot
	input:
		"w-full border border-gray-200 rounded-xl bg-white py-3 px-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
	disabledInput:
		"w-full border border-gray-200 rounded-xl bg-gray-100 py-3 px-4 text-sm text-gray-500 cursor-not-allowed",

	// Location
	inputWrapper:
		"flex items-center border border-gray-200 rounded-xl bg-white gap-3 px-4 py-3",
	inputborder:
		"flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none",
	clearButton: "text-blue-500 text-base shrink-0",
	locationClear:
		"shrink-0 text-gray-400 hover:text-red-400 transition-colors p-1",
	locationClearIcon: "text-sm",
	locationResultText:
		"p-3 border border-blue-200 rounded-xl bg-blue-50 mt-2 cursor-pointer hover:bg-blue-100 transition-colors",
	locationText: "text-xs font-semibold text-blue-700",
	selectedLocation: "text-xs text-blue-600 break-words",
	coordinates: "font-semibold text-gray-500 text-[10px]",
	coordinatesText: "text-[10px] ml-3",

	// Dropdown
	dropdownIcon: "text-gray-400 text-xs",
	industryOpen:
		"absolute z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-xl max-h-64 overflow-y-auto",
	selectIndustry: "px-4 py-3 font-semibold border-b text-gray-700",
	industryOptions:
		"flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50",
	industryCheckbox: "h-5 w-5 shrink-0 rounded-md border-gray-300 text-blue-600",

	// Footer
	footer: "flex items-center justify-between w-full max-w-auto mt-8 align-middle",
	backLink:
		"inline-flex items-center gap-3 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 shadow-lg",
	nextLink:
		"inline-flex items-center gap-3 bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-900 shadow-lg",
	disabled: "opacity-50 cursor-not-allowed pointer-events-none",
};

export default projectInfoDesign;
