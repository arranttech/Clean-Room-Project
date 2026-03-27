const profileDesign = {
	panelHeader: "flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-3",
	panelTitleWrap: "flex flex-col gap-1",
	panelTitle: "text-xl sm:text-2xl font-bold text-slate-900 ml-2 sm:ml-4",
	panelSubtitle: "text-xs sm:text-sm text-slate-500 ml-2 sm:ml-4",
	addBtn:
	  "flex items-center gap-2 bg-blue-800 text-white text-xs sm:text-sm font-semibold px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm",
  
	searchWrap: "relative mb-4 sm:mb-5",
	searchIcon:
	  "absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base",
	searchInput:
	  "w-full border border-slate-200 rounded-xl bg-white pl-10 pr-4 py-2 sm:py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm",
  
	tableWrap: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto",
	table: "w-full min-w-[550px]",
	thead: "bg-slate-900",
	th: "px-3 sm:px-5 py-3 sm:py-3.5 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap",
	thActions: "px-3 sm:px-5 py-3 sm:py-3.5 text-right text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap",
	tbody: "divide-y divide-slate-50",
	tr: "hover:bg-blue-50/50 transition-colors",
	tdScreenId: "px-3 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-slate-900",
	tdScreenName: "px-3 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm text-slate-600",
	tdProfileName: "px-3 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-slate-900",
	td: "px-3 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm text-slate-600",
	tdActions: "px-3 sm:px-5 py-3 sm:py-4 text-right",
	emptyRow: "px-5 py-10 sm:py-16 text-center text-sm text-slate-400",
  
	statusActive: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700",
	statusInactive: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600",
  
	editBtn: "text-blue-800 hover:text-blue-700 transition-colors p-1.5 rounded-lg hover:bg-blue-50",
	deleteBtn: "text-red-500 hover:text-red-700 transition-colors p-1.5 rounded-lg hover:bg-red-50",
  
	formTitle: "text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6",
	formCard: "bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-8",
	formSectionTitle: "text-base sm:text-lg font-bold text-blue-600 mb-4 sm:mb-6",
	formGroup: "mb-4 sm:mb-6",
	formRow: "mb-4 sm:mb-6",
	formLabel: "block text-sm font-semibold text-slate-700 mb-1.5",
	formRequired: "text-red-500 ml-0.5",
	formInput:
	  "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
	formTextarea:
	  "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y min-h-[90px] sm:min-h-[110px]",
	formDivider: "border-t border-slate-100 mt-4 sm:mt-6 pt-4 sm:pt-6",
	formFooter: "flex items-center justify-end gap-3 flex-wrap",
	formCancelBtn:
	  "flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all",
	formSubmitBtn:
	  "flex items-center gap-2 bg-blue-600 text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-sm",
	formError: "text-red-500 text-xs mt-1",
  
	assignCard:
	  "bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-8 flex flex-col gap-4 sm:gap-6",
	assignGrid: "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8",
	assignCol: "border border-slate-200 rounded-xl overflow-hidden",
	assignHeader:
	  "bg-slate-50 border-b border-slate-200 px-4 sm:px-5 py-3 sm:py-4 font-semibold text-slate-800 text-sm",
	assignList: "flex flex-col max-h-[280px] sm:max-h-[400px] overflow-y-auto",
	assignListItem:
	  "flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors last:border-0",
	assignRadio:
	  "w-4 h-4 text-blue-600 bg-white border-slate-300 focus:ring-blue-500 focus:ring-2 cursor-pointer",
	assignLabel: "text-sm text-slate-700 cursor-pointer flex-1 font-medium",
	assignLabelActive: "text-sm text-slate-900 cursor-pointer flex-1 font-bold",
  
	popupOverlay: "fixed inset-0 z-50 flex items-center justify-center px-4",
	popupBackdrop: "absolute inset-0 bg-black/40 backdrop-blur-sm",
	popupCard: "relative z-10 bg-white rounded-2xl shadow-2xl px-6 sm:px-10 py-6 sm:py-8 flex flex-col items-center gap-3 w-full max-w-sm",
	popupIcon: "text-green-500 text-5xl",
	popupTitle: "text-lg sm:text-xl font-bold text-slate-900",
	popupMessage: "text-sm text-slate-500 text-center",
	popupProgressWrap: "w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2",
	popupProgressBar: "h-full bg-green-500 rounded-full animate-[progress_2s_linear_forwards]",
  
	placeholderWrap: "flex flex-col items-center justify-center h-full w-full text-center",
	placeholderIconWrap: "mb-4 text-slate-300",
	placeholderTitle: "text-lg sm:text-xl font-bold text-slate-800 mb-2",
	placeholderText: "text-slate-500 text-sm",
  
	assignColWrap: "flex flex-col gap-2",
	assignColTitle: "text-sm font-bold text-slate-900 mb-1",
	assignFooterWrap: "border-t border-slate-100 pt-4 sm:pt-6 flex justify-end gap-3 mt-4 flex-wrap",
  
	paginationWrap: "flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 px-2 gap-3 sm:gap-0",
	paginationInfo: "text-xs sm:text-sm text-slate-500 font-medium",
	paginationControls: "flex items-center gap-1 sm:gap-2 flex-wrap",
	paginationBtn: (active: boolean, disabled: boolean) => {
	  const base = "w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl text-xs sm:text-sm font-semibold transition-all border";
	  if (disabled) return `${base} bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed`;
	  if (active) return `${base} bg-blue-600 text-white border-blue-600 shadow-sm`;
	  return `${base} bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:bg-slate-50`;
	},
	paginationNavBtn: (disabled: boolean) => {
	  const base = "px-3 sm:px-4 h-8 sm:h-9 flex items-center justify-center gap-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border";
	  if (disabled) return `${base} bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed`;
	  return `${base} bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:bg-slate-50`;
	}
  };
  
  export default profileDesign;