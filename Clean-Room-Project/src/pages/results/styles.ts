const resultsDesign = {
  wrap: "min-h-screen bg-slate-50 px-4 py-10",

  card:
    "mx-auto max-w-7xl bg-white rounded-2xl border border-slate-200 shadow-sm p-6",

  headerSection: "mb-6",
  title: "text-2xl font-bold text-slate-900 text-center",
  subtitle: "mt-2 text-center text-slate-500",

  tableOuter:
    "mt-8 rounded-2xl border border-slate-200 overflow-hidden bg-white",
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

  headerSubTitle: "sticky left-0 z-40 px-6 py-4 font-semibold text-indigo-900 text-2xl",
 
  tr: "bg-white",


  td:
    "px-5 py-4 text-sm text-slate-900 bg-white " +
    "border-b border-r border-slate-200 whitespace-nowrap align-middle",


  tdRoom:
    "sticky left-0 z-30 bg-white px-6 py-4 text-base font-semibold text-slate-900 " +
    "border-b border-r border-slate-200 whitespace-nowrap align-middle",

  emptyRow:
    "px-6 py-8 text-center text-slate-500 bg-white border-b border-slate-200",

  footer: "mt-8 flex justify-center",
  backLink:
    "inline-flex items-center gap-3 border border-gray-300 px-5 py-3 rounded-xl hover:bg-gray-100 shadow-lg",
};

export default resultsDesign;