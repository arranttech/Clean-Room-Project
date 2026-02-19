// customerInfoDesign.ts — Design tokens for the CustomerInfo page

const customerInfoDesign = {
	// Page layout
	wrapper: "min-h-screen bg-gray-100 flex flex-col items-center px-8 py-10 font-sans",

	// Header
	top: "mb-8 text-center w-full max-w-3xl",
	headerRow: "flex items-center justify-center gap-3 mb-1",
	headerIcon:
		"w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 text-xl shrink-0",
	title: "text-2xl font-bold text-black-900 tracking-tight",
	headerText: "text-sm text-blue-800",

	// Card
	card: "bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-3xl",
	cardTitle: "text-lg font-semibold text-blue-600 mb-3",
	divider: "border-gray-200 mb-6",

	// Form field groups
	fieldGroup: "flex flex-col gap-1 mb-5",

	// Labels
	label: "text-sm font-semibold text-gray-800 mb-1",

	// Inputs — rounded bordered style matching screenshot
	input:
		"w-full border border-gray-200 rounded-xl bg-white py-3 px-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",

	// Textarea for address and notes (matching screenshot)
	textarea:
		"w-full border border-gray-200 rounded-xl bg-white py-3 px-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none",

	disabledInput:
		"w-full border border-gray-200 rounded-xl bg-gray-100 py-3 px-4 text-sm text-gray-500 cursor-not-allowed",

	// Footer
	footer: "flex items-center justify-between w-full max-w-3xl mt-6",
	cancelLink:
		"px-8 py-4 border border-gray-300 rounded-2xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm",
	nextLink:
		"flex items-center gap-3 bg-blue-600 text-white text-sm font-semibold px-8 py-4 rounded-2xl hover:bg-blue-700 transition-colors shadow-md",
	disabled: "opacity-50 cursor-not-allowed pointer-events-none",

	// Success Popup
	popupOverlay: "fixed inset-0 flex items-center justify-center z-50",
	popupBackdrop: "absolute inset-0 bg-black/30 backdrop-blur-sm",
	popupCard: "relative bg-white rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center gap-4 max-w-sm w-full mx-4",
	popupIcon: "text-green-500 text-5xl",
	popupTitle: "text-xl font-bold text-gray-900",
	popupMessage: "text-sm text-gray-500 text-center",
	popupProgressWrap: "w-full bg-gray-100 rounded-full h-1 mt-2 overflow-hidden",
	popupProgressBar: "bg-green-500 h-1 rounded-full animate-[shrink_2s_linear_forwards]",
};

export default customerInfoDesign;