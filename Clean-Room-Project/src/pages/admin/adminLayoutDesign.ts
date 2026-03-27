const adminDesign = {
  page: "min-h-screen bg-slate-50 flex flex-col",
  body: "flex flex-1 overflow-hidden",

  sidebar:
    "hidden md:flex w-48 lg:w-56 bg-white border-r border-slate-200 flex-col py-4 lg:py-6 px-2 lg:px-3 shrink-0 shadow-sm",
  sidebarTitle:
    "text-[10px] lg:text-[11px] font-extrabold text-slate-800 tracking-widest uppercase px-3 lg:px-5 mb-4 lg:mb-5",

  navItem:
    "flex items-center justify-between px-2 lg:px-3 py-2.5 lg:py-3 rounded-xl text-xs lg:text-sm font-semibold text-slate-600 hover:bg-[#fc8314]/10 hover:text-[#fc8314] transition-all cursor-pointer mb-1 w-full",
  navItemActive:
    "flex items-center justify-between px-2 lg:px-3 py-2.5 lg:py-3 rounded-xl text-xs lg:text-sm font-bold bg-[#fc8314] text-white shadow-md mb-1 w-full",
  navItemLeft: "flex items-center gap-2 lg:gap-3",
  navIcon: "text-base lg:text-lg shrink-0",
  navLabel: "flex-1 text-left",
  navBadge:
    "text-xs font-bold bg-[#fc8314]/15 text-[#fc8314] rounded-full px-2 py-0.5 min-w-[22px] text-center",
  navBadgeActive:
    "text-xs font-bold bg-white/25 text-white rounded-full px-2 py-0.5 min-w-[22px] text-center",

  navSubList: "flex flex-col gap-1 mb-2 px-2 lg:px-3",
  navSubItem:
    "block w-full text-left px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium text-slate-500 bg-slate-50 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition-all cursor-pointer",
  navSubItemActive:
    "block w-full text-left px-3 lg:px-4 py-2 text-xs lg:text-sm font-semibold text-[#fc8314] bg-[#fc8314]/10 rounded-lg shadow-sm cursor-pointer",
  navSubBadge:
    "text-[9px] font-bold bg-[#fc8314]/10 text-[#fc8314] rounded-full px-1 py-0.5 min-w-[16px] text-center border border-[#fc8314]/20",
  navSubBadgeActive:
    "text-[9px] font-bold bg-[#fc8314] text-white rounded-full px-1 py-0.5 min-w-[16px] text-center",

  content: "flex-1 p-4 sm:p-6 lg:p-8 overflow-auto",
};

export default adminDesign;
