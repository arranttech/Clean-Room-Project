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
  container: "mx-auto ",

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

  /* quick actions */
  quickGrid: "mt-5 grid grid-cols-1 gap-6 md:grid-cols-2",

  actionLink: "block",
  actionCardBase:
    "rounded-xl border border-slate-200 p-5 flex gap-4 items-start transition shadow-sm hover:shadow-md bg-white",
  actionCardHover:
    "hover:bg-blue-50 hover:border-blue-600 hover:ring-1 hover:ring-blue-600",

  actionIconWrap:
    "h-12 w-12 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0",
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

  /* all projects page */
  listTopRow: "pt-6 flex items-center justify-between gap-4 flex-wrap",
  backBtn:
    "inline-flex items-center gap-2 border border-slate-300 px-4 py-2 rounded-xl hover:bg-slate-100 shadow-sm bg-white text-[14px] font-medium",
  listTitleWrap:
    "w-full flex flex-col items-center justify-center gap-2 text-center",
  listTitle: "text-2xl md:text-3xl font-extrabold text-slate-900 text-center",

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
    "ml-2 mt-10 inline-flex items-center gap-2 border border-slate-300 px-4 py-2 rounded-xl hover:bg-slate-100 shadow-sm bg-white text-[14px] font-medium",
};

export default dashboardDesign;