const roomDesign = {
  page: "min-h-screen bg-slate-50 px-4 py-10",

  headerWrap: "mx-auto max-w-5xl text-center mb-8",
  headerIconWrap:
    "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-md",
  headerTitle: "text-4xl font-extrabold text-slate-900",
  headerSubtitle: "mt-2 text-base text-slate-500",

  cardWrap: "mx-auto max-w-5xl",
  card: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden",

  cardInner: "px-8 py-8",

  sectionTitle:
    "mt-6 text-xm  font-bold tracking-widest text-slate-500 uppercase",
  sectionDivider: "mt-4 border-t border-slate-200",

  grid2: "mt-4 grid grid-cols-1 md:grid-cols-2 gap-6",
  grid3: "mt-4 grid grid-cols-1 md:grid-cols-3 gap-6",

  field: "flex flex-col gap-2",
  labelRow: "flex items-center gap-2",
  label: "text-sm font-semibold text-slate-700",
  required: "text-red-500",

  input:
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm " +
    "focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none",

  inputError:
    "w-full rounded-xl border border-red-400 bg-white px-4 py-3 text-sm " +
    "focus:border-red-500 focus:ring-2 focus:ring-red-100 focus:outline-none",

  helper: "text-xs text-slate-500",
  errorText: "text-xs text-red-600 font-medium",

  footer: "flex justify-between items-center  mt-10 max-w-5xl mx-auto",
  backBtn:
    "inline-flex items-center gap-3 border border-gray-300 px-5 py-3 rounded-xl hover:bg-gray-100 shadow-lg",
  saveBtn:
    "inline-flex items-center gap-3 bg-blue-800 text-white px-6 py-3 rounded-xl hover:bg-blue-900 shadow-lg",
};

export default roomDesign;
