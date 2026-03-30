import theme from "../../styles/theme";

const adminDesign = {
  page:    "min-h-screen bg-slate-50 flex flex-col",
  body:    "flex flex-1 overflow-hidden",

  sidebar:      theme.sidebar,
  sidebarTitle: theme.sidebarTitle,

  navItem:      theme.navItem,
  navItemActive: theme.navItemActive,
  navItemLeft:  "flex items-center gap-3",
  navIcon:      "text-lg shrink-0",
  navLabel:     "flex-1 text-left",
  navBadge:
    "text-xs font-bold bg-[#fc8314]/15 text-[#fc8314] rounded-full px-2 py-0.5 min-w-[22px] text-center",
  navBadgeActive:
    "text-xs font-bold bg-white/25 text-white rounded-full px-2 py-0.5 min-w-[22px] text-center",

  navSubList:   "flex flex-col gap-1 mb-2 px-3",
  navSubItem:
    "block w-full text-left px-4 py-2 text-sm font-medium text-slate-500 bg-slate-50 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition-all cursor-pointer",
  navSubItemActive:
    "block w-full text-left px-4 py-2 text-sm font-semibold text-[#fc8314] bg-[#fc8314]/10 rounded-lg shadow-sm cursor-pointer",
  navSubBadge:
    "text-[9px] font-bold bg-[#fc8314]/10 text-[#fc8314] rounded-full px-1 py-0.5 min-w-[16px] text-center border border-[#fc8314]/20",
  navSubBadgeActive:
    "text-[9px] font-bold bg-[#fc8314] text-white rounded-full px-1 py-0.5 min-w-[16px] text-center",

  content: "flex-1 p-8 overflow-auto",
};

export default adminDesign;
