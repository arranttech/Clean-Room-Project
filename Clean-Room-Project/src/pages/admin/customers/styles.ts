import theme from "../../../styles/theme";

const customersDesign = {
  panelHeader: theme.panelHeader,
  panelTitle: theme.panelTitle,
  addBtn: theme.btnIcon,

  searchWrap: theme.searchWrap,
  searchIcon: theme.searchIcon,
  searchInput: theme.searchInput,

  tableWrap: theme.tableWrap,
  table: theme.table,
  thead: theme.thead,
  th: theme.th,
  thActions: theme.thActions,
  tbody: theme.tbody,
  tr: theme.tr,
  td: theme.td,
  tdName: theme.tdName,
  tdEmail: theme.tdEmail,
  tdActions: theme.tdActions,
  emptyRow: theme.emptyRow,

  editBtn: theme.tableEditBtn,
  deleteBtn: theme.tableDeleteBtn,

  statusActive: theme.badgeActive,
  statusInactive: theme.badgeInactive,

  formTitle: theme.formTitle,
  formCard: theme.formCard,
  formGroup: theme.formGroup,
  formRow: theme.formRow,
  formLabel: theme.formLabel,
  formRequired: theme.required,
  formInput: theme.formInput,
  formTextarea: theme.formTextarea,
  formDivider: `border-t border-${theme.borderColor} mt-6 pt-6`,
  formFooter: theme.formFooter,
  formCancelBtn: theme.formCancelBtn,
  formSubmitBtn: theme.formSubmitBtn,
  formError: theme.formError,

  popupOverlay: theme.modalOverlay,
  popupBackdrop: theme.modalBackdrop,
  popupCard: theme.successPopupCard,
  popupIcon: theme.successPopupIcon,
  popupTitle: `text-xl ${theme.weightBold} text-${theme.textPrimary}`,
  popupMessage: `text-sm text-${theme.textMuted} text-center`,
  popupProgressWrap: theme.successProgressWrap,
  popupProgressBar: theme.successProgressBar,

  deleteOverlay: theme.modalOverlay,
  deleteBackdrop: theme.modalBackdrop,
  deleteCard:
    `relative z-10 bg-white ${theme.roundLg} ${theme.shadow2xl} px-8 py-7 flex flex-col items-center gap-4 min-w-[340px] max-w-sm w-full`,
  deleteIconWrap: `bg-${theme.errorBg} ${theme.roundFull} p-4`,
  deleteIcon: `text-${theme.error} text-3xl`,
  deleteTitle: `text-xl ${theme.weightBold} text-${theme.textPrimary}`,
  deleteMessage: `text-sm text-${theme.textMuted} text-center`,
  deleteCustomerName: `${theme.weightSemibold} text-${theme.textSecondary}`,
  deleteBtnRow: `flex items-center gap-3 w-full mt-1`,
  deleteCancelBtn: theme.btnSecondaryFull,
  deleteConfirmBtn: theme.btnDangerFull,

  paginationWrap: theme.paginationWrap,
  paginationInfo: theme.paginationInfo,
  paginationControls: theme.paginationControls,
  paginationBtn: (active: boolean, disabled: boolean) => {
    if (disabled) return `${theme.paginationBtnBase} ${theme.paginationBtnDisabled}`;
    if (active) return `${theme.paginationBtnBase} ${theme.paginationBtnActive}`;
    return `${theme.paginationBtnBase} ${theme.paginationBtnInactive}`;
  },
  paginationNavBtn: (disabled: boolean) => {
    if (disabled) return `${theme.paginationNavBase} ${theme.paginationBtnDisabled}`;
    return `${theme.paginationNavBase} ${theme.paginationBtnInactive}`;
  },
};

export default customersDesign;