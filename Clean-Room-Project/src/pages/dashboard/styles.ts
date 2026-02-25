const dashboardDesign = {
  /* page */
  page: "min-h-screen bg-slate-50",

  header: "w-full bg-white border-b border-slate-200 shadow-sm",
  headerInner: "mx-auto max-w-7xl px-30 h-20 flex items-center",

  // Left area
  left: "flex items-center gap-4 flex-1",
  logoTile: "h-12 w-12 rounded-2xl flex items-center justify-center shadow",
  logoImg: "h-15 w-15 object-contain",
  brand: "text-xs tracking-[0.22em] font-bold text-slate-700 leading-tight",

  // Center title
  center: "flex-1 text-center",
  title1: "text-lg font-extrabold text-blue-600 leading-tight",
  subtitle1: "text-sm font-bold text-slate-700",

  // Right area (logout)
  right: "flex-1 flex justify-end items-center",
  logout:
    "inline-flex items-center gap-2 text-slate-700 text-[16px] font-medium px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition",

  /* body spacing */
  contentWrap: "pt-16 pb-10 px-4",
  container: "mx-auto max-w-7xl",

  /* welcome */
  headerWrap: "mb-5",
  title2: "text-3xl font-extrabold text-slate-900",
  subtitle2: "mb-10 text-m text-slate-500",

  /* metrics */
  metricsRow: "mt-6 grid grid-cols-1 gap-6 md:grid-cols-3",
  metricCard:
    "bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4 md:col-span-1",
  metricIconWrap: "h-11 w-11 rounded-xl flex items-center justify-center",
  metricNumber: "text-2xl font-extrabold text-slate-900 leading-none",
  metricLabel: "mt-0.5 text-sm text-slate-500",

  /* section */
  sectionCard: "mt-7 bg-white rounded-xl border border-slate-200 shadow-sm p-6",
  sectionTitle: "text-lg font-bold text-slate-900",

  /* Pending projects */
  cardWrap: "flex flex-row border border-slate-200 rounded-xl p-6 mt-5 items-center",
  cardHeader: "flex items-center justify-between gap-4 flex-wrap",
  projectTitle: "text-[19px] font-bold text-black",
  pendingProjects: "text-[14px] text-gray-700 font-semibold mr-5",
  projectCustomer: "mt-1 text-[17px] text-gray-500 font-semibold",
  cardStyle: "flex flex-col md:flex-row md:items-center gap-6 mt-3",
  projectPendingStage: "text-[16px] text-blue-700 font-bold bg-blue-200 inline-block px-3 py-1 rounded-[5px] font-semibold px-4",
  projectPendingPage: "text-[17px] text-gray-500 font-semibold",
  projectModifiedDate: "text-[14px] text-gray-500 font-medium mt-1",
  buttonStyle: "ml-auto mt-5 items-center",
  viewAllButton: "bg-blue-700 text-white px-6 py-[12px] rounded-xl hover:bg-blue-800 shadow-sm text-[17px] font-medium flex flex-row gap-4 items-center",

  /* quick actions */
  quickGrid: "mt-5 grid grid-cols-1 gap-6 md:grid-cols-3",
  actionLink: "block",
  actionCardBase:
    "rounded-xl border border-slate-200 p-5 flex gap-4 items-start transition shadow-sm hover:shadow-md bg-white",
  actionCardHover:
    "hover:bg-blue-50 hover:border-blue-600 hover:ring-1 hover:ring-blue-600",
  actionIconWrap:
    "h-10 w-10 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0",
  actionTitle: "text-base font-bold text-slate-900",
  actionDesc: "mt-1 text-sm text-slate-600 leading-relaxed",
  actionHint: "mt-3 text-sm font-semibold text-blue-700",

  /* platform features */
  featuresCard: "mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6",
  featuresTitle: "text-[18px] font-bold text-slate-900",
  featuresGrid: "mt-5 grid grid-cols-1 gap-5 md:grid-cols-3",
  featureItem: "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm",
  featureIconWrap:
    "h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center",
  featureTitle: "mt-5 text-[18px] font-bold text-slate-900",
  featureDesc: "mt-2 text-[14px] text-slate-600 leading-relaxed",
  featureList: "mt-4 space-y-2 text-[14px] text-slate-600",
  featureBullet: "flex items-start gap-2",

 /* Company Profile Required Popup */
 popupOverlay: "fixed inset-0 flex items-center justify-center z-50",
 popupBackdrop: "absolute inset-0 bg-black/30 backdrop-blur-sm",
 popupCard: "relative bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full mx-4",
 popupHeader: "flex items-center gap-4 mb-6",
 popupIconWrap: "w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center shrink-0",
 popupIcon: "text-yellow-500 text-3xl",
 popupTitle: "text-2xl font-bold text-gray-900",
 popupDesc: "text-base text-gray-500 mb-6",
 popupInfoBox: "bg-blue-50 border border-blue-100 rounded-xl px-6 py-5 mb-8",
 popupInfoTitle: "text-base font-semibold text-blue-700 mb-3",
 popupInfoList: "space-y-2",
 popupInfoItem: "text-base text-blue-600",
 popupFooter: "flex gap-4",
 popupCancelBtn: "flex-1 px-4 py-4 border border-gray-300 rounded-2xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors",
 popupConfirmBtn: "flex-1 px-4 py-4 bg-blue-600 text-white text-sm font-semibold rounded-2xl hover:bg-blue-700 transition-colors",

  /* all projects page */
  container1: "mx-auto",
  listTopRow: "pt-6 flex items-center justify-between gap-4 flex-wrap",
  backBtn:
    "inline-flex items-center gap-2 border border-slate-300 px-4 py-2 rounded-xl hover:bg-slate-100 shadow-sm bg-white text-[14px] font-medium",
  listTitleWrap:
    "w-full flex flex-col items-center justify-center gap-2 text-center",
  listTitle: "text-2xl md:text-3xl font-extrabold text-slate-900 text-center -mt-12",
  badge:
    "inline-flex items-center rounded-full bg-slate-100 text-slate-700 px-3 py-1 text-[13px] font-semibold",
  projectsWrap: "mt-6 space-y-5",
  projectCard: "bg-white rounded-2xl border border-slate-200 shadow-sm p-6",
  projectHeaderRow: "flex items-start justify-between gap-4 flex-wrap",
  projectName: "text-[18px] font-extrabold text-slate-900",
  meta: "mt-1 text-[13px] text-slate-500",
  infoGrid: "mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
  kv: "rounded-xl border border-slate-200 p-4 bg-white",
  k: "text-[11px] font-bold tracking-widest text-slate-500 uppercase",
  v: "mt-1 text-[14px] font-semibold text-slate-900",
  cardActions: "mt-6 flex gap-3 flex-wrap",
  primaryBtn:
    "inline-flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-xl hover:bg-blue-800 shadow-sm text-[14px] font-medium",
  secondaryBtn:
    "inline-flex items-center gap-2 border border-slate-300 px-4 py-2 rounded-xl hover:bg-slate-100 shadow-sm bg-white text-[14px] font-medium",
  backBtn1:
    "mt-10 inline-flex items-center gap-2 border border-slate-300 px-4 py-2 rounded-xl hover:bg-slate-100 shadow-sm bg-white text-[14px] font-medium",
};

export default dashboardDesign;