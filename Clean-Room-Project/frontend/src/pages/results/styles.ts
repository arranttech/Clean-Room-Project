const resultsDesign = {
  wrap: "min-h-screen bg-white px-4 py-10",

  card: "mx-auto max-w-7xl bg-white rounded-2xl border border-slate-200 shadow-sm p-6",

  headerSection: "mb-6",
  title: "text-2xl font-bold text-gray-950 text-center tracking-tight",
  subtitle: "mt-2 text-center text-blue-600",

  tableOuter: "mt-8 rounded-2xl border border-slate-200 overflow-hidden bg-white",
  tableScroll:
    "w-full overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100",
  table: "w-full border-separate border-spacing-0 min-w-[1700px]",

  thead: "bg-slate-50",
  th:
    "px-5 py-4 text-sm font-semibold text-slate-900 text-left " +
    "border-b border-r border-slate-200 whitespace-nowrap align-middle",
  thRoom:
    "sticky left-0 z-40 bg-slate-50 px-6 py-4 text-base font-extrabold text-blue-600 text-left " +
    "border-b border-r border-slate-200 whitespace-nowrap align-middle",

  headerSubTitle:
    "sticky left-0 z-40 px-6 py-4 font-semibold text-indigo-900 text-2xl",

  tr: "bg-white",

  td:
    "px-5 py-4 text-sm text-slate-900 bg-white " +
    "border-b border-r border-slate-200 whitespace-nowrap align-middle",

  tdRoom:
    "sticky left-0 z-30 bg-white px-6 py-4 text-base font-semibold text-slate-900 " +
    "border-b border-r border-slate-200 whitespace-nowrap align-middle",

  emptyRow:
    "px-6 py-8 text-center text-slate-500 bg-white border-b border-slate-200",

  // Footer — "Want to add another project?" title + Go Back Home button
  footer: "mt-10 flex flex-col items-center gap-3",
  footerTitle: "text-sm text-slate-500",
  goHomeBtn:
    "inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white " +
    "font-semibold px-8 py-3 rounded-xl shadow-md transition-colors",
};

export default resultsDesign;