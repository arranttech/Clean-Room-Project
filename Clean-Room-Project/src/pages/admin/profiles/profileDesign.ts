import theme from "../../../styles/theme";

const profileDesign = {
  panelHeader:     theme.panelHeader,
  panelTitleWrap:  "flex flex-col gap-1",
  panelTitle:      "text-2xl font-bold text-slate-900 ml-4",
  panelSubtitle:   "text-sm text-slate-500 ml-4",
  addBtn:          theme.btnIcon,

  searchWrap:      theme.searchWrap,
  searchIcon:      theme.searchIcon,
  searchInput:     theme.searchInput,

  tableWrap:       theme.tableWrap,
  table:           theme.table,
  thead:           theme.thead,
  th:              theme.th,
  thActions:       theme.thActions,
  tbody:           theme.tbody,
  tr:              theme.tr,
  td:              theme.td,
  tdScreenId:      theme.tdName,
  tdScreenName:    theme.td,
  tdProfileName:   theme.tdName,
  tdActions:       theme.tdActions,
  emptyRow:        theme.emptyRow,

  statusActive:    theme.badgeActive,
  statusInactive:  theme.badgeInactive,

  editBtn:         theme.tableEditBtn,
  deleteBtn:       theme.tableDeleteBtn,

  formTitle:       theme.formTitle,
  formCard:        theme.formCard,
  formSectionTitle: "text-lg font-bold text-blue-600 mb-6",
  formGroup:       "mb-6",
  formRow:         "mb-6",
  formLabel:       theme.formLabel,
  formRequired:    theme.formRequired,
  formInput:       theme.formInput,
  formTextarea:
    "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y min-h-[110px]",
  formDivider:     "border-t border-slate-100 mt-6 pt-6",
  formFooter:      theme.formFooter,
  formCancelBtn:   theme.formCancelBtn,
  formSubmitBtn:   theme.formSubmitBtn,
  formError:       theme.formError,

  assignCard:
    "bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col gap-6",
  assignGrid:      "grid grid-cols-2 gap-8",
  assignCol:       "border border-slate-200 rounded-xl overflow-hidden",
  assignHeader:
    "bg-slate-50 border-b border-slate-200 px-5 py-4 font-semibold text-slate-800 text-sm",
  assignList:      "flex flex-col max-h-[400px] overflow-y-auto",
  assignListItem:
    "flex items-center gap-3 px-5 py-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors last:border-0",
  assignRadio:
    "w-4 h-4 text-blue-600 bg-white border-slate-300 focus:ring-blue-500 focus:ring-2 cursor-pointer",
  assignLabel:     "text-sm text-slate-700 cursor-pointer flex-1 font-medium",
  assignLabelActive: "text-sm text-slate-900 cursor-pointer flex-1 font-bold",

  popupOverlay:     theme.modalOverlay,
  popupBackdrop:    theme.modalBackdrop,
  popupCard:        theme.successPopupCard,
  popupIcon:        theme.successPopupIcon,
  popupTitle:       "text-xl font-bold text-slate-900",
  popupMessage:     "text-sm text-slate-500 text-center",
  popupProgressWrap: theme.successProgressWrap,
  popupProgressBar:  theme.successProgressBar,

  placeholderWrap:
    "flex flex-col items-center justify-center h-full w-full text-center",
  placeholderIconWrap:  "mb-4 text-slate-300",
  placeholderTitle:     "text-xl font-bold text-slate-800 mb-2",
  placeholderText:      "text-slate-500 text-sm",

  assignColWrap:  "flex flex-col gap-2",
  assignColTitle: "text-sm font-bold text-slate-900 mb-1",
  assignFooterWrap: "border-t border-slate-100 pt-6 flex justify-end gap-3 mt-4",

  paginationWrap:     theme.paginationWrap,
  paginationInfo:     theme.paginationInfo,
  paginationControls: theme.paginationControls,
  paginationBtn: (active: boolean, disabled: boolean) => {
    if (disabled) return `${theme.paginationBtnBase} ${theme.paginationBtnDisabled}`;
    if (active)   return `${theme.paginationBtnBase} ${theme.paginationBtnActive}`;
    return `${theme.paginationBtnBase} ${theme.paginationBtnInactive}`;
  },
  paginationNavBtn: (disabled: boolean) => {
    if (disabled) return `${theme.paginationNavBase} ${theme.paginationBtnDisabled}`;
    return `${theme.paginationNavBase} ${theme.paginationBtnInactive}`;
  },
};

export default profileDesign;
