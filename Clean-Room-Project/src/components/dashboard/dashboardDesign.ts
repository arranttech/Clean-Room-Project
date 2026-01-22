const dashboardDesign = {
  // Page
  page: "min-h-screen bg-slate-50",

  // Top bar
  header: "w-full bg-white border-b border-slate-200 shadow-sm",
  headerInner: "mx-auto max-w-7xl px-30 h-20 flex items-center",

  // Left area 
  left: "flex items-center gap-4 flex-1",
  logoTile: "h-12 w-12 rounded-2xl flex items-center justify-center shadow",
  logoImg: "h-15 w-15 object-contain",
  brand: "text-xs tracking-[0.22em] font-bold text-slate-700 leading-tight",

  // Center title
  center: "flex-1 text-center",
  title: "text-lg font-extrabold text-blue-600 leading-tight",
  subtitle: "text-sm font-bold text-slate-700",

  // Right area (logout)
  right: "flex-1 flex justify-end items-center",

  logout:
    "inline-flex items-center gap-2 text-slate-700 text-[16px] font-medium px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition",

  // Body
  main: "mx-auto max-w-7xl px-6",
  mainInner: "min-h-[calc(100vh-64px)] flex items-center justify-center",

  // Card
  card: "w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-md px-10 py-10 text-center",
  welcome: "text-4xl font-extrabold text-slate-900",
  welcomeSub: "mt-4 text-lg text-slate-600",

  // Button
  buttonRow: "mt-8 flex justify-center",
  primaryButton:
    "inline-flex items-center gap-3 rounded-xl bg-blue-700 px-8 py-3.5 text-white font-semibold shadow hover:bg-blue-800 active:bg-blue-900",
  plus: "inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-white text-xl leading-none",

  // Footer
  footerNote: "mt-8 text-sm text-slate-500",
};

export default dashboardDesign;
