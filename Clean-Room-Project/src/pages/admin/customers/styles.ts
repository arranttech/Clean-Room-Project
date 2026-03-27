const customersDesign = {
  // Header
  panelHeader: "flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-3",
  panelTitle:
    "text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent tracking-tight",
  addBtn:
    "flex items-center gap-2 bg-blue-800 text-white text-xs sm:text-sm font-semibold px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm",

  // Search
  searchWrap: "relative mb-4 sm:mb-5",
  searchIcon:
    "absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base",
  searchInput:
    "w-full border border-slate-200 rounded-xl bg-white pl-10 pr-4 py-2 sm:py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm",

  // Table
  tableWrap:
    "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto",
  table: "w-full min-w-[550px]",
  thead: "bg-slate-900",
  th: "px-3 sm:px-5 py-3 sm:py-3.5 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap",
  thActions:
    "px-3 sm:px-5 py-3 sm:py-3.5 text-right text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap",
  tbody: "divide-y divide-slate-50",
  tr: "hover:bg-blue-50/50 transition-colors",
  td: "px-3 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm text-slate-600",
  tdName: "px-3 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-slate-900",
  tdEmail: "px-3 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm text-slate-500",
  tdActions: "px-3 sm:px-5 py-3 sm:py-4 text-right",
  emptyRow: "px-5 py-10 sm:py-16 text-center text-sm text-slate-400",

  // Action Buttons
  editBtn:
    "text-blue-400 hover:text-orange-600 transition-colors p-1.5 rounded-lg hover:bg-orange-50 mr-1",
  deleteBtn:
    "text-red-500 hover:text-red-700 transition-colors p-1.5 rounded-lg hover:bg-red-50",

  // Status Badges
  statusActive:
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700",
  statusInactive:
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600",

  // Form
  formTitle: "text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6",
  formCard: "bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-8",
  formGroup: "mb-4 sm:mb-5",
  formRow: "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-4 sm:mb-5",
  formLabel: "block text-sm font-semibold text-slate-700 mb-1.5",
  formRequired: "text-red-500 ml-0.5",
  formInput:
    "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
  formTextarea:
    "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y",
  formDivider: "border-t border-slate-100 mt-4 sm:mt-6 pt-4 sm:pt-6",
  formFooter: "flex items-center justify-end gap-3 flex-wrap",
  formCancelBtn:
    "flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all",
  formSubmitBtn:
    "flex items-center gap-2 bg-blue-600 text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-sm",
  formError: "text-red-500 text-xs mt-1",

  // Success Popup
  popupOverlay: "fixed inset-0 z-50 flex items-center justify-center px-4",
  popupBackdrop: "absolute inset-0 bg-black/40 backdrop-blur-sm",
  popupCard:
    "relative z-10 bg-white rounded-2xl shadow-2xl px-6 sm:px-10 py-6 sm:py-8 flex flex-col items-center gap-3 w-full max-w-sm",
  popupIcon: "text-green-500 text-5xl",
  popupTitle: "text-lg sm:text-xl font-bold text-slate-900",
  popupMessage: "text-sm text-slate-500 text-center",
  popupProgressWrap:
    "w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2",
  popupProgressBar:
    "h-full bg-green-500 rounded-full animate-[progress_2s_linear_forwards]",

  // Delete Modal
  deleteOverlay: "fixed inset-0 z-50 flex items-center justify-center px-4",
  deleteBackdrop: "absolute inset-0 bg-black/40 backdrop-blur-sm",
  deleteCard:
    "relative z-10 bg-white rounded-2xl shadow-2xl px-5 sm:px-8 py-6 sm:py-7 flex flex-col items-center gap-4 w-full max-w-sm",
  deleteIconWrap: "bg-red-50 rounded-full p-3 sm:p-4",
  deleteIcon: "text-red-500 text-2xl sm:text-3xl",
  deleteTitle: "text-lg sm:text-xl font-bold text-slate-900",
  deleteMessage: "text-sm text-slate-500 text-center",
  deleteCustomerName: "font-semibold text-slate-700",
  deleteBtnRow: "flex items-center gap-3 w-full mt-1",
  deleteCancelBtn:
    "flex-1 flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all",
  deleteConfirmBtn:
    "flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all shadow-sm",

  // Pagination
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
export default customersDesign;