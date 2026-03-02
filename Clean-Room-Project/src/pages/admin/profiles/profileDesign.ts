const profileDesign = {
	// ---  Header Styling ---
	panelHeader: "flex items-center justify-between mb-6",
	panelTitleWrap: "flex flex-col gap-1",
	panelTitle: "text-2xl font-bold text-slate-900 ml-4",
	panelSubtitle: "text-sm text-slate-500 ml-4",
	addBtn:
		"flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm",

	// --- Search Bar Styling ---
	searchWrap: "relative mb-5",
	searchIcon:
		"absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base",
	searchInput:
		"w-full border border-slate-200 rounded-xl bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm",

	// --- Table Styling ---
	tableWrap:
		"bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto",
	table: "min-w-max w-full",
	thead: "bg-white border-b border-slate-100",
	th: "px-5 py-4 text-left text-xs font-bold text-slate-700 tracking-wider",
	thActions:
		"px-5 py-4 text-right text-xs font-bold text-slate-700 tracking-wider",
	tbody: "divide-y divide-slate-100",
	tr: "hover:bg-slate-50/50 transition-colors",
	td: "px-5 py-4 text-sm text-slate-600",
	tdProfileName: "px-5 py-4 text-sm font-semibold text-slate-900",
	tdActions: "px-5 py-4 text-right flex justify-end gap-2 items-center",

	// --- Badges ---
	badgeActive:
		"px-2.5 py-1 text-[11px] font-bold rounded-md bg-green-100 text-green-700",
	badgeInProgress:
		"px-2.5 py-1 text-[11px] font-bold rounded-md bg-orange-100 text-orange-700",

	// --- Action Buttons Styling ---
	editBtn:
		"text-blue-500 hover:text-blue-700 transition-colors p-1.5 rounded-lg hover:bg-blue-50",
	deleteBtn:
		"text-red-500 hover:text-red-700 transition-colors p-1.5 rounded-lg hover:bg-red-50",

	// --- Empty State ---
	emptyRow: "px-5 py-16 text-center text-sm text-slate-400",

	// --- Add Profile Form Styling ---
	formTitle: "text-2xl font-bold text-slate-900 mb-6",
	formCard: "bg-white rounded-2xl border border-slate-200 shadow-sm p-8",
	formSectionTitle: "text-lg font-bold text-blue-600 mb-6",
	formGroup: "mb-6",
	formRow: "mb-6",
	formLabel: "block text-sm font-semibold text-slate-700 mb-1.5",
	formRequired: "text-red-500 ml-0.5",
	formInput:
		"w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
	formTextarea:
		"w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y min-h-[110px]",
	formDivider: "border-t border-slate-100 mt-6 pt-6",
	formFooter: "flex items-center justify-end gap-3",
	formCancelBtn:
		"flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all",
	formSubmitBtn:
		"flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-sm",
	formError: "text-red-500 text-xs mt-1",

	// --- Assign Profile Styling ---
	assignCard:
		"bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col gap-6",
	assignGrid: "grid grid-cols-2 gap-8",
	assignCol: "border border-slate-200 rounded-xl overflow-hidden",
	assignHeader:
		"bg-slate-50 border-b border-slate-200 px-5 py-4 font-semibold text-slate-800 text-sm",
	assignList: "flex flex-col max-h-[400px] overflow-y-auto",
	assignListItem:
		"flex items-center gap-3 px-5 py-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors last:border-0",
	assignRadio:
		"w-4 h-4 text-blue-600 bg-white border-slate-300 focus:ring-blue-500 focus:ring-2 cursor-pointer",
	assignLabel: "text-sm text-slate-700 cursor-pointer flex-1 font-medium",
	assignLabelActive: "text-sm text-slate-900 cursor-pointer flex-1 font-bold",

	// --- Success Popup ---
	popupOverlay: "fixed inset-0 z-50 flex items-center justify-center",
	popupBackdrop: "absolute inset-0 bg-black/40 backdrop-blur-sm",
	popupCard:
		"relative z-10 bg-white rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center gap-3 min-w-[320px]",
	popupIcon: "text-green-500 text-5xl",
	popupTitle: "text-xl font-bold text-slate-900",
	popupMessage: "text-sm text-slate-500 text-center",
	popupProgressWrap:
		"w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2",
	popupProgressBar:
		"h-full bg-green-500 rounded-full animate-[progress_2s_linear_forwards]",

	// --- Layout and Placeholder Styling ---
	placeholderWrap:
		"flex flex-col items-center justify-center h-full w-full text-center",
	placeholderIconWrap: "mb-4 text-slate-300",
	placeholderTitle: "text-xl font-bold text-slate-800 mb-2",
	placeholderText: "text-slate-500 text-sm",

	// --- Assign Profile specific ---
	assignColWrap: "flex flex-col gap-2",
	assignColTitle: "text-sm font-bold text-slate-900 mb-1",
	assignFooterWrap:
		"border-t border-slate-100 pt-6 flex justify-end gap-3 mt-4",
};

export default profileDesign;
