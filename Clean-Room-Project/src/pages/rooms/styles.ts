import theme from "../../styles/theme";

const roomDesign = {
  page: `${theme.pageWrapperWhite} px-3 sm:px-4 py-4 sm:py-6`,
  headerWrap: `mx-auto ${theme.contentMaxWidth5xl} text-center mb-4`,
  headerIconWrap:
    `mx-auto mb-2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center ${theme.roundLg} bg-${theme.primary} ${theme.shadowMd}`,
  headerTitle: theme.h1,
  headerSubtitle: `mt-2 text-sm sm:text-base text-${theme.primaryText}`,

  cardWrap: `mx-auto w-full`,
  card: `mt-4 sm:mt-6 bg-white ${theme.roundLg} border border-${theme.borderColor} ${theme.shadowSm} overflow-hidden`,
  cardInner: `px-4 sm:px-8 py-6 sm:py-8`,

  sectionTitle:
    `mt-4 sm:mt-6 text-xs sm:text-sm ${theme.weightBold} ${theme.trackingWidest} text-${theme.textPrimary} uppercase`,
  sectionDivider: `mt-3 sm:mt-4 border-t border-${theme.borderStrong}`,

  grid2: `mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6`,
  grid3: `mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6`,
  grid4: "grid grid-cols-1 md:grid-cols-4 gap-6",

  field: `flex flex-col gap-2`,
  labelRow: `flex items-center gap-2`,
  label: theme.labelBold,
  required: `text-${theme.error} ml-[-87%]`,
  required1: `text-${theme.error}`,

  inputDisabled: theme.inputDisabled,
  input: theme.input,

  topActions: `flex justify-end mb-4`,

  footer: `flex flex-wrap justify-between gap-3 w-full mt-6 sm:mt-10 mx-auto`,
  backBtn: theme.btnSecondary,
  saveBtn: theme.btnPrimary,
  clrBtn: theme.btnSecondary,
  zoneBtn: theme.btnPrimary,

  bottomActionsRow: `flex gap-3 justify-end mt-4 sm:mt-6`,
  clearBtn:
    "inline-flex items-center gap-2 bg-white text-gray-700 border border-gray-300 px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-50 shadow-lg text-xs sm:text-sm",
  clearBtnIcon: "mr-1.5 rotate-[180deg]",
  saveBtnDisabled: "opacity-80 cursor-not-allowed",
  saveBtnIcon: "ml-1.5",

  roomsList: "mt-4 sm:mt-6 flex flex-col gap-3 sm:gap-4",
  roomCard: "rounded-xl border border-slate-200 bg-white p-3 sm:p-4",
  roomCardTitle: "mt-2 sm:mt-3 text-sm font-semibold text-slate-900",
  roomCardLine: "text-xs text-slate-600",

  savedHeaderRow: "flex items-center justify-between",
  savedHeaderTitle: "text-sm font-extrabold text-slate-700",
  savedHeaderCount: "text-xs text-slate-500",
  divider: "mt-3 sm:mt-4 border-t border-slate-200",
  emptyState: "text-center text-slate-500 py-6 sm:py-8 text-sm",
  deleteBtn: "text-slate-600 hover:text-red-700 hover:text-blue-900 hover:bg-orange-400 hover:p-[5px] rounded-[5px]",
  editBTN: "text-slate-600 hover:text-blue-900 hover:bg-orange-400 hover:p-[5px] rounded-[5px] border-0 ml-[93%]",

  emptyWrap:
    `py-10 sm:py-14 flex flex-col items-center justify-center text-center`,
  emptyIconBox:
    `mb-4 sm:mb-6 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center ${theme.roundLg} bg-slate-100 border border-${theme.borderColor}`,
  emptyIcon: `text-${theme.textDisabled} text-2xl sm:text-3xl`,
  emptyTitle: `text-lg sm:text-xl ${theme.weightXBold} text-${theme.textPrimary}`,
  emptySubtitle: `mt-2 text-sm sm:text-base text-${theme.textMuted}`,
  label1: `text-xs sm:text-sm ${theme.weightSemibold} text-${theme.textSecondary} mb-2 ml-1`,

  select: theme.select,
  selectDisabled: theme.selectDisabled,

  acphBanner:
    `mt-4 sm:mt-6 ${theme.roundMd} bg-${theme.primaryLight} border border-${theme.primaryBorder} p-3 sm:p-4 text-xs sm:text-sm text-${theme.primaryText}`,
  bannerTitle: `${theme.weightBold} text-${theme.primaryText}`,
  bannerText:
    `${theme.weightBold} text-${theme.primaryText} ml-auto bg-${theme.primaryLight} px-2 sm:px-3 py-1 ${theme.roundSm} text-xs`,
  bannerValue: `font-mono text-${theme.primaryTextLight}`,
  acphBannerStyle: `flex flex-row gap-2`,
  range: `font-mono text-${theme.primaryTextLight}`,

  deviationBox:
    `flex items-center gap-2 border border-${theme.borderColor} ${theme.roundSm} px-2 sm:px-3 py-2`,
  deviationValue: `font-mono text-${theme.primaryTextLight}`,
  deviationBtn:
    `px-3 sm:px-6 ${theme.roundSm} text-${theme.textDisabled} hover:bg-slate-50 text-sm`,
  deviationInput:
    `w-full sm:w-80 text-center bg-white px-2 py-1 text-sm outline-none focus:outline-none border-none focus:ring-0`,
  rangeText: `text-xs sm:text-sm text-${theme.textMuted} mt-1`,

  tableDeviationBox:
    "w-[118px] h-[36px] flex items-center justify-between border border-slate-300 rounded-lg bg-white overflow-hidden px-1",

  tableDeviationBtn:
    "w-[40px] h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40",

  tableDeviationInput:
    "w-[60px] h-full text-center text-sm text-slate-700 outline-none border-0 bg-transparent",
  loaderOverlay:
    "fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm",

  loaderCard:
    "bg-white rounded-2xl shadow-2xl px-8 py-6 flex flex-col items-center gap-4",

  loaderSpinner:
    "h-12 w-12 rounded-full border-4 border-slate-300 border-t-blue-900 animate-spin",

  loaderContent: "text-center",

  loaderTitle:
    "text-lg font-semibold text-slate-800",

  loaderSubtitle:
    "text-sm text-slate-500 mt-1",


  popupOverlay: theme.modalOverlay,
  popupCard:
    `bg-white ${theme.roundLg} ${theme.shadow2xl} p-5 sm:p-8 max-w-md w-full mx-auto`,
  popupIconWrap:
    `w-10 h-10 sm:w-12 sm:h-12 ${theme.roundFull} bg-${theme.warningBg} flex items-center justify-center shrink-0`,
  popupIconText: `text-${theme.warning} text-xl sm:text-2xl ${theme.weightBold}`,
  popupHeader: `flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4`,
  popupTitle: `text-lg sm:text-xl ${theme.weightBold} text-gray-900`,
  popupDescription: `text-${theme.textMuted} mb-3 sm:mb-4 text-sm`,
  popupList: `mb-4 sm:mb-5 space-y-2`,
  popupListItem: `flex items-start gap-2 text-${theme.textSecondary} text-sm`,
  popupBullet: `mt-1.5 w-2 h-2 ${theme.roundFull} bg-${theme.warning} shrink-0`,
  popupTipBox: `bg-${theme.primaryLight} ${theme.roundMd} px-3 sm:px-4 py-2.5 sm:py-3 mb-4 sm:mb-6`,
  popupTipText: `text-${theme.primaryText} text-xs sm:text-sm`,
  popupFooter: `flex justify-end`,
  popupBtn:
    `bg-${theme.primary} hover:bg-${theme.primaryHover} text-white ${theme.weightSemibold} px-6 sm:px-8 py-2.5 sm:py-3 ${theme.roundMd} ${theme.transitionColors} text-sm`,

  toggleContainer:
    `flex items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6`,
  toggleBtn:
    `px-4 sm:px-6 py-1.5 sm:py-2 ${theme.roundFull} text-xs sm:text-sm ${theme.weightSemibold} ${theme.transition} ${theme.shadowSm} border`,
  toggleBtnActive: `bg-${theme.primary} text-white border-${theme.primary}`,
  toggleBtnInactive:
    `bg-white text-${theme.textSecondary} border-${theme.borderColor} hover:bg-slate-50`,

  tableContainer:
    `mt-4 sm:mt-8 overflow-x-auto ${theme.roundMd} border border-${theme.borderColor}`,
  entryTable: `w-full text-left border-collapse`,
  tableHead: `bg-slate-50 border-b border-${theme.borderColor}`,
  tableTh:
    `px-2 sm:px-4 py-2.5 sm:py-3 text-[10px] sm:text-xs ${theme.weightBold} text-${theme.textSecondary} uppercase tracking-wider text-center whitespace-nowrap`,
  tableTr:
    `border-b border-slate-100 last:border-0 hover:bg-slate-50/50 ${theme.transitionColors}`,
  tableTd:
    `px-1 sm:px-2 py-3 sm:py-4 text-xs sm:text-sm text-${theme.textSecondary} align-middle text-center`,
  tableInput:
    `w-full min-w-[50px] sm:min-w-[60px] ${theme.roundSm} border border-${theme.borderColor} px-1.5 sm:px-2 py-1.5 sm:py-2 text-xs sm:text-sm focus:border-${theme.primary} focus:ring-1 focus:ring-${theme.primaryLight} outline-none text-center`,
  tableActionBtn:
    `p-1.5 sm:p-2 ${theme.roundSm} ${theme.transitionColors} inline-flex items-center justify-center`,
  editBtn:
    `text-${theme.primaryText} hover:bg-${theme.primaryLight} border border-${theme.primaryBorder} px-2 sm:px-3 py-1 sm:py-1.5 gap-1 sm:gap-2 text-xs`,
  tableTitle: `text-base sm:text-lg ${theme.weightBold} text-${theme.textPrimary}`,
  tableHeaderRow: `flex items-center justify-between mb-3 sm:mb-4 px-2`,
  tableSubtitle: `text-xs sm:text-sm text-${theme.textMuted}`,

  tableSelect:
    `w-full ${theme.roundSm} border border-${theme.borderColor} bg-white px-1.5 sm:px-2 py-1.5 sm:py-2 text-xs sm:text-sm focus:border-${theme.primary} focus:ring-1 focus:ring-${theme.primaryLight} outline-none h-auto min-w-[70px] sm:min-w-[80px]`,
  tableSelectDisabled:
    `w-full ${theme.roundSm} border border-${theme.borderColor} bg-slate-100 px-1.5 sm:px-2 py-1.5 sm:py-2 text-xs sm:text-sm outline-none cursor-not-allowed h-auto min-w-[70px] sm:min-w-[80px]`,

  tableFooterNoteRow:
    `p-3 sm:p-4 bg-slate-50 flex items-center justify-between border-t border-${theme.borderColor}`,
  tableFooterNoteText: `text-xs text-${theme.textDisabled}`,

  roomCardHeader: `flex items-start justify-between gap-3 sm:gap-4`,
  footerActions: `flex gap-2 sm:gap-4`,

  deletePopupIconWrap:
    `w-10 h-10 sm:w-12 sm:h-12 ${theme.roundFull} bg-${theme.errorBg} flex items-center justify-center shrink-0`,
  deletePopupIcon: `text-${theme.error} text-base sm:text-lg`,

  popupFooterRow: `flex justify-end gap-2 sm:gap-3`,
  popupCancelBtn:
    `inline-flex items-center justify-center gap-2 border border-${theme.borderColor} px-4 sm:px-5 py-2 sm:py-2.5 ${theme.roundSm} hover:bg-slate-50 text-${theme.textSecondary} ${theme.weightSemibold} ${theme.transitionColors} ${theme.shadowSm} text-xs sm:text-sm`,
  popupConfirmDeleteBtn:
    `inline-flex items-center justify-center gap-2 bg-${theme.error} text-white px-4 sm:px-5 py-2 sm:py-2.5 ${theme.roundSm} hover:bg-red-600 ${theme.weightSemibold} ${theme.transitionColors} ${theme.shadowSm} text-xs sm:text-sm`,

};

export default roomDesign;
