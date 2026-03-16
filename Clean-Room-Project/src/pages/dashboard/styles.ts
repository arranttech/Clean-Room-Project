const dashboardDesign = {
  /* page */
  page: "min-h-screen bg-slate-50",

  /* body */
  contentWrap: "pt-10 pb-10 px-4",
  container: "px-10 mx-auto max-w-auto",
  headerWrap: "mb-6",
  title2: "text-3xl font-extrabold text-slate-900",
  subtitle2: "mt-1 text-sm text-slate-500",

  /* metrics */
  metricsRow: "mt-6 grid grid-cols-2 gap-4 md:grid-cols-4",
  metricCard:
    "bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4",
  metricIconWrap:
    "h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0",
  metricNumber: "text-2xl font-extrabold leading-none",
  metricLabel: "mt-0.5 text-sm text-slate-500",
  sectionCard: "mt-6 bg-white rounded-xl border border-slate-200 shadow-sm p-6",
  sectionTitle: "text-lg font-bold text-slate-900",
  cardWrap:
    "flex flex-row border border-slate-200 rounded-xl p-6 mt-5 items-center",
  cardHeader: "flex items-center justify-between gap-4 flex-wrap",
  projectTitle: "text-[19px] font-bold text-black",
  pendingProjects: "text-[14px] text-gray-700 font-semibold mr-5",
  projectCustomer: "mt-1 text-[17px] text-gray-500 font-semibold",
  cardStyle: "flex flex-col md:flex-row md:items-center gap-6 mt-3",
  projectPendingStage:
    "text-[16px] text-blue-700 font-bold bg-blue-100 inline-block px-3 py-1 rounded-[5px]",
  projectPendingPage: "text-[17px] text-gray-500 font-semibold",
  projectModifiedDate: "text-[14px] text-gray-500 font-medium mt-1",
  buttonStyle: "ml-auto mt-5 items-center",
  viewAllButton:
    "bg-blue-700 text-white px-6 py-[12px] rounded-xl hover:bg-blue-800 shadow-sm text-[17px] font-medium flex flex-row gap-4 items-center",
  quickGrid: "mt-5 grid grid-cols-1 gap-6 md:grid-cols-3",
  actionCardBase:
    "rounded-xl border border-slate-200 p-5 flex gap-4 items-start transition shadow-sm hover:shadow-md bg-white",
  actionCardHover:
    "hover:bg-blue-50 hover:border-blue-600 hover:ring-1 hover:ring-blue-600",
  actionIconWrap:
    "h-10 w-10 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0",
  actionTitle: "text-base font-bold text-slate-900",
  actionDesc: "mt-1 text-sm text-slate-600 leading-relaxed",
  actionHint: "mt-3 text-sm font-semibold text-blue-700",
  featuresCard:
    "mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6",
  featuresTitle: "text-[18px] font-bold text-slate-900",
  featuresGrid: "mt-5 grid grid-cols-1 gap-5 md:grid-cols-3",
  featureItem: "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm",
  featureIconWrap:
    "h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center",
  featureTitle: "mt-5 text-[18px] font-bold text-slate-900",
  featureDesc: "mt-2 text-[14px] text-slate-600 leading-relaxed",
  featureList: "mt-4 space-y-2 text-[14px] text-slate-600",
  featureBullet: "flex items-start gap-2",
  popupOverlay: "fixed inset-0 flex items-center justify-center z-50",
  popupBackdrop: "absolute inset-0 bg-black/30 backdrop-blur-sm",
  popupCard:
    "relative bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full mx-4",
  popupHeader: "flex items-center gap-4 mb-6",
  popupIconWrap:
    "w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center shrink-0",
  popupIcon: "text-yellow-500 text-3xl",
  popupTitle: "text-2xl font-bold text-gray-900",
  popupDesc: "text-base text-gray-500 mb-6",
  popupInfoBox: "bg-blue-50 border border-blue-100 rounded-xl px-6 py-5 mb-8",
  popupInfoTitle: "text-base font-semibold text-blue-700 mb-3",
  popupInfoList: "space-y-2",
  popupInfoItem: "text-base text-blue-600",
  popupFooter: "flex gap-4",
  popupCancelBtn:
    "flex-1 px-4 py-4 border border-gray-300 rounded-2xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors",
  popupConfirmBtn:
    "flex-1 px-4 py-4 bg-blue-600 text-white text-sm font-semibold rounded-2xl hover:bg-blue-700 transition-colors",

  /* ── AllProjects page ── */
  container1: "mx-auto max-w-7xl px-8 pb-16",

  // title row
  titleRow: "relative flex items-center pt-8 mb-8",
  listTitle: "text-2xl md:text-3xl font-extrabold text-slate-900 mx-auto",
  countBadge:
    "absolute right-0 inline-flex items-center rounded-full border border-green-600 bg-green-50 shadow-sm px-4 py-1.5 text-[13px] font-semibold text-green-700",

  // empty / loading states
  stateWrap: "mt-24 flex flex-col items-center gap-4 text-center",
  stateTitle: "text-[17px] font-bold text-slate-900",
  stateDesc: "text-sm text-slate-500 max-w-sm leading-relaxed",
  errorText: "mt-16 text-center text-red-400 text-sm",
  emptyIconWrap:
    "h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center",

  // cards list — each card is white with blue border + subtle shadow
  cardsList: "mt-2 flex flex-col gap-6",

  projectCard:
    "bg-white rounded-2xl border border-blue-200 shadow-md hover:shadow-lg transition-shadow px-10 py-8",
  // card header
  projectHeaderRow: "flex items-start justify-between gap-4",
  cardLeft: "flex flex-col",
  nameBadgeRow: "flex items-center gap-3 flex-wrap",
  projectName: "text-[20px] font-bold text-slate-900 leading-tight",
  // green completed badge
  badgeCompleted:
    "inline-flex items-center rounded-full bg-green-100 text-green-700 border border-green-200 px-4 py-1 text-[13px] font-medium",

  metaId: "text-[13px] text-slate-500 mt-2 font-medium",
  metaDate: "text-[13px] text-slate-500 mt-0.5 font-medium",

  // buttons
  btnGroup: "flex items-center gap-3 flex-shrink-0",
  primaryBtn:
    "inline-flex items-center gap-2 bg-blue-700 text-white px-5 py-2.5 rounded-xl hover:bg-blue-800 shadow-sm text-[14px] font-semibold transition-colors",
  secondaryBtn:
    "inline-flex items-center gap-2 border border-slate-300 bg-white text-slate-700 px-5 py-2.5 rounded-xl hover:bg-slate-50 shadow-sm text-[14px] font-semibold transition-colors",

  // divider
  divider: "mt-6 border-t border-slate-300",
  infoGrid: "mt-6 grid grid-cols-4 gap-x-6",
  kvWrap: "flex items-start gap-3 min-w-0 min-h-[80px]",
  kvValue:
    "text-[15px] font-bold text-slate-900 mt-0.5 break-words line-clamp-3",
  kvIcon: "mt-0.5 text-blue-600 text-[20px] flex-shrink-0",
  kvBody: "flex flex-col",
  kvLabel: "text-[12px] font-semibold text-blue-500 uppercase tracking-wide",

  // back button — centered
  backBtn1:
    "mt-10 inline-flex items-center gap-2 border border-slate-300 px-5 py-2.5 rounded-xl hover:bg-slate-100 shadow-sm bg-white text-[14px] font-medium transition-colors",
};

export default dashboardDesign;
