const ScreensDesign = {
	panelHeader: "flex justify-between items-center mb-4 sm:mb-6 flex-wrap gap-3",
	panelTitle: "text-xl sm:text-2xl font-bold text-slate-800",
	addBtn:
	  "flex items-center gap-2 bg-[#092B74] hover:bg-[#072460] text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer text-xs sm:text-sm",
  
	searchWrap: "relative mb-4 sm:mb-6",
	searchIcon: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg",
	searchInput:
	  "w-full pl-12 pr-4 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#092B74]/20 focus:border-[#092B74] transition-all text-sm",
  
	tableWrap: "bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto",
	table: "w-full min-w-[500px] text-left border-collapse",
	thead: "border-b border-slate-100 bg-slate-900",
	th: "px-3 sm:px-5 py-3 sm:py-3.5 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap",
	thActions: "px-3 sm:px-5 py-3 sm:py-3.5 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap",
	tbody: "divide-y divide-slate-100",
	tr: "hover:bg-slate-50/50 transition-colors",
	tdScreenId: "px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-slate-900",
	tdScreenName: "px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-600",
	td: "px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-600",
	tdActions: "px-3 sm:px-5 py-3 sm:py-3.5 text-left text-xs font-bold text-white uppercase tracking-wider",
	emptyRow: "px-6 py-8 sm:py-12 text-center text-slate-500 text-sm",
  
	statusActive: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700",
	statusInactive: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600",
  
	editBtn: "inline-flex items-center justify-center p-2 text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer",
	deleteBtn: "inline-flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer",
  
	formTitle: "text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6",
	formCard: "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden",
	formRow: "p-4 sm:p-6",
	formGroup: "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl",
	formLabel: "flex flex-col gap-2 text-xs sm:text-sm font-semibold text-slate-700",
	formRequired: "text-red-500",
	formInput:
	  "px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors cursor-pointer text-sm",
	formError: "text-red-500 text-xs mt-1",
  
	formDivider: "border-t border-slate-100 bg-slate-50 p-4 sm:p-6",
	formFooter: "flex justify-end gap-3 flex-wrap",
	formCancelBtn:
	  "px-4 sm:px-6 py-2 sm:py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors cursor-pointer flex items-center gap-2 text-xs sm:text-sm",
	formSubmitBtn:
	  "px-4 sm:px-6 py-2 sm:py-2.5 bg-[#092B74] hover:bg-[#072460] text-white rounded-lg font-medium transition-colors shadow-sm cursor-pointer flex items-center gap-2 text-xs sm:text-sm",
  
	popupOverlay: "fixed inset-0 z-50 flex items-center justify-center p-4",
	popupBackdrop: "absolute inset-0 bg-slate-900/40 backdrop-blur-sm",
	popupCard: "relative z-10 bg-white rounded-2xl shadow-2xl px-6 sm:px-10 py-6 sm:py-8 flex flex-col items-center gap-3 w-full max-w-sm",
	popupIcon: "text-green-500 text-5xl",
	popupTitle: "text-lg sm:text-xl font-bold text-slate-900",
	popupMessage: "text-sm text-slate-500 text-center",
	popupProgressWrap: "w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2",
	popupProgressBar: "h-full bg-green-500 rounded-full animate-[progress_2s_linear_forwards]",
  
	paginationWrap: "flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 px-2 gap-3 sm:gap-0",
	paginationInfo: "text-xs sm:text-sm text-slate-500 font-medium",
	paginationControls: "flex items-center gap-1 sm:gap-2 flex-wrap",
	paginationBtn: (active: boolean, disabled: boolean) => {
	  const base = "w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl text-xs sm:text-sm font-semibold transition-all border";
	  if (disabled) return `${base} bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed`;
	  if (active) return `${base} bg-[#092B74] text-white border-[#092B74] shadow-sm`;
	  return `${base} bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:bg-slate-50`;
	},
	paginationNavBtn: (disabled: boolean) => {
	  const base = "px-3 sm:px-4 h-8 sm:h-9 flex items-center justify-center gap-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border";
	  if (disabled) return `${base} bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed`;
	  return `${base} bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:bg-slate-50`;
	}
  };
  
  export default ScreensDesign;