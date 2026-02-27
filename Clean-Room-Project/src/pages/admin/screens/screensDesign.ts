const ScreensDesign = {
	// ---  Header Styling ---
	panelHeader: "flex justify-between items-center mb-6",
	panelTitle: "text-2xl font-bold text-slate-800",
	addBtn:
		"flex items-center gap-2 bg-[#092B74] hover:bg-[#072460] text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer",

	// --- Search ---
	searchWrap: "relative mb-6",
	searchIcon: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg",
	searchInput:
		"w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#092B74]/20 focus:border-[#092B74] transition-all text-sm",

	// --- Table ---
	tableWrap:
		"bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden",
	table: "w-full text-left border-collapse",
	thead: "border-b border-slate-100 bg-slate-900",
	th: "px-5 py-3.5 text-left text-xs font-bold text-white uppercase tracking-wider",
	thActions:
		"px-5 py-3.5 text-left text-xs font-bold text-white uppercase tracking-wider",
	tbody: "divide-y divide-slate-100",
	tr: "hover:bg-slate-50/50 transition-colors",
	tdScreenId: "px-6 py-4 text-sm font-medium text-slate-900",
	tdScreenName: "px-6 py-4 text-sm text-slate-600",
	td: "px-6 py-4 text-sm text-slate-600",
	tdActions:
		"px-5 py-3.5 text-left text-xs font-bold text-white uppercase tracking-wider",
	emptyRow: "px-6 py-12 text-center text-slate-500",

	// --- Action Buttons ---
	editBtn:
		"inline-flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer",
	deleteBtn:
		"inline-flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer",

	// --- Form Container ---
	formTitle: "text-2xl font-bold text-slate-800 mb-6",
	formCard:
		"bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden",
	formRow: "p-6",
	formGroup: "grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl",
	formLabel: "flex flex-col gap-2 text-sm font-semibold text-slate-700",
	formRequired: "text-red-500",
	formInput:
		"px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors cursor-pointer",
	formError: "text-red-500 text-xs mt-1",

	// --- Form Footer ---
	formDivider: "border-t border-slate-100 bg-slate-50 p-6",
	formFooter: "flex justify-end gap-3",
	formCancelBtn:
		"px-6 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors cursor-pointer flex items-center gap-2",
	formSubmitBtn:
		"px-6 py-2.5 bg-[#092B74] hover:bg-[#072460] text-white rounded-lg font-medium transition-colors shadow-sm cursor-pointer flex items-center gap-2",

	// --- Popup ---
	popupOverlay: "fixed inset-0 z-50 flex items-center justify-center p-4",
	popupBackdrop: "absolute inset-0 bg-slate-900/40 backdrop-blur-sm",
	popupCard:
		"relative bg-white rounded-xl shadow-xl w-[400px] p-8 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200",
	popupIcon: "text-5xl text-green-500 mb-4",
	popupTitle: "text-xl font-bold text-slate-900 mb-2",
	popupMessage: "text-slate-500 mb-6",
	popupProgressWrap: "w-full h-1 bg-slate-100 rounded-full overflow-hidden",
	popupProgressBar:
		"h-full bg-green-500 w-full origin-left animate-[progress_2s_ease-in-out]",
};

export default ScreensDesign;
