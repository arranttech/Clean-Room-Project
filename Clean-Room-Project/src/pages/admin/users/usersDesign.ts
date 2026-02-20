
const usersDesign = {
    // ---  Header Styling ---
    panelHeader: "flex items-center justify-between mb-6",
    panelTitle: "text-2xl font-bold text-slate-900 ml-4",
    addBtn: "flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm",
  
    // --- Search Bar Styling ---
    searchWrap: "relative mb-5",
    searchIcon: "absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base",
    searchInput: "w-full border border-slate-200 rounded-xl bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm",
  
    // --- Table Styling ---
    tableWrap: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto",
table: "min-w-max w-full",

    thead: "border-b border-slate-100 bg-slate-50",
    th: "px-5 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider",
    thActions: "px-5 py-3.5 text-right text-xs font-bold text-slate-400 uppercase tracking-wider",
    tbody: "divide-y divide-slate-50",
    tr: "hover:bg-blue-50/50 transition-colors",
    td: "px-5 py-4 text-sm text-slate-600",
    tdName: "px-5 py-4 text-sm font-semibold text-slate-900",
    tdEmail: "px-5 py-4 text-sm text-slate-500",
    tdActions: "px-5 py-4 text-right",
  
    // --- Action Buttons Styling ---
    editBtn: "text-slate-400 hover:text-blue-600 transition-colors p-1.5 rounded-lg hover:bg-blue-500",
    deleteBtn: "text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50",
  
    // --- Empty State ---
    emptyRow: "px-5 py-16 text-center text-sm text-slate-400",

    userEditIcon: "text-slate-400 hover:text-blue-600 transition-colors p-1.5 rounded-lg hover:bg-blue-500",
    userDeleteIcon: "text-slate-400 hover:text-red-500  hover:bg-red-500",


    // --- Add Users Form Styling ---
  formTitle: "text-2xl font-bold text-slate-900 mb-6",
  formCard: "bg-white rounded-2xl border border-slate-200 shadow-sm p-8",
  formGroup: "mb-5",
  formRow: "grid grid-cols-2 gap-5 mb-5",
  formLabel: "block text-sm font-semibold text-slate-700 mb-1.5",
  formRequired: "text-red-500 ml-0.5",
  formInput: "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
  formTextarea: "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y min-h-[110px]",
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
  };
  
  export default usersDesign; 
