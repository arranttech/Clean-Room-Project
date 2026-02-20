
const adminDesign = {
    // --- Page Layout ---
    page: "min-h-screen bg-slate-50 flex flex-col",
  
    // --- Body ---
    body: "flex flex-1 overflow-hidden",
  
    // --- Sidebar ---
    sidebar: "w-56 bg-white border-r border-slate-200 flex flex-col py-6 px-3 shrink-0 shadow-sm",
    sidebarTitle: "text-[11px] font-extrabold text-black-800 tracking-widest uppercase px-5 mb-5",
    navItem: "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-all cursor-pointer mb-1",
    navItemActive: "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold bg-blue-600 text-white shadow-md mb-1",
    navIcon: "text-lg shrink-0",
    navLabel: "flex-1",
    navBadge: "text-xs font-bold bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 min-w-[22px] text-center",
    navBadgeActive: "text-xs font-bold bg-white/25 text-white rounded-full px-2 py-0.5 min-w-[22px] text-center",
  
    // --- Content Area ---
    content: "flex-1 p-8 overflow-auto",
  };
  
  export default adminDesign;