/**
 * theme.ts — Single source of truth for all colors, typography, spacing and common styles.
 * Change the whole app's look by editing only this file.
 */

const theme = {

  // ── Brand Colors ──────────────────────────────────────────────────────────
  primary: "blue-700",
  primaryHover: "blue-800",
  primaryDark: "blue-900",
  primaryLight: "blue-100",
  primaryText: "blue-700",
  primaryTextLight: "blue-600",
  primaryBorder: "blue-200",

  accent: "#fc8314",   // orange — header title, CTA button (inline only)
  accentHover: "#bf6a20",
  accentDark: "#a85c18",

  // ── Page / Surface ────────────────────────────────────────────────────────
  pageBg: "slate-50",
  pageBgDark: "#0B1221",   // landing page dark sections
  cardBg: "white",
  sidebarBg: "white",

  // Layout utilities
  containerCentered: "mx-auto w-full max-w-screen-2xl px-4 sm:px-8",
  contentMaxWidth5xl: "max-w-screen-2xl mx-auto",
  pageWrapperCenterMiddle: "min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-6",

  // ── Borders ───────────────────────────────────────────────────────────────
  borderColor: "slate-200",
  borderStrong: "slate-300",
  borderBlue: "blue-200",

  // ── Text ──────────────────────────────────────────────────────────────────
  textPrimary: "slate-900",
  textSecondary: "slate-700",
  textMuted: "slate-500",
  textDisabled: "slate-400",
  textWhite: "white",

  // ── Status ────────────────────────────────────────────────────────────────
  success: "green-600",
  successBg: "green-100",
  successText: "green-700",
  successBorder: "green-200",

  warning: "amber-500",
  warningBg: "amber-100",

  error: "red-500",
  errorHover: "red-600",
  errorDark: "red-700",
  errorBg: "red-50",
  errorText: "red-500",

  // Status Banners
  bannerInfo: "rounded-xl bg-blue-50 border border-blue-200 p-3 sm:p-4 text-xs sm:text-sm text-blue-700",
  bannerSuccess: "rounded-xl bg-green-50 border border-green-200 p-3 sm:p-4 text-xs sm:text-sm text-green-700",
  bannerWarning: "rounded-xl bg-amber-50 border border-amber-200 p-3 sm:p-4 text-xs sm:text-sm text-amber-700",
  bannerError: "rounded-xl bg-red-50 border border-red-200 p-3 sm:p-4 text-xs sm:text-sm text-red-700",

  // ── Typography ────────────────────────────────────────────────────────────
  fontXs: "text-xs",
  fontSm: "text-sm",
  fontBase: "text-base",
  fontLg: "text-lg",
  fontXl: "text-xl",
  font2xl: "text-2xl",
  font3xl: "text-3xl",

  // Pre-composed typography
  h1: "text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight",
  h2: "text-sm sm:text-base font-bold tracking-widest text-gray-900 uppercase",
  h3: "text-base font-bold text-slate-800",
  h4: "text-sm font-bold text-slate-700 uppercase tracking-wider",
  bodyLg: "text-lg sm:text-xl text-slate-600",
  bodyBase: "text-sm sm:text-base text-slate-600",
  bodySm: "text-xs sm:text-sm text-slate-500",
  bodyXs: "text-[10px] sm:text-xs text-slate-400",

  weightMedium: "font-medium",
  weightSemibold: "font-semibold",
  weightBold: "font-bold",
  weightXBold: "font-extrabold",

  trackingTight: "tracking-tight",
  trackingWide: "tracking-wide",
  trackingWidest: "tracking-widest",

  // ── Border Radius ─────────────────────────────────────────────────────────
  roundSm: "rounded-lg",
  roundMd: "rounded-xl",
  roundLg: "rounded-2xl",
  roundFull: "rounded-full",

  // ── Shadows ───────────────────────────────────────────────────────────────
  shadowSm: "shadow-sm",
  shadowMd: "shadow-md",
  shadowLg: "shadow-lg",
  shadow2xl: "shadow-2xl",

  // ── Transitions ───────────────────────────────────────────────────────────
  transition: "transition-all",
  transitionColors: "transition-colors",

  // ─────────────────────────────────────────────────────────────────────────
  // PRE-COMPOSED REUSABLE CLASS STRINGS
  // Use these directly in style objects instead of raw Tailwind
  // ─────────────────────────────────────────────────────────────────────────

  // Page wrappers
  pageWrapper: "min-h-screen bg-slate-50",
  pageWrapperWhite: "min-h-screen bg-white px-3 sm:px-4 py-4 sm:py-6",

  // Cards
  card:
    "bg-white rounded-2xl border border-slate-200 shadow-sm",
  cardPadded:
    "bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6",
  cardPaddedLg:
    "bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-8",
  cardInteractive:
    "bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer",

  // Inputs
  input:
    "w-full border border-slate-200 rounded-xl bg-white py-2.5 sm:py-3 px-3 sm:px-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all",
  inputDisabled:
    "w-full border border-slate-200 rounded-xl bg-slate-100 py-2.5 sm:py-3 px-3 sm:px-4 text-sm text-slate-500 cursor-not-allowed",
  inputGreen:
    "w-full border border-green-200 rounded-xl bg-green-50 py-3 px-4 text-sm text-slate-600 cursor-not-allowed select-none",
  select:
    "w-full rounded-xl border border-slate-300 bg-white px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none",
  selectDisabled:
    "w-full rounded-xl border border-slate-200 bg-slate-100 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-slate-500 cursor-not-allowed",
  textarea:
    "w-full border border-slate-200 rounded-xl bg-white py-3 px-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-y",

  formGroup: "flex flex-col gap-2 mb-4",
  formRow: "grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4",

  // Labels
  label:
    "text-xs sm:text-sm font-semibold text-slate-700",
  labelBold:
    "text-xs sm:text-sm font-bold text-gray-950 mb-1",
  required:
    "text-red-500 ml-0.5",

  // Buttons
  btnPrimary:
    "inline-flex items-center gap-2 bg-blue-700 text-white px-5 sm:px-7 py-2 sm:py-2.5 rounded-xl hover:bg-blue-800 shadow-md text-xs sm:text-sm font-semibold transition-all",
  btnPrimaryLg:
    "flex items-center gap-2 bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-800 transition-all shadow-md",
  btnSecondary:
    "inline-flex items-center gap-2 border border-slate-300 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl hover:bg-slate-50 shadow-sm text-slate-600 text-xs sm:text-sm font-medium transition-all",
  btnDanger:
    "inline-flex items-center gap-2 bg-red-500 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl hover:bg-red-600 shadow-sm text-xs sm:text-sm font-semibold transition-all",
  btnDangerFull:
    "flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm",
  btnSecondaryFull:
    "flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all",
  btnDisabled:
    "opacity-40 cursor-not-allowed pointer-events-none",
  btnIcon:
    "flex items-center gap-2 bg-blue-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm",
  btnBack:
    "inline-flex items-center gap-2 sm:gap-3 border border-slate-300 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl hover:bg-slate-50 shadow-sm text-slate-600 text-xs sm:text-sm font-medium transition-all",

  // Section headers
  sectionHeader:
    "text-xs sm:text-sm font-bold tracking-widest text-blue-800 uppercase",
  pageTitle:
    "text-xl sm:text-2xl font-bold text-gray-950 tracking-tight",
  pageSubtitle:
    "mt-2 text-xs sm:text-sm text-blue-600",

  // Dividers
  divider:
    "border-t border-slate-200",
  dividerStrong:
    "border-t border-slate-300",

  // Footer rows
  footerRow:
    "flex items-center justify-between w-full mt-6 sm:mt-8",
  footerRowWrap:
    "flex flex-wrap justify-between gap-3 w-full mt-6 sm:mt-10",

  // Status badges
  badgeActive:
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700",
  badgeInactive:
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600",
  badgeBlue:
    "inline-flex items-center rounded-full bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1 text-xs font-medium",
  badgeGreen:
    "inline-flex items-center rounded-full bg-green-100 text-green-700 border border-green-200 px-4 py-1 text-xs font-medium",

  // Modal / Popup
  modalOverlay:
    "fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4",
  modalBackdrop:
    "absolute inset-0 bg-black/40 backdrop-blur-sm",
  modalCard:
    "relative bg-white rounded-2xl shadow-2xl p-5 sm:p-8 max-w-md w-full mx-auto",
  popupBackdrop:
    "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4",

  // Success popup
  successPopupCard:
    "relative z-10 bg-white rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center gap-3 min-w-[320px]",
  successPopupIcon:
    "text-green-500 text-5xl",
  successProgressWrap:
    "w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2",
  successProgressBar:
    "h-full bg-green-500 rounded-full animate-[progress_2s_linear_forwards]",

  // Table
  tableWrap:
    "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden",
  table: "w-full",
  thead: "bg-slate-900",
  th: "px-5 py-3.5 text-left text-xs font-bold text-white uppercase tracking-wider",
  thActions: "px-5 py-3.5 text-right text-xs font-bold text-white uppercase tracking-wider",
  tbody: "divide-y divide-slate-50",
  tr: "hover:bg-blue-50/50 transition-colors",
  td: "px-5 py-4 text-sm text-slate-600",
  tdName: "px-5 py-4 text-sm font-semibold text-slate-900",
  tdActions: "px-5 py-4 text-right",
  tdEmail: "px-5 py-4 text-sm text-slate-500",
  emptyRow: "px-5 py-16 text-center text-sm text-slate-400",

  // Table action buttons
  tableEditBtn:
    "text-blue-400 hover:text-blue-600 transition-colors p-1.5 rounded-lg hover:bg-blue-50 mr-1",
  tableDeleteBtn:
    "text-red-500 hover:text-red-700 transition-colors p-1.5 rounded-lg hover:bg-red-50",

  // Search bar
  searchWrap: "relative mb-5",
  searchIcon: "absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base",
  searchInput:
    "w-full border border-slate-200 rounded-xl bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm",

  // Panel header (admin pages)
  panelHeader: "flex items-center justify-between mb-6",
  panelTitle:
    "text-2xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent tracking-tight",

  // Form (admin forms)
  formTitle: "text-2xl font-bold text-slate-900 mb-6",
  formCard: "bg-white rounded-2xl border border-slate-200 shadow-sm p-8",
  formLabel: "block text-sm font-semibold text-slate-700 mb-1.5",
  formInput:
    "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
  formTextarea:
    "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y",
  formFooter: "flex items-center justify-end gap-3",
  formCancelBtn:
    "flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all",
  formSubmitBtn:
    "flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-sm",
  formError: "text-red-500 text-xs mt-1",

  // Pagination
  paginationWrap: "flex items-center justify-between mt-6 px-2",
  paginationInfo: "text-sm text-slate-500 font-medium",
  paginationControls: "flex items-center gap-2",
  paginationBtnBase: "w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-all border",
  paginationBtnActive: "bg-blue-600 text-white border-blue-600 shadow-sm",
  paginationBtnInactive: "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:bg-slate-50",
  paginationBtnDisabled: "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed",
  paginationNavBase: "px-4 h-9 flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all border",

  // Grid layouts
  grid2: "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6",
  grid3: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6",
  grid4: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6",

  // Sidebar (admin)
  sidebar:
    "w-56 bg-white border-r border-slate-200 flex flex-col py-6 px-3 shrink-0 shadow-sm",
  sidebarTitle:
    "text-[11px] font-extrabold text-slate-800 tracking-widest uppercase px-5 mb-5",
  navItem:
    "flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-[#fc8314]/10 hover:text-[#fc8314] transition-all cursor-pointer mb-1 w-full",
  navItemActive:
    "flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold bg-[#fc8314] text-white shadow-md mb-1 w-full",
};

export default theme;