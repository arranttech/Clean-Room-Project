import theme from "../../../styles/theme";

const usersDesign = {
    // --- Header ---
    panelHeader: theme.panelHeader,
    panelTitle:  theme.panelTitle,
    addBtn:      theme.btnIcon,
  
    // --- Filter Tabs ---
    filterWrap: `flex items-center gap-2 mb-4`,
    filterBtn: (active: boolean, type: string) => {
      const base = `px-4 py-1.5 ${theme.roundFull} text-xs ${theme.weightSemibold} border ${theme.transition}`;
      if (!active) return `${base} bg-white text-${theme.textDisabled} border-${theme.borderColor} hover:border-slate-400`;
      if (type === "I") return `${base} bg-red-500 text-white border-red-500`;
      if (type === "A") return `${base} bg-green-500 text-white border-green-500`;
      return `${base} bg-${theme.textPrimary} text-white border-${theme.textPrimary}`;
    },
  
    // --- Search ---
    searchWrap: theme.searchWrap,
    searchIcon: theme.searchIcon,
    searchInput: theme.searchInput,
  
    // --- Table ---
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
  
    // --- Status ---
    statusActive: theme.badgeActive,
    statusInactive: theme.badgeInactive,
  
    // --- Action Buttons ---
    editBtn: theme.tableEditBtn,
    deleteBtn: theme.tableDeleteBtn,
  
    // --- Form ---
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
  
    // --- Success Popup ---
    popupOverlay: theme.modalOverlay,
    popupBackdrop: theme.modalBackdrop,
    popupCard: theme.successPopupCard,
    popupIcon: theme.successPopupIcon,
    popupTitle: `text-xl ${theme.weightBold} text-${theme.textPrimary}`,
    popupMessage: `text-sm text-${theme.textMuted} text-center`,
    popupProgressWrap: theme.successProgressWrap,
    popupProgressBar: theme.successProgressBar,
  
    // --- Delete Modal ---
    deleteOverlay: theme.modalOverlay,
    deleteBackdrop: theme.modalBackdrop,
    deleteCard:
      `relative z-10 bg-white ${theme.roundLg} ${theme.shadow2xl} px-8 py-7 flex flex-col items-center gap-4 min-w-[340px] max-w-sm w-full`,
    deleteIconWrap: `bg-${theme.errorBg} ${theme.roundFull} p-4`,
    deleteIcon: `text-${theme.error} text-3xl`,
    deleteTitle: `text-xl ${theme.weightBold} text-${theme.textPrimary}`,
    deleteMessage: `text-sm text-${theme.textMuted} text-center`,
    deleteUserName: `${theme.weightSemibold} text-${theme.textSecondary}`,
    deleteBtnRow: `flex items-center gap-3 w-full mt-1`,
    deleteCancelBtn: theme.btnSecondaryFull,
    deleteConfirmBtn: theme.btnDangerFull,
  
    // --- Pagination ---
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
    }
  };
  
  export default usersDesign;
