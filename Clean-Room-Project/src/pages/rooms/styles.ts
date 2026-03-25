const roomDesign = {
  page: "min-h-screen bg-white px-4 py-6",
  headerWrap: "mx-auto max-w-5xl text-center mb-4",
  headerIconWrap:
    "mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-md",
  headerTitle: "text-2xl font-bold text-gray-950 tracking-tight",
  headerSubtitle: "mt-2 text-base text-blue-600",

  cardWrap: "mx-auto max-w-auto",
  card: "mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden",
  cardInner: "px-8 py-8",

  sectionTitle:
    "mt-6 text-sm font-bold tracking-widest text-gray-900 uppercase",
  sectionDivider: "mt-4 border-t border-slate-300",

  grid2: "mt-4 grid grid-cols-1 md:grid-cols-2 gap-6",
  grid3: "mt-4 grid grid-cols-1 md:grid-cols-3 gap-6",

  field: "flex flex-col gap-2",
  labelRow: "flex items-center gap-2",
  label: "text-sm font-semibold text-slate-700",
  required: "text-red-500 ml-[-87%]",
  required1: "text-red-500",

  inputDisabled:
    "w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm " +
    "focus:outline-none cursor-not-allowed",
  input:
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm " +
    "focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none",

  topActions: "flex justify-end mb-4",

  footer: "flex justify-between max-w-auto mt-10 mx-auto",
  backBtn:
    "inline-flex items-center gap-3 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 shadow-lg",
  saveBtn:
    "inline-flex items-center gap-3 bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-900 shadow-lg",
  clrBtn:
    "inline-flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 shadow-sm",
  zoneBtn:
    "inline-flex items-center bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-900 shadow-lg mr-auto gap-2 ml-5",

  // ── Bottom Actions ──
  bottomActionsRow: "flex gap-3 justify-end mt-6",
  clearBtn:
    "inline-flex items-center gap-2 bg-white text-gray-700 border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 shadow-lg",
  clearBtnIcon: "mr-1.5 rotate-[180deg]",
  saveBtnDisabled: "opacity-80 cursor-not-allowed",
  saveBtnIcon: "ml-1.5",

  roomsList: "mt-6 flex flex-col gap-4",
  roomCard: "rounded-xl border border-slate-200 bg-white p-4",
  roomCardTitle: "mt-3 text-xm font-semibold text-slate-900",
  roomCardLine: "text-xs text-slate-600",

  savedHeaderRow: "flex items-center justify-between",
  savedHeaderTitle: "text-xm font-extrabold text-slate-700",
  savedHeaderCount: "text-xs text-slate-500",
  divider: "mt-4 border-t border-slate-200",
  emptyState: "text-center text-slate-500 py-8",
  deleteBtn: "text-slate-600 hover:text-red-700",

  emptyWrap: "py-14 flex flex-col items-center justify-center text-center",
  emptyIconBox:
    "mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 border border-slate-200",
  emptyIcon: "text-slate-400 text-3xl",
  emptyTitle: "text-xl font-extrabold text-slate-900",
  emptySubtitle: "mt-2 text-base text-slate-500",
  label1: "text-sm font-semibold text-slate-700 mb-2 ml-1",

  select:
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none",
  selectDisabled:
    "w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm focus:outline-none cursor-not-allowed",

  acphBanner:
    "mt-6 rounded-xl bg-blue-50 border border-blue-200 p-4 text-sm text-blue-700",
  bannerTitle: "font-bold text-blue-900",
  bannerText:
    "font-bold text-blue-500 ml-auto bg-blue-100 px-3 py-1 rounded-lg",
  bannerValue: "font-mono text-blue-600",
  acphBannerStyle: "flex flex-row gap-2",
  range: "font-mono text-blue-600",

  deviationBox:
    "flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2",
  deviationValue: "font-mono text-blue-600",
  deviationBtn: "px-6 rounded-lg text-gray-500 hover:bg-gray-100",
  deviationInput:
    "w-80 text-center bg-white px-2 py-1 text-sm outline-none focus:outline-none border-none focus:ring-0",
  rangeText: "text-sm text-slate-500 mt-1",

  // ─── Missing Info Popup ───
  popupOverlay:
    "fixed inset-0 z-50 flex items-center justify-center bg-black/40",
  popupCard: "bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4",
  popupIconWrap:
    "w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0",
  popupIconText: "text-amber-500 text-2xl font-bold",
  popupHeader: "flex items-center gap-4 mb-4",
  popupTitle: "text-xl font-bold text-gray-900",
  popupDescription: "text-gray-500 mb-4",
  popupList: "mb-5 space-y-2",
  popupListItem: "flex items-start gap-2 text-gray-700",
  popupBullet: "mt-1.5 w-2 h-2 rounded-full bg-amber-400 shrink-0",
  popupTipBox: "bg-blue-50 rounded-xl px-4 py-3 mb-6",
  popupTipText: "text-blue-700 text-sm",
  popupFooter: "flex justify-end",
  popupBtn:
    "bg-blue-700 hover:bg-blue-800 text-white font-semibold px-8 py-3 rounded-xl transition-colors",
};

export default roomDesign;
