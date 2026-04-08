import theme from "../../styles/theme";

const headerStyles: Record<string, string> = {
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

  avatarBtn:
    "w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#fc8314] text-white text-xs sm:text-sm font-bold flex items-center justify-center flex-shrink-0 cursor-pointer hover:bg-[#e6740f] transition shadow-sm select-none",

  overlay: "fixed inset-0 bg-black/20 z-40",
  sidebar:
    "fixed top-0 right-0 h-full w-[320px] sm:w-[360px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out",
  sidebarOpen: "translate-x-0",
  sidebarClosed: "translate-x-full",

  sidebarHeader: "bg-[#fc8314] px-5 py-5 flex items-center gap-4 flex-shrink-0",
  sidebarAvatar:
    "w-14 h-14 rounded-full bg-white/30 text-white text-lg font-bold flex items-center justify-center flex-shrink-0",
  sidebarUserInfo: "flex-1 min-w-0",
  sidebarName: "text-white font-bold text-base leading-tight truncate",
  sidebarRole: "text-white/80 text-xs mt-0.5 truncate",
  sidebarClose:
    "text-white/80 hover:text-white flex-shrink-0 p-1 rounded transition",

  sidebarBody: "flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3",

  infoCard: "bg-slate-50 border border-slate-100 rounded-xl px-4 py-3",
  infoCardHeader: "flex items-center justify-between mb-1.5",
  infoCardTitle: "flex items-center gap-2 text-slate-700 font-semibold text-sm",
  infoIcon: "text-slate-500 text-base flex-shrink-0",
  updateBtn: "text-[#fc8314] text-xs font-semibold hover:underline transition",
  infoCardValue: "text-slate-600 text-sm leading-relaxed",
  phoneLabel: "text-slate-400 text-xs font-medium",

  inputLabel: "block text-xs text-slate-500 mb-1 mt-2",
  inputField:
    "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:border-[#fc8314] focus:ring-1 focus:ring-[#fc8314] transition",
  textareaField:
    "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:border-[#fc8314] focus:ring-1 focus:ring-[#fc8314] transition resize-none",

  pwInputWrap: "relative flex items-center",
  inputFieldPw:
    "w-full border border-slate-200 rounded-lg px-3 py-2 pr-9 text-sm text-slate-700 bg-white focus:outline-none focus:border-[#fc8314] focus:ring-1 focus:ring-[#fc8314] transition",
  eyeBtn: "absolute right-2.5 text-slate-400 hover:text-[#fc8314] transition",

  inputError: "border-red-400 focus:border-red-400 focus:ring-red-400",
  fieldError: "text-red-500 text-xs mt-1",
  passwordRulesList: "mt-1 flex flex-col gap-0.5",

  btnRow: "flex gap-2 mt-3",
  saveBtn:
    "flex-1 bg-[#fc8314] hover:bg-[#e6740f] text-white text-sm font-semibold py-2 rounded-lg transition disabled:opacity-60",
  cancelBtn:
    "px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold py-2 rounded-lg transition",

  sidebarFooter: "px-4 py-4 border-t border-slate-100 flex-shrink-0",
  logoutBtn:
    "w-full flex items-center justify-center gap-2 text-red-600 font-semibold text-sm py-3 rounded-xl bg-red-100 hover:bg-red-300 transition",

  toast:
    "fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-xl min-w-[280px] max-w-[360px] border",
  toastSuccess: "bg-white border-green-100",
  toastError: "bg-white border-red-100",
  toastInner: "flex items-center gap-2 flex-1",
  toastMsg: "text-slate-700 text-sm font-medium",
  toastClose: "text-slate-400 hover:text-slate-600 transition flex-shrink-0",
};

export default headerStyles;
