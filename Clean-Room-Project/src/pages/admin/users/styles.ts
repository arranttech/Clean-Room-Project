const usersDesign = {
    // --- Header ---
    panelHeader: "flex items-center justify-between mb-6",
    panelTitle: "text-2xl font-bold text-slate-900 ml-4",
    addBtn: "flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm",
  
    // --- Filter Tabs ---
    filterWrap: "flex items-center gap-2 mb-4",
    filterBtn: (active, type) => {
      const base = "px-4 py-1.5 rounded-full text-xs font-semibold border transition-all";
      if (!active) return `${base} bg-white text-slate-500 border-slate-200 hover:border-slate-400`;
      if (type === "I") return `${base} bg-red-500 text-white border-red-500`;
      if (type === "A") return `${base} bg-green-500 text-white border-green-500`;
      return `${base} bg-slate-800 text-white border-slate-800`;
    },
  
    // --- Search ---
    searchWrap: "relative mb-5",
    searchIcon: "absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base",
    searchInput: "w-full border border-slate-200 rounded-xl bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm",
  
    // --- Table ---
    tableWrap: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto",
    table: "min-w-max w-full",
    thead: "border-b border-slate-100 bg-slate-900",
    th: "px-5 py-3.5 text-left text-xs font-bold text-white uppercase tracking-wider",
    thActions: "px-5 py-3.5 text-right text-xs font-bold text-slate-400 uppercase tracking-wider",
    tbody: "divide-y divide-slate-50",
    tr: "hover:bg-blue-50/50 transition-colors",
    td: "px-5 py-4 text-sm text-slate-600",
    tdName: "px-5 py-4 text-sm font-semibold text-slate-900",
    tdEmail: "px-5 py-4 text-sm text-slate-500",
    tdActions: "px-5 py-4 text-right",
    emptyRow: "px-5 py-16 text-center text-sm text-slate-400",
  
    // --- Status ---
    statusActive: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700",
    statusInactive: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600",
  
    // --- Action Buttons ---
    editBtn: "text-blue-400 hover:text-orange-600 transition-colors p-1.5 rounded-lg hover:bg-orange-50 mr-1",
    deleteBtn: "text-red-500 hover:text-red-700 transition-colors p-1.5 rounded-lg hover:bg-red-50",
  
    // --- Form ---
    formTitle: "text-2xl font-bold text-slate-900 mb-6",
    formCard: "bg-white rounded-2xl border border-slate-200 shadow-sm p-8",
    formGroup: "mb-5",
    formRow: "grid grid-cols-2 gap-5 mb-5",
    formLabel: "block text-sm font-semibold text-slate-700 mb-1.5",
    formRequired: "text-red-500",
    formInput: "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
    formTextarea: "w-full border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y px-2 py-2",
    formDivider: "border-t border-slate-100 mt-6 pt-6",
    formFooter: "flex items-center justify-end gap-3",
    formCancelBtn: "flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all",
    formSubmitBtn: "flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-sm",
    formError: "text-red-500 text-xs mt-1",
  
    // --- Success Popup ---
    popupOverlay: "fixed inset-0 z-50 flex items-center justify-center",
    popupBackdrop: "absolute inset-0 bg-black/40 backdrop-blur-sm",
    popupCard: "relative z-10 bg-white rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center gap-3 min-w-[320px]",
    popupIcon: "text-green-500 text-5xl",
    popupTitle: "text-xl font-bold text-slate-900",
    popupMessage: "text-sm text-slate-500 text-center",
    popupProgressWrap: "w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2",
    popupProgressBar: "h-full bg-green-500 rounded-full animate-[progress_2s_linear_forwards]",
  
    // --- Delete Modal ---
    deleteOverlay: "fixed inset-0 z-50 flex items-center justify-center",
    deleteBackdrop: "absolute inset-0 bg-black/40 backdrop-blur-sm",
    deleteCard: "relative z-10 bg-white rounded-2xl shadow-2xl px-8 py-7 flex flex-col items-center gap-4 min-w-[340px] max-w-sm w-full",
    deleteIconWrap: "bg-red-50 rounded-full p-4",
    deleteIcon: "text-red-500 text-3xl",
    deleteTitle: "text-xl font-bold text-slate-900",
    deleteMessage: "text-sm text-slate-500 text-center",
    deleteUserName: "font-semibold text-slate-700",
    deleteBtnRow: "flex items-center gap-3 w-full mt-1",
    deleteCancelBtn: "flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all",
    deleteConfirmBtn: "flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm",
  };
  
  export default usersDesign;
