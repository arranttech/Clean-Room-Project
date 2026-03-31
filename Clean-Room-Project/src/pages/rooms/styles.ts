const roomDesign = {
  page: "min-h-screen bg-white px-3 sm:px-4 py-4 sm:py-6",
  headerWrap: "mx-auto max-w-5xl text-center mb-4",
  headerIconWrap:
    "mx-auto mb-2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-md",
  headerTitle: "text-xl sm:text-2xl font-bold text-gray-950 tracking-tight",
  headerSubtitle: "mt-2 text-sm sm:text-base text-blue-600",

  cardWrap: "mx-auto max-w-auto",
  card: "mt-4 sm:mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden",
  cardInner: "px-4 sm:px-8 py-6 sm:py-8",

  sectionTitle:
    "mt-4 sm:mt-6 text-xs sm:text-sm font-bold tracking-widest text-gray-900 uppercase",
  sectionDivider: "mt-3 sm:mt-4 border-t border-slate-300",

  grid2: "mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6",
  grid3: "mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6",

  field: "flex flex-col gap-2",
  labelRow: "flex items-center gap-2",
  label: "text-xs sm:text-sm font-semibold text-slate-700",
  required: "text-red-500 ml-[-87%]",
  required1: "text-red-500",

  inputDisabled:
    "w-full rounded-xl border border-slate-200 bg-slate-100 px-3 sm:px-4 py-2.5 sm:py-3 text-sm " +
    "focus:outline-none cursor-not-allowed",
  input:
    "w-full rounded-xl border border-slate-300 bg-white px-3 sm:px-4 py-2.5 sm:py-3 text-sm " +
    "focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none",

  topActions: "flex justify-end mb-4",

  footer: "flex flex-wrap justify-between gap-3 max-w-auto mt-6 sm:mt-10 mx-auto",
  backBtn:
    "inline-flex items-center gap-2 sm:gap-3 border border-gray-300 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-100 shadow-lg text-xs sm:text-sm",
  saveBtn:
    "inline-flex items-center gap-2 sm:gap-3 bg-blue-800 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-900 shadow-lg text-xs sm:text-sm",
  clrBtn:
    "inline-flex items-center gap-2 border border-gray-300 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-100 shadow-sm text-xs sm:text-sm",
  zoneBtn:
    "inline-flex items-center bg-blue-800 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-900 shadow-lg gap-2 text-xs sm:text-sm",

  bottomActionsRow: "flex gap-3 justify-end mt-4 sm:mt-6",
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
  editBTN:"text-slate-600 hover:text-blue-900 hover:bg-orange-400 hover:p-[5px] rounded-[5px] border-0 ml-[93%]",

  emptyWrap:
    "py-10 sm:py-14 flex flex-col items-center justify-center text-center",
  emptyIconBox:
    "mb-4 sm:mb-6 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-slate-100 border border-slate-200",
  emptyIcon: "text-slate-400 text-2xl sm:text-3xl",
  emptyTitle: "text-lg sm:text-xl font-extrabold text-slate-900",
  emptySubtitle: "mt-2 text-sm sm:text-base text-slate-500",
  label1: "text-xs sm:text-sm font-semibold text-slate-700 mb-2 ml-1",

  select:
    "w-full rounded-xl border border-slate-300 bg-white px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none",
  selectDisabled:
    "w-full rounded-xl border border-slate-200 bg-slate-100 px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:outline-none cursor-not-allowed",

  acphBanner:
    "mt-4 sm:mt-6 rounded-xl bg-blue-50 border border-blue-200 p-3 sm:p-4 text-xs sm:text-sm text-blue-700",
  bannerTitle: "font-bold text-blue-900",
  bannerText:
    "font-bold text-blue-500 ml-auto bg-blue-100 px-2 sm:px-3 py-1 rounded-lg text-xs",
  bannerValue: "font-mono text-blue-600",
  acphBannerStyle: "flex flex-row gap-2",
  range: "font-mono text-blue-600",

  deviationBox:
    "flex items-center gap-2 border border-gray-200 rounded-lg px-2 sm:px-3 py-2",
  deviationValue: "font-mono text-blue-600",
  deviationBtn:
    "px-3 sm:px-6 rounded-lg text-gray-500 hover:bg-gray-100 text-sm",
  deviationInput:
    "w-full sm:w-80 text-center bg-white px-2 py-1 text-sm outline-none focus:outline-none border-none focus:ring-0",
  rangeText: "text-xs sm:text-sm text-slate-500 mt-1",

  popupOverlay:
    "fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4",
  popupCard:
    "bg-white rounded-2xl shadow-2xl p-5 sm:p-8 max-w-md w-full mx-auto",
  popupIconWrap:
    "w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0",
  popupIconText: "text-amber-500 text-xl sm:text-2xl font-bold",
  popupHeader: "flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4",
  popupTitle: "text-lg sm:text-xl font-bold text-gray-900",
  popupDescription: "text-gray-500 mb-3 sm:mb-4 text-sm",
  popupList: "mb-4 sm:mb-5 space-y-2",
  popupListItem: "flex items-start gap-2 text-gray-700 text-sm",
  popupBullet: "mt-1.5 w-2 h-2 rounded-full bg-amber-400 shrink-0",
  popupTipBox: "bg-blue-50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 mb-4 sm:mb-6",
  popupTipText: "text-blue-700 text-xs sm:text-sm",
  popupFooter: "flex justify-end",
  popupBtn:
    "bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl transition-colors text-sm",

  toggleContainer:
    "flex items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6",
  toggleBtn:
    "px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-sm border",
  toggleBtnActive: "bg-blue-600 text-white border-blue-600",
  toggleBtnInactive:
    "bg-white text-gray-600 border-gray-200 hover:bg-gray-50",

  tableContainer:
    "mt-4 sm:mt-8 overflow-x-auto rounded-xl border border-slate-200",
  entryTable: "w-full text-left border-collapse",
  tableHead: "bg-slate-50 border-b border-slate-200",
  tableTh:
    "px-2 sm:px-4 py-2.5 sm:py-3 text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider text-center whitespace-nowrap",
  tableTr:
    "border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors",
  tableTd:
    "px-1 sm:px-2 py-3 sm:py-4 text-xs sm:text-sm text-slate-600 align-middle text-center",
  tableInput:
    "w-full min-w-[50px] sm:min-w-[60px] rounded-lg border border-slate-300 px-1.5 sm:px-2 py-1.5 sm:py-2 text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none text-center",
  tableActionBtn:
    "p-1.5 sm:p-2 rounded-lg transition-colors inline-flex items-center justify-center",
  editBtn:
    "text-blue-600 hover:bg-blue-50 border border-blue-200 px-2 sm:px-3 py-1 sm:py-1.5 gap-1 sm:gap-2 text-xs",
  tableTitle: "text-base sm:text-lg font-bold text-slate-800",
  tableHeaderRow: "flex items-center justify-between mb-3 sm:mb-4 px-2",
  tableSubtitle: "text-xs sm:text-sm text-slate-500",

  tableSelect:
    "w-full rounded-lg border border-slate-300 bg-white px-1.5 sm:px-2 py-1.5 sm:py-2 text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none h-auto min-w-[70px] sm:min-w-[80px]",
  tableSelectDisabled:
    "w-full rounded-lg border border-slate-200 bg-slate-100 px-1.5 sm:px-2 py-1.5 sm:py-2 text-xs sm:text-sm outline-none cursor-not-allowed h-auto min-w-[70px] sm:min-w-[80px]",

  tableFooterNoteRow:
    "p-3 sm:p-4 bg-slate-50 flex items-center justify-between border-t border-slate-200",
  tableFooterNoteText: "text-xs text-slate-400",

  roomCardHeader: "flex items-start justify-between gap-3 sm:gap-4",
  footerActions: "flex gap-2 sm:gap-4",

  deletePopupIconWrap:
    "w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0",
  deletePopupIcon: "text-red-500 text-base sm:text-lg",

  popupFooterRow: "flex justify-end gap-2 sm:gap-3",
  popupCancelBtn:
    "inline-flex items-center justify-center gap-2 border border-gray-300 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-gray-50 text-gray-700 font-semibold transition-colors shadow-sm text-xs sm:text-sm",
  popupConfirmDeleteBtn:
    "inline-flex items-center justify-center gap-2 bg-red-500 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-red-600 font-semibold transition-colors shadow-sm text-xs sm:text-sm",
};

export default roomDesign;