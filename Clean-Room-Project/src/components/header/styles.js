import theme from "../../styles/theme";

const headerStyles = {
  header:
    "w-full bg-white border-b border-slate-200 shadow-sm",
  headerInner:
    "mx-auto w-full max-w-screen-2xl px-4 sm:px-8 lg:px-14 h-auto min-h-[64px] py-3 flex items-center justify-between gap-2",
  left:
    "flex items-center gap-2 sm:gap-4 flex-shrink-0",
  logoTile:
    `h-10 w-10 sm:h-12 sm:w-12 ${theme.roundLg} flex items-center justify-center ${theme.shadowSm}`,
  logoImg:
    "h-10 w-10 sm:h-12 sm:w-12 object-contain",
  brand:
    `text-[10px] sm:text-xs tracking-[0.18em] sm:tracking-[0.22em] ${theme.weightBold} text-slate-700 leading-tight hidden sm:block`,
  center:
    "flex-1 text-center px-2",
  title1:
    "text-sm sm:text-base lg:text-lg font-extrabold text-[#fc8314] leading-tight",
  subtitle1:
    `text-xs sm:text-sm ${theme.weightBold} text-slate-700`,
  right:
    "flex items-center gap-2 sm:gap-3 flex-shrink-0",
  logout:
    `inline-flex items-center gap-1 sm:gap-2 text-slate-600 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1.5 sm:py-2 ${theme.roundSm} border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition`,
};

export default headerStyles;