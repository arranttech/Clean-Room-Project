const standardDesign = {
	page: "min-h-screen bg-white px-4 py-6",

	top: "mx-auto max-w-5xl text-center mb-4",
	title: "text-2xl font-bold text-gray-950 tracking-tight",
	subtitle: "mt-2 text-base text-blue-600",

	cardWrap: "mx-auto mt-10 max-w-auto",
	card: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden",

	cardHeader: "px-8 pt-8 pb-4",
	cardHeaderTitle: "text-sm font-bold tracking-widest text-gray-900 uppercase",
	divider: "border-t border-slate-200",

	body: "px-8 py-8",

	sectionTitle: "text-sm font-bold tracking-widest text-gray-900 uppercase",
	sectionSpacer: "mt-10",
	sectionLine: "mt-6 border-t border-slate-200",

	grid3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
	grid2: "grid grid-cols-1 md:grid-cols-2 gap-6",
	grid4: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",

	field: "flex flex-col gap-2",
	label: "text-sm font-semibold text-slate-700",
	required: "text-red-500",

	select:
		"w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm " +
		"focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none",

	selectDisabled:
		"w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500",

	input:
		"w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm " +
		"focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none",

	inputDisabled:
		"w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-600",
	helperText: "text-xs text-slate-500",

	range: "mt-1 text-sm text-slate-600",
	rangeValue: "font-semibold text-blue-600",
	quickView: "mt-8 text-sm text-slate-700",
	footer: "flex justify-between items-center max-w-auto mt-10 mx-auto",
	backLink:
		"inline-flex items-center gap-3 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 shadow-lg",
	nextLink:
		"inline-flex items-center gap-3 bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-900 shadow-lg",

	unitRow: "mt-6 flex flex-wrap items-center gap-4",
	unitLabel: "text-sm font-semibold text-slate-700",
	unitGroup: "flex items-center gap-3",
	unitOption:
		"inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 " +
		"text-sm text-slate-700 hover:bg-slate-200 transition",
	unitRadio: "h-4 w-4 accent-blue-600",
	unitHint: "text-xs text-slate-500",
	tempHelper: "mt-3 text-xs text-slate-500",
	disabled: "opacity-50 cursor-not-allowed pointer-events-none",

	flowBlock: "mt-8",
	flowLabelRow: "flex items-center justify-between",
	flowTitle: "text-sm font-semibold text-slate-700",
	flowUnit: "text-xs font-semibold text-slate-500",

	flowRow:
		"mt-3 flex flex-wrap items-center gap-4 border-b border-slate-200 pb-4",
	flowMin: "text-xs text-slate-500 w-12",
	flowMax: "text-xs text-slate-500 w-12 text-right",
	flowSlider: "flex-1 min-w-[240px] accent-blue-600",
	flowValueBoxWrap: "flex items-center",
	flowValueBox:
		"w-20 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm " +
		"focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none",
	flowUnitSmall: "text-xs text-slate-600",
	flowHint: "mt-2 text-xs text-slate-500",

	/* ---------- Dual Flow Velocity (Heating + Cooling) ---------- */
	dualFlowBlock: "mt-8",
	dualFlowGrid: "grid grid-cols-1 md:grid-cols-2 gap-6",

	dualFlowCard: "rounded-xl border border-slate-200 bg-slate-50 p-4",

	dualFlowTitle: "text-sm font-semibold text-slate-700 mb-3",

	dualFlowRow: "flex items-center gap-3",

	dualFlowMin: "text-xs text-slate-500 w-10",

	dualFlowMax: "text-xs text-slate-500 w-10 text-right",

	dualFlowSlider: "flex-1 accent-blue-600 min-w-[140px]",

	dualFlowValueBox:
		"w-16 rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm " +
		"focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none",

	dualFlowUnit: "text-xs text-slate-600",
};

export default standardDesign;