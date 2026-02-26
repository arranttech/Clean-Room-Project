
const adminDesign = {
  // --- Page Layout ---
  page: "min-h-screen bg-slate-50 flex flex-col",

  // --- Body ---
  body: "flex flex-1 overflow-hidden",

  // --- Sidebar ---
  sidebar: "w-56 bg-white border-r border-slate-200 flex flex-col py-6 px-3 shrink-0 shadow-sm",
  sidebarTitle: "text-[11px] font-extrabold text-black-800 tracking-widest uppercase px-5 mb-5",
  navItem: "flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-all cursor-pointer mb-1 w-full",
  navItemActive: "flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold bg-blue-600 text-white shadow-md mb-1 w-full",
  navItemLeft: "flex items-center gap-3",
  navIcon: "text-lg shrink-0",
  navLabel: "flex-1 text-left",
  navBadge: "text-xs font-bold bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 min-w-[22px] text-center",
  navBadgeActive: "text-xs font-bold bg-white/25 text-white rounded-full px-2 py-0.5 min-w-[22px] text-center",

  navSubList: "flex flex-col gap-1 mb-2 px-3",
  navSubItem: "block w-full text-left px-4 py-2 text-sm font-medium text-slate-500 bg-slate-50 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition-all cursor-pointer",
  navSubItemActive: "block w-full text-left px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-50 rounded-lg shadow-sm cursor-pointer",

  // --- Content Area ---
  content: "flex-1 p-8 overflow-auto",
};

export default adminDesign;