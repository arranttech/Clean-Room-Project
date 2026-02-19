// customersDesign.ts — Design tokens for the Customers panel

const customersDesign = {
    // --- Panel Header ---
    panelHeader: "flex items-center justify-between mb-6",
    panelTitle: "text-2xl font-bold text-slate-900",
  
    // --- Search ---
    searchWrap: "relative mb-5",
    searchIcon: "absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base",
    searchInput: "w-full border border-slate-200 rounded-xl bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm",
  
    // --- Table ---
    tableWrap: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden",
    table: "w-full",
    thead: "border-b border-slate-100 bg-slate-50",
    th: "px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider",
    thActions: "px-5 py-3.5 text-right text-xs font-bold text-slate-400 uppercase tracking-wider",
    tbody: "divide-y divide-slate-50",
    tr: "hover:bg-blue-50/50 transition-colors",
    td: "px-5 py-4 text-sm text-slate-600",
    tdName: "px-5 py-4 text-sm font-semibold text-slate-900",
    tdEmail: "px-5 py-4 text-sm text-slate-500",
    tdActions: "px-5 py-4 text-right",
  
    // --- Action Buttons ---
    editBtn: "text-slate-400 hover:text-blue-600 transition-colors p-1.5 rounded-lg hover:bg-blue-50",
    deleteBtn: "text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50",
  
    // --- Empty State ---
    emptyRow: "px-5 py-16 text-center text-sm text-slate-400",
  };
  
  export default customersDesign;