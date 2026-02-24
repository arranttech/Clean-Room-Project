const ScreenAccessDesign = {
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

    thead: "bg-slate-900",
    th: "px-5 py-5 text-left text-xs font-bold text-white uppercase tracking-wider",
    thActions: "px-5 py-3.5 text-right text-xs font-bold text-white uppercase tracking-wider",
    tbody: "divide-y divide-slate-50",
    tr: "hover:bg-blue-50/50 transition-colors",
    td: "px-5 py-4 text-sm text-slate-600",
    tdScreenId: "px-5 py-4 text-sm font-semibold text-slate-900",
    tdScreenName: "px-5 py-4 text-sm text-slate-600",
    tdActions: "px-5 py-4 text-right",

    // --- Action Buttons Styling ---

    editBtn: "text-slate-400 hover:text-blue-600 transition-colors p-1.5 rounded-lg hover:bg-blue-300",
    deleteBtn: "text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-300",

    // --- Empty State ---
    emptyRow: "px-5 py-16 text-center text-sm text-slate-400",

    userEditIcon: "text-slate-400 hover:text-blue-600 transition-colors p-1.5 rounded-lg hover:bg-blue-500",
    userDeleteIcon: "text-slate-400 hover:text-red-500  hover:bg-red-500",


    // --- Add Users Form Styling ---
    formTitle: "text-2xl font-bold text-slate-900 mb-6",
    formCard: "bg-white rounded-2xl border border-slate-200 shadow-sm p-8",
    formGroup: "mb-6",
    formRow: "mb-6",
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

    // --- Screen Selection Styling ---
    screenGroupWrapper: "relative w-full",
    dropdownTrigger: "w-full border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer flex justify-between items-center",
    dropdownContainer: "absolute top-full left-0 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-[300px] overflow-y-auto flex flex-col gap-1 p-2",
    selectAllBox: "border-b border-slate-100 bg-[#f4f8ff] rounded-t-xl px-4 py-3 mb-1",
    checkboxLabelSelectAll: "flex items-center gap-3 text-sm font-bold text-blue-600 cursor-pointer",
    screensList: "flex flex-col gap-1",
    checkboxLabel: "flex items-center gap-3 px-4 py-2.5 text-[14px] text-slate-600 cursor-pointer hover:bg-slate-50 rounded-lg transition-colors",
    checkboxInput: "w-4 h-4 rounded border-slate-300 accent-blue-600 cursor-pointer",
    selectedCount: "text-[13px] text-slate-500",

    // --- Permission Table Styling ---
    permissionTableWrap: "w-full border border-slate-200 rounded-xl overflow-hidden mt-1",
    permissionTable: "w-full text-left border-collapse",
    permissionThead: "bg-[#f8fafc] border-b border-slate-200",
    permissionTh: "py-3.5 px-4 text-[13px] font-bold text-slate-700 w-1/4 text-center first:text-left",
    permissionTbody: "divide-y divide-slate-100",
    permissionTr: "hover:bg-slate-50/50 transition-colors",
    permissionTd: "py-3.5 px-4 text-[14px] text-slate-600 text-center first:text-left first:font-medium",
    permissionRadioWrapper: "inline-flex items-center justify-center w-full",
    permissionRadio: "w-4 h-4 text-blue-600 bg-white border-slate-300 focus:ring-blue-500 focus:ring-2 cursor-pointer",
    configuredCount: "text-[13px] text-slate-500 mt-2 block",

    // --- Tooltip Styling ---
    screenAccessTooltip: "!bg-white !text-slate-800 border !border-slate-200 shadow-sm",
    tooltipWrap: "flex flex-col gap-3",
    tooltipItem: "flex items-center gap-3",
    tooltipDotGreen: "w-3 h-3 rounded-full bg-[#22c55e] block",
    tooltipDotSlate: "w-3 h-3 rounded-full bg-[#94a3b8] block",
    tooltipDotRed: "w-3 h-3 rounded-full bg-[#ef4444] block",
    tooltipText: "font-bold tracking-[0.1em] text-[11px] uppercase text-slate-700",
};

export default ScreenAccessDesign;
