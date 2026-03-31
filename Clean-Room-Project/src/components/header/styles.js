import theme from "../../styles/theme";

const headerStyles = {
  header: "w-full bg-white border-b border-slate-200 shadow-sm",
  headerInner:
    "mx-auto px-3 sm:px-8 lg:px-14 min-h-[64px] py-2 sm:py-3 grid grid-cols-3 items-center",

  left: "flex items-center gap-2 sm:gap-4 justify-start min-w-0",

  logoTile: `h-8 w-8 sm:h-12 sm:w-12 ${theme.roundLg} flex items-center justify-center ${theme.shadowSm} cursor-pointer flex-shrink-0`,

  logoImg: "h-8 w-8 sm:h-12 sm:w-12 object-contain",

  brand: `text-[9px] sm:text-xs tracking-[0.18em] sm:tracking-[0.22em] ${theme.weightBold} text-slate-700 leading-tight hidden sm:block`,

  center: "flex flex-col items-center justify-center text-center px-1",

  title1:
    "text-xs sm:text-base lg:text-lg font-extrabold text-[#fc8314] leading-tight whitespace-nowrap",

  subtitle1: `text-[10px] sm:text-sm ${theme.weightBold} text-slate-700 whitespace-nowrap`,

  right: "flex items-center gap-1.5 sm:gap-3 justify-end min-w-0",

  userName:
    "text-xs sm:text-sm font-bold text-blue-600 truncate max-w-[70px] sm:max-w-[120px]",

  userEmail:
    "text-[10px] sm:text-xs text-slate-500 mt-0.5 hidden sm:block truncate max-w-[120px]",

  logout: `inline-flex items-center gap-1 sm:gap-2 text-slate-600 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1.5 sm:py-2 ${theme.roundSm} border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition flex-shrink-0`,
};

export default headerStyles;