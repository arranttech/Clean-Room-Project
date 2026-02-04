const roomDesign = {
  page: "min-h-screen bg-slate-50 px-4 py-10",
  headerWrap: "mx-auto max-w-5xl text-center mb-8",
  headerIconWrap:
    "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-md",
  headerTitle: "text-4xl font-extrabold text-slate-900",
  headerSubtitle: "mt-2 text-base text-slate-500",

  cardWrap: "mx-auto max-w-7xl",
  card: "mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden",
  cardInner: "px-8 py-8",

  sectionTitle: "mt-6 text-xm font-bold tracking-widest text-slate-500 uppercase",
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

  // footer: "flex justify-between mt-10 max-w-5xl mx-auto",

  // backBtn:
  //   "inline-flex items-center gap-3 border border-gray-300 px-5 py-3 rounded-xl hover:bg-gray-100 shadow-lg",

  // saveBtn:
  //   "inline-flex items-center gap-3 bg-blue-800 text-white px-6 py-3 rounded-xl hover:bg-blue-900 shadow-lg",
  footer: "flex justify-between max-w-7xl  mt-10 mx-auto",
  backBtn:
    "inline-flex items-center gap-3 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 shadow-lg",
  saveBtn:
    "inline-flex items-center gap-3 bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-900 shadow-lg",
  clrBtn:
  "inline-flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 shadow-sm",

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
  label1: "text-sm font-semibold text-slate-700 mb-2 ml-1 ",
  acphInput:
    " p-[13px] border border-gray-300 rounded-lg w-full h-18  focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 ",
  acphWrap: "flex flex-col items-start justify-start mt-7 ",
};

export default roomDesign;

